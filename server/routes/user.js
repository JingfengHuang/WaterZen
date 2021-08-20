var router = require('express').Router();
const indexController = require('../controllers/indexController');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

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
    const {useremail, nickname} = req.body;
    const password = bcrypt.hashSync(req.body.password, 10);
    const avatarPath = "default";
    connection.query('INSERT INTO user SET email = ?, nickname = ?, password = ?, avatarPath = ?', [useremail, nickname, password, avatarPath], (err, rows) => {

        if (!err) {
            res.render('registration');
        } else {
            console.log(err);
        }
    });
});

router.post('/login/checklogin', function (req, res) {
    const {useremail, password} = req.body;
    connection.query('SELECT * FROM user WHERE email = ?', [useremail], (err, rows) => {
        if (!err) {
            
            let hashedpassword = rows[0].password;
            bcrypt.compare(password, hashedpassword, function(error, res) {
                if (!error) {
                    console.log(res); // true
                } else {
                    console.log(error);
                }
                
            });
            res.render('index');
        } else {
            console.log(err);
        }
    });
});

module.exports = router;