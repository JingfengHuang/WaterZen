/** Imports */
const {
    compile
} = require('ejs');
const mysql = require('mysql');

//Variables
let results = null;
let selected = null;

/** Create connection pool */
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

exports.view = (req, res) => {

    const userEmail = req.session.userEmail;
    const pageTitle = "Official";

    if (req.session.login) {
        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (!err) {
                    res.render('official', {
                        login: true,
                        pageTitle: pageTitle,
                        nickname: rows[0].nickname,
                        avatar: rows[0].avatarPath,
                        results: results,
                        selected: selected,
                        alert: req.flash('nullState')
                    });
                }
            });
        });
    } else {
        res.render('official', {
            login: false,
            pageTitle: pageTitle,
            results: results,
            selected: selected,
            alert: req.flash('nullState')
        });
    }
}


function onbeforeunload() {
    console.log("onbeforeunload");
    var scrollPos;
    if (typeof window.pageYOffset != 'undefined') {
        scrollPos = window.pageYOffset;
    }
    else if (typeof document.compatMode != 'undefined' &&
        document.compatMode != 'BackCompat') {
        scrollPos = document.documentElement.scrollTop;
    }
    else if (typeof document.body != 'undefined') {
        scrollPos = document.body.scrollTop;
    }
    document.cookie = "scrollTop=" + scrollPos; //存储滚动条位置到cookies中
}

function onload() {
    console.log("onload");
    if (document.cookie.match(/scrollTop=([^;]+)(;|$)/) != null) {
        var arr = document.cookie.match(/scrollTop=([^;]+)(;|$)/); //cookies中不为空，则读取滚动条位置
        document.documentElement.scrollTop = parseInt(arr[1]);
        document.body.scrollTop = parseInt(arr[1]);
    }
}

exports.basicSearch = (req, res) => {
    pool.getConnection((err, connection) => {
        let state = req.body.state;
        let searchCity = req.body.searchCity;
        let searchPlace = req.body.searchPlace;
        selected = {
            "state": null,
            "searchCity": null,
            "searchPlace": null,
            "orderby": null
        };

        /* Create view */
        if (state != "null") {
            selected.state = state;

            if (searchCity == "" && searchPlace == "") {
                connection.query('CREATE OR REPLACE VIEW select_state AS SELECT * FROM qualityData WHERE `state` = ?;', [state], (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                });
            } else if (searchCity != "" && searchPlace == "") {
                selected.searchCity = searchCity;
                searchCity = searchCity + '%';
                connection.query('CREATE OR REPLACE VIEW select_state AS SELECT * FROM qualityData WHERE `state` = ? AND `city` LIKE ?;', [state, searchCity], (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                });
            } else if (searchCity == "" && searchPlace != "") {
                selected.searchPlace = searchPlace;
                searchPlace = '%' + searchPlace + '%';
                connection.query('CREATE OR REPLACE VIEW select_state AS SELECT * FROM qualityData WHERE `state` = ? AND `placeName` LIKE ?;', [state, searchPlace], (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                });
            } else if (searchCity != "" && searchPlace != "") {
                selected.searchCity = searchCity;
                selected.searchPlace = searchPlace;
                searchCity = searchCity + '%';
                searchPlace = '%' + searchPlace + '%';
                connection.query('CREATE OR REPLACE VIEW select_state AS SELECT * FROM qualityData WHERE `state` = ? AND `placeName` LIKE ? AND `city` LIKE ?;', [state, searchPlace, searchCity], (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        } else if (state == "null") {

            if (searchCity == "" && searchPlace == "") {
                req.flash('nullState', 'Please select a valid choice!');
                return res.redirect('/official/clear');

            } else if (searchCity != "" && searchPlace == "") {
                selected.searchCity = searchCity;
                searchCity = searchCity + '%';
                connection.query('CREATE OR REPLACE VIEW select_state AS SELECT * FROM qualityData WHERE `city` LIKE ?;', [searchCity], (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                });
            } else if (searchCity == "" && searchPlace != "") {
                selected.searchPlace = searchPlace;
                searchPlace = '%' + searchPlace + '%';
                connection.query('CREATE OR REPLACE VIEW select_state AS SELECT * FROM qualityData WHERE `placeName` LIKE ?;', [searchPlace], (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                });
            } else if (searchCity != "" && searchPlace != "") {
                selected.searchCity = searchCity;
                selected.searchPlace = searchPlace;
                searchCity = searchCity + '%';
                searchPlace = '%' + searchPlace + '%';
                connection.query('CREATE OR REPLACE VIEW select_state AS SELECT * FROM qualityData WHERE `placeName` LIKE ? AND `city` LIKE ?;', [searchPlace, searchCity], (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }


        /* Show data */
        connection.query('SELECT * FROM select_state', (err, rows) => {
            if (!err) {
                results = rows;
                results.forEach(element => 
                    element.level = calculateLevel(element.temperature, element.pH, element.eletricalConductivity)
                );
                console.log(results);
                res.redirect('/official');
            } else {
                console.log(err);
            }
        });
    });
}
exports.advanceSearch = (req, res) => {
    pool.getConnection((err, connection) => {
        let orderBy = req.body.orderBy;
        if (orderBy == "city") {
            selected.orderBy = "city";
            connection.query('SELECT * FROM select_state ORDER BY `city` ASC', (err, rows) => {
                if (!err) {
                    results = rows;
                    results.forEach(element => 
                        element.level = calculateLevel(element.temperature, element.pH, element.eletricalConductivity)
                    );
                    res.redirect('/official');
                    // used with ajax to get ordered data
                    // res.send(results);

                } else {
                    console.log(err);
                }
            });

        } else if (orderBy == "name") {
            selected.orderBy = "name";
            connection.query('SELECT * FROM select_state ORDER BY `placeName` ASC', (err, rows) => {
                if (!err) {
                    results = rows;
                    results.forEach(element => 
                        element.level = calculateLevel(element.temperature, element.pH, element.eletricalConductivity)
                    );
                    res.redirect('/publicArea');
                } else {
                    console.log(err);
                }
            });
        } else if (orderBy == "quality") {
            selected.orderBy = "quality";
            return res.redirect('/official/clear');
        }
    });
}

exports.recommendation = (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM qualityData WHERE placeName = ?', ['Loddon River'], (err, resultRows) => {
            results = resultRows;
            results.forEach(element => 
                element.level = calculateLevel(element.temperature, element.pH, element.eletricalConductivity)
            );
            res.redirect('/official');
        });
    });
}

exports.clear = (req, res) => {
    selected = null;
    results = null;
    res.redirect('/official');
}

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