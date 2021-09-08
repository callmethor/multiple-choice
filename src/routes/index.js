const userRouter = require('./user.routes')
function route(app){

    app.get('/', userRouter)
    

}

module.exports = route;