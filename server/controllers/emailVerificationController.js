/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

/** Logic */
// Email verification page
exports.view = (req, res) => {
    res.render('emailVerification', {'emailVerificationAlert': req.app.get('emailVerificationAlert')});
    req.app.set('emailVerificationAlert', ``);
}

// Code verification
exports.codeVerification = function (req, res) {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        const today = new Date();
        console.log(`Connect as ID ${connection.threadId} at ${today}`);

        // Get user input
        const {userEmail, verificationCode} = req.body;

        //Query code correct
        connection.query('SELECT * FROM user WHERE email = ? AND verificationCode = ?', [userEmail, verificationCode], (err, rows) => {

            // If no result returned
            if (rows.length === 1) {
                req.app.set('emailVerificationAlert', `Congregations! You can login now`);

                connection.query('UPDATE user SET isEmailVerified = 1 WHERE email = ? AND verificationCode = ?', [userEmail, verificationCode], (err, rows) => {
                });
            } else {
                req.app.set('emailVerificationAlert', `Incorrect verification code`);
            }

            return res.redirect('/emailVerification');
        });
    });
}