const express = require('express')
// const mongoose = require('mongoose');
const path = require('path');
const md5 = require('md5');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors());
app.use(cookieParser())

const route = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));

// * Set view engine template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources/views'));

//route init
route(app);

// app.get('/', function(req, res, next) {
//   res.render('pages/index', {pageTitle: 'Home'});
// });


app.all('/error', (req, res, next) => {
  res.render('pages/error-404', { pageTitle: 'Error 404 !' })
});


module.exports = app;