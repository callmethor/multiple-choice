const router = require('express').Router();
const middlewares = require('../util/middleware/authorization.middlware');
const adminController = require('../controllers/AdminController');
const teacherController = require('../controllers/TeacherController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files')
    },
    filename: function (req, file, cb) {
        const parts = file.mimetype.split('/');
        cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
    }
})
const upload = multer({ storage: storage });

router.get('/dashboard', middlewares.restrictTo('teacher'), teacherController.getDashboard)
router.get('/create-new-question', middlewares.restrictTo('admin', 'teacher'), teacherController.getCreateNewQuestion)
router.post('/create-new-question', middlewares.restrictTo('teacher'), teacherController.posttCreateNewQuestion)

router.get('/create-course', middlewares.restrictTo('teacher'), teacherController.getCreateNewCourse)
router.post('/store-course', middlewares.restrictTo('teacher'), teacherController.postStoreCourse)
router.post('/edit-course/:id', middlewares.restrictTo('teacher'), teacherController.editCourse)



router.get('/create-new-questions', middlewares.restrictTo('admin', 'teacher'), teacherController.getCreateNewQuestions)

router.post('/edit-question', middlewares.restrictTo('teacher', 'admin'), teacherController.postEditQuestion)
router.post('/update-question', middlewares.restrictTo('teacher', 'admin'), teacherController.postUpdateQuestion)
router.post('/delete-question', middlewares.restrictTo('teacher', 'admin'), teacherController.postDeleteQuestion)
// router.post('/delete-question', middlewares.restrictTo('teacher', 'admin'), teacherController.postDeleteQuestion)

router.post('/upload-questions', middlewares.restrictTo('teacher'), upload.single('file-question'), teacherController.postUploadFileQuestions)
router.get('/get-all-question', middlewares.restrictTo('teacher'), teacherController.getAllQuestion)
router.get('/get-all-student', middlewares.restrictTo('teacher'), teacherController.getAllStudent)
router.get('/get-all-courses', middlewares.restrictTo('teacher'), teacherController.getAllCourse)

module.exports = router;