const fs = require('fs');

module.exports = function () { // для вывода сообщения об ошибке
  const config = JSON.parse(fs.readFileSync('config/config.json').toString());
  if (fs.existsSync(config.srcDir + config.rootDir))
    return 'Не найден файл JSON';
  return 'Не найдена папка с базой';
};

