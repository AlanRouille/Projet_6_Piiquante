const express = require('express');
const router = express.Router();
const Password = require('../middleware/password.js');
const userCtrl = require('../controllers/user');

router.post('/signup', Password, userCtrl.signup);  // Inscription    
router.post('/login', userCtrl.login);    // Connection

module.exports = router;