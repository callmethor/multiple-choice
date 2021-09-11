const express = require('express');
const router = express.Router();
const middlewares = require('../util/middleware/authorization.middlware');
const userController = require('../controllers/UserController');


//get homepage 
router.get('/', userController.getHomepage);

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin)

router.get('/logout', userController.logout)

router.get('/infomation', userController.getInfomation);

router.get('/changepassword',  middlewares.restrictTo('admin', 'teacher'), userController.getChangePassword);

router.post('/changepassword',  middlewares.restrictTo('admin', 'teacher'), userController.postChangePassword);

module.exports = router;
