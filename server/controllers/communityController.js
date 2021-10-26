/** Imports */
const mysql = require('mysql');

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

/** Variables */
let searchData = null;

/** Logic */
// Default page
exports.view = (req, res) => {

    const userEmail = req.session.userEmail;
    const pageTitle = "Community";

    if (req.session.login) {
        pool.getConnection((err, connection) => {
            if(err) throw err; //not connected
            const today = new Date();
            console.log(`Connect as ID ${connection.threadId} at ${today}`)
    
            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (searchData == null) {
                    connection.query('SELECT * FROM sensorData', (queryErr, allData) => {
                        allData.forEach(element => 
                            element.level = calculateLevel(element.temperature, element.pH, element.eletricalConductivity)
                        );
                        res.render('community', {login: true, pageTitle: pageTitle, nickname: rows[0].nickname, avatar: rows[0].avatarPath, allData: allData});
                    });
                } else {
                    searchData.forEach(element => 
                        element.level = calculateLevel(element.temperature, element.pH, element.eletricalConductivity)
                    );
                    res.render('community', {login: true, pageTitle: pageTitle, nickname: rows[0].nickname, avatar: rows[0].avatarPath, allData: searchData});
                }
            });
        });
        
    } else {
        if (searchData === null) {
            pool.getConnection((err, connection) => {
                connection.query('SELECT * FROM sensorData', (queryErr, allData) => {
                    allData.forEach(element => 
                        element.level = calculateLevel(element.temperature, element.pH, element.eletricalConductivity)
                    );
                    res.render('community', {login: false, pageTitle: pageTitle, allData: allData});
                });
            });
        } else {
            searchData.forEach(element => 
                element.level = calculateLevel(element.temperature, element.pH, element.eletricalConductivity)
            );
            res.render('community', {login: false, pageTitle: pageTitle, allData: searchData});
        }
    }

    searchData = null;
}

// Search for places with keywords and return the query results
exports.search = (req, res) => {
    let keyword = req.body.placeName;
    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM sensorData WHERE placeName LIKE ?', ["%" + keyword + "%"], (err, rows) => {
            searchData = rows;
            return res.redirect('/community');
        });
    });
}

// Clear all search keywords and clear all query results
exports.clear = (req, res) => {
    searchData = null;
    return res.redirect('/community');
}

// Calculaate water quality level, based on temperature, pH, and water conductivity.
function calculateLevel(temperature, pH, waterConductivity) {
    result = 1;
    if (temperature >= 25) {
        result++;
    }
    if (pH < 6.5 || pH > 8.5) {
        result++;
    }
    if (waterConductivity >= 2500) {
        result = result + 2;
    } else if (waterConductivity > 800) {
        result++;
    }

    return result;
}