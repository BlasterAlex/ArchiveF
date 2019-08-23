const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));
var dateFormat = require('../../../../utils/dateFormatting');

// Поиск по массиву
var getIndex = function (arr, id) {
  for (var i = 0; i < arr.length; i++)
    if (arr[i].id === id)
      return i;

  console.log("Не нашел!");
  return -1;
};

module.exports = function (req, res) {

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

        // Новые названия картинок
        records[index].img = req.body.img;
        records[index].addImages = req.body.addImages;

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
              dateOfChange: records[index].changed
            });
        });
      }
    }
  });
}