const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const srcMap = {
  assets: path.join(__dirname, 'assets'),
  components: path.join(__dirname, 'components'),
  styles: path.join(__dirname, 'styles'),
  template: path.join(__dirname, 'template.html'),
};

const destMap = {
  base: path.join(__dirname, 'project-dist'),
  assets: path.join(__dirname, 'project-dist', 'assets'),
  html: path.join(__dirname, 'project-dist', 'index.html'),
  styles: path.join(__dirname, 'project-dist', 'style.css'),
};

const getData = (src) => {
  let data = '';

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(src))
      .on('error', (err) => reject(err))
      .on('data', (chunk) => (data += chunk))
      .on('end', () => resolve(data));
  });
};

const getAllData = async (src, type) => {
  const data = {};

  try {
    const files = await fsPromises.readdir(src, { withFileTypes: true });

    for (const file of files) {
      const extname = path.extname(file.name);
      if (file.isFile() && extname === `.${type}`) {
        const component = await getData(path.join(src, file.name));
        data[file.name.replace(extname, '')] = component;
      }
    }
  } catch (err) {
    console.error('getAllData:', err.message);
  }

  return data;
};

const bundleStyles = async (src, dest) => {
  try {
    const writableStream = fs.createWriteStream(dest);
    const styles = await getAllData(src, 'css');

    for (const style in styles) {
      writableStream.write(styles[style]);
    }
  } catch (err) {
    console.error('bundleStyles:', err.message);
  }
};

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

const generateHtmlFromTemplate = async (src, dest) => {
  try {
    const writableStream = fs.createWriteStream(dest);

    let template = await getData(src.template);
    const components = await getAllData(src.components, 'html');

    for (const tag in components) {
      template = template.replace(`{{${tag}}}`, components[tag]);
    }

    writableStream.write(template);
  } catch (err) {
    console.error('generateHtmlFromTemplate:', err.message);
  }
};

const build = async (src, dest) => {
  try {
    await fsPromises.mkdir(dest.base, { recursive: true });
    await copyDir(src.assets, dest.assets);
    await generateHtmlFromTemplate(src, dest.html);
    await bundleStyles(src.styles, dest.styles);
  } catch (err) {
    console.error(err.message);
  }
};

build(srcMap, destMap);
