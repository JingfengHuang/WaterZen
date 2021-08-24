/** Imports */
const router = require('express').Router();

/** Import Controllers */
const publicAreaController = require('../controllers/publicAreaController');

// Direct to public area page
router.get('/publicArea', publicAreaController.view);

module.exports = router;