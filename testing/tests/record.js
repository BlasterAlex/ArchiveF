import 'regenerator-runtime/runtime';
const uniqid = require('uniqid');
const fs = require('fs');
const path = require('path');

// Новая запись для тестирования
const recordName = 'test' + uniqid();

// Поиск записи
function findRecord(name) {
  let config = JSON.parse(fs.readFileSync('config/config.json'));
  let data = fs.readFileSync(config.srcDir + config.rootDir + config.json);
  return JSON.parse(data).find(x => x.name === name);
}
function findRecordIndex(name) {
  let config = JSON.parse(fs.readFileSync('config/config.json'));
  let data = fs.readFileSync(config.srcDir + config.rootDir + config.json);
  return JSON.parse(data).findIndex(x => x.name === name);
}

/* ------- Запуск тестов ------- */

// Добавить новую
describe('/add', () => {

  test('GET: status', (done) => {
    global.agent.get('/add').then((res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  test('POST: status', (done) => {
    global.agent
      .post('/add')
      .set('Accept', 'application.json')
      .field('name', recordName)
      .attach('Images', path.resolve('testing/data/img/test-image.jpg'))
      .expect(303)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

// Страница записи
describe('/record', () => {

  let found, recordId;
  beforeAll(() => {
    found = findRecord(recordName);
    if (found)
      recordId = found.id;
  });

  test('GET: status', (done) => {
    if (!recordId)
      return done('Record not found');

    global.agent.get('/record/' + recordId).then((res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
  test('UPDATE: status', (done) => {
    if (!recordId)
      return done('Record not found');

    global.agent
      .post('/record/update')
      .type('form')
      .send({
        'id': recordId,
        'name': recordName,
        'url': 'https://www.google.com/',
        'linkName': 'google'
      })
      .set('Accept', 'application/json')
      .expect(303)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  // Редактирование изображений записи
  describe('/record/images', () => {

    // Загрузка изображений
    test('UPLOAD one: status', (done) => {
      if (!recordId)
        return done('Record not found');

      global.agent
        .post('/record/images')
        .set('Accept', 'application.json')
        .field('id', recordId)
        .field('name', recordName)
        .attach('array', path.resolve('testing/data/img/test-image.jpg'))
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    test('UPLOAD two: status', (done) => {
      if (!recordId)
        return done('Record not found');

      global.agent
        .post('/record/images')
        .set('Accept', 'application.json')
        .field('id', recordId)
        .field('name', recordName)
        .attach('array', path.resolve('testing/data/img/test-image.jpg'))
        .attach('array', path.resolve('testing/data/img/test-image.jpg'))
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    // Изменение состояния изображений
    test('UPDATE: status', (done) => {
      if (!recordId)
        return done('Record not found');

      // Получение последнего состояния записи
      found = findRecord(recordName);
      if (!found)
        return done('Modified record not found');

      // Перемешивание изображений
      found.addImages = found.addImages.sort(() => Math.random() - 0.5);
      let i = Math.floor(Math.random() * found.addImages.length);
      found.img = [found.addImages[i], found.addImages[i] = found.img][0];

      // Отправка запроса
      global.agent
        .put('/record/images')
        .type('form')
        .send({
          'id': recordId,
          'img': found.img,
          'addImages': found.addImages
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    // Удаление изображений
    test('DELETE additional: status', (done) => {
      if (!recordId)
        return done('Record not found');

      // Получение последнего состояния записи
      found = findRecord(recordName);
      if (!found)
        return done('Modified record not found');

      // Случайный индекс из массива
      let index = Math.floor(Math.random() * found.addImages.length);

      // Отправка запроса
      global.agent
        .delete('/record/images')
        .type('form')
        .send({
          'id': recordId,
          'picName': found.addImages[index]
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    test('DELETE main: status', (done) => {
      if (!recordId)
        return done('Record not found');

      // Получение последнего состояния записи
      found = findRecord(recordName);
      if (!found)
        return done('Modified record not found');

      // Отправка запроса
      global.agent
        .delete('/record/images')
        .type('form')
        .send({
          'id': recordId,
          'picName': found.img
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

// Получить все
describe('/all', () => {
  test('GET: status', (done) => {
    global.agent.get('/').then((res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});

// Получить случайную
describe('/random', () => {
  test('GET: status', (done) => {
    global.agent.get('/random').then((res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});

// Удалить запись
describe('/del', () => {
  test('GET: status', (done) => {
    global.agent.get('/del').then((res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
  test('POST: status', (done) => {
    let index = findRecordIndex(recordName);
    if (index === -1)
      return done('Record not found');

    global.agent
      .post('/del')
      .set('Accept', 'application.json')
      .field('sel', index)
      .expect(303)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});
