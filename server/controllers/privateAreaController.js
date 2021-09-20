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

    const userEmail = req.session.userEmail;

    if (req.session.login) {
        pool.getConnection((err, connection) => {
            if(err) throw err; //not connected
            const today = new Date();
            console.log(`Connect as ID ${connection.threadId} at ${today}`)
    
            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (err) {
                    res.redirect('/login');
                }
            });
        });
        res.render('privateArea', {login: true, nickname: req.session.nickname});
    } else {
        res.render('privateArea', {login: false});
    }
}