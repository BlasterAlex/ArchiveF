const fs = require('fs');
var config = require('./../../../libs/config');

module.exports=function (req, res) {
    fs.readFile(config.jsonPath + config.jsonName, (err, data) => {
        if (err)
        {
            fs.mkdir(config.jsonPath, (err) => { // создание папки
                if (err) res.render ('somethingWrong', {textError: 'Не удалось создать папку!'});
                fs.mkdirSync(config.imagePath); // создание папки для фото

                var records = [] // создание пустого JSON файла
                let json = JSON.stringify(records, null, 2);

                fs.writeFile(config.jsonPath + config.jsonName, json, (err) => {
                    if (err) res.render ('somethingWrong', {textError: 'Не удалось записать в JSON файл!'});    
                    res.redirect('/');
                });
                
            });
        }
        else res.render ('somethingWrong', {textError: 'Папка уже была создана!'});
    });
}