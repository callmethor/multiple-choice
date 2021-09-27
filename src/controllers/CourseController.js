const Course = require('../models/course.model');

class CourseController {


    // getCourses = async (req, res, next) => {
    //     Course.find({})
    //     .then(courses => res.render('pages/course/courses', {
    //         courses : courses,
    //         pageTitle: 'Bài Giảng',
    //     }))
    //     .catch(next);   

    // }
 
    // learn(req, res, next){
    //     Course.findOne({slug: req.params.slug})
    //         .then(course => {
    //             res.render('pages/course/show',{
    //                 course: course,
    //                 pageTitle: 'Bài Giảng'
    //             })
    //         })
    //         .catch(next);
    // }
   
}

module.exports = new CourseController();