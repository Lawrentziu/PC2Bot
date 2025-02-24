const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const schema = require('../../schemas/QuestionSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Request a quiz question.')
    .addStringOption(option =>
        option.setName('number')
            .setDescription('Quiz number (leave empty for random)')),
    async execute(interaction) {
        const number = interaction.options.getString('number');

        const data = await schema.findOne({ 'ID': number }, 'Question Answers Correct');

        const answerButtons = [];
        for (let i = 0; i < data.Answers.length; i++)
        {
            answerButtons[i] = new ButtonBuilder()
            .setCustomId(i.toString())
            .setLabel('Raspuns ' + (i + 1).toString())
            .setStyle(ButtonStyle.Secondary);
        }

        const row = new ActionRowBuilder()
            .addComponents(answerButtons);

        const reply = new EmbedBuilder()
            .setTitle('Intrebarea #' + number)
            .setDescription(data.Question)
            .setColor('Yellow')
            .setTimestamp();

        let cnt = 0;
        data.Answers.forEach(a => (
            cnt = cnt + 1,
            reply.addFields({ name: '**Raspuns ' + cnt + '**', value: a })
        ));

        if (interaction.isButton())
        {
            if (interaction.customId == data.Answers.indexOf(data.Correct))
            {
                console.log('Corect');
            }
            else {
                console.log('gresit');
            }
        }
        else
        {
            interaction.reply({
                embeds: [reply],
                components: [row],
            });
        }

    },
};