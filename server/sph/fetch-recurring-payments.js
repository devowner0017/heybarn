const { serialize } = require('../api-util/sdk');

module.exports = async (req, res) => {
  // Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET,
  });
  const { subId } = req.body;

  // TODO: UPDATE ERROR HANDLING
  return stripe.subscriptions
    .retrieve(subId)
    .then(apiResponse => {
      const serialRes = serialize(apiResponse);
      return res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(serialRes)
        .end();
    })
    .catch(e => {
      const serialErr = serialize(e);
      return res
        .status(500)
        .set('Content-Type', 'application/transit+json')
        .send(serialErr)
        .end();
      // handleError(res, e);
    });
};
