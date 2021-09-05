// Замена сломанной картинки на дефолтную
function imgError(img) { // eslint-disable-line
  img.src = '/img/default.jpg';
}

// Отображение изображения после загрузки
function imgLoad(img) { // eslint-disable-line
  $(img).parent().fadeIn(400);
}

// Перемещение слайда в слайдере
const splideMove = (splide, from, to) => {
  const slides = splide.Components.Elements.slides;
  const slide = slides[from].cloneNode(true);
  splide.remove(from);
  splide.add(slide, to);
  splide.go(to);
};

// Добавление картинок на слайдер
const splideAddImages = (primarySlider, secondarySlider, images) => {
  images.forEach(img => {
    primarySlider.add(`<li class="splide__slide">
    <div style="display: flex; justify-content: center; ">
      <a href="/${img}" target="_blank">
        <img src="/${img}" name="${img}" id="largePic" onload="imgLoad(this)"
          onerror="imgError(this)" style="height: auto;" />
      </a>
    </div>
  </li>`);
    secondarySlider.add(`<li class="splide__slide smallSlide">
    <img src="/${img}" name="${img}" onload="imgLoad(this)" onerror="imgError(this)"
      style="height: auto;" />
    </li>`);
  });
  primarySlider.go(primarySlider.length);
  secondarySlider.go(secondarySlider.length);
};

// Загрузка страницы
$(document).ready(function () {

  const recordID = $('.record-page').attr('id');

  // Create and mount the thumbnails slider.
  var secondarySlider = new Splide('#secondary-slider', {
    rewind: true,
    fixedWidth: 100,
    fixedHeight: 104,
    isNavigation: true,
    gap: 10,
    focus: 'center',
    pagination: false,
    cover: true,
    lazyLoad: 'sequential',
    breakpoints: {
      '600': {
        fixedWidth: 66,
        fixedHeight: 40,
      }
    }
  }).mount();

  // Create the main slider.
  var primarySlider = new Splide('#primary-slider', {
    type: 'fade',
    autoHeight: true,
    pagination: false,
    arrows: false,
    width: '500px',
  });

  // Set the thumbnails slider as a sync target and then call mount.
  primarySlider.sync(secondarySlider).mount();

  // Main slider move event listener
  primarySlider.on('move', index => {
    $('.save-first-button').attr('hidden', index === 0);
  });
  primarySlider.go(0);

  // Buttons on main slider
  var saveFirstButton = document.querySelector('.save-first-button');
  var addButton = document.querySelector('.add-button');
  var removeButton = document.querySelector('.remove-button');
  var imageInput = document.getElementById('splide-image-input');

  // Переместить картинки
  saveFirstButton.addEventListener('click', function () {
    const slides = primarySlider.Components.Elements.slides;
    const pictures = slides.map(element => $(element).find('img').attr('name'));

    // Если текущая картинка единственная - выход
    if (pictures.length < 2) return;

    // Получение новой главной картинки и удаление ее из списка картинок
    const currentIndex = primarySlider.index;
    const largeImg = pictures.splice(currentIndex, 1)[0];

    // Сбор данных о текущем расположении картинок
    const data = {
      id: recordID,
      img: largeImg,
      addImages: pictures
    };

    $.ajax({ // отправка запроса на бэк
      url: '/record/images',
      method: 'PUT',
      data: data
    }).done(function (res) { // успех

      splideMove(primarySlider, currentIndex, 0);
      splideMove(secondarySlider, currentIndex, 0);

      $('#record-dateOfChange').text(res.dateOfChange); // обновление даты изменения
      if ($('#record-dateOfChange').parent().css('display') === 'none')
        $('#record-dateOfChange').parent().fadeIn(300);

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
        }
      }
    });

  });

  // Добавить картинку
  addButton.addEventListener('click', function () {
    imageInput.click();
  });
  imageInput.addEventListener('change', function () {
    const formData = new FormData();
    formData.append('id', recordID);

    // Формирование массива файлов
    var files = $(imageInput.files);
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

      splideAddImages(primarySlider, secondarySlider, res.newImages);

      clearFlash();
    }).fail(function (res) { // ошибка
      switch (res.status) {
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

    $(imageInput).val('');

  });

  // Удаление картинки
  removeButton.addEventListener('click', function () {
    const slides = primarySlider.Components.Elements.slides;
    const currentIndex = primarySlider.index;
    const slide = slides[currentIndex];
    const photo = $(slide).find('img').attr('name');

    let quest = confirm('Будет удалено фото: ' + photo + '\nИз записи: ' + recordID + '\n\nВы уверены?');

    if (quest === true) { // удаление изображения

      let data = { // сбор данных с формы
        id: recordID,
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

        $('#record-dateOfChange').text(res.dateOfChange); // обновление даты изменения записи
        if ($('#record-dateOfChange').parent().css('display') === 'none')
          $('#record-dateOfChange').parent().fadeIn(300);

        primarySlider.remove(currentIndex);
        secondarySlider.remove(currentIndex);

        clearFlash();
      }).fail(function (res) { // ошибка
        switch (res.status) {
          case 404:
            switch (res.responseText) {
              case 'file not found': // обновить окно, на беке тут подключается новый шаблон
                window.location.reload();
                break;
              case 'record not found': // не найдена запись
                $('article').prepend('<div class="alert alert-danger"><div>Элемент не найден!</div></div>');
                clearFlash();
                break;
              case 'image not found': // не найдена картинка
                $('article').prepend('<div class="alert alert-danger"><div>Изображение ' + data.picName + ' не найдено!</div></div>');
                clearFlash();
                break;
            }
            break;
          case 409:
            switch (res.responseText) {
              case 'last picture':
                $('article').prepend('<div class="alert alert-danger"><div>Нельзя удалять последнее изображение!</div></div>');
                clearFlash();
                break;
            }
            break;
        }
      });
    }

  });

});