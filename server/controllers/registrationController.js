/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const url = require('url');
const { check, validationResult } = require('express-validator');

// Variables
let registrationAlert = null;
let emailSent = null;
let validationError = null;

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PSWD,
    },
});

/** Logic */
// Registration page
exports.view = (req, res) => {
    if (registrationAlert) {
        res.render('registration', { 'registrationAlert': registrationAlert });
    } else if (emailSent) {
        res.render('registration', { 'emailSent': emailSent });
    } else if (validationError) {
        res.render('registration', { 'validationError': validationError });
    } else {
        res.render('registration');
    }
    registrationAlert = null;
    emailSent = null;
    validationError = null;
}

// Registration Validation
exports.validation = [check('userEmail')
                        .trim()
                        .isEmail()
                        .normalizeEmail()
                        .withMessage('Invalid email address!'),
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
                        }),
                        (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            console.log(errors.array());
            validationError = errors.array();
            return res.redirect('/registration');
        } else {
            pool.getConnection((err, connection) => {
                if (err) throw err; //not connected
                const today = new Date();
                console.log(`Connect as ID ${connection.threadId} at ${today}`);

                // Get user input
                const { userEmail, nickname } = req.body;

                // Check if this email already exist
                connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {

                    if (rows.length !== 0) {
                        let isEmailVerified = rows[0].isEmailVerified;
                        if (isEmailVerified === 0) {
                            registrationAlert = 'This email address has been registered and is awaiting for verification. Please check your email inbox for instructions.';
                        } else {
                            registrationAlert = 'This email address has be registered!';
                        }
                        return res.redirect('/registration');
                    } else {
                        // Hash password
                        const password = bcrypt.hashSync(req.body.password, 10);

                        // Set avatar path as default for now
                        const avatarPath = "default";

                        // Generate a verification key
                        let verificationKey = crypto.randomBytes(20).toString('hex');

                        // Set email to not verified
                        let emailVerified = 0;

                        // Set verification email contents
                        let mailOptions = {
                            from: process.env.MAIL,
                            to: userEmail,
                            subject: 'Verify your WaterZen account',
                            html: `<p>Hi ${nickname},</p>
                            <p>Thank you for registering with WaterZen. Please verify your account by clicking this <a href="http://localhost:5000/registration/verify_email/?verify=${verificationKey}">link</a>.</p>
                            <p>Best Regards,<br>WaterZen IT</p>`
                        };

                        // Send verification email
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });

                        // Insert into database
                        connection.query('INSERT INTO user SET email = ?, nickname = ?, password = ?, avatarPath = ?, isEmailVerified = ?, verificationKey = ?', [userEmail, nickname, password, avatarPath, emailVerified, verificationKey], (err, rows) => {

                            // If success refresh registration page
                            if (!err) {
                                emailSent = 'A verification email had been sent to your account. Please check your email for further verification.';
                                return res.redirect('/registration');
                            } else {
                                console.log(err);
                            }
                        });


                    }
                });

            });
        }

    }]


exports.verifyEmail = (req, res) => {
    let path = url.parse(req.originalUrl, true);

    if (path.query.verify) {
        console.log(path.query.verify);
        const verificationKey = path.query.verify;
        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            // Query user existence
            connection.query('UPDATE user SET isEmailVerified = "1" WHERE verificationKey = ?', [verificationKey], (err, rows) => {

                // If db cannot find that account
                if (rows.length === 0) {
                    res.send('<p>Verification Error, please contact IT Team.</p>')
                }

                // If db updated
                if (!err) {
                    res.send(`<p>Verification success! Please log in from <a href='/login'>here</a></p>`)
                } else {
                    console.log(err);
                }
            });
        });
    } else {
        res.send('<p>Verification Error, please contact IT Team.</p>')
    }
}
