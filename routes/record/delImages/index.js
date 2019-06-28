const fs = require('fs');
var config = require('../../../libs/config');

// Поиск по массиву
var getIndex = function (arr, id) {
  for (var i = 0; i < arr.length; i++)
    if (arr[i].id === id)
      return i;

  console.log("Не нашел!");
  return -1;
};

module.exports = function (req, res) {
  fs.readFile(config.jsonPath + config.jsonName, (err, data) => {
    if (err) res.render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
    else {
      var records = JSON.parse(data);
      var index = getIndex(records, req.body.id);

      if (index === -1) {
        req.flash('error', 'Элемент не найден!');
        res.redirect('/record/' + req.body.id);
      } else {
        var picName = req.body.picName;
        var id = records[index].addImages.indexOf(picName);

        if (id === -1) {
          if (records[index].img === picName) {
            try {
              fs.unlinkSync(config.imagePath + picName);
            } catch (err) {
              req.flash('error', 'Изображениe ' + picName + ' не найдено!');
            }
            records[index].img = records[index].addImages[0];
            records[index].addImages.splice(0, 1);
          } else {
            req.flash('error', 'Не найдено изображения с именем: ' + picName);
            res.redirect('/record/' + req.body.id);
            return;
          }
        } else {
          try {
            fs.unlinkSync(config.imagePath + picName);
          } catch (err) {
            req.flash('error', 'Изображениe ' + picName + ' не найдено!');
          }
          records[index].addImages.splice(id, 1);
        }

        // перезапись файла
        let json = JSON.stringify(records, null, 2);
        fs.writeFile(config.jsonPath + config.jsonName, json, (err) => {
          if (err) res.send("Не удалось записать в JSON файл!");
          req.flash('notify', 'Запись ' + records[index].name + ' успешно обновлена!');
          res.redirect('/record/' + req.body.id);
        });
      }
    }
  });
}