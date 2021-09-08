const express = require('express')
// const mongoose = require('mongoose');
const path = require('path');
const app = express();

const route = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));

// * Set view engine template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources/views'));

app.get('/', function(req, res, next) {
  res.render('pages/index', {pageTitle: 'Home'});
});


route();

module.exports = app;