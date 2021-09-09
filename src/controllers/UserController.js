const Student = require('../models/students.model');
const findUserBy = require('../util/middleware/findUserBy.middleware');

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
            console.log('111')
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

}

module.exports = new UserController;