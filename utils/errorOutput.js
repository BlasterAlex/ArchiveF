const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'))

module.exports = function () { // для вывода сообщения об ошибке
  if (fs.existsSync(config.srcDir + config.rootDir))
    return "Не найден файл JSON";
  return "Не найдена папка с базой";
}

