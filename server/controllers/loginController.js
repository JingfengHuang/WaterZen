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


/** Logic */
// Login page
exports.view = (req, res) => {
    if (!req.session.login) {
        if (req.session.loginAlert == null) {
            res.render('login');
        } else {
            res.render('login', {'loginAlert': req.session.loginAlert});
        }
        req.session.login = false;
        req.session.userId = null;
        req.session.loginAlert = null;
        req.session.nickname = null;
        req.session.email = null;
    } else {
        res.redirect('/');
    }
}


// Login verification
exports.verification = function (req, res) {

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
                req.session.userId = null;
                req.session.loginAlert = 'Incorrect email account or password!';
                req.session.nickname = null;
                req.session.email = null;
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
                    req.session.userId = rows[0].id;
                    req.session.loginAlert = null;
                    req.session.nickname = rows[0].nickname;
                    req.session.email = rows[0].email;
                    return res.redirect('/');
                } else {
                    req.session.login = false;
                    req.session.userId = null;
                    req.session.loginAlert = 'Incorrect email account or password!';
                    req.session.nickname = null;
                    req.session.email = null;
                    return res.redirect('/login');
                }
            } else {
                console.log(err);
            }
        });
    });
};