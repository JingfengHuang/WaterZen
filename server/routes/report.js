/** Imports */
const router = require('express').Router();

/** Import Controllers */
const reportController = require('../controllers/reportController');

// Direct to private area page
router.get('/report', reportController.view);
module.exports = router;