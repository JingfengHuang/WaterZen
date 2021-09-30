/** Imports */
const router = require('express').Router();

/** Import Controllers */
const publicAreaController = require('../controllers/publicAreaController');

// Direct to public area page
router.get('/publicArea', publicAreaController.view);
router.post('/publicArea/searchState', publicAreaController.searchState);
router.get('/publicArea/clear', publicAreaController.clear);

module.exports = router;