const fs = require('fs');
const path = require('path');

const copyFile = (src, dest) => {
  fs.copyFile(src, dest, (err) => {
    if (err) return console.error(err.message);
  });
};

const copyDir = (src, dest) => {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) return console.error(err.message);
  });

  fs.readdir(src, (err, files) => {
    if (err) return console.error(err.message);

    for (const file of files) copyFile(path.join(src, file), path.join(dest, file));
  });
};

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
