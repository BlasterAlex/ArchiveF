const fs = require('fs');
var config = require('../../libs/config');
var dateFormat = require('./../../utils/dateFormatting');

module.exports = function (req, res) {

  // console.log(dateFormat.stringToDate("30-04-2019 12:00").getTime());

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