const { execute } = require('./execute');
const { TRANSIFEX_TOKEN, TRANSIFEX_POST_URL } = require('../config');

/**
 * Post a file to Transifex, using URL & Token from a config file.
 * @param {string} path - The absolut path to the Yaml file.
 *
 * @summary You can manually test this
 * using TRANSIFEX_POST_CURL = `sleep 5 && cp ${path} /Users/oussama.zaki/code/shipping-module-frontend/`.
 */
function postToTransifex(path) {
  const TRANSIFEX_POST_CURL = `curl -L --user api:${TRANSIFEX_TOKEN} -F file=@${path} -X PUT ${TRANSIFEX_POST_URL}`;

  console.log('🌐 Uploading ' + path + ' to Transifex');
  return execute(TRANSIFEX_POST_CURL)();
}

module.exports = {
  postToTransifex
};
