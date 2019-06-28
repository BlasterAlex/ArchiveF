$(document).ready(function () {
  var dropZone = $('.add_picture_link');

  // Поддерживать квадратную форму
  dropZone.height(dropZone.width());
  $(window).resize(function () {
    dropZone.height(dropZone.width());
  });

  // Фокусировка на форме
  $('#file-input').focus(function () {
    dropZone.addClass('focused');
  })
    .focusout(function () {
      dropZone.removeClass('focused');
    });

  // Нажатие на форму
  dropZone.click(function () {
    document.getElementById("file-input").click();
  });

  dropZone.on('drag dragstart dragend dragover dragenter dragleave drop', function () {
    return false;
  });

  dropZone.on('dragover dragenter', function () {
    dropZone.addClass('dragover');
  });

  dropZone.on('dragleave', function (e) {
    let dx = e.pageX - dropZone.offset().left;
    let dy = e.pageY - dropZone.offset().top;
    if ((dx < 0) || (dx > dropZone.width()) || (dy < 0) || (dy > dropZone.height())) {
      dropZone.removeClass('dragover');
    }
  });

  // Сохранение файлов
  dropZone.on('drop', function (e) {
    dropZone.removeClass('dragover');
    document.getElementById('file-input').files = e.originalEvent.dataTransfer.files;
    $('.control-span span').text(document.getElementById('file-input').files.length);
    $('.control-span').fadeIn(400);
  });

  $('#file-input').change(function () {
    $('.control-span span').text(document.getElementById('file-input').files.length);
    $('.control-span').fadeIn(400);
  });
});