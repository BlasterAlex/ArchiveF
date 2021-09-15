// Получение элемента в строке таблицы
function getCellValue(row, index) {
  if (index >= 2)
    return $(row).children('td').eq(index).data('int');
  return $(row).children('td').eq(index).text().trim();
}
// Сравнение двух строк таблицы
function comparer(index) {
  return function (a, b) {
    var valA = getCellValue(a, index), valB = getCellValue(b, index);
    return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
  };
}
// Разделение контента на страницы
class Pagination {
  constructor(rows) {
    $('.tableActions').append('<ul class="pagination"></ul>');
    this.switch = $('.pagination');
    this.rows = rows;
    this.paginated = false;
  }

  paginate() { // разбиение на страницы
    let pagination = this.switch; // переключатель страниц
    // Если переключатель еще не заполнен
    if (this.paginated === false) {
      this.paginated = true;

      let rowsShown = parseInt($('#rowsShown').text()); // количество записей на странице
      let rowsTotal = 0; // количество записей в таблице
      let visible = new Array; // массив отображаемых записей

      // Скрыть все записи и подсчитать количество
      this.rows.forEach((record) => {
        if ($(record).is(':visible')) {
          ++rowsTotal;
          visible.push(record);
        }
        $(record).hide();
      });
      let numPages = Math.ceil(rowsTotal / rowsShown); // количество страниц (округление в большую сторону)

      // Создание ссылок для переключения
      // Кнопка назад
      pagination.append('<li class="page-item disabled"><a class="page-link" href="#" rel="0">Previous</a></li>');

      // Кнопки страниц
      for (let i = 0; i < numPages; i++)
        pagination.append('<li class="page-item"><a class="page-link" href="#" rel="' + i + '">' + (i + 1) + '</a></li>');
      pagination.find('li:eq(1)').addClass('active');

      // Кнопка вперед
      pagination.append('<li class="page-item"><a class="page-link" href="#" rel="1">Next</a></li>');
      if (numPages == 1)
        pagination.find('li:last').addClass('disabled');

      // Отобразить переключатель на странице
      pagination.fadeIn(300);

      // Отображение первой страницы
      $(visible.slice(0, rowsShown)).show();

      // Переход на страницу
      pagination.find('a').bind('click', function () {

        let currPage = parseInt($(this).attr('rel')); // текущая страница
        let startItem = currPage * rowsShown; // первая запись на странице
        let endItem = startItem + rowsShown;  // последняя запись на странице

        let prev = pagination.find('li:first'); // кнопка Назад
        let next = pagination.find('li:last');  // кнопка Вперед

        // Очистка свойств кнопок переключателя
        pagination.find('li').removeClass('active');
        next.removeClass('disabled');
        prev.removeClass('disabled');

        if (currPage === 0)
          prev.addClass('disabled');
        if (currPage === numPages - 1)
          next.addClass('disabled');

        // Выделение текущей страницы
        pagination.find('li:eq(' + (currPage + 1) + ')').addClass('active');
        $(this).blur();

        // Установка ссылок для кнопок Назад и Вперед
        prev.children().attr('rel', currPage - 1);
        next.children().attr('rel', currPage + 1);

        // Отобразить текущую страницу
        $(visible).hide();
        $(visible.slice(startItem, endItem)).fadeIn(500);

      });
    }
  }

  empty() { // удаление страниц
    $(this.rows).show();
    this.switch.empty();
    this.paginated = false;
  }

  hide() { // скрыть переключатель (для поиска)
    this.switch.fadeOut(300, function () {
      $(this).empty();
    });
    this.paginated = false;
  }

  isPaginated() { // состояние переключателя
    return this.paginated;
  }

  moveTo(target) { // перемещение переключателя
    if (target.find(this.switch).length === 0)
      target.append(this.switch);
  }
}

// Главная функция
$(document).ready(function () {

  // Очистка уведомлений
  clearFlash();

  let table = $('table'); // таблица
  let rows = table.find('tbody').find('tr').toArray(); // строки таблицы

  if (rows && rows.length) { // если есть записи
    // Создать переключатель страниц 
    var pagination = new Pagination(rows);

    // Поиск
    $('#search')
      .keyup(function () {
        let filter = $(this).val().toUpperCase(); // ключ для поиска
        let col = 0; // количество результатов поиска

        // Если есть ключ для поиска или переключатель еще не заполнен
        if (filter || (!pagination.isPaginated() && !filter))
          rows.forEach((record) => { // поиск
            let name = $(record).find('td:first').text().trim();
            if (name.toUpperCase().indexOf(filter) > -1) {
              if ($(record).is(':hidden'))
                $(record).fadeIn(150);
              ++col;
            } else {
              if ($(record).is(':visible'))
                $(record).fadeOut(150);
            }
          });

        // Вывод количества результатов
        let qty = $('#resultsQty');
        if (filter) { // если поле ввода не пустое
          if (!col) // если нет результатов
            qty.css('color', 'red');
          else
            qty.css('color', '');
          qty.text(col);
          // Скрыть переключатель
          pagination.hide();
        } else {
          qty.text('');
          // Повторное создание страниц при пустом поле поиска
          pagination.paginate();
        }
      })
      .keyup();

    // Сортировка
    let sortable = $('.sortable');
    sortable.on('click', function () {
      // Удалить страницы
      pagination.empty();

      // Получить состояние текущего столбца
      let asc = $(this).hasClass('asc'); // по возрастанию
      let desc = $(this).hasClass('desc'); // по убыванию

      // Сбросить состояния для всех столбцов таблицы
      sortable.removeClass('asc').removeClass('desc');

      // Установить состояние текущего столбца
      if (desc || (!asc && !desc)) {
        $(this).addClass('asc');
      } else {
        $(this).addClass('desc');
      }

      // Сортировка
      rows = rows.sort(comparer($(this).index() - 1));
      if (asc) { rows = rows.reverse(); }

      // Вернуть страницы
      pagination.paginate();

      // Вывод в таблицу
      for (var i = 0; i < rows.length; i++) { table.append(rows[i]); }
    });
    // Вызов сортировки по имени
    sortable.first().trigger('click');

    // Отслеживание скрола страницы
    $(window).scroll(function () {
      let tableTop = parseInt(table.offset().top);

      if ($(this).scrollTop() >= tableTop) {
        $('#return-to-top').fadeIn(300);
        pagination.moveTo($('.tableActionsFooter'));
      } else {
        $('#return-to-top').fadeOut(300);
        pagination.moveTo($('.tableActions'));
      }
    });

    // Плавный переход к началу страницы
    $('#return-to-top').click(function () {
      $('body,html').animate({
        scrollTop: 0
      }, 1000);
    });
  }
});