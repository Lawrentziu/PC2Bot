const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Request a quiz question.')
    .addStringOption(option =>
        option.setName('number')
            .setDescription('Quiz number (leave empty for random)')),
    async execute(interaction) {
        const embedQuiz = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Intrebarea #' + interaction.options.getString('number'))
            .setDescription('```cpp\nint a;\n```');

            interaction.reply({ embeds: [embedQuiz] });
    },
};