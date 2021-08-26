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

    // Connect to DB
    pool.getConnection((err, connection) => {
        if(err) throw err; //not connected
        const today = new Date();
        console.log(`Connect as ID ${connection.threadId} at ${today}`)
    });


    if (req.session.login) {
        res.render('product', {login: true});
    } else {
        res.render('product', {login: false});
    }
}