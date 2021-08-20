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

// Homepage
router.get('/', function (req, res) {
    res.render('index');
});

// Direct to Login Page
router.get('/login', function (req, res) {
    res.render('login');
});

// Direct to registration page
router.get('/registration', function (req, res) {
    res.render('registration');
});

// get user input from registraion page and insert into db
router.post('/registration/validation', function (req, res) {
    // get user input
    const {useremail, nickname} = req.body;

    // hash password
    const password = bcrypt.hashSync(req.body.password, 10);

    // set avatar path as default for now
    const avatarPath = "default";

    // insert into database
    connection.query('INSERT INTO user SET email = ?, nickname = ?, password = ?, avatarPath = ?', [useremail, nickname, password, avatarPath], (err, rows) => {
        
        // if success refrech registration page
        if (!err) {
            res.render('registration');
        } else {
            console.log(err);
        }
    });
});

// check user login
router.post('/login/checklogin', function (req, res) {
    // get user input
    const {useremail, password} = req.body;

    // query user existence
    connection.query('SELECT * FROM user WHERE email = ?', [useremail], (err, rows) => {

        // if db match user email
        if (!err) {
            // get db-stored password
            let hashedpassword = rows[0].password;

            //compare user input password and db-stored password
            var matched = bcrypt.compareSync(password, hashedpassword);
            
            // if matched redirect to home page, if not pop alert
            if (matched) {
                res.render('index');
            } else {
                res.render('login', {rows, alert: `Incorrect email or password`});
            }
        } else {
            console.log(err);
        }
    });
});

module.exports = router;