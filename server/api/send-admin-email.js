const sgMail = require('@sendgrid/mail');
const humanizeString = require('humanize-string');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');

const prettyPrintObject = object => {
  if (!object) return;
  const entries = Object.entries(object);
  return `
  <ul>
  ${entries
    .map(([key, value]) => {
      const newValue = ((value instanceof Array ? value : [value]).flatMap(v => !!v ? humanizeString(v.toString()) : []).join(', '))
      return `
    <li>${humanizeString(key)}: ${newValue}</li>
    `;
    })
    .join('')}
  </ul>`;
};

module.exports = async (req, res) => {
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET,
  });
  const { message, content, renterId, hostId } = req.body;
const renterData = await integrationSdk.users.show({id: renterId})
const hostData = await integrationSdk.users.show({id: hostId})
const renter = renterData.data.data.attributes
const host = hostData.data.data.attributes
  sgMail.setApiKey(process.env.SENDGRID_API);
  const msg = {
    to: process.env.REACT_APP_ADMIN_EMAIL, // Change to your recipient
    from: process.env.REACT_APP_ADMIN_EMAIL, // Change to your verified sender
    subject: message.subject,
    text: message.body,
    html: `
    <p>${message.body}</p>
    <br/>
    <h2>Host</h2>
    <ul>
    <li>Email: ${host.email}</li>
    <li>First Name: ${host.profile.firstName}</li>
    <li>Last Name: ${host.profile.lastName}</li>
    <li>Phone Number: ${host.profile.protectedData && host.profile.protectedData.phoneNumber}</li>
  </ul>
    <h2>Renter</h2>
    <ul>
    <li>Email: ${renter.email}</li>
    <li>First Name: ${renter.profile.firstName}</li>
    <li>Last Name: ${renter.profile.lastName}</li>
    <li>Phone Number: ${renter.profile.protectedData && renter.profile.protectedData.phoneNumber}</li>
  </ul>
  <br/>
  <h2>Terms</h2>
  ${prettyPrintObject(content)}
    `,
  };
  sgMail
    .send(msg)
    .then((r) => {
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
