const { getTicketStatus, flagTicket, labelTicket } = require('./api');

const markJiraTicketsWithMissingTranslations = ({ tickets, credentials }) =>
  tickets.forEach(ticketKey => {
    getTicketStatus({ credentials, ticketKey }).then(({ body }) => {
      const parsedBody = JSON.parse(body);
      const ticketStatusName = parsedBody.fields.status.name;

      if (ticketStatusName !== 'Done') {
        flagTicket({ credentials, ticketKey });
        labelTicket({ credentials, ticketKey, labelName: 'missing_translations' });
      }
    });
  });

module.exports = {
  markJiraTicketsWithMissingTranslations
};
