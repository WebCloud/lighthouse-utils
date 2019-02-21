const { execute } = require('../utils/execute');
const { TRANSIFEX_TOKEN, TRANSIFEX_LANG_URL } = require('../config');
const { ymlToJson } = require('../utils/ymlToJson');

const LANG_LIST = [
  'nl',
  'fi',
  'fr',
  'de',
  'it',
  'nb',
  'pl',
  'pt',
  'es',
  'sv'
];

const fetchLanguage = lang => {
  return new Promise(function(resolve, reject) {
    execute(`curl -L --user api:${TRANSIFEX_TOKEN} -X GET ${TRANSIFEX_LANG_URL}${lang}/?file=yml`)()
    .then(({ stdout }) => ymlToJson(stdout, `src/core/translations/locales/${lang}.json`))
    .then(() => {
      console.log(`🌐 ${lang} fetched properly`);
      resolve();
    })
    .catch(err => {
      reject(err);
      process.exit(1);
    });
  })
}

const actions = LANG_LIST.map(fetchLanguage);

Promise.all(actions)
  .then(() => console.log("🌐 All translations were fetched!"))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
