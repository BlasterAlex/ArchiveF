const fs = require('fs');

module.exports = function (req, res) {
  const config = JSON.parse(fs.readFileSync('config/config.json').toString());
  fs.readFile(config.srcDir + config.rootDir + config.imageDir, (err) => {
    if (err.syscall != 'read') {
      res.status(404).render('somethingWrong', { textError: 'Не найдена папка изображений' });
    } else res.render('form', { messages: req.flash('error') });
  });
};