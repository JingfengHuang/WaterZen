/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");
const crypto = require("crypto");

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

/** Logic */
// Registration page
exports.view = (req, res) => {
    res.render('registration', {'registrationAlert': req.app.get('registrationAlert')});
    req.app.set('registrationAlert', '');
}

//Registration Validation
exports.registrationValidation = function (req, res) {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        const today = new Date();
        console.log(`Connect as ID ${connection.threadId} at ${today}`);

        // get user input
        const {userEmail, nickname} = req.body;

        // Check if this email already exist
        connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {

            if (rows.length !== 0) {
                req.app.set('registrationAlert', `This email address has already be registered!`);
                return res.redirect('/registration');
            }
        });

        // hash password
        const password = bcrypt.hashSync(req.body.password, 10);

        // set avatar path as default for now
        const avatarPath = "default";

        // Generate random verification code, inspired by https://dev.to/kais_blog/how-to-generate-a-secure-random-number-in-node-js-16io
        const n = crypto.randomInt(0, 1000000);
        crypto.randomInt(0, 1000000, (err, n) => {
            if (err) throw err;
            console.log(n);
        });
        const verificationCode = n.toString().padStart(6, "0");

        // Set email to not verified
        const emailVerified = 0;

        // insert into database
        connection.query('INSERT INTO user SET email = ?, nickname = ?, password = ?, avatarPath = ?, isEmailVerified = ?, verificationCode = ?', [userEmail, nickname, password, avatarPath, emailVerified, verificationCode], (err, rows) => {

            // if success refresh registration page
            if (!err) {
                req.app.set('registrationAlert', '');
                res.redirect('/emailVerification');
            } else {
                console.log(err);
            }
        });
    });
}