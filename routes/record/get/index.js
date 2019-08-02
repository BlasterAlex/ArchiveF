const fs = require('fs');
var config = require('../../../libs/config');

module.exports = function (req, res) {
  fs.readFile(config.jsonPath + config.jsonName, (err, data) => {
    if (err) res.render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
    else {
      var records = JSON.parse(data);
      var check = records.find(x => x.id === req.params.recordId);

      if (check != undefined) {
        res.render('recordPage', { record: check, errors: req.flash('error'), messages: req.flash('notify') });
      } else {
        res.render('somethingWrong', { textError: "Такого элемента нет!" });
      }
    }
  });
}