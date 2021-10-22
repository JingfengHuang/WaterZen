const router = require('express').Router();

/** Import Controllers */
const contributionController = require('../controllers/contributionController');

// Direct to private area page
router.get('/contribute', contributionController.view);
router.post('/contribute/data', contributionController.contributeData);
module.exports = router;