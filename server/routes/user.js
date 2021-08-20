var router = require('express').Router();
const indexController = require('../controllers/indexController');
const mysql = require('mysql');

// Create connection pool
const connection = mysql.createConnection({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

router.get('/', function (req, res) {

    // Use the connection
    res.render('index');

});

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/registration', function (req, res) {
    res.render('registration');
});

router.post('/registration/validation', function (req, res) {
    var {useremail, nickname, password} = req.body;
    var avatarPath = "default";
    connection.query('INSERT INTO user SET email = ?, nickname = ?, password = ?, avatarPath = ?', [useremail, nickname, password, avatarPath], (err, rows) => {

        if (!err) {
            res.render('registration');
        } else {
            console.log(err);
        }
    });
});

module.exports = router;