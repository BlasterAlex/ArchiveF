const fs = require('fs');
var config = require('../../libs/config');

module.exports = function (req, res) {

  // Проверка на наличие папки
  var errImgFile = false;
  fs.readFile(config.imagePath, (err, data) => {
    if (err.syscall != "read") {
      errImgFile = true;
    }
  });

  fs.readFile(config.jsonPath + config.jsonName, (err, data) => {
    if (err) res.render('somethingWrong', { textError: require('../../utils/errorOutput')() });
    else if (!errImgFile) {
      var records = JSON.parse(data);

      res.render('main', { records: records, errors: req.flash('error'), messages: req.flash('notify') });
    } else
      res.render('somethingWrong', { textError: "Не найдена папка изображений" });
  });
}