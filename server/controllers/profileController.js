/** Imports */
const mysql = require('mysql');
const path = require('path');

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

let modifyAlert = null;
let upload = null;

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
                if (err) {
                    modifyAlert = null;
                    res.redirect('/login');
                }
            });
        });

        res.render('profile', { login: true, nickname: req.session.nickname, userEmail: userEmail, 'modifyAlert': modifyAlert });
        modifyAlert = null;
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
                    modifyAlert = 'Changes have been saved';
                    res.redirect('/profile');
                } else {
                    console.log(err);
                    modifyAlert = 'Failed to save the changes, please try again!';
                    res.redirect('/profile');
                }
            });
        });
    }
}

exports.upload = (req, res) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // name of the input
    sampleFile = req.files.sampleFile;
    uploadPath = process.cwd() + '/public/img/upload/' + sampleFile.name;

    console.log(sampleFile);
    console.log(uploadPath);

    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);

        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            connection.query('UPDATE user SET avatarPath = ?', [sampleFile.name], (err, rows) => {
                if (!err) {
                    upload = "Upload Success!";
                    res.redirect('/profile');
                } else {
                    console.log(err);
                }
            });
        });
    })
}