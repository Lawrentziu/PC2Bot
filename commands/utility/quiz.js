const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, Colors } = require('discord.js');
const schema = require('../../schemas/QuestionSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Request a quiz question.')
    .addStringOption(option =>
        option.setName('number')
            .setDescription('Quiz number (leave empty for random)')),
    async execute(interaction, _number) {

        let number = _number || interaction.options.getString('number');

        if (!number)
        {
            number = Math.floor(Math.random() * 108) + 1;
        } else if (isNaN(number))
        {
            interaction.reply({ content: 'Comanda `/quiz` trebuie urmata de un numar daca doresti o intrebare anume!', flags: MessageFlags.Ephemeral });
            return;
        }

        const data = await schema.findOne({ 'ID': number }, 'Question Answers Correct');

        if (!data)
        {
            interaction.reply({ content: 'Intrebarea cu numarul ' + number + ' nu exista!', flags: MessageFlags.Ephemeral });
            return;
        }

        const answerButtons = [];
        for (let i = 0; i < data.Answers.length; i++)
        {
            answerButtons[i] = new ButtonBuilder()
            .setCustomId(data.Correct.includes(data.Answers[i]) ? 'Correct' + i.toString() : i.toString())
            .setLabel('Raspuns ' + (i + 1).toString())
            .setStyle(ButtonStyle.Secondary);

        }

        const answerSelection = new ActionRowBuilder()
            .addComponents(answerButtons);

        const sendAnswer = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('Confirm')
            .setStyle(ButtonStyle.Success)
            .setLabel('Trimite'),
        );

        const reply = new EmbedBuilder()
            .setTitle('Intrebarea #' + number)
            .setDescription(data.Question)
            .setColor('#F1C40F')
            .setTimestamp();

        let cnt = 0;
        data.Answers.forEach(a => (
            cnt = cnt + 1,
            reply.addFields({ name: '**Raspuns ' + cnt + '**', value: a })
        ));

        const response = await interaction.reply({
            embeds: [reply],
            components: [answerSelection, sendAnswer],
            withResponse: true,
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            while (true)
            {
                const answer = await response.resource.message.awaitMessageComponent({ filter: collectorFilter });
                const buttonID = answer.customId;

                if (buttonID === 'Next')
                {
                    this.execute(answer, parseInt(number) + 1);
                    await response.resource.message.delete();
                    break;
                }

                if (buttonID === 'Confirm') {
                    sendAnswer.components[0].setStyle(ButtonStyle.Primary);
                    sendAnswer.components[0].setLabel('Urmatoarea intrebare');
                    sendAnswer.components[0].setCustomId('Next');

                    answerButtons.forEach(async button => {
                        if ((button.data.style === ButtonStyle.Primary && !button.data.custom_id.includes('Correct')) || (button.data.style !== ButtonStyle.Primary && button.data.custom_id.includes('Correct')))
                        {
                            reply.setColor('Red');
                        }

                        button.setDisabled(true);
                        if (button.data.custom_id.includes('Correct')) { button.setStyle(ButtonStyle.Success); }
                        else { button.setStyle(ButtonStyle.Danger); }

                    });

                    if (reply.data.color == Colors.Gold) reply.setColor('Green');

                    answer.update({ embeds: [reply], components: [answerSelection, sendAnswer] });
                } else {
                    const b = answerButtons.find(button => button.data.custom_id == buttonID);
                    b.setStyle(b.data.style == ButtonStyle.Secondary ? ButtonStyle.Primary : ButtonStyle.Secondary);
                    answer.update({ components: [answerSelection, sendAnswer] });
                }

            }

        } catch (error) {
            console.log(error);
        }


    },
};