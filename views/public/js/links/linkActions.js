var classArr = [], hiddenClasses = [];
var numOfLinks = $('#numOfLinks').text();

for (var i = 1; i <= numOfLinks; i++)
  classArr.push(".url" + i);

$(document).ready(function () {
  var linksCol = $('#linksCol').text();
  for (var i = linksCol; i < numOfLinks; i++) {
    hiddenClasses.push('form-control ' + classArr[i].substr(1, classArr[i].length - 1));
  }

  $('#show-update-form').click(function () { /* кнопка Редактировать */

    $('#update-name-field').attr('hidden', false);
    $('.input-group').attr('hidden', false);
    if (hiddenClasses.length != 0) $('#form-add-links-button').attr('hidden', false);
    $('#save-update-button').attr('hidden', false);

    hiddenClasses.forEach(element => {
      var lastClass = element;
      lastClass = '.' + lastClass.substr(lastClass.indexOf(' ') + 1, lastClass.length);
      $(lastClass).parents('.input-group').attr('hidden', true);
    });

    $(this).attr('hidden', true);
  });

  $('#form-add-links-button').click(function () { /* кнопка Добавить ссылку */
    if (hiddenClasses.length != 0) {
      var lastClass = hiddenClasses[hiddenClasses.length - 1];
      lastClass = '.' + lastClass.substr(lastClass.indexOf(' ') + 1, lastClass.length);

      $(lastClass).parents('.input-group').attr('hidden', false);
      $(lastClass).parents('.input-group').hide();
      $(lastClass).parents('.input-group').slideDown(300);

      hiddenClasses.pop();

      if (hiddenClasses.length === 0 && $('#form-add-links-button').is(':visible'))
        $(this).fadeOut(400);
    }
  });

  $('.input-group-button').click(function () { /* крестик на поле ссылки */
    $(this).parents('.input-group').children('.form-control').val("");

    hiddenClasses.push($(this).parents('.input-group').children('.form-control').first().attr('class'));
    $(this).parents('.input-group').slideUp(300, function () {

      if (hiddenClasses.length != 0 && $('#form-add-links-button').is(':hidden'))
        $('#form-add-links-button').fadeIn(100);
    });
  });

  $('#update-form').submit(function (e) { /* сохранение изменений */
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