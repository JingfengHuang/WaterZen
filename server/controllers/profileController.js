/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

/** Logic */
// Profile page
exports.view = (req, res) => {

    if (!req.session.login) {
        res.redirect('/login');
    } else {
        const userEmail = req.session.userEmail;

        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                // If db match user email
                if (!err) {
                    res.render('profile', { login: true, nickname: rows[0].nickname, userEmail: userEmail, modifyAlert: 'Changes have been saved' });
                } else {
                    res.redirect('/login');
                }
            });
        });
    }
}

// Modify profile
exports.modifyProfile = function (req, res) {
    if (!req.session.login) {
        res.redirect('/login');
    } else {
        // Connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            // Get user input
            const nickname = req.body.nickname;

            // Modify user profile
            connection.query('UPDATE user SET nickname=? WHERE email = ?', [nickname, req.session.userEmail], (err, rows) => {
                // If db match user email
                if (!err) {
                    res.render('profile', { login: true, nickname: nickname, userEmail: req.session.userEmail, modifyAlert: 'Changes have been saved' })
                } else {
                    console.log(err);
                    res.render('profile', { modifyAlert: 'Failed to save the changes, please try again!' })
                }
            });
        });
    }
}