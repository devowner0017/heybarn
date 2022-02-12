const { handleError, serialize } = require('../api-util/sdk');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');

const UUID = flexIntegrationSdk.types.UUID;

module.exports = async (req, res) => {

  const { transactionId, ...metadata } = req.body;

  const flexIntegrationClientId = process.env.SHARETRIBE_INTEGRATION_CLIENT_ID;
  const flexIntegrationClientSecret = process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET;
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: flexIntegrationClientId,
    clientSecret: flexIntegrationClientSecret,
  });


  const metaParams = {
    id: new UUID(transactionId),
    metadata,
  };

  return (
    integrationSdk.transactions
      .updateMetadata(metaParams, {
        expand: true,
      })
      .then(metaResponse => {
        return res
          .status(200)
          .set('Content-Type', 'application/transit+json')
          .send(serialize(metaResponse))
          .end();
      })
      .catch(e => {
      handleError(res, e);
      })
  );
};
