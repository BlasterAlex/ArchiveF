# ArchiveF

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![npm](https://img.shields.io/npm/v/npm.svg)
<!-- ![GitHub package.json version](https://img.shields.io/github/package-json/v/BlasterAlex/archivef.svg) -->

ArchiveF - это веб-приложение, которое позволяет работать с портативной "базой данных" в формате JSON. 

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
$ node index.js
# or
$ npm start
```

# Использование 
При отсутствии необходимых файлов приложение предложит создать их.
Записи храняться в виде массива объектов в файле ``src.json`` в папке ``src``. Данное приложение ориентированно на хранение фотографий, но вы можете изменить это под любой необходимый формат.  
Файлы, загружаемые пользователем, помещаются в папку ``src/image``.
Настройки сервиса находятся в ``/libs/config.js``. 