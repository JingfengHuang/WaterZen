/** Imports */
const router = require('express').Router();

/** Import Controllers */
const reportController = require('../controllers/reportController');

// Direct to private area page
router.get('/report', reportController.view);
router.post('/report/reportQuality', reportController.reportQuality);
module.exports = router;