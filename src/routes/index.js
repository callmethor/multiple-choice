const userRouter = require('./user.routes');
const adminRouter = require('./admin.routes');
const teacherRouter = require('./teacher.routes');
const studentRouter = require('./student.routes');
// const courseRouter = require('./course.routes');



function route(app){

    app.use('/', userRouter)
    app.use('/users', userRouter);
    app.use('/admin', adminRouter);
    app.use('/teacher', teacherRouter);
    app.use('/student', studentRouter);
    // app.use('/course', courseRouter);

    
    
    app.all('*', (req, res, next) => {
         res.render('pages/error-404', { pageTitle: 'Error 404 !' })
    });

}

module.exports = route;