/**
 * This file contains server side endpoints that can be used to perform backend
 * tasks that can not be handled in the browser.
 *
 * The endpoints should not clash with the application routes. Therefore, the
 * endpoints are prefixed in the main server where this file is used.
 */

const express = require('express');
const bodyParser = require('body-parser');
const { deserialize } = require('./api-util/sdk');

const initiateLoginAs = require('./api/initiate-login-as');
const loginAs = require('./api/login-as');
const transactionLineItems = require('./api/transaction-line-items');
const initiatePrivileged = require('./api/initiate-privileged');
const transitionPrivileged = require('./api/transition-privileged');
const transitionPrivilegedSimple = require('./api/transition-privileged-simple');

const createUserWithIdp = require('./api/auth/createUserWithIdp');

const { authenticateFacebook, authenticateFacebookCallback } = require('./api/auth/facebook');
const { authenticateGoogle, authenticateGoogleCallback } = require('./api/auth/google');

const receiveReservationPayment = require('./sph/receive-reservation-payment');
const createReservationCharge = require('./sph/create-reservation-charge');
const createRentalPayments = require('./sph/create-recurring-payments');
const fetchRentalPayments = require('./sph/fetch-recurring-payments');
const extendRentalPayments = require('./sph/extend-recurring-payments');
const cancelRentalPayments = require('./sph/cancel-recurring-payments');
const updateSubscriptionPM = require('./sph/update-subscription-payment-method');
const updateListingState = require('./api/update-listing-state');
const fetchListingTransactions = require('./api/fetch-listing-transactions');
const updateTransactionMetadata = require('./api/update-transaction-metadata');
const closeAcceptedListing = require('./api/close-accepted-listing');
const sendAdminEmail = require('./api/send-admin-email.js');
const sendContactEmail = require('./api/send-contact-email.js');

//ADMIN / DEVELOPMENT ONLY
const updateAllListings = require('./api/update-all-listings');

const router = express.Router();

// ================ API router middleware: ================ //

// Parse Transit body first to a string
router.use(
  bodyParser.text({
    type: 'application/transit+json',
  })
);

// Deserialize Transit body string to JS data
router.use((req, res, next) => {
  if (req.get('Content-Type') === 'application/transit+json' && typeof req.body === 'string') {
    try {
      req.body = deserialize(req.body);
    } catch (e) {
      console.error('Failed to parse request body as Transit:');
      console.error(e);
      res.status(400).send('Invalid Transit in request body.');
      return;
    }
  }
  next();
});

// ================ API router endpoints: ================ //

router.get('/initiate-login-as', initiateLoginAs);
router.get('/login-as', loginAs);
router.post('/transaction-line-items', transactionLineItems);
router.post('/initiate-privileged', initiatePrivileged);
router.post('/transition-privileged', transitionPrivileged);
router.post('/transition-privileged-simple', transitionPrivilegedSimple);

// Create user with identity provider (e.g. Facebook or Google)
// This endpoint is called to create a new user after user has confirmed
// they want to continue with the data fetched from IdP (e.g. name and email)
router.post('/auth/create-user-with-idp', createUserWithIdp);

// Facebook authentication endpoints

// This endpoint is called when user wants to initiate authenticaiton with Facebook
router.get('/auth/facebook', authenticateFacebook);

// This is the route for callback URL the user is redirected after authenticating
// with Facebook. In this route a Passport.js custom callback is used for calling
// loginWithIdp endpoint in Flex API to authenticate user to Flex
router.get('/auth/facebook/callback', authenticateFacebookCallback);

// Google authentication endpoints

// This endpoint is called when user wants to initiate authenticaiton with Google
router.get('/auth/google', authenticateGoogle);

// This is the route for callback URL the user is redirected after authenticating
// with Google. In this route a Passport.js custom callback is used for calling
// loginWithIdp endpoint in Flex API to authenticate user to Flex
router.get('/auth/google/callback', authenticateGoogleCallback);

router.post('/receive-reservation-payment', receiveReservationPayment);
router.post('/create-reservation-charge', createReservationCharge);
router.post('/create-recurring-payments', createRentalPayments);

router.post('/fetch-recurring-payments', fetchRentalPayments);
router.post('/cancel-recurring-payments', cancelRentalPayments);
router.post('/extend-recurring-payments', extendRentalPayments);
router.post('/update-subscription-payment-method', updateSubscriptionPM);
router.post('/close-accepted-listing', closeAcceptedListing);
router.post('/update-listing-state', updateListingState);
router.post('/update-transaction-metadata', updateTransactionMetadata);
router.post('/send-admin-email', sendAdminEmail);
router.post('/send-contact-email', sendContactEmail);
router.post('/fetch-listing-transactions', fetchListingTransactions);

// ADMIN
router.post('/update-all-listings', updateAllListings);

module.exports = router;
