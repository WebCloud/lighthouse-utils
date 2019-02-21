const fs = require('fs');
const path = require('path');

const getFileNames = () => {
  const files = fs.readdirSync('src/utils/logoIcon/svg/base/vendor');
  const logoNames = files.reduce((names, file) => {
    const name = /(\w+(?:-\w+)?).js$/.exec(file)[1];
    names[name] = name;

    return names;
  }, {});

  return logoNames;
}

module.exports.default = getFileNames;
