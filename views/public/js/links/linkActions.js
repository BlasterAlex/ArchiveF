var numOfLinks = $('#numOfLinks').text(); // максимальное количество ссылок

// Cостояние полей блока контента
class Content {
  constructor() {
    this.title = $('#update-name').val();

    let bLinks = new Array;
    $('.link-block').each(function (i, el) {
      bLinks.push({
        name: $(el).find('.url-name-input').val(),
        url: $(el).find('.url-input').val()
      });
    });
    this.links = bLinks;
  }

  isChanged() { // получение текущего состояния контента
    if (this.title == $('#update-name').val()) {

      // Удаление пустых ссылок
      $('.link-block').each(function (i, el) {
        let input = $(el).find('.url-input');
        if (!input.val())
          delLinkInput(input);
      });

      // Сравнение текущего массива ссылок с начальным
      if (this.links.length === $('.link-block').length) {
        let bLinks = this.links;
        let check = false;

        $('.link-block').each(function (i, el) {
          if ($(el).find('.url-name-input').val() != bLinks[i].name)
            check = true;
          else
            if ($(el).find('.url-input').val() != bLinks[i].url)
              check = true;
        });

        return check;
      } else
        return true;

    } else
      return true;
  }

  cancel() { // восстановление начального состояния контента
    // Восстановление значений инпутов
    $('#update-name').val(this.title);
    let bLinks = this.links;
    $('.link-block').each(function (i, el) {
      if (i < bLinks.length) {
        $(el).find('.url-name-input').val(bLinks[i].name);
        $(el).find('.url-input').val(bLinks[i].url);
      } else {
        $(el).hide();
        $(el).remove();
      }
    });

    // Скрыть форму
    $('#update-name-field').hide();
    $('.input-group').hide();

    if ($('#form-add-links-button').css('display') !== 'none')
      $('#form-add-links-button').hide();

    if ($('#cancel-changes').css('display') !== 'none')
      $('#cancel-changes').hide();

    if ($('#save-update-button').css('display') !== 'none')
      $('#save-update-button').hide();

    // Показать кнопку редактирования
    $('#show-update-form').fadeIn(300);
  }
};
var content;

// Вадидация для всех полей ссылок
function addValidate() {
  $('.url-input').each(function (i, el) {
    bootstrapValidate(el, 'url:Неправильная ссылка!');
  });
}

// Сброс значений валидатора
function resetValidatorVal() {
  $('.url-input').each(function (i, el) {
    $(el).removeClass('is-invalid');
    $(el).closest('.link-block').find('.invalid-feedback').remove();
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

// Добавление новой ссылки
function addLinkInput() {
  $('.record-links ul')
    .append('<div class="input-group input-group-rounded link-block">' +
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
  checkExLinks();
  addValidate();
}

// Удаление блока ссылки 
function delLinkInput(elem) {
  // Очистить поля
  $(elem).parents('.input-group').children('.form-control').val("");

  // Скрыть элемент
  $(elem).parents('.input-group').slideUp(300, function () {

    // Удалить текущий элемент
    $(elem).remove();

    // Обновить индикаторы
    checkExLinks();

    if ($('.link-block').length != numOfLinks && $('#form-add-links-button').is(':hidden'))
      $('#form-add-links-button').fadeIn(100);
  });
}

$(document).ready(function () {

  // Валидация
  addValidate();

  $('#show-update-form').click(function () { /* кнопка Редактировать */

    // Отображение формы ввода
    $('#update-name-field').fadeIn(300);
    $('.input-group').fadeIn(300);
    if ($('.link-block').length != numOfLinks)
      $('#form-add-links-button').fadeIn(300);

    $('#cancel-changes').fadeIn(300);
    $('#save-update-button').fadeIn(300);

    // Сохранение начального состояния контента
    content = new Content;

    // Расстановка неактивных индикаторов
    checkExLinks();

    // Скрыть текущую кнопку
    $(this).hide();
  });

  $('#form-add-links-button').click(function () { /* кнопка Добавить ссылку */
    if ($('.link-block').length != numOfLinks) {

      addLinkInput();
      if ($('.link-block').length == numOfLinks && $('#form-add-links-button').is(':visible'))
        $(this).fadeOut(300);
    }
  });

  $('#cancel-changes').click(function () { /* кнопка Отменить изменения */
    content.cancel();
    resetValidatorVal();
  });

  $('#save-update-button').click(function () { /* сохранение изменений */

    if (checkValidate()) { // проверка всех полей на валидность
      if (content.isChanged()) { // проверка полей на наличие изменений
        $('.input-group').hide();
        $(document.getElementsByName('linkName')).each(function (index, item) {
          if (!$(item).val())
            $(item).val("null");
        });
        $(document.getElementsByName('url')).each(function (index, item) {
          if (!$(item).val())
            $(item).val("null");
        });
      } else { // нет изменений - просто скрыть форму
        content.cancel();
        resetValidatorVal();
        return;
      }
    } else
      return;

    // Отправка формы
    $('#update-form').submit();
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
  delLinkInput(this);
});