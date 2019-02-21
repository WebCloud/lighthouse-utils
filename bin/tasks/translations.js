const { promisify } = require('util');
const { resolve } = require('path');
const mkdirp = promisify(require('mkdirp'));
const rimraf = promisify(require('rimraf'));
const writeFile = promisify(require('fs').writeFile);
const { jsonToYml } = require('../utils/jsonToYml');
const { postToTransifex } = require('../utils/postToTransifex');
const { execute } = require('../utils/execute');
const { markJiraTicketsWithMissingTranslations } = require('./jira/missingTranslations');
const { getCredentialsFromArgv } = require('../utils/auth');

const NO_UPDATE = '🌐 No translation change detected';
const BASE_TRANSLATION_PATH = 'src/core/translations/locales/en.json';
const folderName = 'translation';
const fileName = 'base.yml';
const filePath = resolve(`${folderName}/${fileName}`);

// To trigger the task manually.
const manuallyTriggered =
  process.argv.length === 3 && process.argv[2] === '--manual';

const jiraCredentials = getCredentialsFromArgv(process.argv);

const getTicketsWithTranslationChanges = () =>
  execute(`git log master -10 --no-merges --pretty="format:%s" -- ${BASE_TRANSLATION_PATH}`)()
    .then(({ stdout }) => {
      const commits = stdout.split('\n');
      return commits.map(commit => commit.match(/SHIPMO-\d{1,5}/g)[0]);
    });

execute('git diff-tree -r --name-only --no-commit-id HEAD^ HEAD')()
  .then(({ stdout }) => {
    if (!manuallyTriggered && stdout.indexOf(BASE_TRANSLATION_PATH) === -1)
      throw new Error(NO_UPDATE);
  })
  .then(() => mkdirp(folderName))
  .then(() => jsonToYml(BASE_TRANSLATION_PATH))
  .then(yamlText => writeFile(`${folderName}/${fileName}`, yamlText))
  .then(() => postToTransifex(filePath))
  .then(() => rimraf(folderName))
  .then(() => Promise.resolve(console.log('🌐 Translation uploaded properly')))
  .then(() => getTicketsWithTranslationChanges())
  .then(tickets => markJiraTicketsWithMissingTranslations({ tickets, credentials: jiraCredentials }))
  .then(() => Promise.resolve(console.log('🌐 Jira tickets updated')))
  .catch(err => {
    if (err.message && err.message === NO_UPDATE) {
      console.log(NO_UPDATE);
      process.exit();
    } else {
      console.error(err);
      process.exit(1);
    }
  });
