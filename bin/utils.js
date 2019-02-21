/* eslint-disable no-console, import/no-extraneous-dependencies */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { cyan, red, white } = require('chalk');

const log = (message, color = cyan) => console.log('\n', color(message));
const error = message => console.error('\n', red(message));

const executeWithMessage = (message, command) => async () => {
  if (message && message !== '') log(message);

  const { stdout, stderr } = await exec(command);
  log(stdout, white.dim);
  log(stderr, white.dim);

  return { stdout, stderr };
};

const config = {
  BITBUCKET_URL: '',
  TEAM_PROJECT_NAME: '',
  LIGHTHOUSE_APP_REPO_NAME: 'lighthouse-base-app',
  SHIPPING_MODULE_REPO_NAME: 'shipping-module-frontend'
};

module.exports = {
  log,
  error,
  executeWithMessage,
  config
};
