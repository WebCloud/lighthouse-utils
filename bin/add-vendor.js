const fs = require('fs');
const path = require('path');

const dir = path.resolve('public/js');

let vendorName = '';
let bundleName = 'bundle.js';

const files = fs.readdirSync('public/js');

for (const fileEntry of files) {
  if (fileEntry.match(/vendor.\w+.js/g)) {
    vendorName = fileEntry;
  }
}

const remoteURL = process.argv.find(arg => arg.indexOf('ASSET_PATH=') !== -1)
  ? process.argv.find(arg => arg.indexOf('ASSET_PATH=') !== -1).split('=')[1]
  : '';

fs.readFile(`public/js/${bundleName}`, 'utf8', (fileReadError, content) => {
  if (fileReadError) throw fileReadError;

  const appendedContent = `var scriptElement = document.createElement('script'); scriptElement.id = 'shipping-vendor'; scriptElement.type = 'text/javascript';scriptElement.async = true;scriptElement.src = '${remoteURL}${vendorName}';
var headElement = document.getElementsByTagName('head')[0];headElement.appendChild(scriptElement);scriptElement.onload = function() {${content.replace('var ShippingModule', 'window.ShippingModule')}}`;

  fs.writeFile(`public/js/${bundleName}`, appendedContent, 'utf8', (writeFileError) => {
    if (writeFileError) throw writeFileError;
  });
});
