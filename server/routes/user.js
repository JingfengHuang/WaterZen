/** Imports */
const router = require('express').Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

/** Import Controllers */
const indexController = require('../controllers/indexController');
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');

/** Below contents are routers */
// Direct to Index page
router.get('/', indexController.view);

// Direct to Login Page
router.get('/login', loginController.view);

// Direct to registration page
router.get('/registration', registrationController.view);

// Get user input from registration page and insert into db
router.post('/registration/registrationValidation', registrationController.registrationValidation);

// Check user login
router.post('/login/loginVerification', loginController.loginVerification);

module.exports = router;