$(document).ready(function () {
  $('#header_havigation li a').each(function () { // выделение активной вкладки
    var location = window.location.href;
    var link = this.href;
    if (location == link) {
      $(this).addClass('active');
    }
  });

  $('#header_havigation li a').click(function () { // отмена перехода по текущей ссылке (кроме Random)
    if ($(this).hasClass('active') && $(this).text() !== 'Random')
      return false; // cancel the event
  });
});