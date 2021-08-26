/** Imports */
const router = require('express').Router();

/** Import Controllers */
const productController = require('../controllers/productController');

// Direct to private area page
router.get('/product', productController.view);
module.exports = router;