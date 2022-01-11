const { serialize } = require('../api-util/sdk');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');

const UUID = flexIntegrationSdk.types.UUID;

module.exports = async (req, res) => {

  const { transactionId, ...metadata } = req.body;
  console.log("🚀 | file: update-transaction-metadata.js | line 9 | module.exports= | id", transactionId);
  console.log("🚀 | file: update-transaction-metadata.js | line 9 | module.exports= | metadata", metadata);

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
      console.log("🚀 | file: update-transaction-metadata.js | line 30 | module.exports= | metaResponse", metaResponse);
        return res
          .status(200)
          .set('Content-Type', 'application/transit+json')
          .send(serialize(metaResponse))
          .end();
      })
      .catch(e => {
      console.log("🚀 | file: update-transaction-metadata.js | line 38 | module.exports= | e", e);
      handleError(res, e);
      })
  );
};
