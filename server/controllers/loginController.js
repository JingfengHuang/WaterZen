/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");

// Variables
let loginAlert = null;

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

// Login page
exports.view = (req, res) => {
    if (!req.session.login) {
        res.render('login', {'loginAlert': loginAlert});
        loginAlert = null;
    } else {
        res.redirect('/');
        loginAlert = null;
    }
}

// Login verification
exports.verification =  (req, res) => {

    // Connect to DB
    pool.getConnection((err, connection) => {
        if(err) throw err; //not connected
        const today = new Date();
        console.log(`Connect as ID ${connection.threadId} at ${today}`);

        // Get user input
        const {userEmail, password} = req.body;

        // Query user existence
        connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {

            // If db cannot find that account
            if (rows.length === 0) {
                req.session.login = false;
                req.session.userID = null;
                req.session.email = null;
                req.session.nickname = null;
                loginAlert = 'Incorrect email address or password!';
                return res.redirect('/login');
            } else if (rows[0].isEmailVerified === 0) {
                req.session.login = false;
                req.session.userID = null;
                req.session.email = null;
                req.session.nickname = null;
                loginAlert = 'This email address has been registered and is awaiting for verification. Please check your email inbox for instructions.';
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
                    req.session.nickname = rows[0].nickname;
                    loginAlert = null;
                    return res.redirect('/');
                } else {
                    req.session.login = false;
                    req.session.userID = null;
                    req.session.userEmail = null;
                    req.session.nickname = null;
                    loginAlert = 'Incorrect email account or password!';
                    return res.redirect('/login');
                }
            } else {
                console.log(err);
            }
        });
    });
}