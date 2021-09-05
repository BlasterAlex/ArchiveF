import 'regenerator-runtime/runtime';
const request = require('supertest');
const fs = require('fs');
const path = require('path');

var testDir = 'test' + require('uniqid')() + '1/';
var server;

// Настройка сервера
const initApp = () => {
  const express = require('express');
  const app = express();
  const config = JSON.parse(require('fs').readFileSync('config/config.json').toString());

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

describe('Test 1:', () => {
  const config = JSON.parse(require('fs').readFileSync('config/config.json').toString());

  // Запомнить название активной базы
  fs.writeFileSync(path.join(config.srcDir, 'oldActiveBase'), config.rootDir);

  // Заменить название базы на новое
  config.rootDir = testDir;
  fs.writeFileSync('config/config.json', JSON.stringify(config, null, 2));

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

  test('Create test base via /control/base', (done) => {
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

  describe('/control', () => {
    // Получение списка файлов в пользовательской папке
    test('GET: status', (done) => {
      global.agent.get('/control').then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    require('./tests/base.js')(testDir);
    // require('./tests/archive')(testDir);
  });
});