const { handleError, serialize } = require('../api-util/sdk');

module.exports = (req, res) => {
  const { client_secret, payment_method } = { client_secret: 111, payment_method: {} };
  return stripe
    .confirmCardPayment(client_secret, payment_method)
    .then(r => {
      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        console.log(result.error.message);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.
        }
      }
    })
    .then(apiResponse => {
      res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            apiResponse,
          })
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
