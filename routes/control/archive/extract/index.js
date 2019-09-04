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
  let archive = path.join(config.srcDir, baseName + '.7z');

  // Проверка наличия архива
  if (!fs.existsSync(archive))
    return res.status(404).send('archive not found');

  // Проверка папки базы
  if (fs.existsSync(base) && fs.statSync(base).isDirectory())
    return res.status(403).send('base is exist');

  // Выполнение разархивирования
  const myStream = Seven.extractFull(archive, config.srcDir, {
    $progress: true,
    noRootDuplication: true,
    password: password
  });

  // Разарзивирование завершено
  myStream.on('end', function () {

    // Создание объекта новой базы
    let baseObj = {
      baseName: baseName
    };

    // Для обработки ошибок
    var error;

    // Проверка папки изображений
    let imageDir = path.join(base, config.imageDir);
    try {
      // Создать папку изображений
      if (!fs.existsSync(imageDir))
        fs.mkdirSync(imageDir);
    } catch (e) {
      error = 'Невозможно создать папку изображений для \'' + baseName + '\', существует файл с таким именем!';
    }

    // Проверка аватарки базы
    let files = fs.readdirSync(base);
    for (var i in files) {
      if (files[i].match(config.avatarName + '.*') && fs.statSync(path.join(base, files[i])).isFile()) {
        baseObj.avatar = path.join(baseName, files[i]);
        break;
      } else {
        baseObj.avatar = false;
      }
    }

    // Проверка json файла
    let jsonFile = path.join(base, config.json);
    baseObj.json = {};

    if (fs.existsSync(jsonFile)) { // json файл существует

      // Чтение файла
      let json = fs.readFileSync(jsonFile);
      if (json) {
        json = JSON.parse(json);
        baseObj.json.size = json.length;
      }

    } else {

      baseObj.json.size = 0;
      try {
        // Создать json файл
        var records = [];
        let jsonBlame = JSON.stringify(records, null, 2);
        fs.writeFileSync(jsonFile, jsonBlame);
      } catch (err) {
        error = 'Невозможно создать файл \'' + config.json + '\' для \'' + baseName + '\'';
      }
    }

    // Проверка информационного файла
    let aboutFile = path.join(base, config.about);
    if (fs.existsSync(aboutFile)) { // json файл существует
      // Чтение файла
      let about = JSON.parse(fs.readFileSync(aboutFile, 'utf-8'));
      if (about) {
        baseObj.description = about.description;
      }
    } else {
      baseObj.description = '';
      try {
        // Создать json файл
        let aboutBlame = JSON.stringify({ description: '' }, null, 2);
        fs.writeFileSync(aboutFile, aboutBlame);
      } catch (err) {
        error = 'Невозможно создать файл \'' + config.about + '\' для \'' + baseName + '\'';
      }
    }

    // Состояние активности
    baseObj.isActive = false;

    // Дата последнего изменения базы
    try {
      let imageDirLast = moment(fs.statSync(imageDir).mtime);
      let rootDirLast = moment(fs.statSync(base).mtime);
      var lastUpdated;

      if (imageDirLast.isAfter(rootDirLast))
        lastUpdated = imageDirLast;
      else
        lastUpdated = rootDirLast;

      lastUpdated.locale('ru');
      baseObj.lastUpdated = lastUpdated.fromNow();
    } catch (e) {
      error = 'Не существует папки изображений для \'' + baseName + '\'';
    }

    baseObj.isArchive = false;

    if (error) { // ошибка
      rmdir(base, function (err) {
        if (err)
          res.status(505).send(err);
        else
          res.status(505).send(error);
      });
    } else { // все хорошо
      fs.unlinkSync(archive);
      res.status(200).send(baseObj);
    }
  });

  // Ошибка архивации
  myStream.on('error', function () {
    // При ошибке пароля все равно создается папка с базой
    rmdir(base, function (error) {
      if (error)
        res.status(505).send(error);
      else
        res.status(505).send('Неправильный пароль!');
    });
  });
};