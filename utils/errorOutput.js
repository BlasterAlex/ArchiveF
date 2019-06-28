const fs = require('fs');
var config = require('../libs/config');

module.exports = function () { // для вывода сообщения об ошибке
  if (fs.existsSync(config.jsonPath)) {
    return "Не найден файл JSON";
  }
  else return "Не найдена папка с базой";
}

