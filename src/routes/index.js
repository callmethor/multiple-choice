const userRouter = require('./user.routes');
const adminRouter = require('./admin.routes');
const courseRouter = require('./course.routes');

function route(app){

    app.use('/', userRouter)
    app.use('/users', userRouter);
    // app.use('/courses', courseRouter);

    app.use('/admin', adminRouter);

}

module.exports = route;