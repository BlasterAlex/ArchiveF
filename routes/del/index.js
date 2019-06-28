const fs = require('fs');
var config = require('./../../libs/config');

module.exports=function (req, res) {
    fs.readFile(config.jsonPath + config.jsonName, (err, data) => {
        if (err) res.send("Не удалось открыть JSON файл!");
        else {
            var records = JSON.parse(data);
            var name = records[req.body.sel].name;
            var largePic = records[req.body.sel].img;

            try {
                fs.unlinkSync(config.imagePath + largePic);
            } catch(err) {
                req.flash('error', 'Изображениe ' + largePic + ' не найдено!');
            }

            for (var i = 0; i < records[req.body.sel].addImages.length; i++) {
                try {
                    fs.unlinkSync(config.imagePath + records[req.body.sel].addImages[i]);   
                } catch(err) {
                    req.flash('error', 'Изображениe ' + largePic + ' не найдено!');
                }
            }

            records.splice(req.body.sel, 1);
            // Перезапись файла
            let json = JSON.stringify(records, null, 2);
            fs.writeFile(config.jsonPath + config.jsonName, json, (err) => {
                if (err) res.send("Не удалось записать в JSON файл!");
                req.flash('notify', 'Запись "' + name + '" успешно удалена');
                res.redirect('/');
            });
        }        
    }); 
}