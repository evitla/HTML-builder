const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

const printFileInfo = (file) => {
  fs.stat(path.join(folderPath, file), (err, fileStats) => {
    if (err) return console.error(err.message);

    if (fileStats.isFile()) {
      const ext = path.extname(file);
      console.log(`${file.replace(ext, '')} - ${ext.slice(1)} - ${fileStats.size / 1000}kb`);
    }
  });
};

fs.readdir(folderPath, (err, files) => {
  if (err) return console.error(err.message);

  for (const file of files) printFileInfo(file);
});
