const fs = require('fs');
const path = require('path');
const deepmerge = require('deepmerge');

const getLocaleFilesList = (localesPath) => new Promise((resolve, reject) =>
  fs.readdir(localesPath, (err, files) =>
    err
      ? reject(err)
      : resolve(
        files.filter(file => !!file.endsWith('.json'))
      )
  )
);

const getLocaleFileContent = (fileName, localesPath) => new Promise((resolve, reject) =>
  fs.readFile(path.resolve(localesPath, `${fileName}`), 'utf8', (err, content) =>
    err
      ? reject(err)
      : resolve(JSON.parse(content))
  )
);

const writeLocaleFileContent = ({ fileName, content }, localesPath) => new Promise((resolve, reject) =>
  fs.writeFile(
    path.resolve(localesPath, `${fileName}`),
    `${JSON.stringify(content, undefined, 2)}\n`,
    (err, response) =>
      err
        ? reject(err)
        : resolve(response)
  )
);

const run = async ({ baseLocaleFile, localesPath }) => {
  const baseLocaleContent = await getLocaleFileContent(baseLocaleFile, localesPath);
  const localeFilesList = await getLocaleFilesList(localesPath);

  localeFilesList
    .filter(fileName => fileName !== baseLocaleFile)
    .forEach(async fileName => {
      const localeContent = await getLocaleFileContent(fileName, localesPath);

      const content = deepmerge(
        baseLocaleContent,
        localeContent,
        { arrayMerge: (destination, source) => source }
      );

      await writeLocaleFileContent({ fileName, content }, localesPath);
    });
};

const args = process.argv.slice(2);
const BUILD_NAMESPACE = args[0];
const BASE_LOCALE_FILE = args[1] || 'en.json';

const LOCALES_PATH = path.resolve(__dirname, `../../build/${BUILD_NAMESPACE}/core/translations/locales/`);

run({ baseLocaleFile: BASE_LOCALE_FILE, localesPath: LOCALES_PATH });

