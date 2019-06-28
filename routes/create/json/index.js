const fs = require('fs');
var config = require('./../../../libs/config');

module.exports= function (req, res) {
        fs.readFile(config.jsonPath + config.jsonName, (err, data) => {
        if (err) 
        {
            var records = []
            // Создать файл
            let json = JSON.stringify(records, null, 2);
            fs.writeFile(config.jsonPath + config.jsonName, json, (err) => {
                if (err) res.send("Не удалось записать в JSON файл!");
                res.redirect('/');
            });
        }
        else res.render('somethingWrong', {textError: "Файл уже был создан!"});
    }); 
}