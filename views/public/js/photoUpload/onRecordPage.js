$(document).ready(function () {
  var dropZone = $('#upload-container');

  // Поддерживать квадратную форму
  dropZone.height(dropZone.width());
  $(window).resize(function () {
    dropZone.height(dropZone.width());
  });

  // Фокусировка на форме
  $('#file-input').focus(function () {
    $('#upload-container').addClass('focused');
  })
    .focusout(function () {
      $('#upload-container').removeClass('focused');
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

  dropZone.on('drop', function (e) {
    dropZone.removeClass('dragover');
    document.getElementById('file-input').files = e.originalEvent.dataTransfer.files;
    dropZone.submit();
  });

  $('#file-input').change(function () {
    dropZone.submit();
  });
});