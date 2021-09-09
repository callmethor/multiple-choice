const express = require('express');
const router = express.Router();
const middlewares = require('../util/middleware/authorization.middlware');
const userController = require('../controllers/UserController');


//get homepage 
router.get('/', userController.getHomepage);

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin)



module.exports = router;
