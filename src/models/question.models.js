const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    choiceA: {
        type: String,
        required: true
    },
    choiceB: {
        type: String,
        required: true
    },
    choiceC: {
        type: String,
        required: true
    },
    choiceD: {
        type: String,
        required: true
    },
    correct: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true
    },
    chapter: Number,
    level: {
        type: String,
        enum: ['easy', 'normal', 'hard']
    },
    teacher: {
        type: mongoose.Types.ObjectId,
        ref: 'Teacher'
    },
    createdDate: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Question', questionSchema);