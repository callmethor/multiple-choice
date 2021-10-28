const Student = require('../models/students.model')
const Teacher = require('../models/teachers.model')
const Admin = require('../models/admin.model')
const Course = require('../models/course.model')
const Subject = require('../models/subjects.model')
const findUserBy = require('../util/middleware/findUserBy.middleware')
const Question = require('../models/question.models')
const Exam = require('../models/exam.model')
const _ = require('lodash');

class StudentController {

    getCourses = async (req, res, next) => {
        Course.find({})
            .then(courses => res.render('pages/course/courses', {
                courses: courses,
                pageTitle: 'Bài Giảng',
            }))
            .catch(next);

    }

    showCourse(req, res, next) {
        Promise.all([Course.findOne({ slug: req.params.slug }), Course.find({}).limit(2).sort('asc')])
            .then(([course, relatedCourse]) => {
                res.render('pages/course/show', {
                    course: course,
                    pageTitle: 'Bài Giảng',
                    relatedCourses: relatedCourse
                })
            })
            .catch(next);

    }

    getSearchExam = async (req, res, next) => {
        res.render('pages/student/search-exam', {
            pageTitle: 'Sinh Viên| Tìm Kiếm Ca Thi',
            user: await findUserBy.userID(req.signedCookies.userID)
        });
    }

    postSearchExam = async (req, res, next) => {
        const student = await Student.findOne({ studentID: req.signedCookies.userID }).populate('subject');

        const exam = await Exam.findOne({ examID: req.body.search.trim() }).populate('subject');
        if (!exam) return res.render('pages/student/search-exam', {
            pageTitle: 'Sinh Viên| Tìm Kiếm Ca Thi',
            user: await findUserBy.userID(req.signedCookies.userID),
            alert: {
                type: 'danger',
                message: 'Không có ca thi nào ứng với mã ca thi như trên! Vui lòng thử lại'
            },
            search: req.body.search
        })
        if (exam) {
            if (exam.status !== 'inprogress') {
                return res.render('pages/student/search-exam', {
                    pageTitle: 'Sinh Viên| Tìm Kiếm Ca Thi',
                    user: await findUserBy.userID(req.signedCookies.userID),
                    alert: {
                        type: 'danger',
                        message: 'Xin lỗi ca thi bạn tìm kiếm đã hết hạn!'
                    },
                    search: req.body.search
                })
            }
            if (student.score) {
                return res.render('pages/student/search-exam', {
                    pageTitle: 'Sinh Viên| Tìm Kiếm Ca Thi',
                    user: await findUserBy.userID(req.signedCookies.userID),
                    alert: {
                        type: 'danger',
                        message: 'Xin lỗi bạn đã thi môn này!'
                    },
                    search: req.body.search || 'Xin lỗi thao tác không hợp lệ!'
                });
            }
            if (student.subject.subjectID !== exam.subject.subjectID) {
                return res.render('pages/student/search-exam', {
                    pageTitle: 'Sinh Viên| Tìm Kiếm Ca Thi',
                    user: await findUserBy.userID(req.signedCookies.userID),
                    alert: {
                        type: 'danger',
                        message: 'Xin lỗi bạn không có quyền thi môn này do bạn không học môn này!!'
                    },
                    search: req.body.search
                })
            }
            if (student.score) {
                return res.render('pages/student/search-exam', {
                    pageTitle: 'Sinh Viên| Tìm Kiếm Ca Thi',
                    user: await findUserBy.userID(req.signedCookies.userID),
                    alert: {
                        type: 'danger',
                        message: 'Xin lỗi, bạn đã thi môn này rồi!!'
                    },
                    search: req.body.search
                })
            }
            res.locals.student = student;
            res.locals.exam = exam;
            next();
        }
    }

    exam = async (req, res, next) => {
        const exam = res.locals.exam;
        const student = res.locals.student;
        let questions = await Question.find().populate('teacher');
        questions = questions.filter(question => question.teacher.subjectID.trim() === exam.subject.subjectID.trim())
        questions = _.shuffle(questions);
        res.render('pages/student/exam', {
            pageTitle: 'Sinh Viên| Làm Bài Thi',
            user: await findUserBy.userID(req.signedCookies.userID),
            questions: questions.filter((q, i) => i < 10),
            exam: exam,
            student: student
        });
    }

    confirmExam = async (req, res, next) => {
        let score = 0;
        for (const q in { ...req.body }) {
            let question = null;
            if (req.body[q][0].length > 1) {
                question = await Question.findOne({ _id: req.body[q][0].trim() });
                if (question) {
                    if (question.correct.trim() === req.body[q][1]) {
                        score += 1;
                    }
                }
            } else {
                question = await Question.findOne({ _id: req.body[q].trim() });
                if (question) {
                    if (question.correct.trim() === req.body[q]) {
                        score += 1;
                    }
                }
            }
        }
        let student = await findUserBy.userID(req.signedCookies.userID);
        // console.log(student);
        if (student.score >= 0) {
            return res.send('<h1>Xin lỗi bạn đã thi môn này rồi, thao tác này không hợp lệ!</h1>');
        } else {
            await Student.findOneAndUpdate({ studentID: req.signedCookies.userID.trim() }, {
                $set: {
                    score: score
                }
            })
            res.render('pages/student/score', {
                pageTitle: 'Sinh Viên| Kết quả bài thi',
                user: await findUserBy.userID(req.signedCookies.userID),
                score: score
            });
        }


    }

    confirmExamGet = async (req, res, next) => {
        // const student = await findUserBy.userID(req.signedCookies.userID);
        // return res.status(404).send(student.score);
        return res.send('Ok')
    }
}

module.exports = new StudentController;
