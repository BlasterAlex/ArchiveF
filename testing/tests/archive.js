import 'regenerator-runtime/runtime';
const fs = require('fs');
const path = require('path');
const rmdir = require('rimraf');

var config = JSON.parse(require('fs').readFileSync('config/config.json'));

// Начальное название активной базы
let tempFile = path.join(config.srcDir, 'oldActiveBase');
const oldActive = fs.readFileSync(tempFile, 'utf8').toString();
fs.unlinkSync(tempFile);

// Базы для текущего теста
const baseName = config.rootDir.slice(0, -1);
const repBase = baseName + '1';
const repBaseDir = path.join(config.srcDir, repBase);

/* ------- Запуск тестов ------- */
describe('/control/archive', () => {

  fs.mkdirSync(repBaseDir);
  // // Создание архива с паролем
  // test('CREATE with password: status', (done) => {
  //   global.agent
  //     .post('/control/archive/create')
  //     .type('form')
  //     .send({
  //       'baseName': repBase,
  //       'repBase': baseName,
  //       'password': '123456'
  //     })
  //     .set('Accept', 'application/json')
  //     .expect(200)
  //     .end(function (err) {
  //       if (err) return done(err);
  //       done();
  //     });
  // });

  // // Извлечение архива с паролем
  // test('EXTRACT with password: status', (done) => {
  //   global.agent
  //     .post('/control/archive/extract')
  //     .type('form')
  //     .send({
  //       'baseName': repBase,
  //       'password': '123456'
  //     })
  //     .set('Accept', 'application/json')
  //     .expect(200)
  //     .end(function (err) {
  //       if (err) return done(err);
  //       done();
  //     });
  // });

  // Создание архива без пароля
  test('CREATE without password: status', (done) => {
    global.agent
      .post('/control/archive/create')
      .type('form')
      .send({
        'baseName': baseName,
        'repBase': repBase,
        'password': ''
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  // Удаление архива
  test('DELETE: status', (done) => {
    global.agent
      .delete('/control/archive')
      .type('form')
      .send({
        'archName': baseName
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err) {
        if (err) return done(err);

        // Удаление оставшейся базы 
        rmdir(repBaseDir, function () {
          config.rootDir = oldActive;
          fs.writeFileSync('config/config.json', JSON.stringify(config, null, 2));
        });
        done();
      });
  });
});
