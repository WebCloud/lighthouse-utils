const getCredentialsFromArgv = (argv) => {
  const [username, password] = argv.find(arg => arg.indexOf('auth=') !== -1)
    ? process.argv.find(arg => arg.indexOf('auth=') !== -1).split('=')[1].split(':')
    : '';

  return { username, password };
};

module.exports = {
  getCredentialsFromArgv
};
