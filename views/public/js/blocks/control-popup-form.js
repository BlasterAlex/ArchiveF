
// Создание форм для ввода пароля
function createPasswordForm(baseName) { // на создание архива
  $('article').append(
    '<div class="control-popup-background">' +
    '  <div class="card mb-3 control-popup-password archieve-create">' +
    '    <img src="img/close-cross.svg" class="close-popup-password">' +
    '    <h3>Введите пароль для архива</h3>' +
    '    <div class="form-group">' +
    '      <input type="password" class="form-control control-popup-password-input" placeholder="Пароль">' +
    '      <p class="show-password">show</p>' +
    '    </div>' +
    '    <div class="form-group">' +
    '      <input type="password" class="form-control control-popup-password-input" placeholder="Повторите пароль">' +
    '      <p class="show-password">show</p>' +
    '    </div>' +
    '    <div>' +
    '    <button class="btn btn-success submit-popup-without-password">Без пароля</button>' +
    '    <button class="btn btn-primary submit-popup-password" style="display: none">Отправить</button>' +
    '    </div>' +
    '    <input name="control-popup-baseName" value="' + baseName + '" hidden' +
    '  </div>' +
    '</div>')
    .find('.control-popup-background')
    .fadeIn(300);
};
function passwordEntryForm(baseName) { // на извлечение архива
  $('article').append(
    '<div class="control-popup-background">' +
    '  <div class="card mb-3 control-popup-password">' +
    '    <img src="img/close-cross.svg" class="close-popup-password">' +
    '    <h3>Введите пароль для архива</h3>' +
    '    <div class="form-group">' +
    '      <input type="password" class="form-control control-popup-password-input" placeholder="Пароль">' +
    '      <p class="show-password">show</p>' +
    '    </div>' +
    '    <div>' +
    '    <button class="btn btn-primary submit-popup-password">Отправить</button>' +
    '    </div>' +
    '    <input name="control-popup-baseName" value="' + baseName + '" hidden' +
    '  </div>' +
    '</div>')
    .find('.control-popup-background')
    .fadeIn(300);
};

// Создание новых блоков
function changeOnArchiveCard(old, data) { // блок архива
  // Скрытие старого блока
  old.fadeOut(250, function () {

    // Создание новой карты
    old.replaceWith('<div class="card mb-3 control-card" style="display: none; max-width: 595px" name="' + data.baseName + '" >' +
      '  <div class="row no-gutters">' +
      '    <div class="col-md-4 control-card-img">' +
      '      <img src="img/SHERLOCKED.jpg" class="control-card-base-avatar">' +
      '    </div>' +
      '    <div class="col-md-8">' +
      '      <div class="card-body">' +
      '        <h5 class="card-title">' + data.baseName + '</h5>' +
      '        <p class="card-text card-description">Архив</p>' +
      '        <p class="card-text-last-updated"><small class="text-muted card-last-updated">Последнее обновление' + data.lastUpdated + '</small></p>' +
      '        <p><small class="text-muted"></p>' +
      '        <div class="card-buttons-block">' +
      '           <button class="btn btn-danger card-button-remove"><i class="fa fa-check"></i>Удалить</button>' +
      '           <button class="btn btn-warning card-button-archive-extract"><i class="fa fa-check"></i>Разархивировать</button>' +
      '        </div>' +
      '      </div >' +
      '    </div >' +
      '  </div >' +
      '</div >');

    let aCard = $(document.getElementsByName(data.baseName));

    // Задание свойств для новой карты
    cardResize(aCard.find('.control-card-img'), '.control-card-img');
    aCard.find('.card-description').css('height', card['text-height']);

    // Добавление эффекта на блок 
    aCard.css('box-shadow', '0px 0px 30px rgba(0, 0, 0, 0.5)');

    // Отображение новой карты
    aCard.fadeIn(250, function () {
      $(this).css('box-shadow', 'none');
    });
  });
};
function changeOnBaseCard(old, data) { // блок базы
  old.replaceWith('<div class="card mb-3 control-card" style="display: none; max-width: 595px" name="' + data.baseName + '" >' +
    '  <div class="row no-gutters">' +
    '    <div class="col-md-4 control-card-img">' +
    '      <img src="img/base-refresh.png" class="control-card-icon">' +
    '      <p>Изменить аватарку</p>' +
    '      <input type="file" class="control-card-icon-input" required />' +
    '      <img src="' + data.avatar + '" class= "control-card-base-avatar" >' +
    '    </div>' +
    '    <div class="col-md-8">' +
    '      <div class="card-body">' +
    '        <h5 class="card-title">' + data.baseName + '</h5>' +
    '        <p class="card-text card-description">' + data.description + '</p>' +
    '        <p class="card-text-last-updated"><small class="text-muted card-last-updated">Последнее обновление ' + data.lastUpdated + '</small></p>' +
    '        <p><small class="text-muted">Количество записей:' + data.json.size + '</small></p>' +
    '        <div class="card-buttons-block">' +
    '           <button class="btn btn-danger card-button-remove"><i class="fa fa-check"></i>Удалить</button>' +
    '           <button class="btn btn-warning card-button-archive"><i class="fa fa-check"></i>Архивировать</button>' +
    '           <button class="btn btn-success card-button-activate"><i class="fa fa-check"></i>Активировать</button>' +
    '        </div>' +
    '      </div >' +
    '    </div >' +
    '  </div >' +
    '</div >');
  let aCard = $(document.getElementsByName(data.baseName));

  // Настройка аватарки
  if (data.avatar === false) {
    aCard.find('.control-card-base-avatar').attr('src', "img/default.jpg");
    aCard.find('.control-card-icon').attr('src', "img/base-download.png");
    aCard.find('.control-card-img p').text('Загрузить аватарку');
  }

  // Задание свойств для новой карты
  cardResize(aCard.find('.control-card-img'), '.control-card-img');
  aCard.find('.card-description').css('height', card['text-height']);

  // Добавление эффекта на блок 
  aCard.css('box-shadow', '0px 0px 30px rgba(0, 0, 0, 0.5)');

  // Отображение новой карты
  aCard.fadeIn(250, function () {
    $(this).css('box-shadow', 'none');
  });
};

// Создание архива:
// data = {
//   action: 'create' | 'extract',
//   baseName: <baseName>
//   password: <password>
// }
function archiveAction(data) {

  // Отправка запроса на бэк
  switch (data.action) {
    case 'create':
      $.ajax({
        url: '/control/base/archive/create',
        method: 'POST',
        data: {
          baseName: data.baseName,
          password: data.password
        }
      }).done(function (res) { // успех
        $('article').prepend('<div class="alert alert-success"><div>База ' + res.baseName + ' успешно архивирована</div></div>');
        // Изменение карты на архивную
        changeOnArchiveCard($(document.getElementsByName(res.baseName)), res);
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
      break;
    case 'extract':
      $.ajax({
        url: '/control/base/archive/extract',
        method: 'POST',
        data: {
          baseName: data.baseName,
          password: data.password
        }
      }).done(function (res) { // успех
        $('article').prepend('<div class="alert alert-success"><div>База ' + res.baseName + ' успешно разархивирована</div></div>');

        // Изменение карты на карту базы
        changeOnBaseCard($(document.getElementsByName(res.baseName)), res);
        clearFlash();
        console.log(res);
      }).fail(function (res) { // ошибка
        switch (res.status) {
          case 403: // запрещено
            if (res.responseText === 'base is exist') {
              $('article').prepend('<div class="alert alert-danger"><div>Такая база уже разархивирована!</div></div>');
              clearFlash();
            }
            break;
          case 404: // не найдено
            if (res.responseText === 'archive not found') {
              $('article').prepend('<div class="alert alert-danger"><div>Архив не найден!</div></div>');
              clearFlash();
            }
            break;
          case 505: // ошибка сервера
            $('article').prepend('<div class="alert alert-danger"><div>' + res.responseText + '</div></div>');
            clearFlash();
            break;
        }
      });
      break;
  }
};

// ---------------Архив---------------

// Нажатие кнопки создания архива
$(document).on('click', '.card-button-archive', function () {
  createPasswordForm($(this).closest('.row').find('.card-title').text());
});

// Нажатие кнопки распаковки архива
$(document).on('click', '.card-button-archive-extract', function () {
  passwordEntryForm($(this).closest('.row').find('.card-title').text());
});

// Событие ввода пароля
$(document).on('keyup', '.control-popup-password-input', function () {

  let parent = $(this).closest('.control-popup-password');
  let inputs = parent.find('.control-popup-password-input');

  if (inputs.length > 1) {
    let btn = parent.find('.submit-popup-password');

    // Проверка всех полей на наличие значения
    if ($(inputs[0]).val().length && $(inputs[1]).val().length) {
      if (!btn.is(":visible"))
        btn.fadeIn(150);
    } else {
      if (btn.is(":visible"))
        btn.fadeOut(150);
    }
  }
});

// Показать / скрыть пароль
$(document).on('click', '.show-password', function () {
  let input = $(this).closest('.form-group').find('.control-popup-password-input');

  if (input.attr('type') === 'password') {
    input.attr('type', 'text');
    $(this).text('hide');
  } else {
    input.attr('type', 'password');
    $(this).text('show');
  }
});

// Закрыть окно ввода пароля
$(document).on('click', '.close-popup-password', function () {
  $(this).closest('.control-popup-background').fadeOut(300, function () {
    $(this).remove();
  });
});

// Отправить пароль
$(document).on('click', '.submit-popup-password', function () { // пароль есть

  // Поля ввода
  let parent = $(this).closest('.control-popup-password');
  let fields = parent.find('.control-popup-password-input');
  var data = {};

  // Проверка введенных значений
  if (fields.length > 1) {

    // Если значения полей не равны
    if ($(fields[0]).val() !== $(fields[1]).val()) {
      $('article').prepend('<div class="alert alert-danger" style="position: fixed; z-index: 1000; transform: translate(-50%, -50%);">' +
        '<div>Введенные пароли не совпадают!</div></div>');

      // Обнуление полей ввода
      $(fields[0]).val('');
      $(fields[1]).val('');

      // Обнуление состояний показа текста на полях
      parent.find('.show-password').each(function () {
        $(this).text('show');
      })

      // Скрыть кнопку отправки пароля
      parent.find('.submit-popup-password').fadeOut(150);

      // Завершение работы функции
      return clearFlash();
    }

    // Формирование объекта для отправки
    data = {
      action: 'create',
      baseName: document.getElementsByName('control-popup-baseName')[0].value,
      password: $(fields[0]).val()
    }

  } else {
    data = {
      action: 'extract',
      baseName: document.getElementsByName('control-popup-baseName')[0].value,
      password: $(fields[0]).val()
    }
  }

  $(this).closest('.control-popup-background').fadeOut(300, function () {
    // Вызов функции создания архива
    $(this).remove();

    // Добавление эффекта на блок 
    $(document.getElementsByName(data.baseName)).css('box-shadow', '0px 0px 30px rgba(0, 0, 0, 0.5)');

    // Вызов функции создания архива
    archiveAction(data);
  });

});
$(document).on('click', '.submit-popup-without-password', function () { // пароль пустой
  $(this).closest('.control-popup-background').fadeOut(300, function () {
    let data = {
      action: 'create',
      baseName: document.getElementsByName('control-popup-baseName')[0].value,
      password: ''
    };

    // Вызов функции создания архива
    $(this).remove();

    // Добавление эффекта на блок 
    $(document.getElementsByName(data.baseName)).css('box-shadow', '0px 0px 30px rgba(0, 0, 0, 0.5)');

    // Вызов функции создания архива
    archiveAction(data);
  });
});