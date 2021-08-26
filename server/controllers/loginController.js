/** Imports */
const mysql = require('mysql');
const bcrypt = require("bcrypt");

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
        res.render('login');
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
                req.session.login = false;
                req.session.email = null;
                res.redirect('/login');
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
                    req.session.userEmail = rows[0].email;
                    return res.redirect('/');
                } else {
                    req.session.login = false;
                    req.session.userEmail = null;
                    return res.render('/login', {loginAlert: 'Incorrect email account or password!'});
                }
            } else {
                console.log(err);
            }
        });
    });
}