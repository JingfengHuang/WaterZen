var router = require('express').Router();
const indexController = require('../controllers/indexController');

router.get('/', function(req, res) {
    res.render('index');
});

module.exports = router;