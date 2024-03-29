const fs = require('fs');
const path = require('path');
const rmdir = require('rimraf');

module.exports = function (req, res) {
  const config = JSON.parse(fs.readFileSync('config/config.json').toString());

  // Полученые данные
  let baseName = req.body.baseName;
  let repBaseName = req.body.repBase;

  // Проверка папки базы
  let src = config.srcDir;
  let base = path.join(src, baseName);
  if (!(fs.existsSync(base) && fs.statSync(base).isDirectory())) {
    return res.status(404).send('base not found');
  }

  // Проверка папки базы на замену, если такая есть
  if (repBaseName != 'false') {
    let repBase = path.join(src, repBaseName);
    if (!(fs.existsSync(repBase) && fs.statSync(repBase).isDirectory())) {
      console.log(repBase);
      return res.status(404).send('repBase not found');
    }
  }
  
  // Удаление папки базы
  rmdir(base, function (err) {
    if (err)
      res.status(505).send(err);
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

      res.status(200).send(data);
    }
  });
};