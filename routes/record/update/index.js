const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));
var dateFormat = require('../../../utils/dateFormatting');

// Поиск по массиву
var getIndex = function (arr, id) {
  for (var i = 0; i < arr.length; i++)
    if (arr[i].id === id)
      return i;

  console.log('Не нашел! ');
  return -1;
};

module.exports = function (req, res) {

  fs.readFile(config.srcDir + config.rootDir + config.json, (err, data) => {
    if (err) res.status(404).render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
    else {
      var records = JSON.parse(data);
      var index = getIndex(records, req.body.id);

      if (index === -1) {
        req.flash('error', 'Элемент не найден!');
        res.redirect('/record/' + req.body.id);
      } else {
        records[index].name = req.body.name;

        // Проверка на дублирование
        var check;
        if (records.length != 0) check = records.find(x => x.name === records[index].name);
        else check = undefined;

        if (check != undefined && check != records[index]) {
          req.flash('error', 'Запись "' + records[index].name + '" уже есть');
          res.redirect('/record/' + req.body.id);
        } else {

          // Массивы ссылок
          var links = req.body.url;
          var link_names = req.body.linkName;

          // Нет ссылок
          if (!links) {
            records[index].links = new Array;
          } else {

            // Если ссылка является простой строкой
            if (!Array.isArray(links)) {
              links = [links];
              link_names = [link_names];
            }

            // Сборка массива ссылок
            var i = 0;
            while (i < links.length) {
              if (links[i] === 'null') {
                links.splice(i, 1);
                link_names.splice(i, 1);
              } else { // добавление названия для непустой ссылки
                links[i] = {
                  name: '',
                  url: links[i]
                };
                if (link_names[i] != 'null')
                  links[i].name = link_names[i];
                ++i;
              }
            }

            // Если максимальное количество ссылок меньше текущего размера массива
            if (config.numOfLinks < records[index].links.length) {
              records[index].links = links.concat(records[index].links.splice(config.numOfLinks));
            } else {
              records[index].links = links;
            }
          }

          // Дата изменения
          records[index].changed = dateFormat.dateToString(new Date);
          records[index].changedInt = dateFormat.stringToDate(records[index].created).getTime();

          // Сортировка
          records = require('../../../utils/sortRecords')(records, { 'prop': 'name', 'asc': true });

          // Перезапись файла
          let json = JSON.stringify(records, null, 2);
          fs.writeFile(config.srcDir + config.rootDir + config.json, json, (err) => {
            if (err) res.send('Не удалось записать в JSON файл!');
            req.flash('notify', 'Запись "' + req.body.name + '" успешно обновлена');
            res.redirect(303, '/record/' + req.body.id);
          });
        }
      }
    }
  });
};