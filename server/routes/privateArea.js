/** Imports */
const router = require('express').Router();

/** Import Controllers */
const privateAreaController = require('../controllers/privateAreaController');

// Direct to private area page
router.get('/privateArea', privateAreaController.view);
module.exports = router;