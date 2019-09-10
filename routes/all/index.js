const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));
// var dateFormat = require('./../../utils/dateFormatting');

module.exports = function (req, res) {

  // console.log(dateFormat.stringToDate("30-04-2019 12:00").getTime());

  // Проверка на наличие папки
  var errImgFile = false;
  fs.readFile(config.srcDir + config.rootDir + config.imageDir, (err) => {
    if (err.syscall != 'read') {
      errImgFile = true;
    }
  });

  fs.readFile(config.srcDir + config.rootDir + config.json, (err, data) => {
    if (err) res.status(404).render('somethingWrong', { textError: require('../../utils/errorOutput')() });
    else if (!errImgFile) {
      var records = JSON.parse(data);

      res.render('main', {
        records: records,
        errors: req.flash('error'),
        messages: req.flash('notify')
      });
    } else
      res.status(404).render('somethingWrong', { textError: 'Не найдена папка изображений' });
  });
};