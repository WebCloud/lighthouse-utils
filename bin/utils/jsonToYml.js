const { readFileSync } = require('fs');
const { safeDump } = require('js-yaml');

/**
 * Convert a .ts file into an in memory yaml string
 * @param {string} path - The absolut path to the Yaml file.
 *
 * @returns {string} yaml string.
 */
function jsonToYml(filePath) {
  const json = JSON.parse(readFileSync(filePath));
  const yamlText = safeDump(json, {
    lineWidth: 250
  });

  console.log('🌐 Json to Yaml done!');
  return yamlText;
}

module.exports = {
  jsonToYml
};
