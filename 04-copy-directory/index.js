const fsPromises = require('fs/promises');
const path = require('path');

const copyDir = async (src, dest) => {
  try {
    await fsPromises.mkdir(dest, { recursive: true });

    const files = await fsPromises.readdir(src);
    for (const file of files) {
      await fsPromises.copyFile(path.join(src, file), path.join(dest, file));
    }
  } catch (err) {
    console.error(err.message);
  }
};

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
