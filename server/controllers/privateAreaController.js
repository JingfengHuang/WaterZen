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
    const pageTitle = "Community";

    if (req.session.login) {
        pool.getConnection((err, connection) => {
            if(err) throw err; //not connected
            const today = new Date();
            console.log(`Connect as ID ${connection.threadId} at ${today}`)
    
            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (!err) {
                    res.render('privateArea', {login: true, pageTitle: pageTitle, nickname: rows[0].nickname});
                }
            });
        });
        
    } else {
        res.render('privateArea', {login: false, pageTitle: pageTitle});
    }
}