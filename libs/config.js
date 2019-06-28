var config = {};

// Статика, которая отвечает за стандартные настройки
config.port = 3000;                                      // номер порта
config.projectFolder = 'src';                            // папка проекта
config.jsonName = config.projectFolder + '.json';        // имя файла проекта
config.jsonPath = './src/' + config.projectFolder + '/'; // путь до файла проекта
config.imagePath = config.jsonPath + 'image/';           // путь до папки с пользовательскими файлами
config.numOfLinks = 6;                                   // максимальное количество ссылок для одной записи
config.rowsShown = 10;                                   // количество записей на одной странице в таблице

module.exports = config;