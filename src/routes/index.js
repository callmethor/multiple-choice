const userRouter = require('./user.routes')
const adminRouter = require('./admin.routes')
function route(app){

    app.use('/', userRouter)
    app.use('/users', userRouter);

    app.use('/admin', adminRouter);

}

module.exports = route;