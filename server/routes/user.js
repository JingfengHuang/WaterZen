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
    connection.query('SELECT * FROM user', (err, rows) => {
        // when connection done, release it

        if (!err) {
            res.render('index');
        } else {
            console.log(err);
        }
    });

});

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/registration', function (req, res) {
    res.render('registration');
});

module.exports = router;