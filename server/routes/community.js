/** Imports */
const router = require('express').Router();

/** Import Controllers */
const communityController = require('../controllers/communityController');

// Direct to private area page
router.get('/community', communityController.view);
router.post('/community/search', communityController.search);
router.post('/community/clear', communityController.clear);
module.exports = router;