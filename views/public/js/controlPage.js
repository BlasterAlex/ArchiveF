// Свойства объектов по умолчанию
var card = {
  'image-height': 265,
  'image-raise': 20,
  'text-height': 50
};
// Высота аватарки каждой карты
var cardsHeight = new Array;

// Добавление новой аватарки базы
function changeAvatar(where, image) {
  where.fadeOut(150, function () {
    $(this).attr('src', '/' + image + '?nocache=' + Math.random());
    $(this).fadeIn(150);
  });
}

// Динамическое изменение высоты карты
function cardResize(el, elClass) {
  el.css('height', cardsHeight[el.index(elClass)]);
  el.find('.control-card-base-avatar').css('height', cardsHeight[el.index(elClass)]);
}

// (Де-)Активирование кнопки:
// btn = {
//   obj: <jquery el>,
//   isActive: <current active state>,
//   newText: <new btn text>
// }
function changeBtnState(btn) {
  btn.obj.fadeOut(200, function () {
    $(this).prop("disabled", !btn.isActive);
    $(this).text(btn.newText);

    if (!btn.isActive) $(this).prepend('<i class="fa fa-check"></i>');
    $(this).fadeIn(200);
  });
}

// Главная функция
$(document).ready(function () {

  // Проход по картам при загрузке страницы
  $('.control-card-img').each(function () {
    // Расстановка иконок на аватарки
    let icon = $(this).find('.control-card-icon');
    let text = $(this).find('p');

    let avatarSrc = $(this).find('.control-card-base-avatar').attr("src");
    if (avatarSrc === "false" || avatarSrc === "img/default.jpg") {
      icon.attr('src', "img/base-download.png");
      text.text('Загрузить аватарку');
    }

    // Задание максимальной высоты
    cardsHeight[$(this).index('.control-card-img')] = card['image-height'];
    cardResize($(this), '.control-card-img');

    // Высота блока описания
    $(this).closest('.control-card').find('.card-description').css('height', card['text-height']);
  });

  // Проверка высоты текста описания
  $('.card-description').each(function () {
    var element = $(this);
    var saved = element.css(['overflow', 'max-height']);

    element.css({
      'max-height': 0,
      'overflow': 'scroll'
    });

    var actualHeight = element.prop('scrollHeight');

    element.css('overflow', saved['overflow']);
    element.css('max-height', saved['max-height']);

    if (element.height() < actualHeight) {
      element.after('<span class="card-description-readmore">(Читать далее)</span>')
    }
  });
});

// ---------------Аватарка базы---------------

// Событие наведения на аватарку
$(document).on({
  mouseenter: function () {
    let el = $(this).find('.control-card-base-avatar');
    el.css('height', cardsHeight[$(this).index('.control-card-img')] + card['image-raise']);
  },
  mouseleave: function () {
    let el = $(this).find('.control-card-base-avatar');
    el.css('height', cardsHeight[$(this).index('.control-card-img')]);
  }
}, '.control-card-img');

// Выбор новой аватарки
$(document).on('click', '.control-card-img', function () {
  $(this).find('.control-card-icon-input').click();
});

// Предотвращение уведомлений родительских обработчиков для формы
$(document).on('click', '.control-card-icon-input', function (e) {
  e.stopPropagation();
});

// Загрузка новой аватарки
$(document).on('change', '.control-card-img', function () {

  // Форма для отправки
  var formData = new FormData();

  // Название базы
  formData.append('baseName', $(this).closest('.row').find('.card-title').text());

  // Получение аватарки с формы
  var form = $(this).find('.control-card-icon-input');
  var file = form[0].files[0];
  formData.append('avatar', file);

  // Отправка запроса на бэк
  $.ajax({ // отправка запроса на бэк
    url: '/control/base/update/avatar',
    method: 'POST',
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    dataType: 'json'
  }).done(function (res) { // успех
    $('article').prepend('<div class="alert alert-success"><div>База ' + res.baseName + ' успешно обновлена</div></div>');

    let card = $(document.getElementsByName(res.baseName));

    // Обновление аватарки
    let avatarEl = card.find('.control-card-base-avatar');
    changeAvatar(avatarEl, res.avatar);

    // Обновление иконки аватарки
    let controlCard = avatarEl.closest('.control-card-img');
    controlCard.find('.control-card-icon').attr('src', "img/base-refresh.png");
    controlCard.find('p').text('Изменить аватарку');

    // Обновление даты изменения базы
    card.find('.card-last-updated').text('Последнее обновление ' + res.lastUpdated);

    clearFlash();
  }).fail(function (res) { // ошибка
    switch (res.status) {
      case 404: // не найдено
        if (res.responseText === 'base not found') {
          $('article').prepend('<div class="alert alert-danger"><div>База не найдена!</div></div>');
          clearFlash();
        }
        break;
      case 505: // ошибка сервера
        $('article').prepend('<div class="alert alert-danger"><div>' + res.responseText + '</div></div>');
        clearFlash();
        break;
    }
  });

  form.val(''); // очистка формы
});

// ---------------Контент базы---------------

// Полный текст описания
$(document).on('click', '.card-description-readmore', function () {
  if ($(this).text() === '(Читать далее)') {
    $(this).text('(Скрыть)');

    // Измерение высоты после показа полного текста описания
    let description = $(this).parent().find('.card-description');
    let curHeight = description.height(),
      autoHeight = description.css('height', 'auto').height();

    // Изменение высоты аватарки, если это горизонтальная карта
    if (window.matchMedia('(min-width: 768px)').matches) {
      let parent = $(this).closest('.control-card');
      let img = parent.find('.control-card-img');
      cardsHeight[img.index('.control-card-img')] = parent.height();
      cardResize(img, '.control-card-img');
    }

    // Анимация показа полного текста описания
    description.height(curHeight).animate({ 'height': autoHeight }, 200);

  } else {
    $(this).text('(Читать далее)');

    // Измерение высоты после скрытия полного текста описания
    let description = $(this).parent().find('.card-description');
    let curHeight = description.height(),
      newHeight = description.css('height', card['text-height']).height();

    // Изменение высоты аватарки
    let parent = $(this).closest('.control-card');
    let img = parent.find('.control-card-img');
    img.height(0);
    cardsHeight[img.index('.control-card-img')] = parent.height();
    cardResize(img, '.control-card-img');

    // Анимация скрытия полного текста описания
    description.height(curHeight).animate({ 'height': newHeight }, 200);
  }
});

// Активирование базы
$(document).on('click', '.card-button-activate', function () {

  // Сбор данных для отправки
  let data = {
    baseName: $(this).closest('.row').find('.card-title').text()
  };

  // Отправка запроса на бэк
  $.ajax({ // отправка запроса на бэк
    url: '/control/base/update/status',
    method: 'POST',
    data: data
  }).done(function (res) { // успех
    $('article').prepend('<div class="alert alert-success"><div>База ' + res.baseName + ' успешно активирована.<br>Перезагрузите приложение для применения изменений</div></div>');

    // Снятие акивации со всех баз
    $('.control-card').each(function () {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');

        changeBtnState({
          obj: $(this).find('.card-button-activate'),
          isActive: true,
          newText: 'Активировать'
        });
      }
    });

    // Активация выбранной базы
    let card = $(document.getElementsByName(res.baseName));
    card.closest('.control-card').addClass('active');

    changeBtnState({
      obj: card.find('.card-button-activate'),
      isActive: false,
      newText: 'Активна'
    });
  }).fail(function (res) { // ошибка
    switch (res.status) {
      case 404: // не найдено
        if (res.responseText === 'base not found') {
          $('article').prepend('<div class="alert alert-danger"><div>База не найдена!</div></div>');
          clearFlash();
        }
        break;
      case 505: // ошибка сервера
        $('article').prepend('<div class="alert alert-danger"><div>' + res.responseText + '</div></div>');
        clearFlash();
        break;
    }
  });
});
