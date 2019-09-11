# ArchiveF

[![GitHub](https://img.shields.io/github/license/BlasterAlex/ArchiveF)](https://github.com/BlasterAlex/ArchiveF/blob/master/LICENSE.md) [![Travis (.org)](https://img.shields.io/travis/BlasterAlex/ArchiveF)](https://travis-ci.org/BlasterAlex/ArchiveF) [![npm](https://img.shields.io/npm/v/npm?color=orange)](https://github.com/npm/cli/releases/latest) [![GitHub release (latest by date)](https://img.shields.io/github/v/release/BlasterAlex/ArchiveF)](https://github.com/BlasterAlex/ArchiveF/releases/latest)

`ArchiveF` - это веб-приложение, которое позволяет работать с файловой [“базой данных”](https://github.com/BlasterAlex/ArchiveF/wiki/%D0%A5%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85)  в формате JSON.


# Установка
Для работы с сервисом необходим [Node.js](https://nodejs.org/) с установленным [npm](https://www.npmjs.com/get-npm)
Перед первым запуском требуется установить все необходимые пакеты командой:
```sh
$ npm install
# or
$ sudo npm install # for Linux
```
Запуск сервера осуществляется командой:
```sh
$ node server.js
# or
$ npm start
```

# Использование 
При отсутствии необходимых файлов приложение предложит создать их.
Записи храняться в виде массива объектов в файле ``src.json`` в папке ``src``. Данное приложение ориентированно на хранение фотографий, но вы можете изменить это под любой необходимый формат данных.  

Файлы, загружаемые пользователем, помещаются в папку ``src/image``.
Настройки сервиса находятся в [``/config/config.json``](/libs/config.js). 

Более подробную информацию об `ArchiveF` можно получить на соответствующей [странице Wiki](https://github.com/BlasterAlex/ArchiveF/wiki/%D0%98%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5)

<p align="center">
  <img src="./data/gif/slideshowInterface.gif" width="917"/>
</p>

# Тестирование
Для запуска тестов используйте команду:
```sh
$ npm test
```
С программным кодом тестов можно ознакомиться в папке [``/testing``](/testing). 

