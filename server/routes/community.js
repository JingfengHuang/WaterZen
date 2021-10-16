/** Imports */
const router = require('express').Router();

/** Import Controllers */
const communityController = require('../controllers/communityController');

// Direct to private area page
router.get('/community', communityController.view);
router.post('/community/search', communityController.search);
module.exports = router;