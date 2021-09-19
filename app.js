/** Imports */
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);
const fileUpload = require('express-fileUpload');

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
app.use('/js', express.static(__dirname  + 'public/js'));
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

// Log connect to DB
pool.getConnection((err, connection) => {
    if(err) throw err; //not connected
    const today = new Date();
    console.log(`Connect as ID ${connection.threadId} at ${today}`)
});

// Set session store to database
let sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
        tableName: 'session_store',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, pool);

app.use(session({
    name: 'sid',
	secret: 'good_quality_water_for_life',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: true,
    }
}));

// file upload configure
app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024 },
}));

// Route settings
const userRoutes = require('./server/routes/user');
app.use('/', userRoutes);

const publicAreaRoutes = require('./server/routes/publicArea');
app.use('/', publicAreaRoutes);

const privateAreaRoutes = require('./server/routes/privateArea');
app.use('/', privateAreaRoutes);

const productRoutes = require('./server/routes/product');
app.use('/', productRoutes);

const reportRoutes = require('./server/routes/report');
app.use('/', reportRoutes);

app.listen(port, () => console.log(`Listening on ${port}`));