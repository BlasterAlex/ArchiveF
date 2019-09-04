const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {
  fs.readFile(config.srcDir + config.rootDir + config.imageDir, (err) => {
    if (err.syscall != 'read') {
      res.render('somethingWrong', { textError: 'Не найдена папка изображений' });
    } else res.render('form', { messages: req.flash('error') });
  });
};