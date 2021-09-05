const fs = require('fs');
var dateFormat = require('../../../../utils/dateFormatting');

// Поиск по массиву
var getIndex = function (arr, id) {
  for (var i = 0; i < arr.length; i++)
    if (arr[i].id === id)
      return i;

  console.log('Не нашел!');
  return -1;
};

module.exports = function (req, res) {
  const config = JSON.parse(fs.readFileSync('config/config.json').toString());
  fs.readFile(config.srcDir + config.rootDir + config.json, (err, data) => {
    if (err) {
      res.status(404)
        .render('somethingWrong', { textError: require('../../../../utils/errorOutput')() }, function () {
          res.send('file not found');
        });
    } else {
      var records = JSON.parse(data);
      var index = getIndex(records, req.body.id);

      if (index === -1) { // запись не найдена
        res.status(404).send('record not found');
      } else {
        var picName = req.body.picName;
        var id = records[index].addImages.indexOf(picName);
        var warning;

        if (id === -1) { // это главная картинка
          if (records[index].img === picName) {
            if (records[index].addImages.length === 0) {
              return res.status(409).send('last picture');
            }

            try {
              fs.unlinkSync(config.srcDir + config.rootDir + config.imageDir + picName);
            } catch (err) {
              warning = 'image not found';
            }

            records[index].img = records[index].addImages[0];
            records[index].addImages.splice(0, 1);
          } else {
            return res.status(404).send('image not found');
          }
        } else { // это картинка из блока дополнительных
          try {
            fs.unlinkSync(config.srcDir + config.rootDir + config.imageDir + picName);
          } catch (err) {
            warning = 'image not found';
          }
          records[index].addImages.splice(id, 1);
        }

        // Дата изменения
        records[index].changed = dateFormat.dateToString(new Date);
        records[index].changedInt = dateFormat.stringToDate(records[index].created).getTime();

        // перезапись файла
        let json = JSON.stringify(records, null, 2);
        fs.writeFile(config.srcDir + config.rootDir + config.json, json, (err) => {
          if (err) {
            res.status(404)
              .render('somethingWrong', { textError: require('../../../../utils/errorOutput')() }, function () {
                res.send('file not found');
              });
          } else
            res.status(200).send({
              name: records[index].name,
              warning: warning,
              dateOfChange: records[index].changed
            });
        });
      }
    }
  });
};