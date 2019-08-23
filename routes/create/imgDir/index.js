const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  var errDir = false
  fs.readFile(config.srcDir + config.rootDir + config.json, (err, data) => {
    if (err) {
      res.render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
      errDir = true;
    }
  });

  if (!errDir) {
    fs.readFile(config.srcDir + config.rootDir + config.imageDir, (err, data) => {
      if (err.syscall != "read") {
        fs.mkdirSync(config.srcDir + config.rootDir + config.imageDir);
        res.redirect('/');
      }
      else res.render('somethingWrong', { textError: 'Папка уже была создана!' });
    });
  }
}
