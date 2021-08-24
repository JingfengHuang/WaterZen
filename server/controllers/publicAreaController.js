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
// Public area page
exports.view = (req, res) => {
    if (!req.session.login) {
        res.render('publicArea');
    } else {
        res.render('profile', {login: true});
    }
}