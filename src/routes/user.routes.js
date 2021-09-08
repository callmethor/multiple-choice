const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');


//get homepage 
router.use('/', userController.getHomepage);



module.exports = router;
