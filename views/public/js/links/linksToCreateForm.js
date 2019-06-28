var classArr = [], hiddenClasses = [];
var numOfLinks = $('#numOfLinks').text();

for (var i = 1; i <= numOfLinks; i++) {
  classArr.push(".url" + i);
  hiddenClasses.push("form-control url" + i);
}

$(document).ready(function () {
  $('#form-add-links-button').click(function () { /* добавление новой ссылки на форму */
    if (hiddenClasses.length != 0) {
      var lastClass = hiddenClasses[hiddenClasses.length - 1];
      lastClass = '.' + lastClass.substr(lastClass.indexOf(' ') + 1, lastClass.length);

      $(lastClass).parents('.input-group').slideDown(300);
      hiddenClasses.pop();

      if (hiddenClasses.length === 0 && $('#form-add-links-button').is(':visible'))
        $(this).fadeOut(400);
    }
  });

  $('.input-group-button').click(function () { /* кнопка удаления ссылки */
    $(this).parents('.input-group').children('.form-control').val("");

    hiddenClasses.push($(this).parents('.input-group').children('.form-control').first().attr('class'));
    $(this).parents('.input-group').slideUp(300, function () {

      if (hiddenClasses.length != 0 && $('#form-add-links-button').is(':hidden'))
        $('#form-add-links-button').fadeIn(100);
    });
  });

  $('#uploadForm').submit(function () { /* сохранение изменений */
    $('.input-group').hide();

    $(document.getElementsByName('linkName')).each(function (index, item) {
      if (!$(item).val())
        $(item).val("null");
    });
    $(document.getElementsByName('url')).each(function (index, item) {
      if (!$(item).val())
        $(item).val("null");
    });
  });
});

// Валидация
classArr.forEach(element => {
  bootstrapValidate(element, 'url:Неправильная ссылка!');
});