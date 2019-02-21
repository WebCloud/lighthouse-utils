/* eslint-disable import/no-extraneous-dependencies */
const { green } = require('chalk');
const fs = require('fs');
const axios = require('axios').default;
const https = require('https');
const {
  log,
  error,
  executeWithMessage,
  config
} = require('./utils');
const { getCredentialsFromArgv } = require('./utils/auth');
const { uploadToS3 } = require('./utils/uploadToS3');
const { resolve } = require('path');

const credentials = getCredentialsFromArgv(process.argv);

const reportsFile = 'reports/automated-lighthouse-master/report.json';
const reportDigest = { data: [] };

const instance = axios.create({
  auth: credentials,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

const lighthouseStatsPath = 'lighthouse-stats';
const folderPath = resolve(`${lighthouseStatsPath}/build`);

executeWithMessage('Fetching last 20 releases', `git log --format="%H | %ad" -20 -- ${reportsFile}`)()
  .then(async ({ stdout }) => {
    const { hashes, dates } = stdout.split('\n').reduce((acc, item) => {
      if (item === "") {
        return acc;
      }

      const [hash, date] = item.split(' | ');
      acc.hashes.push(hash);
      acc.dates.push(date);

      return acc;
    }, { hashes: [], dates: [] });

    for (const hash of hashes) {
      log(`Fetching report for hash ${hash}`);
      const { data: report } = await instance.get(`${config.BITBUCKET_URL}/projects/${config.TEAM_PROJECT_NAME}/repos/${config.SHIPPING_MODULE_REPO_NAME}/raw/${reportsFile}?at=${hash}`);

      const measures = report.audits['user-timings'].details.items.filter((timming) => timming.timingType.toLowerCase() === 'measure')
        .reduce((acc, { name, duration }) => ({ ...acc, [name]: duration }), {});
      const { speedIndex } = report.audits['speed-index'];
      const { mainThread } = report.audits['mainthread-work-breakdown'];
      const [, totalWeight] = report.audits['total-byte-weight'].displayValue;

      reportDigest.data.push({
        date: dates.shift(),
        'speed-index': speedIndex,
        'main-thread-work': mainThread,
        'total-weight': totalWeight,
        ...measures
      });
    }

    log('Saving digest to file');
    fs.writeFileSync('lighthouse-stats/src/data.json', JSON.stringify(reportDigest, null, 2));
  })
  .then(executeWithMessage('Building stats page', `./bin/bootstrap.sh ${lighthouseStatsPath} https://s3.int.klarna.net/merchant-shipping/lighthouse-stats/`))
  .then(() => log('Uploading to amazong bucket'))
  .then(() => uploadToS3(folderPath, 'lighthouse-stats'))
  .then(() => process.exit())
  .catch((err) => {
    error(err);
    process.exit(1);
  });
