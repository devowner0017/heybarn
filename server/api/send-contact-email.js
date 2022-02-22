const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
  const { to, message, content } = req.body;
  sgMail.setApiKey(process.env.SENDGRID_API);
  const msg = {
    to: to || process.env.REACT_APP_ADMIN_EMAIL, // Change to your recipient
    from: process.env.REACT_APP_ADMIN_EMAIL, // Change to your verified sender
    subject: message.subject,
    text: message.body,
    html: `
    <p>${message.body}</p>
    <br/>
  <br/>
  <h2>Content</h2>
  <h3>Sent By: ${content.name}</h3>
  <h3>Email: ${content.email}</h3>
  <p>${content.message}</p>
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
