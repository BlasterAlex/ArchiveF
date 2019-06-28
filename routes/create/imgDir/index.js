const fs = require('fs');
var config = require('../../../libs/config');

module.exports = function (req, res) {

  var errDir = false
  fs.readFile(config.jsonPath + config.jsonName, (err, data) => {
    if (err) {
      res.render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
      errDir = true;
    }
  });

  if (!errDir) {
    fs.readFile(config.imagePath, (err, data) => {
      if (err.syscall != "read") {
        fs.mkdirSync(config.imagePath);
        res.redirect('/');
      }
      else res.render('somethingWrong', { textError: 'Папка уже была создана!' });
    });
  }
}
