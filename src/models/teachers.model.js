const mongoose = require('mongoose');
const md5 = require('md5');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    teacherID: {
        type: String,
        unique: true,
        required: true
    },
    subjectID: {
        type: String,
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
        default: 'teacher'
    },
    password: String,
    createdDate: {
        type: Date,
        default: new Date()
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }
});
teacherSchema.pre('save', function (next) {
    const date = new Date(this.dateOfBirth);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear();
    const dateString = `${day}/${month}/${year}`;
    this.password = md5(dateString);
    next();
})

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;