const fs = require('fs');
const random = require('random');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  fs.readFile(config.srcDir + config.rootDir + config.json, (err, data) => {
    if (err) res.render('somethingWrong', { textError: require('../../utils/errorOutput')() });
    else {
      var records = JSON.parse(data);
      if (Object.keys(records).length === 0) {
        res.render('recordPage', { record: records, errors: req.flash('error'), messages: req.flash('notify') });
      }
      else { // Случайное число
        var count = Object.keys(records).length;
        var index = random.int(min = 0, max = count - 1);
        res.render('recordPage', { record: records[index], errors: req.flash('error'), messages: req.flash('notify') });
      }
    }
  });
}