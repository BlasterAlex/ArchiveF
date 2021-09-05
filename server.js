const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const config = () => JSON.parse(require('fs').readFileSync('config/config.json').toString());

// Default options
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Path
app.use(fileUpload());
app.use('/', express.static('./views/public'));
app.use('/', express.static('./public'));
app.use(cookieParser());

// Session key
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

// Глобальные переменные
app.use(function (req, res, next) {
  res.locals.baseName = config().rootDir.split('/')[0];
  res.locals.baseImageDir = config().rootDir + config().imageDir;
  res.locals.numOfLinks = config().numOfLinks;
  res.locals.rowsShown = config().rowsShown;
  next();
});

// Routes
app.use('/', require('./routes/index'));

// 404 
app.use(function (req, res) {
  res.render('error404');
});

// Настройка сервера
require('reloader')({
  watchModules: true,
  onStart: function () {
    console.log('Listening on port ', config().port);
  },
  onReload: function () {
    app.listen(config().port);
  }
});