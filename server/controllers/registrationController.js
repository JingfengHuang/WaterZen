/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const url = require('url');
const { check, validationResult } = require('express-validator');

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
    const pageTitle = "Registration";
    res.render('registration', { 'registrationAlert': req.flash('registrationAlert'), 'emailSent': req.flash('emailSent'), 'validationError': req.flash('validationError'), pageTitle: pageTitle });
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
                    check('nickname')
                        .trim()
                        .isLength({min: 3, max: 15})
                        .withMessage('Nickname should be longer than 3 characters and less than 15 characters!'),
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
        console.log(errors.array());
        req.flash('validationError', errors.array());
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
                    req.flash('registrationAlert', 'This email address has been registered!');
                    return res.redirect('/registration');
                } else {
                    // Hash password
                    const password = bcrypt.hashSync(req.body.password, 10);

                    // Generate a verification key
                    let verificationKey = crypto.randomBytes(20).toString('hex');

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
                            req.flash('registrationAlert', 'Registration failed. Please contact IT team.');
                            res.redirect('/registration');
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    // Insert into database
                    connection.query('INSERT INTO user SET email = ?, nickname = ?, password = ?, isEmailVerified = ?, verificationKey = ?', [userEmail, nickname, password, 0, verificationKey], (err, rows) => {

                        // If success refresh registration page
                        if (!err) {
                            req.flash('emailSent', 'A verification email had been sent to your account. Please check your email for further verification.');
                            return res.redirect('/registration');
                        } else {
                            console.log(err);
                            req.flash('registrationAlert', 'Registration failed. Please contact IT team.');
                            res.redirect('/registration');
                        }
                    });
                }
            });
        });
    }
}]

// Verify email page
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
                    res.send('<h1 style="text-align: center">Verification Error, please contact IT Team.</h1>')
                }

                // If db updated
                if (!err) {
                    res.send(`<h1 style="text-align: center">Verification success! Please log in from <a href='/login'>here</a></h1>`)
                } else {
                    console.log(err);
                }
            });
        });
    } else {
        res.send('<h1>Verification Error, please contact IT Team.</h1>')
    }
}
