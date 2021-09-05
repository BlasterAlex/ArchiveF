const fs = require('fs');
const path = require('path');

module.exports = function (req, res) {
  const config = JSON.parse(fs.readFileSync('config/config.json').toString());
  let baseName = req.body.baseName;
  let base = path.join(config.srcDir, baseName);

  // Проверка папки базы
  if (!(fs.existsSync(base) && fs.statSync(base).isDirectory()))
    return res.status(404).send('base not found');

  // Запись названия новой базы в конфиг
  config.rootDir = baseName + '/';
  fs.writeFileSync('config/config.json', JSON.stringify(config, null, 2));

  res.status(200).send({
    baseName: baseName
  });

};