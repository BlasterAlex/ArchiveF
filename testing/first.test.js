import 'regenerator-runtime/runtime';
const request = require('supertest');
const fs = require('fs');
const path = require('path');
var config = JSON.parse(require('fs').readFileSync('config/config.json'));
var testDir;

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

describe('Test 1:', () => {

  // Запомнить название активной базы
  fs.writeFileSync(path.join(config.srcDir, 'oldActiveBase'), config.rootDir);

  // Заменить название базы на новое
  config.rootDir = 'test' + require('uniqid')() + '1/';
  fs.writeFileSync('config/config.json', JSON.stringify(config, null, 2));
  testDir = config.rootDir;

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

  test('Create test base', (done) => {
    global.agent
      .post('/control/base')
      .type('form')
      .send({
        'baseName': testDir,
        'description': 'Test Base'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  require('./tests/base.js')(testDir);
});