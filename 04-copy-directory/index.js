const fsPromises = require('fs/promises');
const path = require('path');

const copyDir = async (src, dest) => {
  try {
    await fsPromises.mkdir(dest, { recursive: true });
    const files = await fsPromises.readdir(src, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        await copyDir(path.join(src, file.name), path.join(dest, file.name));
      } else {
        await fsPromises.copyFile(path.join(src, file.name), path.join(dest, file.name));
      }
    }
  } catch (err) {
    console.error('copyDir:', err.message);
  }
};

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
