// Числа фиксированной длины (2 символа)
function formatNum(num) {
  return ('0' + num).slice(-2);
}

// Получение строки
module.exports.dateToString = function dateToString(date) {
  return formatNum(date.getDate()) + '-' +
    formatNum(date.getMonth() + 1) + '-' +
    date.getFullYear() + ' ' +
    formatNum(date.getHours()) + ':' +
    formatNum(date.getMinutes());
};

// Получение объекта Date
module.exports.stringToDate = function (line) {
  let array = line.split(/-| |:/);
  let date = new Date;

  date.setDate(array[0]);
  date.setMonth(array[1] - 1);
  date.setFullYear(array[2]);
  date.setHours(array[3]);
  date.setMinutes(array[4]);

  return date;
};