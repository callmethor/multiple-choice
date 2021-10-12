const Student = require('../models/students.model')
const Teacher = require('../models/teachers.model')
const Subject = require('../models/subjects.model')
const Question = require('../models/question.models')
const Course = require('../models/course.model');
const findUserBy = require('../util/middleware/findUserBy.middleware')
const Exam = require('../models/exam.model');
const fs = require('fs');
const csv = require('csv-parser');

class AdminController {
    // * DASHBOARD feature!
    
    getDashboard = async (req, res, next) => {
        const students = await Student.find().populate('subject');
        const teachers = await Teacher.find().populate('subject');
        const questions = await Question.find().populate({
            path: 'teacher',
            populate: {
                path: 'subject',
                model: 'Subject'
            }
        }).sort('-createdDate');
        const exams = await Exam.find().populate('subject').sort('-createdDate');
        // exams.forEach(async exam => {
        //     if (Date.now() <= exam.startDate || Date.now() >= exam.startDate) {
        //         await Exam.findOneAndUpdate({ _id: exam._id }, {
        //             $set: {
        //                 status: 'expired'
        //             }
        //         })
        //     } else {
        //         await Exam.findOneAndUpdate({ _id: exam._id }, {
        //             $set: {
        //                 status: 'inprogress'
        //             }
        //         })
        //     }
        // })
        if (req.signedCookies.userID) {
            const user = await findUserBy.userID(req.signedCookies.userID)
            return res.render('pages/admin/dashboard', {
                pageTitle: '🎉 Quản trị viên| Trang Quản Trị !',
                user: user,
                students: students,
                teachers: teachers,
                questions: questions,
                exams: exams
            });
        } else {
            res.redirect('/users/login')
        }
    }
    
    getCreateNewStudent = async (req, res, next) => {
        const subjects = await Subject.find();
        res.render('pages/admin/create-student', {
            pageTitle: '🎑 Quản trị viên| Tạo Sinh Viên !',
            user: await findUserBy.userID(req.signedCookies.userID),
            subjects: subjects
        });
    }
    
    postCreateNewStudent = async (req, res, next) => {
        const student = await Student.findOne({ studentID: req.body.studentID }).populate('subject');
        const subjects = await Subject.find();
        const user = await findUserBy.userID(req.signedCookies.userID);
        try {
            await Student.create({
                studentID: req.body.studentID,
                name: req.body.name,
                subject: (await Subject.findOne({ subjectID: req.body.subjectID.trim() }))._id,
                dateOfBirth: req.body.dateOfBirth,
                email: req.body.email
            });
            return res.render('pages/admin/create-student', {
                pageTitle: '🎑 Quản trị viên| Tạo Sinh Viên !',
                alert: {
                    type: 'success',
                    message: 'Tạo mới sinh viên thành công 🎉!'
                },
                student: req.body,
                user: user,
                subjects: subjects,
                action: 'create-new-student'
            })
        } catch (err) {
            res.render('pages/admin/create-student', {
                pageTitle: '🎑 Quản trị viên| Tạo Sinh Viên !',
                alert: {
                    type: 'danger',
                    message: 'Tạo mới sinh viên không thành công, vui lòng kiểm tra lại MSV !'
                },
                user: user,
                student: req.body,
                subjects: subjects,
                action: 'create-new-student'
            })
    
        }
    }
    
    getCreateNewStudents = async (req, res, next) => {
        const subjects = await Subject.find();
        res.render('pages/admin/create-students', {
            pageTitle: '🎑 Quản trị viên| Thêm Sinh Viên Từ File !',
            user: await findUserBy.userID(req.signedCookies.userID),
            subjects: subjects
        });
    }
    
    
    getCreateNewTeacher = async (req, res, next) => {
        const subjects = await Subject.find({});
        res.render('pages/admin/create-teacher', {
            pageTitle: '🎑 Quản trị viên| Tạo Giáo Viên !',
            user: await findUserBy.userID(req.signedCookies.userID),
            subjects: subjects
        })
    }
    
    postCreateNewTeacher = async (req, res, next) => {
        const subjects = await Subject.find();
        const user = await findUserBy.userID(req.signedCookies.userID);
        try {
            console.log(req.body.subjectID.trim())
            const subject = await Subject.findOne({ subjectID: req.body.subjectID.trim() });
            const teacher = await Teacher.create({
                ...req.body,
                subject: subject._id
            });
            res.render('pages/admin/create-teacher', {
                pageTitle: '🎑 Quản trị viên| Tạo Giáo Viên !',
                alert: {
                    type: 'success',
                    message: 'Tạo mới giáo viên thành công 🎉!'
                },
                user: user,
                subjects: subjects,
                teacher: teacher,
                action: 'create-new-teacher'
            })
        } catch (err) {
            res.render('pages/admin/create-teacher', {
                pageTitle: '🎑 Quản trị viên| Tạo Sinh Viên !',
                alert: {
                    type: 'danger',
                    message: 'Tạo mới giáo viên không thành công, vui lòng kiểm tra lại MGV !'
                },
                user: user,
                teacher: req.body,
                subjects: subjects,
                action: 'create-new-teacher'
            })
        }
    }
    // * UPDATE AND DELETE STUDENT feature!
    
    postDeleteStudent = async (req, res, next) => {
        try {
            await Student.findOneAndDelete({ studentID: req.body.studentID });
            res.redirect('/admin/dashboard');
        } catch (err) {
            console.log(err)
        }
    }
    
    postEditStudent = async (req, res, next) => {
        try {
            const student = await Student.findOne({ studentID: req.body.studentID }).populate('subject');
            const subjects = await Subject.find();
            // console.log(subjects)
            res.render('pages/admin/create-student', {
                pageTitle: '🎑 Quản trị viên| Cập Nhật Sinh Viên !',
                student: student,
                action: '/admin/update-student',
                user: await (await findUserBy.userID(req.signedCookies.userID)),
                subjects: subjects
            })
    
        } catch (err) {
            console.log(err)
        }
    }
    
    postUpdateStudent = async (req, res, next) => {
        const student = await Student.findOne({ studentID: req.body.studentID }).populate('subject');
        const subjects = await Subject.find();
        const user = await findUserBy.userID(req.signedCookies.userID);
        try {
        const updated = await Student.findOneAndUpdate({ studentID: req.body.studentID }, {
            $set: {
                studentID: req.body.studentID,
                name: req.body.name,
                dateOfBirth: req.body.dateOfBirth,
                email: req.body.email,
                subject: (await Subject.findOne({ subjectID: req.body.subjectID.trim() }))._id
            }
        })
        return res.render('pages/admin/create-student', {
            pageTitle: '🎑 Quản trị viên| Tạo Sinh Viên !',
            alert: {
                type: 'success',
                message: 'Sửa sinh viên thành công 🎉!'
            },
            student: req.body,
            user: user,
            subjects: subjects,
            action: '/admin/update-student'
        })
        } catch (err) {
        res.render('pages/admin/create-student', {
            pageTitle: '🎑 Quản trị viên| Tạo Sinh Viên !',
            alert: {
                type: 'danger',
                message: 'Sửa sinh viên thất bại !'
            },
            student: req.body,
            user: user,
            subjects: subjects,
            action: '/admin/update-student'
        })
        }
    }
    // * UPDATE AND DELETE TEACHER feature!
    
    postDeleteTeacher = async (req, res, next) => {
        try {
            await Teacher.findOneAndDelete({ teacherID: req.body.teacherID });
            res.redirect('/admin/dashboard');
        } catch (err) {
            console.log(err)
        }
    }
    
    postEditTeacher = async (req, res, next) => {
        try {
            const subjects = await Subject.find({});
            const teacher = await Teacher.findOne({ teacherID: req.body.teacherID });
    
            res.render('pages/admin/create-teacher', {
                pageTitle: '🎑 Quản trị viên| Cập Nhật Giáo Viên !',
                teacher: teacher,
                action: '/admin/update-teacher',
                user: await findUserBy.userID(req.signedCookies.userID),
                subjects: subjects
            })
    
        } catch (err) {
            console.log(err)
        }
    }
    
    postUpdateTeacher = async (req, res, next) => {
        const subjects = await Subject.find({});
        const teacher = await Teacher.findOne({ teacherID: req.body.teacherID });
        try {
        const updated = await Teacher.findOneAndUpdate({ teacherID: req.body.teacherID }, {
            $set: {
                teacherID: req.body.teacherID,
                name: req.body.name,
                dateOfBirth: req.body.dateOfBirth,
                email: req.body.email,
                subjectID: req.body.subjectID
            }
        })
        return res.render('pages/admin/create-teacher', {
            pageTitle: '🎑 Quản trị viên| Sửa Giáo Viên !',
            alert: {
                type: 'success',
                message: 'Sửa giáo viên thành công 🎉!'
            },
            teacher: teacher,
            action: '/admin/update-teacher',
            user: await findUserBy.userID(req.signedCookies.userID),
            subjects: subjects
        })
        } catch (err) {
        res.render('pages/admin/create-student', {
            pageTitle: '🎑 Quản trị viên| Sửa Giáo Viên !',
            alert: {
                type: 'danger',
                message: 'Sửa giáo viên thất bại !'
            },
            teacher: teacher,
            action: '/admin/update-teacher',
            user: await findUserBy.userID(req.signedCookies.userID),
            subjects: subjects
        })
        }
    }
    
    getCreateNewQuestion = async (req, res, next) => {
        res.render('pages/teacher/create-question', {
            pageTitle: '🎑 Quản trị viên| Tạo Câu Hỏi !',
            user: await findUserBy.userID(req.signedCookies.userID)
        })
    }
    
    posttCreateNewQuestion = async (req, res, next) => {
        await Question.create({
            ...req.body,
            teacher: (await findUserBy.userID(req.signedCookies.userID))._id
        });
        res.render('pages/teacher/create-question', {
            pageTitle: '🎑 Quản trị viên| Tạo Câu Hỏi !',
            user: await findUserBy.userID(req.signedCookies.userID),
            alert: {
                type: 'success',
                message: 'Tạo mới câu hỏi thành công 🎉!'
            }
        });
    }
    // * UPDATE AND DELETE QUESTION feature!
    
    postDeleteQuestion = async (req, res, next) => {
        try {
            await Question.findOneAndDelete({ _id: req.body.question })
            res.redirect('/admin/dashboard');
        } catch (err) {
            console.log(err)
        }
    }
    
    postEditQuestion = async (req, res, next) => {
        try {
            const question = await Question.findOne({ _id: req.body.question });
            res.render('pages/teacher/create-question', {
                pageTitle: '🎑 Quản trị viên| Cập Nhật Câu Hỏi !',
                question: question,
                action: '/admin/update-question',
                user: await findUserBy.userID(req.signedCookies.userID)
            })
        } catch (err) {
            console.log(err)
        }
    }
    
    postUpdateQuestion = async (req, res, next) => {
        const updated = await Question.findOneAndUpdate({ _id: req.body._id.trim() }, {
            $set: {
                question: req.body.question,
                choiceA: req.body.choiceA,
                choiceB: req.body.choiceB,
                choiceC: req.body.choiceC,
                choiceD: req.body.choiceD,
                correct: req.body.correct
            }
        })
        res.redirect('/admin/dashboard');
    }
    // * EXAMS feature!
    
    getCreateNewExam = async (req, res, next) => {
        const subjects = await Subject.find();
        const user = await findUserBy.userID(req.signedCookies.userID);
        res.render('pages/admin/create-exam', {
            pageTitle: '🎑 Quản Trị Viên | Tạo Mới Ca Thi !',
            subjects: subjects,
            user: user
        })
    }
    
    postCreateNewExam = async (req, res, next) => {
        try {
            await Exam.create({
                name: req.body.name,
                examID: req.body.examID,
                subject: await Subject.findOne({ subjectID: req.body.subjectID }),
                timeDuration: req.body.timeDuration,
                startDate: req.body.startDate
            })
            res.redirect('/admin/dashboard');
        } catch (err) {
            console.log(err);
        }
    }
    
    postDeleteExam = async (req, res, next) => {
        try {
            await Exam.findOneAndDelete({ _id: req.body.examID })
            res.redirect('/admin/dashboard');
        } catch (err) {
            console.log(err)
        }
    }
    
    postEditExam = async (req, res, next) => {
        try {
            const exam = await Exam.findOne({ _id: req.body.examID }).populate('subject');
            const subjects = await Subject.find();
            res.render('pages/admin/create-exam', {
                pageTitle: '🎑 Quản trị viên| Cập Nhật Ca Thi !',
                exam: exam,
                subjects: subjects,
                action: '/admin/update-exam',
                user: await findUserBy.userID(req.signedCookies.userID)
            })
        } catch (err) {
            console.log(err)
        }
    }
    
    postUpdateExam = async (req, res, next) => {
        const updated = await Exam.findOneAndUpdate({ _id: req.body._id.trim() }, {
            $set: {
                name: req.body.name,
                examID: req.body.examID,
                subject: (await Subject.findOne({ subjectID: req.body.subjectID }))._id,
                timeDuration: req.body.timeDuration,
                startDate: req.body.startDate
            }
        })
        res.redirect('/admin/dashboard');
    }
    
    
    postUploadStudent = async (req, res, next) => {
        try {
            const path = req.file.path;
            const result = [];
            const user = await findUserBy.userID(req.signedCookies.userID)
            const students = await Student.find().populate('subject');
            const teachers = await Teacher.find().populate('subject');
            const questions = await Question.find().populate({
                path: 'teacher',
                populate: {
                    path: 'subject',
                    model: 'Subject'
                }
            }).sort('-createdDate');
            const exams = await Exam.find().populate('subject').sort('-createdDate');
            fs.createReadStream(path)
                .pipe(csv())
                .on('data', data => result.push(data))
                .on('end', async () => {
                    try {
                        await Student.insertMany(result);
                        res.render('pages/admin/dashboard', {
                            pageTitle: 'Upload sinh viên thành công!',
                            user: user,
                            questions: questions,
                            teachers: teachers,
                            students: await Student.find().populate('subject'),
                            exams: exams,
                            alert: {
                                type: 'success',
                                message: 'Upload sinh viên thành công 🎉!'
                            }
                        })
                    } catch (error) {
    
                        res.render('pages/admin/dashboard', {
                            pageTitle: 'Upload sinh viên khồng thành công!',
                            user: user,
                            questions: questions,
                            teachers: teachers,
                            students: await Student.find().populate('subject'),
                            exams: exams,
                            alert: {
                                type: 'danger',
                                message: 'Định dạng file không được hỗ trợ! !'
                            }
                        })
                    }
                })
        } catch (err) {
            console.log('ERROR:', err);
        }
    }
    
    // * API
    
    getAllStudent = async (req, res, next) => {
        try {
            const students = await Student.find().populate('subject');
            res.status(200).json(students)
        } catch (err) {
            console.log(err);
        }
    }
    
    getAllTeacher = async (req, res, next) => {
        try {
            const teachers = await Teacher.find().populate('subject');
            res.status(200).json(teachers)
        } catch (err) {
            console.log(err);
        }
    }
    
    getAllQuestion = async (req, res, next) => {
        try {
            const questions = await Question.find();
            res.status(200).json(questions)
        } catch (err) {
            console.log(err);
        }
    }
    
    getAllExam = async (req, res, next) => {
        try {
            const exams = await Exam.find().populate('subject').sort('-createdDate');
            res.status(200).json(exams)
        } catch (err) {
            console.log(err);
        }
    }



}

module.exports = new AdminController;