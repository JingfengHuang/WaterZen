/** Imports */
const mysql = require('mysql');
const { check, validationResult } = require('express-validator');

/** Variables */
let reportStatus = null;

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

exports.view = (req, res) => {

    const userEmail = req.session.userEmail;
    const pageTitle = "Quality Report";

    if (req.session.login) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            const today = new Date();
            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (!err) {
                    res.render('report', {login: true, pageTitle: pageTitle, nickname: rows[0].nickname, reportStatus: reportStatus, avatar: rows[0].avatarPath});
                }
            });
        });
    } else {
        res.render('report', {login: false, pageTitle: pageTitle, reportStatus: "Please log in to report water quality!", disabled: true });
    }
}

exports.reportQuality = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        const today = new Date();
        console.log(`Connect as ID ${connection.threadId} at ${today}`);

        // Get user input
        const { state, city, preciseLocation, qualityTitle, qualityIssue } = req.body;
        let isPrivate = req.body.isPrivate ? true : false;

        connection.query("INSERT INTO report (userID, isPrivate, title, state, city, preciseLocation, latitude, longitude, details, status, governmentID, reply) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [req.session.userID, isPrivate, qualityTitle, state, city, preciseLocation, 0, 0, qualityIssue, "In process", 0, "No reply yet."], (err, rows) => {
            // If success then insert this report
            if (!err) {
                reportStatus = "Your report has been sent successfully!";
                return res.redirect('/report');
            } else {
                console.log(err);
                reportStatus = "Couldn't send report. Please try again later!";
                return res.redirect('/report');
            }
        });
    });
}
