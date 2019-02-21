const request = require('request');

const { JIRA_HOST } = require('../../config');

const getTicketStatus = ({ credentials, ticketKey }) => {
  const options = {
    ...withCredentials(credentials),
    url: `${JIRA_HOST}rest/api/2/issue/${ticketKey}?fields=status`,
    method: 'GET'
  };

  return promisifyRequest(options)
};

const flagTicket = ({ credentials, ticketKey }) => {
  const options = {
    ...withCredentials(credentials),
    url: `${JIRA_HOST}rest/greenhopper/1.0/xboard/issue/flag/flag.json`,
    method: 'POST',
    body: JSON.stringify({
      issueKeys: [ticketKey],
      flag: true
    })
  };

  return promisifyRequest(options);
};

const labelTicket = ({ credentials, ticketKey, labelName }) => {
  const options = {
    ...withCredentials(credentials),
    url: `${JIRA_HOST}rest/api/2/issue/${ticketKey}`,
    method: 'PUT',
    body: JSON.stringify({
      update: {
        labels: [{ add: labelName }]
      }
    })
  };

  return promisifyRequest(options);
};

const promisifyRequest = (options) => new Promise((resolve, reject) =>
  request(options, (err, response) => {
    if (err) return reject(false);

    const { statusCode, statusMessage, body } = response;
    return statusCode < 400 ? resolve({ body }) : reject({ statusCode, statusMessage, body });
  })
);

const withCredentials = ({ username, password }) => ({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
  }
});

module.exports = {
  getTicketStatus,
  flagTicket,
  labelTicket
};
