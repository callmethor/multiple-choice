class AdminController {
    //[GET] Dashboard feature

    getDashboard(req, res, next) {
        res.render('pages/admin/dashboard', {
            pageTitle: '🎉 Quản trị viên| Trang Quản Trị !',
            // user: user,
            // students: students,
            // teachers: teachers,
            // questions: questions,
            // exams: exams
        });
    }
}

module.exports = new AdminController;