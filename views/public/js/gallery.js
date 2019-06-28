// Замена сломанной картинки на дефолтную
function imgError(img) {
  img.src = '/img/default.jpg';
  img.name = 'default.jpg';
}

// Отображение фото после загрузки
function imgLoad(img) {
  $(img).parent().fadeIn(400);
}

$(document).ready(function () {

  $('.smallPic').click(function () { // свап фото по нажатию

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

  $('.recordRedCross').click(function () { // подтверждение удаления фото с кнопки

    let dd = $(this).parents('.recordDelForm');
    let $photo = dd.children('.picName').val();
    let $id = dd.children('#id').val();

    let quest = confirm("Будет удалено фото: " + $photo + "\nИз записи: " + $id + "\n\nВы уверены?");

    if (quest === true) {
      dd.submit();
    } else {
      alert("Мне тоже нравится эта картинка :)");
    }
  });
})