const { serialize } = require('../api-util/sdk');

module.exports = (req, res) => {
  // Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const REACT_APP_LISTING_FEE_CENTS = process.env.REACT_APP_LISTING_FEE_CENTS || 2000;
  const { listingId, paymentMethod, stripeCustomerId } = req.body;
  console.log('🚀 | file: create-reservation-charge.js | line 11 | req.body', req.body);
  const createParams = {
    amount: REACT_APP_LISTING_FEE_CENTS,
    currency: 'nzd',
    metadata: { listingId },
  };
  const createParamsDefault = !!stripeCustomerId
    ? { ...createParams, customer: stripeCustomerId }
    : createParams;
  const createParamsNew = {
    amount: REACT_APP_LISTING_FEE_CENTS,
    currency: 'nzd',
    metadata: { listingId },
  };
  const params = paymentMethod === 'replaceCard' ? createParamsNew : createParamsDefault;

  // TODO: UPDATE ERROR HANDLING
  return stripe.paymentIntents
    .create(params)
    .then(apiResponse => {
      const serialRes = serialize(apiResponse);
      return res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(serialRes)
        .end();
    })
    .catch(e => {
      console.log(e);
      return e;
      // handleError(res, e);
    });
};
