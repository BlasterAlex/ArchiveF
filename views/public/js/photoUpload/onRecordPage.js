// Поддерживать квадратную форму
function beSquare() {
  $('.add_picture_link').height($('.add_picture_link').width());
}

// Добавление изображений на страницу
function addImages(images) {
  images.forEach(function (image) {
    $('.add_picture_link')
      .before('<div class="smallPicContainer" style="display: none;" >\n' +
        '  <img src="/img/red-cross.png" class="recordRedCross" />\n' +
        '  <img src = "/' + image + '?nocache=' + Math.random() + '" name = "' + image + '" class= "smallPic" onload = "imgLoad(this)" onerror = "imgError(this)" />\n' +
        '</div >');
  });
}

// Загрузка изображений
function submit() {
  var formData = new FormData();
  formData.append('id', $('.record-page').attr('id'));

  // Формирование массива файлов
  var files = $($('#file-input')[0].files);
  files.each(function (i, file) {
    formData.append('array', file);
  });

  $.ajax({ // отправка запроса на бэк
    url: '/record/images',
    method: 'POST',
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    dataType: 'json'
  }).done(function (res) { // успех
    $('article').prepend('<div class="alert alert-success"><div>Запись ' + res.name + ' успешно обновлена</div></div>');

    $('#record-dateOfChange').text(res.dateOfChange); // обновление даты изменения записи
    if ($('#record-dateOfChange').parent().css('display') === 'none')
      $('#record-dateOfChange').parent().fadeIn(300);

    if (res.isFilled) // если заняты все ячейки
      $('.add_picture_link').fadeOut(300, function () { // скрыть форму добавления фото
        addImages(res.newImages);
        $(this).remove();
      });
    else
      addImages(res.newImages);

    clearFlash();
  }).fail(function (res) { // ошибка
    switch (res.status) {
      case 400: // плохой запрос
        switch (res.responseText) {
          case 'too many images': // превышен лимит количества изображений
            $('article').prepend('<div class="alert alert-danger"><div>Запись не может содержать более 4-х картинок!</div></div>');
            clearFlash();
            break;
        }
        break;
      case 404: // не найдено
        switch (res.responseText) {
          case 'file not found': // обновить окно, на беке тут подключается новый шаблон
            window.location.reload();
            break;
          case 'record not found': // не найдена запись
            $('article').prepend('<div class="alert alert-danger"><div>Элемент не найден!</div></div>');
            clearFlash();
            break;
          case 'image not found': // не найдена картинка
            $('article').prepend('<div class="alert alert-danger"><div>Изображениe ' + data.picName + ' не найдено!</div></div>');
            clearFlash();
            break;
        }
        break;
      case 500: // ошибка сервера
        $('article').prepend('<div class="alert alert-danger"><div>' + res.responseText + '</div></div>');
        clearFlash();
        break;
    }
  });

  $('#file-input').val(''); // очистка file upload field
}

$(document).ready(function () {
  beSquare(); // Обновлять при ресайзе
  $(window).resize(function () { beSquare(); });
});

// Нажатие на форму
$(document).on('click', '.add_picture_link', function () {
  document.getElementById('file-input').click();
});

// Фокусировка на форме
$(document).on('focus', '#file-input', function () {
  $('.add_picture_link').addClass('focused');
});

$(document).on('focusout', '#file-input', function () {
  $('.add_picture_link').removeClass('focused');
});

// Drag-and-drop
$(document).on('drag dragstart dragend dragover dragenter dragleave drop', '.add_picture_link', function () {
  return false;
});

$(document).on('dragover dragenter', '.add_picture_link', function () {
  $(this).addClass('dragover');
});

$(document).on('dragleave', '.add_picture_link', function (e) {
  let dx = e.pageX - $(this).offset().left;
  let dy = e.pageY - $(this).offset().top;
  if ((dx < 0) || (dx > $(this).width()) || (dy < 0) || (dy > $(this).height())) {
    $(this).removeClass('dragover');
  }
});

// Сохранение файлов
$(document).on('drop', '.add_picture_link', function (e) {
  $(this).removeClass('dragover');
  document.getElementById('file-input').files = e.originalEvent.dataTransfer.files;
  submit();
});

$(document).on('change', '#file-input', function () { submit(); });