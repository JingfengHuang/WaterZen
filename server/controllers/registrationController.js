/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const url = require('url');

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
    res.render('registration', { 'registrationAlert': req.app.get('registrationAlert') });
    req.app.set('registrationAlert', '');
}

//Registration Validation
exports.validation = function (req, res) {
    // Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; //not connected
        const today = new Date();
        console.log(`Connect as ID ${connection.threadId} at ${today}`);

        // get user input
        const { userEmail, nickname } = req.body;

        // Check if this email already exist
        connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {

            if (rows.length !== 0) {
                req.app.set('registrationAlert', `This email address has already be registered!`);
                return res.redirect('/registration');
            }
        });

        // hash password
        const password = bcrypt.hashSync(req.body.password, 10);

        // set avatar path as default for now
        const avatarPath = "default";

        var verificationKey = crypto.randomBytes(20).toString('hex');

        // Set email to not verified
        const emailVerified = 0;

        var mailOptions = {
            from: process.env.MAIL,
            to: userEmail,
            subject: 'Verify your WaterZen account',
            html:   `<p>Hi ${nickname},</p>
                    <p>Thank you for registering with WaterZen. Please verify your account by clicking this <a href="http://localhost:5000/registration/verify_email/?verify=${verificationKey}">link</a>.</p>
                    <p>Best Regards,<br>WaterZen IT</p>`
        };
        
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        // insert into database
        connection.query('INSERT INTO user SET email = ?, nickname = ?, password = ?, avatarPath = ?, isEmailVerified = ?, verificationKey = ?', [userEmail, nickname, password, avatarPath, emailVerified, verificationKey], (err, rows) => {

            // if success refresh registration page
            if (!err) {
                res.render('registration', {emailSent: 'A verification email had been sent to your account. Please check your email for further verification.'});
            } else {
                console.log(err);
            }
        });
    });
}


exports.verifyEmail = (req, res) => {
    var q = url.parse(req.originalUrl, true);

    if (q.query.verify) {
        console.log(q.query.verify);
        const verificationKey = q.query.verify;
        pool.getConnection((err, connection) => {
            if(err) throw err; //not connected
    
            // Query user existence
            connection.query('UPDATE user SET isEmailVerified = "1" WHERE verificationKey = ?', [verificationKey], (err, rows) => {
    
                // If db cannot find that account
                if (rows.length === 0) {
                    res.send('Verification Error, please contact IT Team.')
                }
    
                // If db updated
                if (!err) {
                    res.send(`Verification success! Please login from <a href='/login'>here</a>`)
                } else {
                    console.log(err);
                }
            });
        });
    } else {
        res.send('Verification Error, please contact IT Team.')
    }
    
    
}
