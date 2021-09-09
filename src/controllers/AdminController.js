class AdminController {
    //[GET] Dashboard feature

    getDashboard(req, res, next) {
        res.send('Admin');
    }
}

module.exports = new AdminController;