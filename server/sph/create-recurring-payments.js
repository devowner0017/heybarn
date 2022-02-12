const { handleError, serialize } = require('../api-util/sdk');

module.exports = async (req, res) => {
  // Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');
  const integrationSdk = flexIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET,
  });
  const REACT_APP_LISTING_FEE_CENTS = process.env.REACT_APP_LISTING_FEE_CENTS || 2000;
  const {
    weeklyAmount,
    listingId,
    paymentMethod,
    stripeCustomerId,
    transactionId,
    hostStripeId,
    providerUserId,
    startTimestamp,
    endTimestamp,
    ongoingContract,
  } = req.body;
  const { author, hostStripeAccount } = await integrationSdk.users
    .show({ id: providerUserId.uuid, include: ['stripeAccount'] }, { expand: true })
    .then(res => {
      const author = res.data.data;
      const [hostStripeAccount] = res.data.included;
      return { author, hostStripeAccount };
    })
    .catch(e => {
      return e;
    });
  const params = {
    customer: stripeCustomerId,
    items: [
      {
        price_data: {
          currency: 'nzd',
          product: process.env.REACT_APP_STRIPE_PRODUCT,
          recurring: { interval: 'week' },
          unit_amount: weeklyAmount,
        },
      },
    ],
    application_fee_percent: 10,
    default_payment_method: paymentMethod,
    expand: ['latest_invoice.payment_intent'],
    transfer_data: {
      destination: hostStripeAccount.attributes?.stripeAccountId,
    },
    payment_behavior: 'allow_incomplete',
    proration_behavior: 'none',
    trial_end: startTimestamp,
    // cancel_at: ongoingContract ? null : endTimestamp,
    metadata: { listingId, transactionId },
  };

  // TODO: UPDATE ERROR HANDLING
  return stripe.subscriptions
    .create(ongoingContract ? params : { ...params, cancel_at: endTimestamp })
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
