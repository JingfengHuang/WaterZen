const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

// Default page
exports.view = (req, res) => {

    const userEmail = req.session.userEmail;
    const pageTitle = "Contribute to Community";

    if (req.session.login) {
        pool.getConnection((err, connection) => {
            if (err) throw err;

            connection.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, rows) => {
                if (!err) {
                    res.render('contribute', { login: true, pageTitle: pageTitle, nickname: rows[0].nickname, contributeStatus: req.flash('contributeStatus'), avatar: rows[0].avatarPath });
                }
            });
        });
    } else {
        res.render('contribute', { login: false, pageTitle: pageTitle, contributeStatus: "Please log in to contribute data!", disabled: true});
    }
}

exports.contributeData = (req, res) => {

    let contributionimg = req.files.contributionimg;
    let uploadPath = process.cwd() + '/public/img/community/' + contributionimg.name;

    contributionimg.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);

        pool.getConnection((err, connection) => {
            if (err) throw err; //not connected

            // Get user input
            const {placeName, category, location, shortIntro, temperature, turbidity, totalDissolved, electricalCon, phV} = req.body;

            connection.query("INSERT INTO sensordata (userID, placeName, category, location, shortIntroduction, imagePath, temperature, turbidity, totalDissolvedSolids, electricalConductivity, ph) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [req.session.userID, placeName, category, location, shortIntro, contributionimg.name, temperature, turbidity, totalDissolved, electricalCon, phV], (err, rows) => {
                // If success then insert this report
                if (!err) {
                    req.flash('contributeStatus', 'Your have successfully contributed to the community!');
                    return res.redirect('/contribute');
                } else {
                    console.log(err);
                    req.flash('contributeStatus', "Couldn't contribute. Please try again later!");
                    return res.redirect('/contribute');
                }
            });
        });
    })
}