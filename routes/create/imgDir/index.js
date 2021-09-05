const fs = require('fs');

module.exports = function (req, res) {
  const config = JSON.parse(fs.readFileSync('config/config.json').toString());

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
        res.redirect(303, '/');
      }
      else res.status(404).render('somethingWrong', { textError: 'Папка уже была создана!' });
    });
  }
};
