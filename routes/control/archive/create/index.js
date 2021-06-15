const fs = require('fs');
const path = require('path');
const rmdir = require('rimraf');
const moment = require('moment');
const Seven = require('node-7z');

const pathTo7zip = require('7zip-bin').path7za;
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {
  let baseName = req.body.baseName.trim();
  let repBaseName = req.body.repBase.trim();
  let password = req.body.password;
  let src = config.srcDir;
  let base = path.join(src, baseName);

  // Проверка папки базы
  if (!(fs.existsSync(base) && fs.statSync(base).isDirectory()))
    return res.status(404).send('base not found');

  // Проверка папки базы на замену, если такая есть
  if (repBaseName != 'false') {
    let repBase = path.join(src, repBaseName);
    if (!(fs.existsSync(repBase) && fs.statSync(repBase).isDirectory())) {
      return res.status(404).send('repBase not found');
    }
  }

  // Формирование объекта
  let data = {
    $bin: pathTo7zip,
    recursive: true
  };

  if (password.length)
    data.password = password;

  // Проверка архива
  var archive = path.join(config.srcDir, baseName + '.7z');
  if (fs.existsSync(archive)) {
    return res.status(505).send('Архив с таким именем существует!');
  }

  // Создание архива
  const myStream = Seven.add(archive, base, data);

  // Архивация завершена
  myStream.on('end', function () {
    if (
      myStream.info.get('Archives with Errors') === undefined &&
      myStream.info.get('Creating archive') !== undefined
    ) {

      rmdir(base, function (err) {
        if (err)
          res.status(505).send('err');
        else {

          // Формирование объекта для отправки на фронт
          var data = { baseName: baseName };

          if (repBaseName != 'false') { // если есть файл на замену
            // Запись названия новой базы в конфиг
            config.rootDir = repBaseName + '/';
            fs.writeFileSync('config/config.json', JSON.stringify(config, null, 2));

            data.newActive = repBaseName;
          } else {
            data.newActive = false;
          }

          // Дата последней модификации
          var lastUpdated = moment(fs.statSync(archive).mtime);
          lastUpdated.locale('ru');
          data.lastUpdated = lastUpdated.fromNow();

          res.status(200).send(data);
        }
      });
    }
  });

  // Ошибка архивации
  myStream.on('error', function (err) {
    if (err.code === 'ENOENT')
      return res.status(505).send('Не удалось найти программу для архивации');
    return res.status(505).send(err);
  });
};