const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  fs.readFile(config.srcDir + config.rootDir + config.json, (err) => {
    if (err) {
      fs.mkdir(config.srcDir + config.rootDir, (err) => { // создание папки
        if (err)
          return res.status(404).render('somethingWrong', { textError: 'Не удалось создать папку!' });

        fs.mkdirSync(config.srcDir + config.rootDir + config.imageDir); // создание папки для фото

        var records = []; // создание пустого JSON файла
        let json = JSON.stringify(records, null, 2);

        fs.writeFile(config.srcDir + config.rootDir + config.json, json, (err) => {
          if (err) res.send('Не удалось записать в JSON файл!');
          res.redirect(303, '/');
        });

      });
    }
    else res.status(404).render('somethingWrong', { textError: 'Папка уже была создана!' });
  });
};