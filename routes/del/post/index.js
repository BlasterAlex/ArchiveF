const fs = require('fs');

module.exports = function (req, res) {
  const config = JSON.parse(fs.readFileSync('config/config.json').toString());

  fs.readFile(config.srcDir + config.rootDir + config.json, (err, data) => {
    if (err) res.send('Не удалось открыть JSON файл!');
    else {
      var records = JSON.parse(data);
      var name = records[req.body.sel].name;
      var largePic = records[req.body.sel].img;

      try {
        fs.unlinkSync(config.srcDir + config.rootDir + config.imageDir + largePic);
      } catch (err) {
        req.flash('error', 'Изображениe ' + largePic + ' не найдено!');
      }

      for (var i = 0; i < records[req.body.sel].addImages.length; i++) {
        try {
          fs.unlinkSync(config.srcDir + config.rootDir + config.imageDir + records[req.body.sel].addImages[i]);
        } catch (err) {
          req.flash('error', 'Изображениe ' + largePic + ' не найдено!');
        }
      }

      records.splice(req.body.sel, 1);
      // Перезапись файла
      let json = JSON.stringify(records, null, 2);
      fs.writeFile(config.srcDir + config.rootDir + config.json, json, (err) => {
        if (err) res.send('Не удалось записать в JSON файл!');
        req.flash('notify', 'Запись "' + name + '" успешно удалена');
        res.redirect(303, '/');
      });
    }
  });
};