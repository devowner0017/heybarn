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
  console.log('🚀 | file: fetch-recurring-payments.js | line 10 | req.body;', req.body);

  // TODO: UPDATE ERROR HANDLING
  return stripe.subscriptions
    .retrieve(subId)
    .then(apiResponse => {
      console.log('🚀 | file: fetch-recurring-payments.js | line 21 | apiResponse', apiResponse);
      const serialRes = serialize(apiResponse);
      console.log(
        '🚀 | file: fetch-recurring-payments.js | line 74 | module.exports= | serialRes',
        serialRes
      );
      return res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(serialRes)
        .end();
    })
    .catch(e => {
      console.log('🚀 | file: fetch-recurring-payments.js | line 91 | module.exports= | e', e);
      const serialErr = serialize(e);
      return res
        .status(500)
        .set('Content-Type', 'application/transit+json')
        .send(serialErr)
        .end();
      // handleError(res, e);
    });
};
