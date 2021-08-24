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
    console.log(req.session);
    if (!req.session.userId) {
        res.render('login', {login: true, 'loginAlert': req.app.get('loginAlert')});
    } else {
        res.render('index');
    }
    // res.render('login', {'loginAlert': req.app.get('loginAlert')});
    // req.app.set('loginAlert', ``);
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
                req.app.set('loginAlert', `Incorrect email account or password!`);
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
                    req.session.userId = userEmail;
                    return res.redirect('/');
                } else {
                    req.app.set('loginAlert', `Incorrect email account or password!`);
                    return res.redirect('/login');
                }
            } else {
                console.log(err);
            }
        });
    });
};