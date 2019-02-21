const { safeLoad } = require('js-yaml');
const { createWriteStream } = require("fs");

/**
 * Save yaml text string into a json file
 * @param {string} path - The absolut path to the Yaml file.
 *
 * @returns {string} json string.
 */
function ymlToJson(ymlText, filename) {
  try {
    const doc = safeLoad(ymlText);
    const fileStream = createWriteStream(filename);

    const _console = new console.Console(fileStream, fileStream);
    _console.log(JSON.stringify(doc, null, 2));
    return true;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  ymlToJson
};
