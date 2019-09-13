import 'regenerator-runtime/runtime';
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const rmdir = require('rimraf');

const config = JSON.parse(require('fs').readFileSync('config/config.json'));
const root = path.join(config.srcDir, config.rootDir);
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
  app.use('/', express.static('./public'));
  app.use('/', express.static(config.srcDir + config.rootDir + config.imageDir));
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
    res.locals.baseName = config.rootDir.split('/')[0];
    res.locals.numOfLinks = config.numOfLinks;
    res.locals.rowsShown = config.rowsShown;
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

/* ------- Запуск тестов ------- */

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

  // Проверка ветки /create
  test('Create test base via /create/dir', (done) => {

    fs.stat(root, function (err) {
      if (err == null)
        rmdir.sync(root);

      global.agent
        .get('/create/dir')
        .expect(303)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  test('Create imageDir  via /create/imageDir', (done) => {
    rmdir(path.join(root, config.imageDir), function (e) {
      if (e) done(e);

      global.agent
        .get('/create/imgDir')
        .expect(303)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  test('Create json file via /create/json', (done) => {
    fs.unlinkSync(path.join(root, config.json));
    global.agent
      .get('/create/json')
      .expect(303)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  require('./tests/record');
  require('./tests/afterAll');
});