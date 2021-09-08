const adminRouter = require('./admin.routesdmin')

function route(app) {

    app.use('/error', adminRouter);
// app.all('/error', (req, res, next) => {
//     res.render('pages/error-404', { pageTitle: 'Error 404 !' })
//   })
// }

module.exports = route