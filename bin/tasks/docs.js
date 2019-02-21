const { resolve } = require('path');
const { uploadToS3 } = require('../utils/uploadToS3');
const { execute } = require('../utils/execute');

const NO_UPDATE = '📝 No docs change detected';
const BASE_DOCS_PATH = 'docs';
const folderPath = resolve('_book');
const manuallyTriggered =
  process.argv.length === 3 && process.argv[2] === '--manual';

execute('git diff-tree -r --name-only --no-commit-id HEAD^ HEAD')()
  .then(({ stdout }) => {
    if (!manuallyTriggered && stdout.indexOf(BASE_DOCS_PATH) === -1)
      throw new Error(NO_UPDATE);
  })
  .then(() => execute('node node_modules/.bin/gitbook build')())
  .then(() => Promise.resolve(console.log('📝 Docs generated successfully')))
  .then(() => uploadToS3(folderPath))
  .then(() => Promise.resolve(console.log('📝 Docs uploaded properly')))
  .catch(err => {
    if (err.message && err.message === NO_UPDATE) {
      console.log(NO_UPDATE);
      process.exit();
    } else {
      console.error(err);
      process.exit(1);
    }
  });
