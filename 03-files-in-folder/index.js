const fsPromises = require('fs/promises');
const path = require('path');

const printFilesInfo = async (src) => {
  try {
    const files = await fsPromises.readdir(src);

    for (const file of files) {
      const fileStats = await fsPromises.stat(path.join(src, file));

      if (fileStats.isFile()) {
        const ext = path.extname(file);
        console.log(`${file.replace(ext, '')} - ${ext.slice(1)} - ${fileStats.size / 1000}kb`);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};

printFilesInfo(path.join(__dirname, 'secret-folder'));
