/** Imports */
const mysql = require('mysql');

//Variables
let results = null;
let selected = null;

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

exports.view = (req, res) => {

    const userEmail = req.session.userEmail;
    const pageTitle = "Official";

    if (req.session.login) {
        pool.getConnection((err, connection) => {
            if(err) throw err; //not connected

            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (!err) {
                    res.render('publicArea', {login: true, pageTitle: pageTitle, nickname: rows[0].nickname, avatar: rows[0].avatarPath, results:results, selected: selected, alert:req.flash('nullState')});
                }
            });
        });
    } else {
        res.render('publicArea', {login: false, pageTitle: pageTitle, results:results, selected: selected, alert:req.flash('nullState')});
    }
}

exports.searchState = (req, res) => {
    let state = req.body.state;
    let orderBy = req.body.orderBy;
    selected = state;

    if (state == "null") {
        req.flash('nullState', 'Please select a valid choice!');
        return res.redirect('/publicArea/clear');
    }

    if (orderBy == "null") {
        pool.getConnection((err, connection) => {
            if(err) throw err; //not connected
            connection.query('SELECT * FROM qualityData WHERE state = ?', [state], (err, rows) => {
                if (!err) {
                    results = rows;
                    res.redirect('/publicArea');
                }
            });
        });
    } else if (orderBy == "city") {
        pool.getConnection((err, connection) => {
            if(err) throw err; //not connected
            connection.query('SELECT * FROM qualityData WHERE state = ? ORDER BY city ASC', [state], (err, rows) => {
                if (!err) {
                    results = rows;
                    res.redirect('/publicArea');
                }
            });
        });
    } else if (orderBy == "quality") {
        return res.redirect('/publicArea/clear');
    }
}

exports.clear = (req, res) => {
    selected = null;
    results = null;
    res.redirect('/publicArea');
}