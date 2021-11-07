const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const getStyle = (src) => {
  let data = '';

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(src))
      .on('error', (err) => reject(err))
      .on('data', (chunk) => (data += chunk))
      .on('end', () => resolve(data));
  });
};

const getAllStyles = async (src) => {
  const styles = [];

  try {
    const files = await fsPromises.readdir(src, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const style = await getStyle(path.join(src, file.name));
        styles.push(style);
      }
    }
  } catch (err) {
    console.error(err.message);
  }

  return styles;
};

const bundleStyles = async (src, dest) => {
  const writableStream = fs.createWriteStream(dest);

  const styles = await getAllStyles(src);

  for (const style of styles) {
    writableStream.write(style);
  }
};

bundleStyles(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css'));
