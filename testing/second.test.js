import 'regenerator-runtime/runtime';
const request = require('supertest');

var server;

// Настройка сервера
const initApp = () => {
  const express = require('express');
  const app = express();

  // Default options
  app.set('view engine', 'ejs');
  app.use(require('body-parser').urlencoded({ extended: true }));

  // Path
  app.use(require('express-fileupload')());
  app.use('/', express.static('./views/public'));
  app.use('/', express.static('./src'));
  // app.use('/', express.static(config.srcDir + config.rootDir + config.imageDir));
  app.use(require('cookie-parser')());

  // Session key
  app.use(require('express-session')({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }));
  app.use(require('connect-flash')());

  // Глобальные переменные
  app.use(function (req, res, next) {
    res.locals.baseName = 'test';
    res.locals.numOfLinks = 6;
    res.locals.rowsShown = 10;
    next();
  });

  // Routes
  app.use(require('../routes/index'));

  // 404 
  app.use(function (req, res) {
    res.render('error404');
  });

  return app;
};
var app = initApp();

describe('Test 2:', () => {

  beforeEach((done) => {
    server = app.listen(3000, (err) => {
      if (err) return done(err);
      global.agent = request.agent(server);
      done();
    });
  });

  afterEach((done) => {
    return server && server.close(done);
  });

  require('./tests/record');
  require('./tests/archive');
});