const fs = require('node:fs');
const path = require('node:path');
const schema = require('./schemas/QuestionSchema.js');
const mongoURL = process.env.mongoURL;
const { default: mongoose } = require('mongoose');

const quizFile = fs.readFileSync(path.join(__dirname, 'questions.txt'), 'utf8');

(async () => {
    if (!mongoURL) return;

    await mongoose.connect(mongoURL || '');

    if (mongoose.connect)
    {
        console.log('\nI have connected to the database.');
    } else {
        console.log('\nFailed to connect to the database.');
    }

    const questions = quizFile.split(/(?:\d+\.\s)/).filter(line => line.trim() !== '');

    for (let i = 0; i < questions.length; i++)
    {
        const q = questions[i];

        const question = q.split(/\n(?=\*\*Raspuns 1\*\*)/)[0];
        const answers = q.split(/\n(?=\*\*Raspuns 1\*\*)/)[1];
        const matches = answers.split(/\*\*Raspuns \d\*\*\n/);
        const results = matches.map(part => part.split('\n'))[0];
        let final = [];
        const correct = [];

        for (let j = 1; j < results.length; j += 2)
        {
            if (results[j].includes('@'))
            {
                correct.push(results[j].substring(1));
                final.push(results[j].substring(1));
            } else {
                final.push(results[j]);
            }
        }

        final = final.filter(e => e);
        // console.log('Question:\n' + question);
        // console.log('Answers:');
        // console.log(final);
        // console.log('Correct answer:\n' + correct);

        await schema.create({
            ID: i,
            Question: question,
            Answers: final,
            Correct: correct,
        });

    }

    console.log('Questions added to the database.');
    mongoose.disconnect();
})();