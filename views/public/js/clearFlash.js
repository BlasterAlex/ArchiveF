// Удаление сообщений
function clearFlash() {
  let messages = $('.alert').toArray(); // запомнить текущее состояние уведомлений
  setTimeout(function () {
    messages.forEach(element => { // удалить все сохраненные уведомления
      $(element).slideUp(350, function () {
        $(this).remove();
      });
    });
  }, 5000)
};
clearFlash();