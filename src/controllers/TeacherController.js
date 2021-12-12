const Student = require('../models/students.model')
const Teacher = require('../models/teachers.model')
const Admin = require('../models/admin.model')
const Subject = require('../models/subjects.model')
const Course = require('../models/course.model');
const findUserBy = require('../util/middleware/findUserBy.middleware')
const Question = require('../models/question.models');
const md5 = require('md5');
const fs = require('fs');
const { log } = require('console')
const csv = require('csv-parser');

class TeacherController {
    getDashboard = async (req, res, next) => {
        if (req.signedCookies.userID) {
            const user = await findUserBy.userID(req.signedCookies.userID)
            let students = await Student.find().populate('subject');
            let courses = await Course.find();

            students = students.filter(students => students.subject.subjectID == user.subjectID);
            const questions = await Question.find({ teacher: (await findUserBy.userID(req.signedCookies.userID))._id }).sort('-createdDate').populate({
                path: 'teacher',
                populate: {
                    path: 'subject',
                    model: 'Subject'
                }
            });
            return res.render('pages/teacher/dashboard', {
                pageTitle: '🎉 Teacher| Dashboard !',
                user: user,
                questions: questions,
                students: students,
                courses: courses
            });
        } else {
            res.redirect('/users/login')
        }
    }

    getCreateNewQuestion = async (req, res, next) => {
        res.render('pages/teacher/create-question', {
            pageTitle: 'Teacher| Thêm Câu Hỏi 🎉',
            user: await findUserBy.userID(req.signedCookies.userID)
        })
    }

    posttCreateNewQuestion = async (req, res, next) => {
        await Question.create({
            ...req.body,
            teacher: (await findUserBy.userID(req.signedCookies.userID))._id
        });
        res.render('pages/teacher/create-question', {
            pageTitle: 'Teacher| Thêm Câu Hỏi 🎉',
            user: await findUserBy.userID(req.signedCookies.userID),
            alert: {
                type: 'success',
                message: 'Tạo mới câu hỏi thành công 🎉!'
            }
        });
    }

    getCreateNewQuestions = async (req, res, next) => {
        res.render('pages/teacher/create-questions', {
            pageTitle: 'Teacher| Thêm Câu Hỏi Từ File 🎉',
            user: await findUserBy.userID(req.signedCookies.userID)
        })
    }

    // Update and delete course
    getCreateNewCourse = async (req, res, next) => {
        res.render('pages/teacher/create-course', { 
            pageTitle: 'Teacher| Thêm Bài Học 🎉',
            user: await findUserBy.userID(req.signedCookies.userID),
            //  alert: {
            //     type: 'success',
            //     message: 'Tạo mới câu hỏi thành công 🎉!'
            // }
        })
    }

    getCreateNewCourses = async (req, res, next) => {
        res.render('pages/teacher/create-courses', {
            pageTitle: 'Teacher| Thêm Câu Hỏi Từ File 🎉',
            user: await findUserBy.userID(req.signedCookies.userID)
        })
    }

    postStoreCourse = async (req, res, next) => {
        const user = await findUserBy.userID(req.signedCookies.userID);
        console.log('User: ',user);
        console.log('Subject: ',user.subject);
        const subjectID = user.subject;
        // return;
        const formData = { ...req.body, subject: subjectID };
        formData.image = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`;
        const course = new Course(formData);
        course.save()
            .then(() => res.redirect('/teacher/create-course'))
            .catch(next);

    }

    //[GET] /teacher/edit-course
    editCourse = async (req, res, next) => {
        Course.findById(req.params.id)
            .then(course => res.render('pages/teacher/edit-course',
                {
                    course,
                    pageTitle: 'Teacher| Thêm Câu Hỏi 🎉',
                }))
            .catch(next)

    }

    updateCourse(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/teacher/dashboard'))
            .catch(next)
    }

    postDeleteCourse = async (req, res, next) => {
        try {
            await Course.findOneAndDelete({ _id: req.body.course })
            res.redirect('/teacher/dashboard');
        } catch (err) {
            console.log(err)
        }
    }



    postUploadCourses = async (req, res, next) => {
        try {
            const path = req.file.path;
            const result = [];
            const user = await findUserBy.userID(req.signedCookies.userID)
            const students = await Student.find().populate('subject');
            const teachers = await Teacher.find().populate('subject');
            const courses = await Course.find();
            const questions = await Question.find().populate({
                path: 'teacher',
                populate: {
                    path: 'subject',
                    model: 'Subject'
                }
            }).sort('-createdDate');
            // const exams = await Exam.find().populate('subject').sort('-createdDate');
            fs.createReadStream(path)
                .pipe(csv({}))
                .on('data', data => result.push(data))
                .on('end', async () => {
                    console.log(result);
                    Course.insertMany(result)
                        .then(function () {
                            console.log("Data inserted")  // Success
                            res.render('pages/teacher/dashboard', {
                                pageTitle: '🎑 Giáo Viên | Dashboard',
                                user: user,
                                students: students,
                                teachers: teachers,
                                courses: courses,
                                questions: questions,
                                // exams: exams,
                                alert: {
                                    type: 'success',
                                    message: 'Tải lên bài giảng thành công 🎉!'
                                }
                            })
                        })
                        .catch(function (error) {
                            console.log(error)      // Failure
                            res.render('pages/teacher/dashboard', {
                                pageTitle: '🎑 Giáo Viên | Dashboard',
                                user: user,
                                students: students,
                                teachers: teachers,
                                courses: courses,
                                questions: questions,
                                // exams: exams,
                                alert: {
                                    type: 'danger',
                                    message: 'Tải lên bài giảng không thành công!'
                                }
                            })
                        });
                })
        } catch (err) {
            console.log('ERROR:', err);
        }
    }


    // * UPDATE AND DELETE QUESTION feature!

    postDeleteQuestion = async (req, res, next) => {
        try {
            await Question.findOneAndDelete({ _id: req.body.question })
            res.redirect('/teacher/dashboard');
        } catch (err) {
            console.log(err)
        }
    }

    postEditQuestion = async (req, res, next) => {
        try {

            const question = await Question.findOne({ _id: req.body.question });
            res.render('pages/teacher/create-question', {
                pageTitle: 'Teacher| Edit Question',
                question: question,
                action: '/teacher/update-question',
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
        res.redirect('/teacher/dashboard');
    }

    postUploadFileQuestions = async (req, res, next) => {
        try {
            const path = req.file.path;
            const result = [];
            const teacher = await findUserBy.userID(req.signedCookies.userID);
            const user = await findUserBy.userID(req.signedCookies.userID)
            const students = await Student.find();
            const courses = await Course.find();
            let questions = await Question.find({ teacher: (await findUserBy.userID(req.signedCookies.userID))._id }).sort('-createdDate')
            fs.createReadStream(path)
                .pipe(csv())
                .on('data', data => result.push(data))
                .on('end', async () => {
                    result.forEach(q => { q.teacher = teacher._id });
                    try {
                        await Question.insertMany(result);
                        res.render('pages/teacher/dashboard', {
                            pageTitle: 'Upload câu hỏi thành công!',
                            user: user,
                            questions: await Question.find({ teacher: (await findUserBy.userID(req.signedCookies.userID))._id }).sort('-createdDate').populate({
                                path: 'teacher',
                                populate: {
                                    path: 'subject',
                                    model: 'Subject'
                                }
                            }),
                            students: students,
                            courses: courses,
                            alert: {
                                type: 'success',
                                message: 'Upload câu hỏi thành công 🎉!'
                            },
                        })
                    } catch (error) {

                        res.render('pages/teacher/dashboard', {
                            pageTitle: 'File câu hỏi khồng hợp lệ',
                            user: user,
                            questions: questions,
                            students: students,
                            courses: courses,
                            alert: {
                                type: 'danger',
                                message: 'Định dạng file không được hỗ trợ!'
                            }
                        })
                    }
                })
        } catch (err) {
            console.log('ERROR:', err);
        }
    }

    // * API


    getAllQuestion = async (req, res, next) => {
        try {
            const questions = await Question.find({ teacher: (await findUserBy.userID(req.signedCookies.userID))._id }).sort('-createdDate').populate({
                path: 'teacher',
                populate: {
                    path: 'subject',
                    model: 'Subject'
                }
            });
            res.status(200).json(questions);
        } catch (err) {
            console.log(err)
        }
    }

    getAllStudent = async (req, res, next) => {
        try {
            const students = await Student.find().populate('subject');
            res.status(200).json(students);
        } catch (err) {
            console.log(err)
        }
    }

    getAllCourse = async (req, res, next) => {
        try {
            const courses = await Course.find().populate('subject');
            res.status(200).json(courses);
        } catch (err) {
            console.log(err)
        }
    }


}

module.exports = new TeacherController;
