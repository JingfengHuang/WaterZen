/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const url = require('url');
const { check, validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PSWD,
    },
});

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

// Login page
exports.view = (req, res) => {
    const pageTitle = "Log in";

    if (!req.session.login) {
        res.render('login', { pageTitle: pageTitle, loginAlert: req.flash('loginAlert') });
    } else {
        res.redirect('/');
    }
}

// Login verification
exports.verification = (req, res) => {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        const today = new Date();
        console.log(`Connect as ID ${connection.threadId} at ${today}`);

        // Get user input
        const { userEmail, password } = req.body;

        // Query user existence
        connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {

            // If db cannot find that account
            if (rows.length === 0) {
                req.flash('loginAlert', 'Incorrect email address or password!.');
                return res.redirect('/login');
            } else if (rows[0].isEmailVerified === 0) {
                req.flash('loginAlert', 'This email address has been registered and is awaiting for verification. Please check your email inbox for instructions.');
                return res.redirect('/login');
            }

            // If db match user email
            if (!err) {
                // Get db-stored password
                let hashedPassword = rows[0].password;

                // Compare user input password and db-stored password
                const matched = bcrypt.compareSync(password, hashedPassword);

                // If matched redirect to home page, if not pop alert
                if (matched) {
                    req.session.login = true;
                    req.session.userID = rows[0].id;
                    req.session.userEmail = rows[0].email;
                    return res.redirect('/');
                } else {
                    req.flash('loginAlert', 'Incorrect email address or password!.');
                    return res.redirect('/login');
                }
            } else {
                console.log(err);
            }
        });
    });
}

exports.resetCheck = (req, res) => {
    const pageTitle = "Reset Password";
    res.render('checkEmail', { pageTitle: pageTitle, resetAlert: req.flash('resetAlert')});
}

exports.resetVerify = (req, res) => {
    if (req.body.userEmail) {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query('SELECT * FROM user WHERE email = ?', [req.body.userEmail], (err, rows) => {
                if (rows.length === 0) {
                    req.flash('resetAlert', 'No Account Found!');
                    return res.redirect('/login/resetCheck');
                }

                // Generate a reset token
                let token = crypto.randomBytes(20).toString('hex');
                
                let mailOptions = {
                    from: process.env.MAIL,
                    to: req.body.userEmail,
                    subject: 'WaterZen: Reset Your Password',
                    html: `
                    <p>Please reset your password via this <a href="http://localhost:5000/login/resetPassword/?verify=${token}">link</a>.</p>
                    <p style="color: red;">Please note that this reset link will be expired after one hour.</p>
                    <p>Best Regards,<br>WaterZen IT</p>`
                };

                // Send verification email
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        req.flash('resetAlert', 'Reset Failed. Please contact IT team');
                        res.redirect('/login/resetCheck');
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                connection.query('INSERT INTO reset SET userEmail = ?, reset_token= ?, timestamp = ?', [req.body.userEmail, token, new Date()], (err, rows) => {

                    // If success refresh registration page
                    if (!err) {
                        req.flash('resetAlert', 'Please check your email to get instructions for resetting your password.');
                        return res.redirect('/login/resetCheck');
                    } else {
                        console.log(err);
                        req.flash('resetAlert', 'Reset Failed. Please contact IT team.');
                        res.redirect('/login/resetCheck');
                    }
                });
            });
        });
    }
}

exports.resetPassword = (req, res) => {
    let path = url.parse(req.originalUrl, true);

    if (path.query.verify) {
        const token = path.query.verify;
        const pageTitle = "Reset Password";

        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            // Query user existence
            connection.query('SELECT * FROM reset WHERE reset_token = ?', [token], (err, rows) => {
                
                let requestTime = Math.round(new Date(rows[0].timestamp).getTime() / 1000);
                let currentTime = Math.round(new Date().getTime() / 1000);

                if (rows.length === 0) {
                    return res.send('<h1 style="text-align: center">Reset Error, please contact IT Team.</h1>');
                } else if ((currentTime - requestTime) > 3600) {
                    return res.send('<h1 style="text-align: center">Reset link expired! Please try again!</h1>');
                }

                if (!err) {
                    res.render('reset', {pageTitle: pageTitle, userEmail: rows[0].userEmail, token: token, validationError: req.flash('validationError')});
                } else {
                    res.send('<h1 style="text-align: center">Reset Error, please contact IT Team.</h1>')
                }
            });
        });
    } else {
        res.send('<h1>Reset Error, please contact IT Team.</h1>')
    }
}

exports.resetPermission = [
                            check('password')
                            .trim()
                            .isLength({ min: 6, max:16 })
                            .withMessage('Password must be longer than 6 characters!'),
                            check('confirm')
                            .isLength({ min: 6 })
                            .withMessage('Confirm password is required.')
                            .custom(async (confirmPassword, {req}) => {
                                const password = req.body.password

                                /** Inspired by https://www.geeksforgeeks.org/how-to-compare-password-and-confirm-password-inputs-using-express-validator */
                                if(password !== confirmPassword){
                                throw new Error('Passwords must match')
                                }
                            }),(req, res) => {

    const token = req.body.token;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        req.flash('validationError', errors.array());

        return res.redirect(`/login/resetPassword/?verify=${token}`);
    } else {
        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            const password = bcrypt.hashSync(req.body.password, 10);

            connection.query('UPDATE user SET password = ? WHERE email = ?', [password, req.body.userEmail], (err, rows) => {

                if (!err) {
                    res.send('<h1 style="text-align: center">Reset Success! Now you can log in from <a href="/login">here</a>.</h1>');
                } else {
                    res.send('<h1 style="text-align: center">Reset Error, please contact IT Team.</h1>')
                }
            });
        });
    }
    
}]