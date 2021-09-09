const mongoose = require('mongoose');
const md5 = require('md5');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    adminID: {
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
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'admin'
    },
    password: String,
});
adminSchema.pre('save', function (next) {
    // this.password = md5("dhtl1959");
    next();
})
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;