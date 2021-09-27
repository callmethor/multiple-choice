const express = require('express');
const router = express.Router();
const middlewares = require('../util/middleware/authorization.middlware');
const courseController = require('../controllers/CourseController');

router.get('/:slug', courseController.showCourse)
router.get('/getcourses', courseController.getCourses);



module.exports = router;