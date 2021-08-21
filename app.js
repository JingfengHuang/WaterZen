/** Imports */
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Parsing middleware
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// Parse application/json
app.use(express.json());

// Static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname  + 'public/css'));
app.use('/img', express.static(__dirname  + 'public/img'));

// Templating engine
app.engine('hbs', exphbs( {extname: '.hbs' })); // Set the extension format of handlebars to hbs
app.set('view engine', 'hbs');

// Create connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

// Connect to DB
pool.getConnection((err, connection) => {
    if(err) throw err; //not connected
    const today = new Date();
    console.log(`Connect as ID ${connection.threadId} at ${today}`)
});

const routes = require('./server/routes/user');
app.use('/', routes);

/* not sure -----------------------------------------------------------*/
app.get('/public', (req, res) => {
    res.render('publicArea');
})


app.listen(port, () => console.log(`Listening on ${port}`));