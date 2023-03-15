const sgMail = require('@sendgrid/mail');
const humanizeString = require('humanize-string');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');

// const entries = Object.entries(object);
// ${entries
//   .map(([key, value]) => {
//     const newValue = (value instanceof Array ? value : [value])
//       .flatMap(v => (!!v ? humanizeString(v.toString()) : []))
//       .join(', ');
//     return `
//   <li>${humanizeString(key)}: ${newValue}</li>
//   `;
//   })
//   .join('')}
const prettyPrintObject = (object, host, renter) => {
  if (!object) return;
  return `
  <div>
  <div>Hosts preferred name: ${object.hostsFirstName} ${object.hostsLastName}</div>
  <div>Hosts email address: ${object.hostsEmail}</div>
<br/>
  <div>Renters preferred name: ${object.rentersFirstName} ${object.rentersLastName}</div>
  <div>Renters email address: ${object.rentersEmail}</div>
  <br/>
  <div>Rental of: ${object.rentalAddress}</div>
<div>Rental start date: ${object.startDate}</div>
<div>Rental end date: ${object.ongoingContract ? 'perpetual' : object.endDate}</div>
<br/>
<div>Weekly rental amount: $${object.price / 100}</div>
<br/>
<div>Intended Use(s): ${object.intendedUse}</div>
<div>Smoking: ${object.groundRules.find(r => r === 'noSmoking') ? 'allowed' : 'not allowed'}</div>
<div>Animals: ${object.groundRules.find(r => r === 'noPets') ? 'allowed' : 'not allowed'}
<div>Visitors: ${object.groundRules.find(r => r === 'noGuests') ? 'allowed' : 'not allowed'}
<div>Signage: ${object.groundRules.find(r => r === 'noSignage') ? 'allowed' : 'not allowed'}
<div>Additional terms: ${object.additionalInformation || ''}</div>
  </div>`;
};

module.exports = async (req, res) => {
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET,
  });
  const { to, message, content, renterId, hostId } = req.body;
  const renterData = renterId && (await integrationSdk.users.show({ id: renterId }));
  const hostData = hostId && (await integrationSdk.users.show({ id: hostId }));
  const renter = renterData && renterData.data.data.attributes;
  const host = hostData && hostData.data.data.attributes;
  sgMail.setApiKey(process.env.SENDGRID_API);
  const msg = {
    to: to || process.env.REACT_APP_ADMIN_EMAIL, // Change to your recipient
    from: process.env.REACT_APP_ADMIN_EMAIL, // Change to your verified sender
    subject: message.subject,
    text: message.body,
    html: `
    <p>${message.body}</p>
    <br/>
    ${
      host
        ? `
      <h2>Host</h2>
      <ul>
    <li>Email: ${host.email}</li>
    <li>First Name: ${host.profile.firstName}</li>
    <li>Last Name: ${host.profile.lastName}</li>
    <li>Phone Number: ${host.profile.protectedData && host.profile.protectedData.phoneNumber}</li>
  </ul>
      `
        : ''
    }
      ${
        renter
          ? `
    <h2>Renter</h2>
    <ul>
    <li>Email: ${renter.email}</li>
    <li>First Name: ${renter.profile.firstName}</li>
    <li>Last Name: ${renter.profile.lastName}</li>
    <li>Phone Number: ${renter.profile.protectedData &&
      renter.profile.protectedData.phoneNumber}</li>
  </ul>
  `
          : ''
      }
  <br/>
  <h2>Content</h2>
  ${prettyPrintObject(content, host, renter)}
    `,
  };
  sgMail
    .send(msg)
    .then(r => {
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
