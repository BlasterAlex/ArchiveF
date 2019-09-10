const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  fs.readFile(config.srcDir + config.rootDir + config.json, (err) => {
    if (err) {
      // Создать файл
      var records = [];
      let json = JSON.stringify(records, null, 2);
      fs.writeFile(config.srcDir + config.rootDir + config.json, json, (err) => {
        if (err) res.send('Не удалось записать в JSON файл!');
        res.redirect('/');
      });
    }
    else res.status(404).render('somethingWrong', { textError: 'Файл уже был создан!' });
  });
};