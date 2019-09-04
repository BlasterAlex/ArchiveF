const fs = require('fs');
const path = require('path');
const moment = require('moment');

var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  var bases = new Array;
  var error;

  function checkFile(file) { // функция проверки файла

    if (fs.statSync(file).isDirectory()) { // если это папка

      // Создание объекта новой базы
      let base = {};

      // Название базы
      base.name = path.basename(file);

      // Проверка папки изображений
      let imageDir = path.join(file, config.imageDir);
      try {
        // Создать папку изображений
        if (!fs.existsSync(imageDir))
          fs.mkdirSync(imageDir);
      } catch (e) {
        error = 'Невозможно создать папку изображений для \'' + base.name + '\', существует файл с таким именем!';
      }

      // Проверка аватарки базы
      let files = fs.readdirSync(file);
      for (var i in files) {
        if (files[i].match(config.avatarName + '.*') && fs.statSync(path.join(file, files[i])).isFile()) {
          base.avatar = path.join(base.name, files[i]);
          break;
        } else {
          base.avatar = false;
        }
      }

      // Проверка json файла
      let jsonFile = path.join(file, config.json);
      base.json = {};

      if (fs.existsSync(jsonFile)) { // json файл существует

        // Чтение файла
        let json = fs.readFileSync(jsonFile);
        if (json) {
          json = JSON.parse(json);
          base.json.size = json.length;
        }

      } else {

        base.json.size = 0;
        try {
          // Создать json файл
          var records = [];
          let jsonBlame = JSON.stringify(records, null, 2);
          fs.writeFileSync(jsonFile, jsonBlame);
        } catch (err) {
          error = 'Невозможно создать файл \'' + config.json + '\' для \'' + base.name + '\'';
        }
      }

      // Проверка информационного файла
      let aboutFile = path.join(file, config.about);
      if (fs.existsSync(aboutFile)) { // json файл существует
        // Чтение файла
        let about = JSON.parse(fs.readFileSync(aboutFile, 'utf-8'));
        if (about) {
          base.description = about.description;
        }
      } else {
        base.description = '';
        try {
          // Создать json файл
          let aboutBlame = JSON.stringify({ description: '' }, null, 2);
          fs.writeFileSync(aboutFile, aboutBlame);
        } catch (err) {
          error = 'Невозможно создать файл \'' + config.about + '\' для \'' + base.name + '\'';
        }
      }

      // Состояние активности
      if (path.basename(file) === path.basename(config.rootDir))
        base.isActive = true;
      else
        base.isActive = false;

      // Дата последнего изменения базы
      try {
        let imageDirLast = moment(fs.statSync(imageDir).mtime);
        let rootDirLast = moment(fs.statSync(file).mtime);
        let lastUpdated;

        if (imageDirLast.isAfter(rootDirLast))
          lastUpdated = imageDirLast;
        else
          lastUpdated = rootDirLast;

        lastUpdated.locale('ru');
        base.lastUpdated = lastUpdated.fromNow();
      } catch (e) {
        error = 'Не существует папки изображений для \'' + base.name + '\'';
      }

      base.isArchive = false;

      // Добавление новой базы в массив
      bases.push(base);
    } else if (path.extname(file) === '.7z') { // если это архив

      // Название базы
      let baseName = path.basename(file).split('.')[0];
      let baseDir = path.join(config.srcDir, baseName);

      // Если существует папка с таким именем - пропустить
      if (!(fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory())) {

        // Время последнего обращения к архиву
        let lastUpdated = moment(fs.statSync(file).mtime);
        lastUpdated.locale('ru');

        bases.push({
          name: baseName,
          lastUpdated: lastUpdated.fromNow(),
          isArchive: true
        });
      }
    }
  }

  const src = config.srcDir;
  let files = fs.readdirSync(src); // чтение папки ресурсов
  for (var i in files)  // поиск баз среди файлов в папке
    checkFile(path.join(src, files[i]));

  if (error) {
    req.flash('error', error);
    res.redirect('/');
  } else
    res.render('controlPage', { bases: bases });
};