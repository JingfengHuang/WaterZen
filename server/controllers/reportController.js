/** Imports */
const mysql = require('mysql');
const { check, validationResult } = require('express-validator');

/** Variables */
let disabled = true;
let alert = null;
let reportSent = null;
let validationError = null;

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

exports.view = (req, res) => {

    const userEmail = req.session.userEmail;

    if (req.session.login) {
        pool.getConnection((err, connection) => {
            if(err) throw err;
            const today = new Date();
            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (err) {
                    res.redirect('/login');
                }
            });
        });

        res.render('report', {login: true, nickname: req.session.nickname, validationError: validationError, reportSent: reportSent});
    } else {
        alert = "You have to log in before continuing!"
        res.render('report', {login: false, alert: alert, disabled});
    }

    alert = null;
    reportSent = null;
    validationError = null;
}

exports.reportQuality = [check("isAgreePolicy").custom(async (isAgreePolicy, {req}) => {

        if(!(isAgreePolicy != null)){
            throw new Error('In order to submit water quality report, you need to agree with our policy.')
        }}),

        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                validationError = errors.array();
                return res.redirect('/report');
            } else {
                // Connect to DB
                pool.getConnection((err, connection) => {
                    if(err) throw err; //not connected
                    const today = new Date();
                    console.log(`Connect as ID ${connection.threadId} at ${today}`);

                    // Get user input
                    const {state, city, preciseLocation, qualityTitle, qualityIssue} = req.body;
                    let isPrivate = req.body.isPrivate ? true : false;

                    connection.query("INSERT INTO report (userID, isPrivate, title, state, city, preciseLocation, latitude, longitude, details, status, governmentID, reply) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [req.session.userID, isPrivate,  qualityTitle, state, city, preciseLocation, 0, 0, qualityIssue, "In process", 0, "No reply yet."], (err, rows) => {
                        // If success then insert this report
                        if (!err) {
                            reportSent = "Your report has been successfully sent!";
                            return res.redirect('/report');
                        } else {
                            console.log(err);
                        }
                    });
                    
                });
            }
        }
]