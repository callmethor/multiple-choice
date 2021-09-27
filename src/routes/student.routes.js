const router = require('express').Router();
const middlewares = require('../util/middleware/authorization.middlware');
const adminController = require('../controllers/AdminController');
const teacherController = require('../controllers/TeacherController');
const studentController = require('../controllers/StudentController');

router.get('/courses', middlewares.restrictTo('student'), studentController.getCourses);
router.get('/courses/:slug', middlewares.restrictTo('student'), studentController.showCourse);

router.get('/search-exam', middlewares.restrictTo('student'), studentController.getSearchExam)
router.post('/search-exam', middlewares.restrictTo('student'), studentController.postSearchExam, studentController.exam)

// router.get('/exam', middlewares.restrictTo('student'), studentController.getSearchExam, studentController.exam)

router.post('/confirm-exam', middlewares.restrictTo('student'), studentController.confirmExam)
router.get('/confirm-exam', middlewares.restrictTo('student'), studentController.confirmExamGet)

module.exports = router;