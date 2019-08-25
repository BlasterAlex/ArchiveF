
// Создание форм для ввода пароля
function createPasswordForm(baseName) { // на создание архива
  $('article').append(
    '<div class="control-popup-background">' +
    '  <div class="card mb-3 control-popup-password archieve-create">' +
    '    <img src="img/close-cross.svg" class="close-popup">' +
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
    '    <img src="img/close-cross.svg" class="close-popup">' +
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

// Создание формы для выбора новой активной базы
function createActiveBaseSelForm(baseName) {

  // Получение вариантов выбора
  let bases = $('.control-card').filter(function () {
    return $(this).find('.btn-warning').text() === 'Архивировать' && !$(this).find('.btn-success').prop("disabled");
  });

  if (!bases.length) { // если нет неактивных баз
    $('article').prepend('<div class="alert alert-danger"><div>Это единственная база, вы не можете ее удалить!</div></div>');
    clearFlash();
  } else {

    // Список названий баз
    let headers = bases.find('.card-title');

    // Создание формы с выбором базы
    $('article').append(
      '<div class="control-popup-background">' +
      '  <div class="card mb-3 control-popup-select">' +
      '    <img src="img/close-cross.svg" class="close-popup">' +
      '    <h5>Выберите новую активную базу</h5>' +
      '    <select id="baseSelect" class="form-control" style="max-width: 300px; margin: 10px auto 0 auto;">' +
      '    </select>' +
      '    <div class="base-on-popup"></div>' +
      '    <div>' +
      '      <button class="btn btn-primary popup-select-base">Отправить</button>' +
      '    </div>' +
      '  </div>' +
      '</div>');

    let background = $('article').find('.control-popup-background');
    let select = background.find('#baseSelect');

    // Заполнение селекта списком доступных баз
    headers.each(function (i) {
      select.append('<option value=' + i + '>' + $(this).text() + '</option>');
    });

    // Отображение первой базы в списке
    var basePlace = background.find('.base-on-popup');
    $(bases[select.val()]).clone().appendTo(basePlace);
    let imgContainer = basePlace.find('.control-card .control-card-img ');

    // Удаление лишних элементов с карты
    imgContainer.find('.control-card-icon').remove();
    imgContainer.find('p').remove();
    imgContainer.find('input').remove();
    basePlace.find('.control-card .card-buttons-block').remove();

    // Событие выбора из выпадающего списка
    select.change(function () {
      let val = $(this).val();
      basePlace.find('.control-card').fadeOut(400, function () {

        // Удаление старой карты
        $(this).remove();

        // Клонирование выбранной карты
        $(bases[val]).clone().hide().appendTo(basePlace);

        // Удаление лишних элементов с карты
        let imgContainer = basePlace.find('.control-card .control-card-img ');
        imgContainer.find('.control-card-icon').remove();
        imgContainer.find('p').remove();
        imgContainer.find('input').remove();
        basePlace.find('.control-card .card-buttons-block').remove();

        // Отображение новой карты в окне
        basePlace.find('.control-card').fadeIn(200);
      });
    });

    // Событие нажатия кнопки Отправить
    background.find('.popup-select-base').click(function () {
      background.fadeOut(300, function () {
        $(this).remove();
        removeBase({
          baseName: baseName,
          repBase: $(headers[select.val()]).text()
        });
      });
    });

    // Отображение окна выбора
    background.fadeIn(300);
  }
}

// Создание формы ввода данных о базе
function createFormCreatingNewBase() {

  // Создание всплывающего окна
  $('article').append(
    '<div class="control-popup-background">' +
    '  <div class="card mb-3 control-popup-password" style="transform: translate(-50%, -60%);">' +
    '    <img src="img/close-cross.svg" class="close-popup">' +
    '    <h3>Введите данные о новой базе</h3>' +
    '    <div class="form-group">' +
    '      <input type="text" class="form-control control-popup-create-name" placeholder="Название">' +
    '    </div>' +
    '    <div class="form-group">' +
    '      <textarea class="form-control rounded-2 control-popup-create-description" rows="3" placeholder="Описание (не обязательно)"></textarea>' +
    '    </div>' +
    '    <div>' +
    '    <button class="btn btn-primary submit-popup-create">Отправить</button>' +
    '    </div>' +
    '  </div>' +
    '</div>')
    .find('.control-popup-background')
    .fadeIn(300);

  // Отправить данные о новой базе
  $(document).on('click', '.submit-popup-create', function () {
    let background = $('.control-popup-background');
    let nameField = background.find('.control-popup-create-name');

    let data = {
      baseName: nameField.val(),
      description: background.find('.control-popup-create-description').val()
    }

    // Получение списка существующих баз
    let headers = $('.control-card').filter(function () {
      return $(this).find('.btn-warning').text() === 'Архивировать';
    }).find('.card-title');

    // Проверка введенного имени
    var check = true;
    headers.each(function () {
      if ($(this).text() === data.baseName) {
        $('article').prepend('<div class="alert alert-danger" style="position: fixed; z-index: 1000; transform: translate(-50%, -90%)">' +
          '<div> Уже существует база с таким названием!</div></div> ');
        clearFlash();

        let saved = nameField.css('border-color');
        nameField.css('border-color', '#f5c8cd');
        setTimeout(function () {
          nameField.css('border-color', saved);
        }, 5000)

        check = false;
        return;
      }
    });

    // Отправка данных
    if (check) {
      $.ajax({
        url: '/control/base',
        method: 'POST',
        data: data
      }).done(function (res) { // успех
        $('.control-popup-background').fadeOut(300, function () {
          $(this).remove();

          $('article').prepend('<div class="alert alert-success"><div>База ' + res.baseName + ' успешно создана</div></div>');
          clearFlash();

          // Создание новой карты
          changeOnBaseCard(false, res);
        });
      }).fail(function (res) { // ошибка
        switch (res.status) {
          case 403: // запрещено
            if (res.responseText === 'file is exist') {
              $('article').prepend('<div class="alert alert-danger" style="position: fixed; z-index: 1000; transform: translate(-50%, -90%)">' +
                '<div>Файл с таким именем уже существует!</div></div>');
              clearFlash();
            }
            break;
          case 505: // ошибка сервера
            $('article').prepend('<div class="alert alert-danger"><div>' + res.responseText + '</div></div>');
            clearFlash();
            break;
        }
      });
    }
  });
}

// Создание новых блоков
function changeOnArchiveCard(old, data) { // блок архива
  // Скрытие старого блока
  old.fadeOut(250, function () {

    // Создание новой карты
    old.replaceWith('<div class="card mb-3 control-card" style="display: none; max-width: 610px" name="' + data.baseName + '" >' +
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
  let newCard = '<div class="card mb-3 control-card" style="display: none; max-width: 610px" name="' + data.baseName + '" >' +
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
    '        <p><small class="text-muted">Количество записей: ' + data.json.size + '</small></p>' +
    '        <div class="card-buttons-block">' +
    '           <button class="btn btn-danger card-button-remove"><i class="fa fa-check"></i>Удалить</button>' +
    '           <button class="btn btn-warning card-button-archive"><i class="fa fa-check"></i>Архивировать</button>' +
    '           <button class="btn btn-success card-button-activate"><i class="fa fa-check"></i>Активировать</button>' +
    '        </div>' +
    '      </div >' +
    '    </div >' +
    '  </div >' +
    '</div >';
  if (old)
    old.replaceWith(newCard);
  else
    $('.control-content').find('.control-add-button-container').before(newCard);

  let aCard = $(document.getElementsByName(data.baseName));
  let image = aCard.find('.control-card-img');

  if (!old)
    cardsHeight[image.index('.control-card-img')] = card['image-height'];

  // Настройка аватарки
  if (data.avatar === false) {
    aCard.find('.control-card-base-avatar').attr('src', "img/default.jpg");
    aCard.find('.control-card-icon').attr('src', "img/base-download.png");
    aCard.find('.control-card-img p').text('Загрузить аватарку');
  }

  // Задание свойств для новой карты
  cardResize(image, '.control-card-img');
  aCard.find('.card-description').css('height', card['text-height']);

  // Отображение новой карты
  aCard.fadeIn(300);
};

// ---------------База---------------

// Удаление базы:
// data = {
//   baseName: <baseName>,
//   repBase: <name of replacement base>
// }
function removeBase(data) {
  // Отправка запроса на бэк
  $.ajax({ // отправка запроса на бэк
    url: '/control/base',
    method: 'DELETE',
    data: data
  }).done(function (res) { // успех

    // Удаление карты
    $(document.getElementsByName(res.baseName)).fadeOut(300, function () {
      $(this).remove();
    });

    if (res.newActive) { // если есть новая активная база
      // Окно с сообщением
      createFullPagePopup('База "' + res.baseName + '" успешно удалена и заменена на "' + res.newActive + '". Перезапустите сервис для применения изменений.');

      // Снятие акивации со всех баз
      $('.control-card').each(function () {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
        }
      });

      // Активация выбранного окна
      let newActive = $(document.getElementsByName(res.newActive));
      newActive.addClass('active');
      changeBtnState({
        obj: newActive.find('.card-button-activate'),
        isActive: false,
        newText: 'Активна'
      });
    } else {
      $('article').prepend('<div class="alert alert-success"><div>База ' + res.baseName + ' успешно удалена</div></div>');
      clearFlash();
    }
  }).fail(function (res) { // ошибка
    switch (res.status) {
      case 404: // не найдено
        switch (res.responseText) {
          case 'base not found':
            $('article').prepend('<div class="alert alert-danger"><div>База не найдена!</div></div>');
            clearFlash();
            break;
          case 'repBase not found':
            $('article').prepend('<div class="alert alert-danger"><div>База на замену активной не найдена!</div></div>');
            clearFlash();
            break;
        }
        break;
      case 505: // ошибка сервера
        $('article').prepend('<div class="alert alert-danger"><div>' + res.responseText + '</div></div>');
        clearFlash();
        break;
    }
  });
};

// ---------------Архив---------------

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
        url: '/control/archive/create',
        method: 'POST',
        data: {
          baseName: data.baseName,
          password: data.password
        }
      }).done(function (res) { // успех
        $('.control-popup-background').fadeOut(300, function () {
          $(this).remove();
          $('article').prepend('<div class="alert alert-success"><div>База ' + res.baseName + ' успешно архивирована</div></div>');

          // Изменение карты на архивную
          changeOnArchiveCard($(document.getElementsByName(res.baseName)), res);
          clearFlash();
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
      break;
    case 'extract':
      $.ajax({
        url: '/control/archive/extract',
        method: 'POST',
        data: {
          baseName: data.baseName,
          password: data.password
        }
      }).done(function (res) { // успех
        $('.control-popup-background').fadeOut(300, function () {
          $(this).remove();
          $('article').prepend('<div class="alert alert-success"><div>База ' + res.baseName + ' успешно разархивирована</div></div>');

          // Изменение карты на карту базы
          changeOnBaseCard($(document.getElementsByName(res.baseName)), res);
          clearFlash();
        });
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

// Удаление архива:
function removeArchive(archName) {
  // Отправка запроса на бэк
  $.ajax({
    url: '/control/archive',
    method: 'DELETE',
    data: { archName: archName }
  }).done(function (res) { // успех

    $('article').prepend('<div class="alert alert-success"><div>Архив ' + res.archName + ' успешно удален</div></div>');
    clearFlash();

    // Удаление карты
    $(document.getElementsByName(res.archName)).fadeOut(300, function () {
      $(this).remove();
    });

  }).fail(function (res) { // ошибка
    switch (res.status) {
      case 404: // не найдено
        if (res.responseText === 'arch not found') {
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
};

// ---------------Кнопки---------------

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

// Закрыть окно
$(document).on('click', '.close-popup', function () {
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
      $('article').prepend('<div class="alert alert-danger" style="position: fixed; z-index: 1000; transform: translate(-50%, -50%)">' +
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

  $(this).closest('.control-popup-password').fadeOut(300, function () {
    let background = $(this).closest('.control-popup-background');

    // Удаление формы
    $(this).remove();

    // Добавление крутилки загрузки
    background.append('<img src="img/loader-inf.gif" class="control-loader">');
    background.find('.control-loader').fadeIn(300, function () {
      // Добавление эффекта на блок 
      $(document.getElementsByName(data.baseName)).css('box-shadow', '0px 0px 30px rgba(0, 0, 0, 0.5)');

      // Вызов функции создания архива
      archiveAction(data);
    });
  });

});
$(document).on('click', '.submit-popup-without-password', function () { // пароль пустой
  $(this).closest('.control-popup-password').fadeOut(300, function () {
    let data = {
      action: 'create',
      baseName: document.getElementsByName('control-popup-baseName')[0].value,
      password: ''
    };

    let background = $(this).closest('.control-popup-background');

    // Удаление формы
    $(this).remove();

    // Добавление крутилки загрузки
    background.append('<img src="img/loader-inf.gif" class="control-loader">');
    background.find('.control-loader').fadeIn(300, function () {
      // Добавление эффекта на блок 
      $(document.getElementsByName(data.baseName)).css('box-shadow', '0px 0px 30px rgba(0, 0, 0, 0.5)');

      // Вызов функции создания архива
      archiveAction(data);
    });
  });
});

// Кнопка удаление на карте
$(document).on('click', '.card-button-remove', function () {

  let cardButtons = $(this).closest('.card-buttons-block');

  // Сбор данных для отправки
  let data = {
    baseName: $(this).closest('.row').find('.card-title').text(),
  };

  // Проверка активности текущей базы
  if (cardButtons.find('.btn-success').prop("disabled")) { // база активна
    createActiveBaseSelForm(data.baseName);
  } else { // база не активна или это архив
    // Выбор действия
    if (cardButtons.find('.btn-warning').text() === 'Архивировать') { // это база
      data.repBase = false;
      removeBase(data);
    } else { // это архив
      removeArchive(data.baseName);
    }
  }
});

// Кнопка создания новой базы
$(document).on('click', '.control-add-button-container', function () {
  createFormCreatingNewBase();
});