const fs = require('fs');
const path = require('path');
const moment = require('moment');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  // Полученые данные
  let baseName = req.body.baseName;
  let description = req.body.description;
  var error;

  // Проверка папки базы
  let src = config.srcDir;
  let base = path.join(src, baseName);
  if (fs.existsSync(base)) {
    return res.status(403).send('file is exist');
  }

  // Создание папки
  try {
    fs.mkdirSync(base);
  } catch (e) {
    error = "Невозможно создать папку '" + baseName + "'";
  }

  if (error)
    return res.status(505).send(error);

  // Создание папки изображений
  let imageDir = path.join(base, config.imageDir);
  try {
    fs.mkdirSync(imageDir);
  } catch (e) {
    error = "Невозможно создать папку изображений для '" + baseName + "'";
  }

  // Создание json файла
  let jsonFile = path.join(base, config.json);
  try {
    var records = []
    let jsonBlame = JSON.stringify(records, null, 2);
    fs.writeFileSync(jsonFile, jsonBlame);
  } catch (err) {
    error = "Невозможно создать файл '" + config.json + "' для '" + baseName + "'";
  }

  // Создание информационного файла
  let aboutFile = path.join(base, config.about);
  try {
    let about = { 'description': description };
    let aboutBlame = JSON.stringify(about, null, 2);
    fs.writeFileSync(aboutFile, aboutBlame);
  } catch (err) {
    error = "Невозможно создать файл '" + config.about + "' для '" + baseName + "'";
  }

  if (error)
    return res.status(505).send(error);

  // Время последнего обращения к файлу
  var lastUpdated = moment(fs.statSync(base).mtime);
  lastUpdated.locale('ru');

  res.status(200).send({
    baseName: baseName,
    avatar: false,
    json: {
      size: 0
    },
    description: description,
    lastUpdated: lastUpdated.fromNow(),
    isActive: false,
    isArchive: false,
  });
}