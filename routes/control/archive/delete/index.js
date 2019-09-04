const fs = require('fs');
const path = require('path');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  // Полученые данные
  let archName = req.body.archName;
  var error;

  // Проверка архива
  let src = config.srcDir;
  let arch = path.join(src, archName + '.7z');
  if (!fs.existsSync(arch)) {
    return res.status(404).send('arch not found');
  }

  // Удаление архива
  try {
    fs.unlinkSync(arch);
  } catch (err) {
    error = err;
  }

  // Отправка результата на фронт
  if (error)
    res.status(505).send(error);
  else {
    res.status(200).send({ archName: archName });
  }
};