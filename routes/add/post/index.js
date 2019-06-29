const fs = require('fs');
var uniqid = require('uniqid');
var config = require('./../../../libs/config');
var dateFormat = require('./../../../utils/dateFormatting');

module.exports = function (req, res) {

  // Проверка на наличие папки
  var errImgFile = false;
  fs.readFile(config.imagePath, (err, data) => {
    if (err.syscall != "read") {
      errImgFile = true;
    }
  });
  if (errImgFile) return res.render('somethingWrong', { textError: "Не найдена папка изображений" });

  // Добавление новой записи
  fs.readFile(config.jsonPath + config.jsonName, (err, data) => {
    if (err) res.render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
    else {
      var records = JSON.parse(data);
      var id = uniqid(), extension, imageName;

      if (req.files == null) {
        req.flash('error', 'Вы не загрузили фото!');
        res.redirect('/add');
      } else {
        if (Object.keys(req.files).length == 0) {
          return res.status(400).send('Ни один файл не был загружен!');
        }

        // Создание нового элемента
        var newItem = {
          id: id,
          name: req.body.name,
          links: req.body.url,
          img: "",
          addImages: [],
          created: ""
        };

        // Массив названий ссылок
        var link_names = req.body.linkName;

        // Если ссылка является простой строкой
        if (config.numOfLinks == 0 || config.numOfLinks == 1) {
          newItem.links = [newItem.links];
          link_names = [link_names];
        }

        // Сборка массива ссылок
        var i = 0;
        while (i < newItem.links.length) {
          if (newItem.links[i] === 'null') {
            newItem.links.splice(i, 1);
            link_names.splice(i, 1);
          } else { // добавление названия для непустой ссылки
            newItem.links[i] = {
              name: "",
              url: newItem.links[i]
            };
            if (link_names[i] != 'null')
              newItem.links[i].name = link_names[i];
            ++i;
          }
        }

        // Проверка на дублирование
        var check;
        if (records.length != 0) check = records.find(x => x.name === newItem.name);
        else check = undefined;

        if (check != undefined) {
          req.flash('error', 'Запись "' + newItem.name + '" уже есть');
          res.redirect('/add');
        } else { // если это новая запись

          // Загрузка картинок
          let sampleFile; var length = req.files.Images.length;
          if (length == undefined) { // если всего одна картинка
            sampleFile = req.files.Images;
            extension = sampleFile.name.split(/\.(?=[^\.]+$)/)[1];
            imageName = id + "." + extension;
            newItem.img = imageName;

            sampleFile.mv(config.imagePath + imageName, function (err) {
              if (err)
                return res.status(500).send(err);
            })
          } else if (length > 4) {
            req.flash('error', 'Вы не можете загрузить более 4-х картинок!');
            return res.redirect('/add');
          } else {
            var imgs = req.files.Images;

            sampleFile = imgs[0];
            extension = sampleFile.name.split(/\.(?=[^\.]+$)/)[1];
            imageName = id + "." + extension;
            newItem.img = imageName;

            sampleFile.mv(config.imagePath + imageName, function (err) {
              if (err)
                return res.status(500).send(err);
            });

            for (var i = 1; i < imgs.length; i++) {
              let sampleFile = imgs[i];
              extension = sampleFile.name.split(/\.(?=[^\.]+$)/)[1];
              imageName = id + i + "." + extension;

              sampleFile.mv(config.imagePath + imageName, function (err) {
                if (err)
                  return res.status(500).send(err);
              })
              newItem.addImages.push(imageName);
            }
          }
          // Добавление даты
          newItem.created = dateFormat.dateToString(new Date);
          newItem.createdInt = dateFormat.stringToDate(newItem.created).getTime();
          records.push(newItem);

          // Сортировка
          function sortResults(prop, asc) {
            records = records.sort(function (a, b) {
              if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
              } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
              }
            });
          }
          sortResults('name', true);

          // Перезапись файла
          let json = JSON.stringify(records, null, 2);
          fs.writeFile(config.jsonPath + config.jsonName, json, (err) => {
            if (err) res.send("Не удалось записать в JSON файл!");
            req.flash('notify', 'Запись "' + newItem.name + '" успешно добавлена');
            res.redirect('/');
          });
        }
      }
    }
  })
}