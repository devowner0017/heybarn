const { transactionLineItems } = require('../api-util/lineItems');
const { getSdk, getTrustedSdk, handleError, serialize } = require('../api-util/sdk');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');
const { types } = require('sharetribe-flex-sdk');
const { UUID } = types;

module.exports = (req, res) => {
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.REACT_APP_INTEGRATION_SDK_CLIENT_ID,
    clientSecret: process.env.REACT_APP_INTEGRATION_SDK_CLIENT_SECRET,
  });
  return integrationSdk.listings
    .close({ id: req.body }, { expand: true })
    .then(listingResponse => {
      res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            listingClosed: true,
          })
        )
        .end();
    })
    .catch(e => {
      console.log(e);
      // handleError(res, e);
    });
};
