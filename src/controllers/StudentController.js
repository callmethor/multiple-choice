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
        const user = await findUserBy.userID(req.signedCookies.userID)
        Course.find({}).populate('subject')
            .then(courses => {
                console.log({ courses: courses[0].subject });
                res.render('pages/course/courses', {
                    courses: courses,
                    ls: courses.filter(course => course.subject.name === 'Lịch Sử'),
                    dl: courses.filter(course => course.subject.name === 'Địa Lý'),
                    gdcd: courses.filter(course => course.subject.name === 'GDCD'),
                    pageTitle: 'Bài Giảng',
                    user: user,
                })
            })
            .catch(next);

    }

    showCourse = async (req, res, next) => {
        const user = await findUserBy.userID(req.signedCookies.userID)
        Promise.all([Course.findOne({ slug: req.params.slug }), Course.find({}).limit(2).sort('asc')])
            .then(([course, relatedCourse]) => {
                res.render('pages/course/show', {
                    course: course,
                    pageTitle: 'Bài Giảng',
                    relatedCourses: relatedCourse,
                    user: user,
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

            /* Không cho thi môn khác nếu không học môn đó  */
            // if (student.subject.subjectID !== exam.subject.subjectID) {
            //     return res.render('pages/student/search-exam', {
            //         pageTitle: 'Sinh Viên| Tìm Kiếm Ca Thi',
            //         user: await findUserBy.userID(req.signedCookies.userID),
            //         alert: {
            //             type: 'danger',
            //             message: 'Xin lỗi bạn không có quyền thi môn này do bạn không học môn này!!'
            //         },
            //         search: req.body.search
            //     })
            // }
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
        const numberOfEasyQuestions = exam.numberOfEasyQuestions;
        const numberOfMediumQuestions = exam.numberOfMediumQuestions;
        const numberOfHardQuestions = exam.numberOfHardQuestions;
        const student = res.locals.student;
        let questions = await Question.find().populate('teacher');
        // let easyQuestions = await Question.find({ level: 'easy' }).populate('teacher').limit(parseInt(numberOfEasyQuestions));
        // let mediumQuestions = await Question.find({ level: 'normal' }).populate('teacher').limit(parseInt(numberOfMediumQuestions));
        // let hardQuestions = await Question.find({ level: 'hard' }).populate('teacher').limit(parseInt(numberOfHardQuestions));
        // console.log({easyQuestions , mediumQuestions, hardQuestions });
        // return;
        // let questions = [...easyQuestions,...mediumQuestions,...hardQuestions] ;
        questions = questions.filter(question => question.teacher.subjectID.trim() === exam.subject.subjectID.trim())

        const easyQuestions = _.shuffle(questions.filter(question => question.level === 'easy')).slice(0, parseInt(numberOfEasyQuestions));
        const mediumQuestions = _.shuffle(questions.filter(question => question.level === 'normal')).slice(0, parseInt(numberOfMediumQuestions));
        const hardQuestions = _.shuffle(questions.filter(question => question.level === 'hard')).slice(0, parseInt(numberOfHardQuestions));

        questions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];


        // questions = _.shuffle(questions);
        res.render('pages/student/exam', {
            pageTitle: 'Sinh Viên| Làm Bài Thi',
            user: await findUserBy.userID(req.signedCookies.userID),
            questions: questions.filter((q, i) => i < 40),
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
                        score += 0.4;
                    }
                }
            } else {
                question = await Question.findOne({ _id: req.body[q].trim() });
                if (question) {
                    if (question.correct.trim() === req.body[q]) {
                        score += 0.4;
                    }
                }
            }
        }
        let student = await findUserBy.userID(req.signedCookies.userID);

        /* Không cho thi lại, nếu thi rồi thì score sẽ >= 0 */
        // if(student.score >= 0){
        //     return res.send('<h1>Xin lỗi bạn đã thi môn này rồi, thao tác này không hợp lệ!</h1>');
        // }
        if (student.score) {
            // return res.send('<h1>Xin lỗi bạn đã thi môn này rồi, thao tác này không hợp lệ!</h1>');
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
