const fs = require('fs');

module.exports = function (req, res) {
  const config = JSON.parse(fs.readFileSync('config/config.json').toString());

  fs.readFile(config.srcDir + config.rootDir + config.json, (err, data) => {
    if (err) res.status(404).render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
    else {
      var records = JSON.parse(data);
      var check = records.find(x => x.id === req.params.recordId);

      if (check != undefined) {
        res.render('recordPage', { record: check, errors: req.flash('error'), messages: req.flash('notify') });
      } else {
        res.status(404).render('somethingWrong', { textError: 'Такого элемента нет!' });
      }
    }
  });
};