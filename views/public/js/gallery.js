// Замена сломанной картинки на дефолтную
function imgError(img) {
  img.src = '/img/default.jpg';
}

// Отображение изображения после загрузки
function imgLoad(img) {
  $(img).parent().fadeIn(400);
}

// Удаление изображения
$(document).on('click', '.recordRedCross', function () {
  let delBtn = $(this);
  let photo = delBtn.siblings('.smallPic').attr('name');
  let id = $('.record-page').attr('id');

  let quest = confirm("Будет удалено фото: " + photo + "\nИз записи: " + id + "\n\nВы уверены?");

  if (quest === true) { // удаление изображения

    let data = { // сбор данных с формы
      id: id,
      picName: photo
    };

    $.ajax({ // отправка запроса на бэк
      url: '/record/images',
      method: 'DELETE',
      data: data
    }).done(function (res) { // успех
      $('article').prepend('<div class="alert alert-success"><div>Запись ' + res.name + ' успешно обновлена</div></div>');

      if (res.warning) // фото не существует
        $('article').prepend('<div class="alert alert-warning"><div>Изображение ' + photo + ' не существует!</div></div>');

      delBtn.parent().fadeOut(300, function () { // удалить фото на странице
        $(this).remove(); // удаление фото

        if (!$('.add_picture_link').length) { // добавление формы для загрузки фото
          $('#thumbs')
            .append('<div class="add_picture_link">\n' +
              '  <div>\n' +
              '    <img id="upload-image" src="/img/plus.png">\n' +
              '    <input type="file" id="file-input" name="Images" required multiple />\n' +
              '    <label id="get-file-label">Выберите файл</label>\n' +
              '    <span>или перетащите его сюда</span>\n' +
              '  </div>\n' +
              '</div>')
            .ready(function () {
              beSquare();
              $('.add_picture_link')
                .css({ 'opacity': 0 })
                .animate({ 'opacity': 1 }, 300);
            })
        }
      });

      clearFlash();
    }).fail(function (res) { // ошибка
      if (res.status === 404) {
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
      }
    });
  }
});

// Свап фото по нажатию
$(document).on('click', '.smallPic', function () {

  let large = {
    src: $('#largePic').attr('src'),
    name: $('#largePic').attr('name')
  };
  let small = {
    src: this.src,
    name: this.name
  };

  $('#largePic').fadeOut(150, function () {
    $(this).attr('src', small.src);
    $(this).attr('name', small.name);
    $('#largePicLink').attr('href', small.src);

    $(this).fadeIn(150);
  });

  $(this).fadeOut(150, function () {
    this.src = large.src;
    this.name = large.name;
    $(this).parents('.smallPicContainer').find('.picName').val(large.name);

    $(this).fadeIn(150);
  });
});
