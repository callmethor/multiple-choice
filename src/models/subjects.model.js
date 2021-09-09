const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    subjectID: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: new Date()
    }
});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;