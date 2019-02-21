const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

/**
 * Execute a bash command.
 * @param {string} command - The command to execute.
 */
const execute = command => async () => {
  const { stdout, stderr } = await exec(command);

  return {
    stdout,
    stderr
  };
};

module.exports = {
  execute
};
