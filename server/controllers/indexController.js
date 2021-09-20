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
exports.view = (req, res) => {
    const {userEmail} = req.session;
    
    if (req.session.login) {
        const userEmail = req.session.userEmail;
        
        pool.getConnection((err, connection) => {
            if(err) throw err;
            const today = new Date();
            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (err) {
                    res.redirect('/login');
                }
            });
        });

        res.render('index', {login: true, nickname: req.session.nickname});
    } else {
        res.render('index', {login: false});
    }
}

exports.logout = (req, res) => {
    req.session.destroy(err => {
        // We can also clear out the cookie here. But even if we don't, the
        // session is already destroyed at this point, so either way, the
        // user won't be able to authenticate with that same cookie again.
        res.clearCookie('sid');
    
        res.redirect('/');
    })
}