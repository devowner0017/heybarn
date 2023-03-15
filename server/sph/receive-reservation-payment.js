const { handleError } = require('../api-util/sdk');
const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');
const { types } = require('sharetribe-flex-sdk');
const { UUID } = types;
module.exports = (request, response) => {
  const event = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
  console.log('receiveReservationPayment');
  console.log(event);
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.REACT_APP_INTEGRATION_SDK_CLIENT_ID,
    clientSecret: process.env.REACT_APP_INTEGRATION_SDK_CLIENT_SECRET,
  });
  // Handle the event
  const listingId = event.data.object.metadata.listingId;
  switch (event.type) {
    case 'charge.succeeded':
      integrationSdk.listings
        .approve(
          {
            id: new UUID(listingId),
          },
          {
            expand: true,
          }
        )
        .then(res => {
          console.log('resapprove');
          console.log(res);
          integrationSdk.listings
            .update(
              {
                id: new UUID(listingId),
                publicData: { hasConfirmedPaid: true, hasPaid: true },
                privateData: { paymentConfirmation: event.data },
              },
              {
                expand: true,
              }
            )
            .then(r => {
              console.log('updateapprove');
              console.log(r);
            });
          // res.data
        })
        .catch(e => {
          console.log(e);
          handleError(response, e);
        });
      break;
    case 'charge.failed':
      // const listingId = event.data.object.metadata.listingId;
      integrationSdk.listings
        .update(
          {
            id: new UUID(listingId),
            publicData: { hasPaid: false },
            privateData: { failedPayment: event.data },
          },
          {
            expand: true,
          }
        )
        .then(res => {
          // res.data
        })
        .catch(e => {
          console.log(e);
          handleError(response, e);
        });
      break;
    case 'charge.expired':
      // const listingId = event.data.object.metadata.listingId;
      integrationSdk.listings
        .update(
          {
            id: new UUID(listingId),
            publicData: { hasPaid: false },
            privateData: { expiredPayment: event.data },
          },
          {
            expand: true,
          }
        )
        .then(res => {
          // res.data
        })
        .catch(e => {
          console.log(e);
          handleError(response, e);
        });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
  return true;
};
