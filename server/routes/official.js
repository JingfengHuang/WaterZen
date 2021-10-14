/** Imports */
const router = require('express').Router();

/** Import Controllers */
const officialController = require('../controllers/officialController');

// Direct to public area page
router.get('/official', officialController.view);
router.post('/official/basicSearch', officialController.basicSearch);
router.post('/official/advanceSearch', officialController.advanceSearch);
router.get('/official/clear', officialController.clear);

module.exports = router;