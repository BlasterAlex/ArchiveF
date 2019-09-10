const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  var errDir = false;
  fs.readFile(config.srcDir + config.rootDir + config.json, (err) => {
    if (err) {
      res.status(404).render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
      errDir = true;
    }
  });

  if (!errDir) {
    fs.readFile(config.srcDir + config.rootDir + config.imageDir, (err) => {
      if (err.syscall != 'read') {
        fs.mkdirSync(config.srcDir + config.rootDir + config.imageDir);
        res.redirect('/');
      }
      else res.status(404).render('somethingWrong', { textError: 'Папка уже была создана!' });
    });
  }
};
