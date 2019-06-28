const fs = require('fs');
var config = require('../../../libs/config');

module.exports = function (req, res) {
  fs.readFile(config.jsonPath + config.jsonName, (err, data) => {
    if (err) res.render('somethingWrong', { textError: require('../../../utils/errorOutput')() });
    else {
      var records = JSON.parse(data);
      res.render('delete', { records: records, errors: req.flash('error') });
    }
  })
}