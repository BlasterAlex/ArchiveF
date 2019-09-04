const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config/config.json'));

module.exports = function (req, res) {

  fs.readFile(config.srcDir + config.rootDir + config.json, (err, data) => {
    if (err) res.render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
    else {
      var records = JSON.parse(data);
      res.render('delete', { records: records, errors: req.flash('error') });
    }
  });
};