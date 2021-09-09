const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    examID: {
        type: String,
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    status: {
        type: String,
        enum: ['inprogress', 'expired'],
        default: 'inprogress'
    },
    startDate: {
        type: Date,
        default: new Date(),
        required: true
    },
    timeDuration: {
        type: Number,
        required: true
    },
    createdDate: {
        type: Date,
        default: new Date()
    }
})
const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;