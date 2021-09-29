/** Imports */
const mysql = require('mysql');
const request = require('request');

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

            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (!err) {
                    res.render('report', { login: true, pageTitle: pageTitle, nickname: rows[0].nickname, reportStatus: req.flash('reportStatus'), avatar: rows[0].avatarPath });
                }
            });
        });
    } else {
        res.render('report', { login: false, pageTitle: pageTitle, reportStatus: "Please log in to report water quality!", disabled: true });
    }
}

exports.reportQuality = (req, res) => {

    if (
        req.body['g-recaptcha-response'] === undefined ||
        req.body['g-recaptcha-response'] === '' ||
        req.body['g-recaptcha-response'] === null
    ) {
        req.flash('reportStatus', "Please select captcha!");
        return res.redirect('/report');
    } else if (!req.body.isAgreePolicy) {
        req.flash('reportStatus', "Please agree to our private policy to report!");
        return res.redirect('/report');
    } else if (
        req.body.state === 'null' ||
        req.body.city === 'null' ||
        req.body.preciseLocation === '' ||
        req.body.qualityTitle === '' ||
        req.body.qualityIssue === ''
    ) {
        req.flash('reportStatus', "Please fill in all the required field!");
        return res.redirect('/report');
    }

    // captcha verification
    const secretKey = "6LcPb4UcAAAAAJZpHpXiQYF-HKVTZtjSbzdYHY2p";
    const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

    // Make request to verify url
    request(verifyURL, (err, response, body) => {
        body = JSON.parse(body);

        // if not successful
        if (body.success !== undefined && !body.success) {
            req.flash('reportStatus', "Captcha verification failed! Please try again!");
            return res.redirect('/report');
        }
    });

    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected

        // Get user input
        const { state, city, preciseLocation, qualityTitle, qualityIssue } = req.body;
        let isPrivate = req.body.isPrivate ? true : false;

        connection.query("INSERT INTO report (userID, isPrivate, title, state, city, preciseLocation, latitude, longitude, details, status, governmentID, reply) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [req.session.userID, isPrivate, qualityTitle, state, city, preciseLocation, 0, 0, qualityIssue, "In process", 0, "No reply yet."], (err, rows) => {
            // If success then insert this report
            if (!err) {
                req.flash('reportStatus', 'Your report has been sent successfully!');
                return res.redirect('/report');
            } else {
                console.log(err);
                req.flash('reportStatus', "Couldn't send report. Please try again later!");
                return res.redirect('/report');
            }
        });
    });
}
