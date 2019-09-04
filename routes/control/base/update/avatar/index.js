const fs = require('fs');
const path = require('path');
const moment = require('moment');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  // Полученые данные
  let baseName = req.body.baseName;
  let avatar = req.files.avatar;

  // Проверка папки базы
  let src = config.srcDir;
  let base = path.join(src, baseName);
  if (!(fs.existsSync(base) && fs.statSync(base).isDirectory())) {
    return res.status(404).send('base not found');
  }

  // Загрузка аватарки в папку
  let extension = avatar.name.split(/\.(?=[^\.]+$)/)[1];
  let fileName = 'avatar.' + extension;
  let filePath = path.join(base, fileName);

  // Если файл существует
  if (fs.existsSync(filePath))
    fs.unlinkSync(filePath);

  // Перемещение в папку
  avatar.mv(filePath, function (err) {
    if (err)
      return res.status(500).send(err);
  });

  // Получение времени последнего обновления
  let lastUpdated = moment(fs.statSync(base).mtime);
  lastUpdated.locale('ru');

  res.status(200).send({
    baseName: baseName,
    lastUpdated: lastUpdated.fromNow(),
    avatar: path.join(baseName, fileName)
  });

};