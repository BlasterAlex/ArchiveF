var numOfLinks = $('#numOfLinks').text(); // максимальное количество ссылок

// Вадидация для всех полей ссылок
function addValidate() {
  $('.url-input').each(function (i, el) {
    bootstrapValidate(el, 'url:Неправильная ссылка!');
  });
}

// Проверка всех полей на валидность
function checkValidate() {
  let check = true;
  $('.url-input').each(function (i, el) {
    if ($(el).hasClass('is-invalid')) check = false;
  });
  return check;
}

// Проверить крайние значения списка ссылок
function checkExLinks() {
  $('.link-block').each(function (i, el) {

    // Стрелки перемещения на блоке добавления ссылки
    let arrowUp = $(el).find('.fa-chevron-up'),
      arrowDown = $(el).find('.fa-chevron-down');

    // Сделать все индикаторы активными
    arrowUp.removeClass('indicator-inactive');
    arrowDown.removeClass('indicator-inactive');

    // Установить неактивные индикаторы, если нужно
    if (i == 0) arrowUp.addClass('indicator-inactive');
    if (i == $('.link-block').length - 1) arrowDown.addClass('indicator-inactive');
  });
}

// Обмен двух элементов
$.fn.swap = function (elem) {
  elem = elem.jquery ? elem : $(elem);
  return this.each(function () {
    $(document.createTextNode('')).insertBefore(this).before(elem.before(this)).remove();
  });
};

$(document).ready(function () {
  $('#form-add-links-button').click(function () { /* добавление новой ссылки на форму */
    if ($('.link-block').length != numOfLinks) {
      $('#numOfLinks')
        .before('<div class="input-group input-group-rounded link-block" style="display: none">' +
          '  <input type="url" class="form-control url-input" name="url" placeholder="Enter your link">' +
          '  <input type="text" class="form-control url-name-input" name="linkName"' +
          '    placeholder="Name of link (or empty)">' +
          '  <div class="input-group-button move-link">' +
          '    <i class="fa fa-chevron-up"></i>' +
          '    <i class="fa fa-chevron-down"></i>' +
          '  </div>' +
          '  <div class="input-group-button remove-link">' +
          '    <div class="input-group-text"><img src="/img/red-cross.png" /></div>' +
          '  </div>' +
          '</div>');
      $('.link-block:last').slideDown(300);
      checkExLinks();
      addValidate();

      if ($('.link-block').length == numOfLinks && $('#form-add-links-button').is(':visible'))
        $(this).fadeOut(300);
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

$(document).on('click', '.fa-chevron-up', function () { /* кнопка Вверх на поле ссылки */
  if (!$(this).hasClass('indicator-inactive')) {
    let curItem = $(this).closest('.link-block');
    curItem.swap($('.link-block')[curItem.index('.link-block') - 1]);
    checkExLinks();
  }
});

$(document).on('click', '.fa-chevron-down', function () { /* кнопка Вниз на поле ссылки */
  if (!$(this).hasClass('indicator-inactive')) {
    let curItem = $(this).closest('.link-block');
    curItem.swap($('.link-block')[curItem.index('.link-block') + 1]);
    checkExLinks();
  }
});

$(document).on('click', '.remove-link', function () { /* крестик на поле ссылки */
  // Очистить поля
  $(this).parents('.input-group').children('.form-control').val("");

  // Скрыть элемент
  $(this).parents('.input-group').slideUp(300, function () {

    // Удалить текущий элемент
    $(this).remove();

    // Обновить индикаторы
    checkExLinks();

    if ($('.link-block').length != numOfLinks && $('#form-add-links-button').is(':hidden'))
      $('#form-add-links-button').fadeIn(100);
  });
});