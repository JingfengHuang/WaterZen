/** Imports */
const router = require('express').Router();

/** Import Controllers */
const privateAreaController = require('../controllers/communityController');

// Direct to private area page
router.get('/community', privateAreaController.view);
module.exports = router;