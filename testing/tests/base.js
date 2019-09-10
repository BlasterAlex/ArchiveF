import 'regenerator-runtime/runtime';
const uniqid = require('uniqid');
const path = require('path');

// База для тестирования
const baseName = 'test' + uniqid();

/* ------- Запуск тестов ------- */

module.exports = function (testDir) {
  describe('/control', () => {

    // Получение списка файлов в пользовательской папке
    test('GET: status', (done) => {
      global.agent.get('/control').then((res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    // Работа с базой
    describe('/control/base', () => {

      // Создание базы
      test('POST: status', (done) => {
        global.agent
          .post('/control/base')
          .type('form')
          .send({
            'baseName': baseName,
            'description': 'Test base'
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });

      // Обновление базы
      describe('/control/base/update', () => {

        // Обновление иконки базы
        test('POST avatar: status', (done) => {
          global.agent
            .post('/control/base/update/avatar')
            .set('Accept', 'application.json')
            .field('baseName', baseName)
            .attach('avatar', path.resolve('testing/data/img/test-image.jpg'))
            .expect(200)
            .end(function (err) {
              if (err) return done(err);
              done();
            });
        });

        // Обновление статуса базы
        test('POST status: status', (done) => {
          global.agent
            .post('/control/base/update/status')
            .set('Accept', 'application.json')
            .field('baseName', baseName)
            .expect(200)
            .end(function (err) {
              if (err) return done(err);
              done();
            });
        });

        // Удаление активной базы 
        test('DELETE: status', (done) => {
          global.agent
            .delete('/control/base')
            .type('form')
            .send({
              'baseName': baseName,
              'repBase': testDir.slice(0, -1),
            })
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err) {
              if (err) return done(err);
              done();
            });
        });
      });
    });
  });
};