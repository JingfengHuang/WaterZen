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

// Profile page
exports.view = (req, res) => {
    const pageTitle = "My Profile";

    if (!req.session.login) {
        res.redirect('/login');
    } else {
        const userEmail = req.session.userEmail;

        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                // If db match user email
                if (!err) {
                    res.render('profile', { login: true, pageTitle: pageTitle, nickname: rows[0].nickname, userEmail: userEmail, 'modifyAlert': req.flash('modifyAlert'), 'avatar': rows[0].avatarPath, 'upload': req.flash('upload')} );
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
                    req.flash('modifyAlert', 'Changes have been saved!');
                    res.redirect('/profile');
                } else {
                    console.log(err);
                    req.flash('modifyAlert', 'Failed to save changes, please try again!');
                    res.redirect('/profile');
                }
            });
        });
    }
}

exports.upload = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let profileimg = req.files.profileimg;
    let uploadPath = process.cwd() + '/public/img/upload/' + profileimg.name;

    console.log(profileimg);
    console.log(uploadPath);

    profileimg.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);

        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            connection.query('UPDATE user SET avatarPath = ? WHERE email = ?', [profileimg.name, req.session.userEmail], (err, rows) => {
                if (!err) {
                    req.flash('upload', 'Upload Success!');
                    res.redirect('/profile');
                } else {
                    console.log(err);
                }
            });
        });
    })
}