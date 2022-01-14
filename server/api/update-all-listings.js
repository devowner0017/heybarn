const { transactionLineItems } = require('../api-util/lineItems');
const { getSdk, getTrustedSdk, handleError, serialize } = require('../api-util/sdk');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');
const { types } = require('sharetribe-flex-sdk');
const { UUID } = types;

module.exports = (req, res) => {
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET,
  });
  return integrationSdk.listings.query({}).then(res => {
    console.log('🚀 | file: update-all-listings.js | line 16 | res', res);
    const listings = res.data.data;
    // res.data contains the response data
    return Promise.all(
      listings.map(listing => {
        return integrationSdk.listings
          .update({ id: listing.id, publicData: { listingState: 'live' } }, { expand: true })
          .then(listingResponse => {
          console.log("🚀 | file: update-all-listings.js | line 21 | returnintegrationSdk.listings.query | listingResponse", listingResponse);
            return "good"
          })
          .catch(e => {
            handleError(res, e);
          });
      })
    );
  });
};
