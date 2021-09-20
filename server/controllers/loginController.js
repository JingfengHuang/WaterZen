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
    const pageTitle = "Log in";
    
    if (!req.session.login) {
        res.render('login', {pageTitle: pageTitle, loginAlert: loginAlert});
        loginAlert = null;
    } else {
        res.redirect('/');
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
                loginAlert = 'Incorrect email address or password!';
                return res.redirect('/login');
            } else if (rows[0].isEmailVerified === 0) {
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
                    return res.redirect('/');
                } else {
                    loginAlert = 'Incorrect email account or password!';
                    return res.redirect('/login');
                }
            } else {
                console.log(err);
            }
        });
    });
}