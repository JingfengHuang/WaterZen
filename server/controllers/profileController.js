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
// Profile page
exports.view = (req, res) => {
    if (!req.session.login) {
        res.redirect('/login');
    } else {
        res.render('profile', {login: true, 'nickname': req.session.nickname, 'emailAddress': req.session.email, 'modifyAlert': req.session.modifyAlert});
    }
    req.session.modifyAlert = null;
}

// Modify profile
exports.modifyProfile = function (req, res)  {
    if (!req.session.login) {
        res.redirect('/login');
    } else {
        // Connect to DB
        pool.getConnection((err, connection) => {
            if(err) throw err; //not connected
            const today = new Date();
            console.log(`Connect as ID ${connection.threadId} at ${today}`);

            // Get user input
            const {nickname, emailAddress} = req.body;

            // Modify user profile
            connection.query('UPDATE `user` SET `nickname` = ?, `email` = ? WHERE `user`.`id` = ?', [nickname, emailAddress, req.session.userId], (err, rows) => {
                // If db match user email
                if (!err) {
                    req.session.nickname = nickname;
                    req.session.email = emailAddress;
                    req.session.modifyAlert = 'Changes have been saved';
                    res.redirect('/profile');
                } else {
                    req.session.modifyAlert = 'Failed to save the changes, please try again!';
                    console.log(err);
                    res.redirect('/profile');
                }
            });
        });

    }
}