var express = require('express');
const router = express.Router();

const adminController = require('../controllers/AdminController');

router.use('/', adminController.index);



module.exports = router;