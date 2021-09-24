const Student = require('../models/students.model');
const Teacher = require('../models/teachers.model');
const Admin = require('../models/admin.model');
const findUserBy = require('../util/middleware/findUserBy.middleware');
const md5 = require('md5');

class UserController {

    //[GET]homepage

    getHomepage = async (req, res, next) => {
        if (req.signedCookies.userID) {
            const user = await findUserBy.userID(req.signedCookies.userID);
            if (user) {
                return res.render('pages', {
                    pageTitle: 'Multiple Choice TLU',
                    user: user
                });
            }
        }
        else {
            res.render('pages', {
                pageTitle: 'Home Page',
            });
        }
    }


    getLogin = async (req, res, next) => {
        if (req.signedCookies.userID) {
            res.redirect('/users/infomation')
        } else {
            res.render('pages/users/login', { pageTitle: '👓 Đăng Nhập !' })
        }
    }


    postLogin = async (req, res, next) => {
        // * Get studentID and password to form submited.
        const userID = req.body.userID;
        const password = req.body.password;

        // * Check user exsiting
        const user = await findUserBy.userID(userID);

        // ! No have user
        if (!user) {
            res.render('pages/users/login', {
                pageTitle: ' Đăng Nhập Thất Bại  !',
                alert: {
                    type: 'danger',
                    message: 'Không có tài khoản nào khớp với tên đăng nhập này! 😥'
                },
                user: {
                    userID: userID,
                    password: password
                }
            })
        }
        // ! Or have user
        if (user) {
            if (md5(password) != user.password) {
                res.render('pages/users/login', {
                    pageTitle: ' Đăng Nhập Thất Bại !',
                    alert: {
                        type: 'danger',
                        message: 'Mật khẩu bạn nhập không đúng! 😥'
                    },
                    user: {
                        userID: userID,
                        password: password
                    }
                })
            } else {
                res.cookie('userID', userID, { signed: true })
                res.redirect('/users/infomation')
            }
        }
    }


    logout = (req, res, next) => {
        if (req.signedCookies.userID) {
            res.clearCookie('userID');
            res.redirect('/');
        }
    }


    getInfomation = async (req, res, next) => {
        let user = await findUserBy.userID(req.signedCookies.userID);

        if (!user) {
            return res.redirect('/')
        }

        if (user.role === 'student') {
            user = await Student.findOne({ _id: user._id }).populate('subject');
        }
        if (user.role === 'teacher') {
            user = await Teacher.findOne({ _id: user._id }).populate('subject');
        }
        return res.render('pages/users/infomation', {
            pageTitle: 'Thông Tin Tài Khoản',
            user: user
        })

    }

    getChangePassword = async (req, res, next) => {
        const user = await findUserBy.userID(req.signedCookies.userID);
        if (user.role === 'teacher' || user.role === 'admin') {
            res.render('pages/users/changepassword', {
                pageTitle: 'Đổi Mật Khẩu !',
                user: user
            })
        }
    }

    postChangePassword = async (req, res, next) => {
        // * Get studentID and password to form submited.
        const password = req.body.password;
        const newpassword = req.body.newpassword;
        const cfpassword = req.body.cfpassword;

        const user = await findUserBy.userID(req.signedCookies.userID);
        // * Check current password
        if (md5(password) != user.password) {
            return res.render('pages/users/changepassword', {
                pageTitle: ' Đổi Mật Khẩu !',
                alert: {
                    type: 'danger',
                    message: 'Mật khẩu hiện tại bạn nhập không đúng không đúng 😥'
                },
                user: user
            })
            // * Check confirm password
        } else if (newpassword != cfpassword) {
            return res.render('pages/users/changepassword', {
                pageTitle: ' Đổi Mật Khẩu !',
                alert: {
                    type: 'danger',
                    message: 'Mật khẩu bạn nhập mới không khớp 😥'
                },
                user: user
            })
        } else if (newpassword.trim().length < 6) {
            return res.render('pages/users/changepassword', {
                pageTitle: ' Đổi Mật Khẩu !',
                alert: {
                    type: 'danger',
                    message: 'Mật khẩu của bạn phải có ít nhất 6 kí tự 😥'
                },
                user: user
            })
        } else {
            if (user.role === 'teacher') {
                const updated = await Teacher.findOneAndUpdate({ teacherID: user.teacherID }, {
                    $set: {
                        password: md5(newpassword)
                    }
                })
            } else {
                const updated = await Admin.findOneAndUpdate({ adminID: user.adminID }, {
                    $set: {
                        password: md5(newpassword)
                    }
                })
            }
            res.render('pages/users/changepassword', {
                pageTitle: ' Đổi Mật Khẩu !',
                alert: {
                    type: 'success',
                    message: 'Đổi mật khẩu thành công 🎉'
                },
                user: user
            })
        }
    }
}

module.exports = new UserController;