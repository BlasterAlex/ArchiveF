const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./libs/config');
const fileUpload = require('express-fileupload');

// Default options
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Path
app.use(fileUpload());
app.use(express.static('views/public'));
app.use('/', express.static(config.imagePath));
app.use(cookieParser());

// Session key
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

// Настройка сервера
require('reloader')({
  watchModules: true,
  onStart: function () {
    console.log('Listening on port ', config.port);
  },
  onReload: function () {
    app.listen(config.port);
  }
});

// Глобальные переменные
app.use(function (req, res, next) {
  res.locals.numOfLinks = config.numOfLinks;
  res.locals.rowsShown = config.rowsShown;
  next();
});

// Routes
app.use('/', require('./routes/index'));

// 404 
app.use(function (req, res) {
  res.render('error404');
});