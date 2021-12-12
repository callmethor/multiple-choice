const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const md5 = require('md5')

const studentSchema = new Schema({
    studentID: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dateOfBirth: Date,
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    password: String,
    createdDate: {
        type: Date,
        default: new Date()
    },
    // score: Number
});

studentSchema.pre('save', function (next) {
    const date = new Date(this.dateOfBirth);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear();
    const dateString = `${day}/${month}/${year}`;
    this.password = md5(dateString);
    next();
})

module.exports = mongoose.model('Student', studentSchema);
