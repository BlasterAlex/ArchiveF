const fs = require('fs');
var config = require('./../../../libs/config');

module.exports = function (req, res) {
  fs.readFile(config.imagePath, (err, data) => {
    if (err.syscall != "read") {
      res.render('somethingWrong', { textError: "Не найдена папка изображений" });
    } else res.render("form", { messages: req.flash('error') });
  });
}