const Teacher = require('../../models/teachers.model');
const Student = require('../../models/students.model');
const Admin = require('../../models/admin.model');

exports.userID = async (id) => {
    const student = await Student.findOne({ studentID: id });
    const teacher = await Teacher.findOne({ teacherID: id });
    const admin = await Admin.findOne({ adminID: id });

    const user = student || teacher || admin;
    // const user = student;
    return user;
}