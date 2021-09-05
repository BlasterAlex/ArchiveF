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

// Для избежания дублирования имен
const getUniqueName = (record, extension, index = 0) => {
  const fileNames = [record.img].concat(record.addImages);
  const fileName = index ? `${record.id}${index}.${extension}` : `${record.id}.${extension}`;

  const nameExists = fileNames.filter(f => f === fileName).length > 0;
  if (!nameExists)
    return fileName;

  return getUniqueName(record, extension, index + 1);
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
      var newImages = new Array;

      if (index === -1) {
        res.status(404).send('record not found');
      } else {
        var length = req.files.array.length;

        if (length == undefined) { // если всего одна новая картинка
          let sampleFile = req.files.array;
          let extension = sampleFile.name.split(/\.(?=[^\.]+$)/)[1];
          let imageName = getUniqueName(records[index], extension);
          records[index].addImages.push(imageName);
          newImages.push(imageName);

          sampleFile.mv(config.srcDir + config.rootDir + config.imageDir + imageName, function (err) {
            if (err)
              return res.status(500).send(err);
          });
        } else { // если несколько
          for (var i = 0; i < length; i++) {
            let sampleFile = req.files.array[i];
            let extension = sampleFile.name.split(/\.(?=[^\.]+$)/)[1];
            let imageName = getUniqueName(records[index], extension);
            records[index].addImages.push(imageName);
            newImages.push(imageName);

            sampleFile.mv(config.srcDir + config.rootDir + config.imageDir + imageName, function (err) {
              if (err)
                return res.status(500).send(err);
            });
          }
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
              newImages: newImages,
              isFilled: records[index].addImages.length === 3,
              dateOfChange: records[index].changed
            });
        });
      }
    }
  });
};