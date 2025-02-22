const fs = require('node:fs');
const path = require('node:path');

const quizFile = fs.readFileSync(path.join(__dirname, 'questions.txt'), 'utf8');

module.exports = {
    name: 'loadQuestions',
    execute() {

        const questions = quizFile.split(/\d+\./);
        if (number > questions.length)
        {
            return -1;
        }
        else
        {
            const question = questions[number - 1];

            return {
                answers: ['true', 'false'],
                description: question,
            };
        }

    },
};
