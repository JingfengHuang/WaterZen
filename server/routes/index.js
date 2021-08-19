var router = require('express').Router();
const indexController = require('../controllers/indexController');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/login', function(req, res) {
    res.render('login');
});

module.exports = router;