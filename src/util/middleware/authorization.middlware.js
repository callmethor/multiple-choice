const findUserBy = require('./findUserBy.middleware')
exports.restrictTo = (...role) => {
    return async (req, res, next) => {
        // * Check if userID is not exist. Redirect user to login page.
        if (!req.signedCookies.userID) {
            return res.redirect('/users/login')
        } else {
            // * Have userID, continue checking what user math with this id
            const user = await findUserBy.userID(req.signedCookies.userID);
            if (role.includes(user.role)) {
                return next();
            } else {
                res.redirect('/user/you-dont-have-this-permission');
            }
        }
    }
}