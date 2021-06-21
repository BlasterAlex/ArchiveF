const { Random, MersenneTwister19937 } = require('random-js');
const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  fs.readFile(config.srcDir + config.rootDir + config.json, (err, data) => {
    if (err) res.status(404).render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
    else {
      var records = JSON.parse(data);
      if (Object.keys(records).length === 0) {
        res.status(404).render('recordPage', { record: records, errors: req.flash('error'), messages: req.flash('notify') });
      }
      else { // Случайное число
        const random = new Random(MersenneTwister19937.autoSeed()); // на основе времени и других случайных значений
        var count = Object.keys(records).length;
        var index = random.integer(0, count - 1);
        const record = records[index];
        res.redirect('/record/' + record.id);
      }
    }
  });
};