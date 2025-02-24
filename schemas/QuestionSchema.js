const { Schema, model } = require('mongoose');

const QuestionSchema = new Schema({
    ID: Number,
    Question: String,
    Answers: [String],
    Correct: [String],
});

module.exports = model('QuestionSchema', QuestionSchema);