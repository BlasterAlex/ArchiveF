const fs = require('fs');
const path = require('path');
const rmdir = require('rimraf');
const moment = require('moment');
const Seven = require('node-7z');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {
  let baseName = req.body.baseName;
  let password = req.body.password;
  let base = path.join(config.srcDir, baseName);

  // Проверка папки базы
  if (!(fs.existsSync(base) && fs.statSync(base).isDirectory()))
    return res.status(404).send('base not found');

  // Формирование объекта
  let data = {
    recursive: true
  };

  if (password.length)
    data.password = password;

  // Создание архива
  var archive = path.join(config.srcDir, baseName + '.7z');
  const myStream = Seven.add(archive, base, data);

  // Архивация завершена
  myStream.on('end', function () {
    rmdir(base, function (err) {
      if (err)
        res.status(505).send(err);
      else {
        var lastUpdated = moment(fs.statSync(archive).mtime);
        lastUpdated.locale('ru');

        res.status(200).send({
          baseName: baseName,
          lastUpdated: lastUpdated.fromNow()
        });
      }
    });
  })

  // Ошибка архивации
  myStream.on('error', function (err) {
    return res.status(505).send(err);
  });
}