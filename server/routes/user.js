/** Imports */
const router = require('express').Router();

/** Import Controllers */
const indexController = require('../controllers/indexController');
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const profileController = require('../controllers/profileController');

/** Below contents are routers */
// Direct to Index page
router.get('/', indexController.view);

// Direct to Login Page
router.get('/login', loginController.view);

// Logout
router.get('/logout', indexController.logout);

// Direct to registration page
router.get('/registration', registrationController.view);

// Get user input from registration page and insert into db
router.post('/registration/validation', registrationController.validation);

// Get user input from registration page and insert into db
router.get('/registration/verify_email', registrationController.verifyEmail);

// Check user login
router.post('/login/verification', loginController.verification);

// Reset password
router.get('/login/resetCheck', loginController.resetCheck);

// Reset password
router.post('/login/resetVerify', loginController.resetVerify);

// Reset password
router.get('/login/resetPassword', loginController.resetPassword);

router.post('/login/resetPermission', loginController.resetPermission);

// Direct to profile page
router.get('/profile', profileController.view);

// Modify user profile
router.post('/profile/modifyProfile', profileController.modifyProfile);

// get reports
router.get('/profile/report', profileController.viewReports);

// get contribution
router.get('/profile/contribution', profileController.contribution);

router.post('/upload', profileController.upload);

module.exports = router;