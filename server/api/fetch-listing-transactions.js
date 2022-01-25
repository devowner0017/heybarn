const {  handleError, serialize } = require('../api-util/sdk');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');

module.exports = (req, res) => {
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET,
  });
  const { listingId, customerId } = req.body;
  return integrationSdk.transactions
    .query({ listingId: listingId, customerId: customerId }, { expand: true })
    .then(transactionResponse => {
      res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize(transactionResponse)
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
