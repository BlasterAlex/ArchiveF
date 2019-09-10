var isNumeric = require('isnumeric');

// Cортировка записей по ключу
// param = {
//   prop: <key>,
//   asc: <true/false>
// }

module.exports = function (records, param) {
  records = records.sort(function (a, b) {
    return isNumeric(a[param.prop]) && isNumeric(b[param.prop]) ? a[param.prop] - b[param.prop] : a[param.prop].toString().localeCompare(b[param.prop]);
  });
  if (!param.asc) { records = records.reverse(); }
  return records;
};

