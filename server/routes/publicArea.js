/** Imports */
const router = require('express').Router();

/** Import Controllers */
const publicAreaController = require('../controllers/publicAreaController');

// Direct to public area page
router.get('/publicArea', publicAreaController.view);
router.post('/publicArea/basicSearch', publicAreaController.basicSearch);
router.post('/publicArea/advanceSearch', publicAreaController.advanceSearch);
router.get('/publicArea/clear', publicAreaController.clear);

module.exports = router;