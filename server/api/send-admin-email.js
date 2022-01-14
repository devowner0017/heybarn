const sgMail = require('@sendgrid/mail');
const humanizeString = require('humanize-string');

const prettyPrintObject = (object) => {
  const entries = Object.entries(object);
  return `
  <ul>
  ${entries.map(([key, value]) => {
    return `
    <li>${humanizeString(key)}: ${JSON.stringify(value)}</li>
    `;
  }).join('')}
  </ul>`;
};

module.exports = (req, res) => {
  const { message, content } = req.body;

  sgMail.setApiKey(process.env.SENDGRID_API);
  const msg = {
    to: process.env.REACT_APP_ADMIN_EMAIL, // Change to your recipient
    from: process.env.REACT_APP_ADMIN_EMAIL, // Change to your verified sender
    subject: message.subject,
    text: message.body,
    html: `
    <p>${message.body}</p>
    <br/>
    ${prettyPrintObject(content)}
    <br/>
    `
  };
  sgMail
    .send(msg)
    .then(() => {
      res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send({ data: 'Email sent' })
        .end();
    })
    .catch(error => {
      console.error(error);
    });
};
