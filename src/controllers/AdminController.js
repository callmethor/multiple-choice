class AdminController {
    //[GET] Dashboard feature

    index(req, res, next) {
        res.render('admin/dashboard');
    }
}

module.exports = new AdminController;