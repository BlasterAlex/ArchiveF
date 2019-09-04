// (Де-)Активирование кнопки:
// btn = {
//   obj: <jquery el>,
//   isActive: <current active state>,
//   newText: <new btn text>
// }
function changeBtnState(btn) { // eslint-disable-line
  btn.obj.fadeOut(200, function () {
    $(this).prop('disabled', btn.isActive);
    $(this).text(btn.newText);

    if (btn.isActive) $(this).prepend('<i class="fa fa-check"></i>');
    $(this).fadeIn(200);
  });
}