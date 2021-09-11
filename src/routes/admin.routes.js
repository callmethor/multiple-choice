const router = require('express').Router();
const middlewares = require('../util/middleware/authorization.middlware');
const adminController = require('../controllers/AdminController');

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

router.get('/create-new-teacher', middlewares.restrictTo('admin'), adminController.getCreateNewTeacher)
router.post('/create-new-teacher', middlewares.restrictTo('admin'), adminController.postCreateNewTeacher)

router.get('/create-new-student', middlewares.restrictTo('admin'), adminController.getCreateNewStudent)
router.post('/create-new-student', middlewares.restrictTo('admin'), adminController.postCreateNewStudent)

router.get('/create-new-students', middlewares.restrictTo('admin'), adminController.getCreateNewStudents)

router.get('/dashboard', middlewares.restrictTo('admin'), adminController.getDashboard)

router.post('/edit-student', middlewares.restrictTo('admin'), adminController.postEditStudent)
router.post('/update-student', middlewares.restrictTo('admin'), adminController.postUpdateStudent)

router.post('/delete-student', middlewares.restrictTo('admin'), adminController.postDeleteStudent)

router.post('/edit-teacher', middlewares.restrictTo('admin'), adminController.postEditTeacher)
router.post('/update-teacher', middlewares.restrictTo('admin'), adminController.postUpdateTeacher)

router.post('/delete-teacher', middlewares.restrictTo('admin'), adminController.postDeleteTeacher)


router.get('/create-new-question', middlewares.restrictTo('admin', 'teacher'), adminController.getCreateNewQuestion)
router.post('/create-new-question', middlewares.restrictTo('admin', 'teacher'), adminController.posttCreateNewQuestion)

router.post('/edit-question', middlewares.restrictTo('teacher', 'admin'), adminController.postEditQuestion)
router.post('/update-question', middlewares.restrictTo('teacher', 'admin'), adminController.postUpdateQuestion)
router.post('/delete-question', middlewares.restrictTo('teacher', 'admin'), adminController.postDeleteQuestion)


router.get('/create-new-exam', middlewares.restrictTo('admin'), adminController.getCreateNewExam);
router.post('/create-new-exam', middlewares.restrictTo('admin'), adminController.postCreateNewExam);
router.post('/delete-exam', middlewares.restrictTo('admin'), adminController.postDeleteExam);
router.post('/edit-exam', middlewares.restrictTo('admin'), adminController.postEditExam);
router.post('/update-exam', middlewares.restrictTo('admin'), adminController.postUpdateExam);

router.post('/upload-students', middlewares.restrictTo('admin'), upload.single('file-students'), adminController.postUploadStudent)

// API
router.get('/get-all-student', middlewares.restrictTo('admin'), adminController.getAllStudent)
router.get('/get-all-teacher', middlewares.restrictTo('admin'), adminController.getAllTeacher)
router.get('/get-all-question', middlewares.restrictTo('admin'), adminController.getAllQuestion)
router.get('/get-all-exam', middlewares.restrictTo('admin'), adminController.getAllExam)

module.exports = router;