/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");
const req = require("express");

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

/** Logic */
// Login page
exports.view = (req, res) => {
    res.render('login');
}

// Login verification
exports.loginVerification = function (req, res) {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if(err) throw err; //not connected
        const today = new Date();
        console.log(`Connect as ID ${connection.threadId} at ${today}`);

        // Get user input
        const {userEmail, password} = req.body;

        // Query user existence
        connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
            // When done with the connection, release it
            connection.release();

            // If db match user email
            if (!err) {
                // Get db-stored password
                let hashedPassword = rows[0].password;

                // Compare user input password and db-stored password
                const matched = bcrypt.compareSync(password, hashedPassword);

                // If matched redirect to home page, if not pop alert
                if (matched) {
                    res.render('index', {rows});
                } else {
                    res.render('login', {rows, alert: `Incorrect email or password!`});
                }
            } else {
                console.log(err);
            }

            console.log(rows);
        });
    });
};