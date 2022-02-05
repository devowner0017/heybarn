const { handleError, serialize } = require('../api-util/sdk');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');
const UUID = flexIntegrationSdk.types.UUID;

module.exports = async (req, res) => {
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET,
  });
  const { listingId, customerId, providerId } = req.body;
  console.log('🚀 | file: fetch-listing-transactions.js | line 11 | providerId', providerId);
  console.log('🚀 | file: fetch-listing-transactions.js | line 10 | customerId', customerId);
  console.log('🚀 | file: fetch-listing-transactions.js | line 10 | listingId', listingId);
  const customerTransactions = await integrationSdk.transactions
    .query({ customerId, providerId }, { expand: true, include: ['listing'] })
    .then(transactionResponse => {
      console.log(
        '🚀 | file: fetch-listing-transactions.js | line 15 | transactionResponse',
        transactionResponse
      );
      return transactionResponse;
    })
    .catch(e => {
      handleError(res, e);
    });
  const providerTransactions = await integrationSdk.transactions
    .query(
      { customerId: providerId, providerId: customerId },
      { expand: true, include: ['listing'] }
    )
    .then(transactionResponse => {
      console.log(
        '🚀 | file: fetch-listing-transactions.js | line 15 | transactionResponse',
        transactionResponse
      );
      return transactionResponse;
    })
    .catch(e => {
      handleError(res, e);
    });
  res
    .status(200)
    .set('Content-Type', 'application/transit+json')
    .send(
      serialize({
        status: 200,
        statusText: 'OK',
        data: { data: [...customerTransactions.data.data, ...providerTransactions.data.data] },
      })
    )
    .end();
};
