const { handleError, serialize } = require('../api-util/sdk');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');
const { types } = require('sharetribe-flex-sdk');
const { UUID } = types;

module.exports = (req, res) => {
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET,
  });
  const { listingId, listingState, transactionId } = req.body;
  console.log('🚀 | file: update-listing-state.js | line 13 | transactionId', transactionId);
  console.log('🚀 | file: update-listing-state.js | line 13 | listingId', listingId);
  console.log('🚀 | file: update-listing-state.js | line 13 | listingState', listingState);
  console.log('🚀 | file: update-listing-state.js | line 16 | listingResponse', listingResponse);
  return integrationSdk.listings
    .update(
      { id: new UUID(listingId), publicData: { listingState, transactionId } },
      { expand: true }
    )
    .then(listingResponse => {
    console.log("🚀 | file: update-listing-state.js | line 22 | listingResponse", listingResponse);
      res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            success: true,
            listingStateUpdated: listingState,
          })
        )
        .end();
    })
    .catch(e => {
    console.log("🚀 | file: update-listing-state.js | line 35 | e", e);
      handleError(res, e);
    });
};
