/** Imports */
const mysql = require('mysql');

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

/** Logic */
// Default page
exports.view = (req, res) => {
    const {userEmail} = req.session;
    const pageTitle = "WaterZen | Home";

    if (req.session.login) {
        const userEmail = req.session.userEmail;
        
        pool.getConnection((err, connection) => {
            if(err) throw err;
            
            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (!err) {
                    res.render('index', {pageTitle: pageTitle, login: true, nickname: rows[0].nickname, avatar: rows[0].avatarPath});
                } else {
                    res.render('index', {login: true, nickname: "username"});
                }
            });
        }); 
    } else {
        res.render('index', {login: false});
    }
}

// Log out and return to home page
exports.logout = (req, res) => {
    req.session.destroy(err => {
        // We can also clear out the cookie here. But even if we don't, the
        // session is already destroyed at this point, so either way, the
        // user won't be able to authenticate with that same cookie again.
        res.clearCookie('sid');
        res.redirect('/');
    })
}