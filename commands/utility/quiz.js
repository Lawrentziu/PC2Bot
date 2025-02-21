const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const loadQuestion = require('../../createQuestions.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Request a quiz question.')
    .addStringOption(option =>
        option.setName('number')
            .setDescription('Quiz number (leave empty for random)')),
    async execute(interaction) {
        const number = interaction.options.getString('number');
        const question = loadQuestion.execute(number);
        if (question == -1)
        {
            const error = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Intrebare not found')
            .setDescription('Intrebarea cu numarul ' + number + ' nu exista.');

            interaction.reply({ embeds: [error] });
        }
        else
        {
        const embedQuiz = new EmbedBuilder()
            .setColor('#ffd801')
            .setTitle('Intrebarea #' + interaction.options.getString('number'))
            .setDescription(question.description);

            interaction.reply({ embeds: [embedQuiz] });
        }
    },
};