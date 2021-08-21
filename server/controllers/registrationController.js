/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");
const req = require("express");

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
    res.render('registration');
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

        // hash password
        const password = bcrypt.hashSync(req.body.password, 10);

        // set avatar path as default for now
        const avatarPath = "default";

        // insert into database
        connection.query('INSERT INTO user SET email = ?, nickname = ?, password = ?, avatarPath = ?', [userEmail, nickname, password, avatarPath], (err, rows) => {
            // if success refresh registration page
            if (!err) {
                res.render('login');
            } else {
                console.log(err);
            }
        });
    });
}