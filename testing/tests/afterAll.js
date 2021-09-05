const fs = require('fs');
const path = require('path');
const rmdir = require('rimraf');

describe('After all:', () => {
  const config = JSON.parse(require('fs').readFileSync('config/config.json').toString());
  test('cleaning up', (done) => {

    // Проверка наличия временного файла
    let tempFile = path.join(config.srcDir, 'oldActiveBase');
    fs.stat(tempFile, function (err) {
      if (err != null && err.code === 'ENOENT')
        done();

      // Считывание и удаление временного файла
      let oldActive = fs.readFileSync(tempFile, 'utf8').toString();
      fs.unlinkSync(tempFile);

      // Если текущая активная база не равна сохраненной
      if (config.rootDir !== oldActive) {

        // Сделать сохраненную базу активной
        let activeBase = path.join(config.srcDir, config.rootDir);
        config.rootDir = oldActive;
        fs.writeFileSync('config/config.json', JSON.stringify(config, null, 2));

        // Проверка наличия активной базы
        try {
          fs.statSync(activeBase).isDirectory();
        } catch (e) {
          done();
        }

        // Удаление папки активной базы
        rmdir(activeBase, function (err) {
          if (err)
            done(err);
          done();
        });
      }
    });
  });
});