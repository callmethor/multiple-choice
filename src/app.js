const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const md5 = require('md5');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const flash = require('connect-flash');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(cookieParser("1234"))
app.use(express.json())
app.use(express.urlencoded({extended: false }));

const route = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));

// * Set view engine template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources/views'));

//route init
route(app);



// * Using cookie-parser to parse cookie header and populate req.cookies.<key-of-cookie>
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({ cookie: { maxAge: 60000 }, saveUninitialized: true, resave: false, secret: process.env.COOKIE_SECRET }));
app.use(flash());



module.exports = app;