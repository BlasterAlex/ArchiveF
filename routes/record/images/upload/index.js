const fs = require('fs');
var config = require('../../../../libs/config');

// Поиск по массиву
var getIndex = function (arr, id) {
  for (var i = 0; i < arr.length; i++)
    if (arr[i].id === id)
      return i;

  console.log("Не нашел!");
  return -1;
};

// Для избежания дублирования имен
var getName = function (record, extension) {
  var check = false;
  var counter = 1;
  var name = record.id;
  while (!check) {
    if (record.img != name + '.' + extension) {
      if (record.addImages.length != 0) {
        record.addImages.forEach(element => {
          if (element != name + '.' + extension && record.img != name + '.' + extension) check = true;
          else {
            check = false;
            if (name != record.id) name = name.substring(0, name.length - 1);
            name += counter++;
          }
        });
      } else check = true;
    } else {
      if (name != record.id) name = name.substring(0, name.length - 1);
      name += counter++;
    }
  }
  return name + '.' + extension;
}

module.exports = function (req, res) {
  fs.readFile(config.jsonPath + config.jsonName, (err, data) => {
    if (err) {
      res.status(404)
        .render('somethingWrong', { textError: require('../../../../utils/errorOutput')() }, function () {
          res.send('file not found');
        });
    } else {
      var records = JSON.parse(data);
      var index = getIndex(records, req.body.id);
      var newImages = new Array;

      if (index === -1) {
        res.status(404).send('record not found');
      } else {
        var length = req.files.array.length;
        var oldLength = records[index].addImages.length;

        if (length == undefined) { // если всего одна новая картинка
          if (oldLength + 2 > 4) {
            return res.status(400).send('too many images');
          } else {
            sampleFile = req.files.array;
            extension = sampleFile.name.split(/\.(?=[^\.]+$)/)[1];
            imageName = getName(records[index], extension);
            records[index].addImages.push(imageName);
            newImages.push(imageName);

            sampleFile.mv(config.imagePath + imageName, function (err) {
              if (err)
                return res.status(500).send(err);
            })
          }
        } else { // если несколько
          if (oldLength + length + 1 > 4) {
            return res.status(400).send('too many images');
          }
          else {
            for (var i = 0; i < length; i++) {
              let sampleFile = req.files.array[i];
              extension = sampleFile.name.split(/\.(?=[^\.]+$)/)[1];
              imageName = getName(records[index], extension);
              records[index].addImages.push(imageName);
              newImages.push(imageName);

              sampleFile.mv(config.imagePath + imageName, function (err) {
                if (err)
                  return res.status(500).send(err);
              })
            }
          }
        }

        // перезапись файла
        let json = JSON.stringify(records, null, 2);
        fs.writeFile(config.jsonPath + config.jsonName, json, (err) => {
          if (err) {
            res.status(404)
              .render('somethingWrong', { textError: require('../../../../utils/errorOutput')() }, function () {
                res.send('file not found');
              });
          } else
            res.status(200).send({
              name: records[index].name,
              newImages: newImages,
              isFilled: records[index].addImages.length === 3
            });
        });
      }
    }
  });
}