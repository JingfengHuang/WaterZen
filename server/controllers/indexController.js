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
        res.render('index', {login: true});
    } else {
        res.render('index', {login: false});
    }
    
    console.log(req.session);
    console.log(req.sessionID);
    console.log(req.session.userEmail);

    // Connect to DB
    pool.getConnection((err, connection) => {
        if(err) throw err; //not connected
        const today = new Date();
        console.log(`Connect as ID ${connection.threadId} at ${today}`)
    });
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