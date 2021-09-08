const Student = require('../models/students.model');
const findUserBy = require('../util/middleware/findUserBy.middleware');

class UserController {

   

    //[GET]homepage

    getHomepage(req, res, next) {
        Student.find({})
            .then(students =>  res.render('pages', {
                pageTitle: 'Home Page'
            }))
            .catch(next);
    }

    // getHomepage = async (req, res, next) => {
    //     if (req.signedCookies.userID) {
    //         const user = await findUserBy.userID(req.signedCookies.userID);
    //         if (user) {
    //             return res.render('pages', {
    //                 pageTitle: 'Multiple Choice TLU',
    //                 user: user
    //             });
    //         }
    //     }
    //     else {
    //         res.render('pages', {
    //             pageTitle: 'Home Page',
    //         });
    //     }
    // }

}

module.exports = new UserController;