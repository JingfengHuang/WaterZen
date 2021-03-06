/** Imports */
const mysql = require('mysql');
const path = require('path');
const url = require('url');
const { check, validationResult } = require('express-validator');

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
    // console.log(req.session);
    if (!req.session.login) {
        res.redirect('/login');
    } else {

        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            // View required
            // CREATE OR REPLACE VIEW REPORT_STATS AS
            // SELECT U.id, U.nickname, U.avatarPath, R.status
            // FROM user U, report R 
            // WHERE U.id = R.userID;

            let nickname = "username";
            let avatarPath = "avatar.png";
            let submit = 0;
            let progress = 0;
            let complete = 0;
            let total = 0;

            connection.query('SELECT * FROM user WHERE email = ?', [req.session.userEmail], (err, rows) => {
                if (!err) {
                    nickname = rows[0].nickname;
                    avatarPath = rows[0].avatarPath;
                } else {
                    console.log(err);
                }
            });

            connection.query('SELECT id, nickname, avatarPath, status, COUNT(*) AS Count FROM report_stats WHERE id = ? GROUP BY status', [req.session.userID], (err, rows) => {
                if (!err && rows[0]) {
                    rows.forEach(function (item) {
                        if (item.status === "In Progress") {
                            progress = item.Count;
                            total += progress;
                        } else if (item.status === "Submitted for Review") {
                            submit = item.Count;
                            total += submit;
                        } else if (item.status === "Completed") {
                            complete = item.Count;
                            total += complete
                        }
                    });
                    // console.log(total);
                }
            });

            connection.query('SELECT * FROM sensordata WHERE userID = ? LIMIT 5', [req.session.userID], (err, rows) => {
                if (!err && rows[0]) {
                    // console.log(rows);
                    res.render('profile', { login: true, pageTitle: pageTitle, nickname: nickname, userEmail: req.session.userEmail, modifySuccess: req.flash('modifySuccess'), modifyAlert: req.flash('modifyAlert'), avatar: avatarPath, 'upload': req.flash('upload'), reportCount: total, progress: progress, submit: submit, complete: complete, contribution: rows });
                } else {
                    res.render('profile', { login: true, pageTitle: pageTitle, nickname: nickname, userEmail: req.session.userEmail, modifySuccess: req.flash('modifySuccess'), modifyAlert: req.flash('modifyAlert'), avatar: avatarPath, 'upload': req.flash('upload'), reportCount: total, progress: progress, submit: submit, complete: complete, nodata: "No contribution was made." });
                }
            });
        });
    }
}

// Modify profile
exports.modifyProfile = [check('nickname')
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage('Nickname should be longer than 3 characters and less than 15 characters!'), (req, res) => {



        if (!req.session.login) {
            res.redirect('/login');
        } else {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array()[0]);
                req.flash('modifyAlert', errors.array()[0].msg);
                return res.redirect('/profile');
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
                            req.flash('modifySuccess', 'Changes have been saved!');
                            return res.redirect('/profile');
                        } else {
                            console.log(err);
                            req.flash('modifyAlert', 'Failed to save changes, please try again!');
                            return res.redirect('/profile');
                        }
                    });
                });
            }
        }
    }]

exports.upload = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let profileimg = req.files.profileimg;
    let uploadPath = process.cwd() + '/public/img/upload/' + profileimg.name;

    // console.log(profileimg);
    // console.log(uploadPath);

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

// Load my reports
exports.viewReports = (req, res) => {
    const path = url.parse(req.originalUrl, true);


    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected

        let nickname = "username";
        let avatarPath = "avatar.png";

        connection.query('SELECT * FROM user WHERE email = ?', [req.session.userEmail], (err, rows) => {
            if (!err) {
                nickname = rows[0].nickname;
                avatarPath = rows[0].avatarPath;
            } else {
                console.log(err);
            }
        });

        let progress = "background-color: none";
        let complete = "background-color: none";
        let submit = "background-color: none";
        let all = "background-color: none";
        if (path.query.kind) {
            let kind = path.query.kind;

            console.log("kind is: " + kind);
            if (kind == "complete") {
                kind = "Completed";
                complete = "background-color: #b6d7e979";
            } else if (kind == "progress") {
                kind = "In Progress";
                progress = "background-color: #b6d7e979";
            } else if (kind == "submit") {
                submit = "background-color: #b6d7e979";
                kind = "Submitted for Review";
            }

            connection.query('SELECT * FROM report R, user U WHERE U.id = R.userID AND userID = ? AND status = ?', [req.session.userID, kind], (err, rows) => {
                if (!err) {
                    if (rows[0] != null) {
                        console.log("with record")
                        console.log(complete);
                        console.log(progress);
                        console.log(submit);
                        res.render('myReport', { login: true, pageTitle: "My Reports", nickname: rows[0].nickname, 'avatar': rows[0].avatarPath, result: rows, complete: complete, progress: progress, submit: submit });
                    } else {
                        console.log("no record")
                        res.render('myReport', { login: true, pageTitle: "My Reports", nickname: nickname, 'avatar': avatarPath, noRecord: "No Record.", complete: complete, progress: progress, submit: submit });
                    }

                } else {
                    console.log(err);
                }
            });


        } else {
            all = "background-color: #b6d7e979";
            connection.query('SELECT * FROM report R, user U WHERE U.id = R.userID AND userID = ?', [req.session.userID], (err, rows) => {
                if (rows[0]) {
                    res.render('myReport', { login: true, pageTitle: "My Reports", nickname: rows[0].nickname, 'avatar': rows[0].avatarPath, result: rows, complete: complete, progress: progress, submit: submit, all: all });
                } else {
                    res.render('myReport', { login: true, pageTitle: "My Reports", nickname: nickname, 'avatar': avatarPath, noRecord: "No Record.", complete: complete, progress: progress, submit: submit, all: all });
                }
            });
        }
    });
}

// Load my contribution
exports.contribution = (req, res) => {
    pool.getConnection((err, connection) => {
        let nickname = "username";
        let avatarPath = "avatar.png";

        connection.query('SELECT * FROM user WHERE email = ?', [req.session.userEmail], (err, rows) => {
            if (!err) {
                nickname = rows[0].nickname;
                avatarPath = rows[0].avatarPath;
                console.log(nickname);
                console.log(avatarPath);
            } else {
                console.log(err);
            }
        });

        connection.query('SELECT * FROM sensordata WHERE userID = ?', [req.session.userID], (err, rows) => {
            if (!err && rows[0] != null) {
                res.render('myContribution', { login: true, pageTitle: "My Contribution", nickname: nickname, 'avatar': avatarPath, result: rows });
            } else if (rows[0] == null) {
                res.render('myContribution', { login: true, pageTitle: "My Contribution", nickname: nickname, 'avatar': avatarPath, nodata: "No Record." });
            }
        });
    });
}