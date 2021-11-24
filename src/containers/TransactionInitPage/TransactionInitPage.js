import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { createSlug } from '../../util/urlHelpers';
import { txIsPaymentPending } from '../../util/transaction';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { isScrollingDisabled, manageDisableScrolling } from '../../ducks/UI.duck';
import { initializeCardPaymentData } from '../../ducks/stripe.duck.js';
import { StripePaymentFormPlatformFee } from '../../forms';
import { confirmCardPayment, retrievePaymentIntent } from '../../ducks/stripe.duck';
import routeConfiguration from '../../routeConfiguration';
import { pathByRouteName, findRouteByRouteName } from '../../util/routes';
import { savePaymentMethod } from '../../ducks/paymentMethods.duck';

import { initiateOrder, confirmPayment } from './PlatformFee.duck';
import {
  ensureUser,
  ensureListing,
  ensureCurrentUser,
  ensureTransaction,
  ensureStripeCustomer,
  ensurePaymentMethodCard,
} from '../../util/data';
import {
  NamedRedirect,
  TransactionInitPanel,
  Page,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components';
import { TopbarContainer } from '..';

import {
  stripeCustomer,
  sendMessage,
  createTransaction,
  getOwnListingsById,
} from './TransactionInitPage.duck';
import { types as sdkTypes } from '../../util/sdkLoader';
import css from './TransactionInitPage.module.css';
import { getPropByName } from '../../util/userHelpers';

const { UUID } = sdkTypes;
const PROVIDER = 'provider';
const CUSTOMER = 'customer';
const STRIPE_PI_USER_ACTIONS_DONE_STATUSES = ['processing', 'requires_capture', 'succeeded'];

// Payment charge options
const ONETIME_PAYMENT = 'ONETIME_PAYMENT';
const PAY_AND_SAVE_FOR_LATER_USE = 'PAY_AND_SAVE_FOR_LATER_USE';
const USE_SAVED_CARD = 'USE_SAVED_CARD';

const initializeOrderPage = (initialValues, routes, dispatch) => {
  console.log(
    '🚀 | file: TransactionInitPage.js | line 62 | initializeOrderPage | initialValues',
    initialValues
  );
  const OrderPage = findRouteByRouteName('OrderDetailsPage', routes);

  // Transaction is already created, but if the initial message
  // sending failed, we tell it to the OrderDetailsPage.
  dispatch(OrderPage.setInitialValues(initialValues));
};

const checkCouponCode = (coupon, currentUser) => {
  console.log('🚀 | file: TransactionInitPage.js | line 74 | checkCouponCode | coupon', coupon);
  console.log(
    '🚀 | file: TransactionInitPage.js | line 74 | checkCouponCode | currentUser',
    currentUser
  );
};
// TransactionInitPage handles data loading for Sale and Order views to transaction pages in Inbox.
export const TransactionInitPageComponent = props => {
  const {
    currentUser,
    getListing,
    params: rawParams,
    initialMessageFailedToTransaction,
    savePaymentMethodFailed,
    fetchMessagesError,
    fetchMessagesInProgress,
    totalMessagePages,
    oldestMessagePageFetched,
    showListingError,
    intl,
    messages,
    onManageDisableScrolling,
    params,
    scrollingDisabled,
    transaction,
    transactionRole,
    processTransitions,
    stripeCustomerFetched,
    contactingAs,
    guest,
    host,
    listings,
    queryInProgress,
  } = props;
  console.log('🚀 | file: TransactionInitPage.js | line 96 | contactingAs', contactingAs);
  console.log('🚀 | file: TransactionInitPage.js | line 94 | params', params);
  console.log('🚀 | file: TransactionInitPage.js | line 91 | props', props);
  console.log('🚀 | file: TransactionInitPage.js | line 92 | listings', listings);
  const [showCreateListingPopup, setShowCreateListingPopup] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [validCouponCode, setValidCouponCode] = useState(null);
  console.log('🚀 | file: TransactionInitPage.js | line 115 | validCouponCode', validCouponCode);

  const [selectedListingId, setSelectedListingId] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  console.log('🚀 | file: TransactionInitPage.js | line 98 | selectedListing', selectedListing);
  console.log('🚀 | file: TransactionInitPage.js | line 97 | selectedListingId', selectedListingId);
  if (!queryInProgress && !listings.length && !showCreateListingPopup) {
    setShowCreateListingPopup(true);
  }
  const [savedPaymentIntents, setSavedPaymentIntents] = useState(null);
  const [stripeFunction, setStripeFunction] = useState(null);
  const [submittingPlatformFee, setSubmittingPlatformFee] = useState(null);
  useEffect(_ => {
    if (window) {
      loadInitialData();
    }
  }, []);

  useEffect(
    _ => {
      if (couponCode === 'TEST') {
        setValidCouponCode(true);
      }
    },
    [couponCode]
  );
  /**
   * Load initial data for the page
   *
   */
  const loadInitialData = () => {
    const { fetchStripeCustomer } = props;
    // Fetch currentUser with stripeCustomer entity
    // Note: since there's need for data loading in "componentWillMount" function,
    //       this is added here instead of loadData static function.
    fetchStripeCustomer();
  };

  const onStripeInitialized = stripe => {
    setStripeFunction(stripe);
  };
  const listingId = new UUID(rawParams.id);
  const currentListing = ensureListing(getListing(listingId));
  const currentAuthor = ensureUser(currentListing.author);
  const listingType = getPropByName(currentListing, 'listingType');

  const currentTransaction = ensureTransaction(transaction);
  const isCustomerRole = transactionRole === CUSTOMER;

  const deletedListingTitle = intl.formatMessage({
    id: 'TransactionInitPage.deletedListing',
  });
  const listingTitle = currentListing.attributes.deleted
    ? deletedListingTitle
    : currentListing.attributes.title || '';

  // Redirect users with someone else's direct link to their own inbox/sales or inbox/orders page.
  const isOwnListing =
    currentUser &&
    currentUser.id &&
    currentAuthor &&
    currentAuthor.id &&
    currentAuthor.id.uuid === currentUser.id.uuid;

  const hasGuestAndHost = !!(guest?.id && host?.id);
  const isDataAvailable = currentUser && hasGuestAndHost;
  const hasRequiredData = hasGuestAndHost;
  const canShowPage = hasRequiredData && !isOwnListing;
  const shouldRedirect =
    currentUser?.id?.uuid && currentListing?.id?.uuid && !isDataAvailable && !canShowPage;

  // Redirect back to ListingPage if data is missing.
  // Redirection must happen before any data format error is thrown (e.g. wrong currency)
  if (shouldRedirect) {
    // eslint-disable-next-line no-console
    console.error('Missing or invalid data for checkout, redirecting back to listing page.', {});
    return (
      <NamedRedirect
        name="ListingPage"
        params={{ ...params, slug: currentListing?.attributes?.title }}
      />
    );
  }

  const detailsClassName = classNames(css.tabContent, css.tabContentVisible);

  const fetchErrorMessage = isCustomerRole
    ? 'TransactionInitPage.fetchOrderFailed'
    : 'TransactionInitPage.fetchSaleFailed';
  const loadingMessage = isCustomerRole
    ? 'TransactionInitPage.loadingOrderData'
    : 'TransactionInitPage.loadingSaleData';

  const loadingOrFailedFetching = showListingError ? (
    <p className={css.error}>
      <FormattedMessage id={`${fetchErrorMessage}`} />
    </p>
  ) : (
    <p className={css.loading}>
      <FormattedMessage id={`${loadingMessage}`} />
    </p>
  );

  const initialMessageFailed = !!(
    initialMessageFailedToTransaction &&
    currentTransaction.id &&
    initialMessageFailedToTransaction.uuid === currentTransaction.id.uuid
  );

  const handlePaymentIntent = handlePaymentParams => {
  console.log("🚀 | file: TransactionInitPage.js | line 225 | handlePaymentParams", handlePaymentParams);
    const {
      currentUser,
      stripeCustomerFetched,
      onInitiateOrder,
      onConfirmCardPayment,
      onConfirmPayment,
      onSendMessage,
      onSavePaymentMethod,
      onCreateTransaction,
    } = props;

    const {
      message,
      paymentIntent,
      selectedPaymentMethod,
      saveAfterOnetimePayment,
      validCouponCode,
      card,
      formValues,
      stripe,
    } = handlePaymentParams;

    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const ensuredStripeCustomer = ensureStripeCustomer(ensuredCurrentUser.stripeCustomer);
    const stripeCustomerId = ensuredStripeCustomer.attributes.stripeCustomerId;
    console.log(
      '🚀 | file: TransactionInitPage.js | line 221 | ensuredStripeCustomer',
      ensuredStripeCustomer
    );

    const ensuredDefaultPaymentMethod = ensurePaymentMethodCard(
      ensuredStripeCustomer.defaultPaymentMethod
    );

    const hasDefaultPaymentMethod = !!(
      stripeCustomerFetched &&
      ensuredStripeCustomer.attributes.stripeCustomerId &&
      ensuredDefaultPaymentMethod.id
    );
    console.log(
      '🚀 | file: TransactionInitPage.js | line 233 | hasDefaultPaymentMethod',
      hasDefaultPaymentMethod
    );
    const stripePaymentMethodId = hasDefaultPaymentMethod
      ? ensuredDefaultPaymentMethod.attributes.stripePaymentMethodId
      : null;
    console.log(
      '🚀 | file: TransactionInitPage.js | line 235 | stripePaymentMethodId',
      stripePaymentMethodId
    );
    const paymentFlow = (selectedPaymentMethod, saveAfterOnetimePayment) => {
      console.log(
        '🚀 | file: TransactionInitPage.js | line 245 | paymentFlow | saveAfterOnetimePayment',
        saveAfterOnetimePayment
      );
      console.log(
        '🚀 | file: TransactionInitPage.js | line 245 | paymentFlow | selectedPaymentMethod',
        selectedPaymentMethod
      );
      // Payment mode could be 'replaceCard', but without explicit saveAfterOnetimePayment flag,
      // we'll handle it as one-time payment
      return selectedPaymentMethod === 'defaultCard'
        ? USE_SAVED_CARD
        : saveAfterOnetimePayment
        ? PAY_AND_SAVE_FOR_LATER_USE
        : ONETIME_PAYMENT;
    };
    console.log(
      '🚀 | file: TransactionInitPage.js | line 254 | selectedPaymentMethod',
      selectedPaymentMethod
    );
    const selectedPaymentFlow = paymentFlow(selectedPaymentMethod, saveAfterOnetimePayment);
    console.log(
      '🚀 | file: TransactionInitPage.js | line 266 | selectedPaymentFlow',
      selectedPaymentFlow
    );

    // Step 1: initiate order by requesting payment from Marketplace API
    const fnRequestPayment = fnParams => {
      console.log('🚀 | file: TransactionInitPage.js | line 274 | fnParams', fnParams);
      console.log('🚀 | file: TransactionInitPage.js | line 257 | fnParams', fnParams);
      // fnParams should be { listingId, bookingStart, bookingEnd }
      const hasPaymentIntents = savedPaymentIntents;
      console.log(
        '🚀 | file: TransactionInitPage.js | line 260 | savedPaymentIntents',
        savedPaymentIntents
      );

      // If paymentIntent exists, order has been initiated previously.
      console.log(
        '🚀 | file: TransactionInitPage.js | line 293 | stripeCustomerId',
        stripeCustomerId
      );
      return fnParams.validCouponCode || hasPaymentIntents
        ? Promise.resolve(fnParams)
        : onInitiateOrder({
            ...fnParams,
            stripeCustomerId,
            listingId: listingId.uuid,
          });
    };

    // Step 2: pay using Stripe SDK
    const fnConfirmCardPayment = fnParams => {
      console.log('🚀 | file: TransactionInitPage.js | line 262 | fnParams', fnParams);
      // fnParams should be returned transaction entity

      const paymentIntent = fnParams;
      const { stripe, card, billingDetails } = handlePaymentParams;
      const stripeElementMaybe = selectedPaymentFlow !== USE_SAVED_CARD ? { card } : {};
      console.log(
        '🚀 | file: TransactionInitPage.js | line 284 | selectedPaymentFlow',
        selectedPaymentFlow
      );

      // Note: payment_method could be set here for USE_SAVED_CARD flow.
      // { payment_method: stripePaymentMethodId }
      // However, we have set it already on API side, when PaymentIntent was created.
      const paymentParams =
        selectedPaymentFlow !== USE_SAVED_CARD
          ? {
              payment_method: {
                billing_details: billingDetails,
                card: card,
              },
              setup_future_usage: 'off_session',
            }
          : {
              payment_method: stripePaymentMethodId,
            };

      const params = {
        stripePaymentIntentClientSecret:
          savedPaymentIntents?.client_secret || fnParams.client_secret,
        stripe,
        ...stripeElementMaybe,
        paymentParams,
      };

      // If paymentIntent status is not waiting user action,
      // confirmCardPayment has been called previously.
      const hasPaymentIntentUserActionsDone =
        paymentIntent && STRIPE_PI_USER_ACTIONS_DONE_STATUSES.includes(paymentIntent.status);
      console.log(
        '🚀 | file: TransactionInitPage.js | line 296 | hasPaymentIntentUserActionsDone',
        hasPaymentIntentUserActionsDone
      );
      return fnParams.validCouponCode || hasPaymentIntentUserActionsDone
        ? Promise.resolve({
            paymentIntent,
          })
        : onConfirmCardPayment(params);
    };

    // // Step 3: CREATE A TRANSACTION
    // // Parameter should contain { paymentIntent, transactionId } returned in step 2
    const fnCreateTransactionObject = fnParams => {
      console.log('🚀 | file: TransactionInitPage.js | line 314 | fnParams', fnParams);
      const paymentIntent = fnParams.paymentIntent;
      setSavedPaymentIntents(paymentIntent);

      return onCreateTransaction({
        listingId: listingId.uuid,
        protectedData: {
          selectedListingId: selectedListing.id.uuid,
          contactingAs,
        },
      }).then(tx => {
        return { tx, paymentIntent };
      });
    };

    // Step 4: send initial message
    const fnSendMessage = fnParams => {
      console.log('🚀 | file: TransactionInitPage.js | line 327 | paymentIntent', paymentIntent);
      console.log('🚀 | file: TransactionInitPage.js | line 326 | fnParams', fnParams);
      console.log('🚀 | file: TransactionInitPage.js | line 378 | message', message);
      if (message) {
        return onSendMessage({
          ...fnParams,
          message,
        });
      } else {
        return Promise.resolve({
          ...fnParams,
          orderId: fnParams.tx.id,
        });
      }
    };

    // Step 5: optionally save card as defaultPaymentMethod
    const fnSavePaymentMethod = fnParams => {
      console.log('🚀 | file: TransactionInitPage.js | line 332 | fnParams', fnParams);
      const pi = fnParams.paymentIntent;

      if (selectedPaymentFlow === PAY_AND_SAVE_FOR_LATER_USE) {
        return onSavePaymentMethod(ensuredStripeCustomer, pi.payment_method)
          .then(response => {
            if (response.errors) {
              return {
                ...fnParams,
                paymentMethodSaved: false,
              };
            }
            return {
              ...fnParams,
              paymentMethodSaved: true,
            };
          })
          .catch(e => {
            // Real error cases are catched already in paymentMethods page.
            return {
              ...fnParams,
              paymentMethodSaved: false,
            };
          });
      } else {
        return Promise.resolve({
          ...fnParams,
          paymentMethodSaved: true,
        });
      }
    };

    // Here we create promise calls in sequence
    // This is pretty much the same as:
    // fnRequestPayment({...initialParams})
    //   .then(result => fnConfirmCardPayment({...result}))
    //   .then(result => fnConfirmPayment({...result}))
    const applyAsync = (acc, val) => acc.then(val);
    const composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));
    const handlePaymentIntentCreation = composeAsync(
      fnRequestPayment,
      fnConfirmCardPayment,
      fnCreateTransactionObject,
      fnSendMessage,
      fnSavePaymentMethod
    );

    // Note: optionalPaymentParams contains Stripe paymentMethod,
    // but that can also be passed on Step 2
    // stripe.confirmCardPayment(stripe, { payment_method: stripePaymentMethodId })
    console.log(
      '🚀 | file: TransactionInitPage.js | line 421 | selectedPaymentFlow',
      selectedPaymentFlow
    );
    const optionalPaymentParams =
      selectedPaymentFlow === USE_SAVED_CARD && hasDefaultPaymentMethod
        ? {
            paymentMethod: stripePaymentMethodId,
          }
        : selectedPaymentFlow === PAY_AND_SAVE_FOR_LATER_USE
        ? { setupPaymentMethodForSaving: true }
        : {};

    console.log(
      '🚀 | file: TransactionInitPage.js | line 420 | optionalPaymentParams',
      optionalPaymentParams
    );
    const orderParams = {
      ...optionalPaymentParams,
      validCouponCode,
    };
      console.log("🚀 | file: TransactionInitPage.js | line 488 | validCouponCode", validCouponCode);
    console.log('🚀 | file: TransactionInitPage.js | line 430 | orderParams ', orderParams);

    return handlePaymentIntentCreation(orderParams);
  };

  const handleSubmitPlatformFee = (values = {}) => {
    console.log('🚀 | file: TransactionInitPage.js | line 495 | values', values);
    if (submittingPlatformFee) {
      return;
    }
    setSubmittingPlatformFee(true);
    const { history, currentUser, dispatch } = props;
    const { card, paymentMethod, formValues, message } = values;
    const {
      name,
      addressLine1,
      addressLine2,
      postal,
      city,
      state,
      country,
      saveAfterOnetimePayment,
    } = formValues || {};

    // Billing address is recommended.
    // However, let's not assume that <StripePaymentAddress> data is among formValues.
    // Read more about this from Stripe's docs
    // https://stripe.com/docs/stripe-js/reference#stripe-handle-card-payment-no-element
    const addressMaybe =
      addressLine1 && postal
        ? {
            address: {
              city: city,
              country: country,
              line1: addressLine1,
              line2: addressLine2,
              postal_code: postal,
              state: state,
            },
          }
        : {};

    const billingDetails = {
      name,
      email: ensureCurrentUser(currentUser).attributes.email,
      ...addressMaybe,
    };

    const requestPaymentParams = {
      stripe: stripeFunction,
      card,
      billingDetails,
      selectedPaymentMethod: paymentMethod,
      saveAfterOnetimePayment: !!saveAfterOnetimePayment,
      message,
      validCouponCode,
    };
    console.log(
      '🚀 | file: TransactionInitPage.js | line 496 | requestPaymentParams',
      requestPaymentParams
    );
    handlePaymentIntent(requestPaymentParams)
      .then(res => {
        console.log('🚀 | file: TransactionInitPage.js | line 522 | res', res);
        const { orderId, messageSuccess, paymentMethodSaved } = res;
        setSubmittingPlatformFee(false);

        const routes = routeConfiguration();
        const initialMessageFailedToTransaction = !message ? null : messageSuccess ? null : orderId;
        console.log('🚀 | file: TransactionInitPage.js | line 534 | message', message);
        console.log(
          '🚀 | file: TransactionInitPage.js | line 534 | initialMessageFailedToTransaction',
          initialMessageFailedToTransaction
        );
        const orderDetailsPath = pathByRouteName('OrderDetailsPage', routes, { id: orderId.uuid });
        const initialValues = {
          initialMessageFailedToTransaction,
          savePaymentMethodFailed: !paymentMethodSaved,
        };

        initializeOrderPage(initialValues, routes, dispatch);
        history.push(orderDetailsPath);
      })
      .catch(err => {
        console.error(err);
        setSubmittingPlatformFee(false);
      });
  };

  // If paymentIntent status is not waiting user action,
  // confirmCardPayment has been called previously.
  const hasPaymentIntentUserActionsDone = true;
  // paymentIntent && STRIPE_PI_USER_ACTIONS_DONE_STATUSES.includes(paymentIntent.status);

  // Get first and last name of the current user and use it in the StripePaymentForm to autofill the name field
  const userName =
    currentUser && currentUser.attributes
      ? `${currentUser.attributes.profile.firstName} ${currentUser.attributes.profile.lastName}`
      : null;
  const initalValuesForStripePayment = {
    name: userName,
  };
  const hasDefaultPaymentMethod = !!(
    stripeCustomerFetched &&
    ensureStripeCustomer(currentUser.stripeCustomer).attributes.stripeCustomerId &&
    ensurePaymentMethodCard(currentUser.stripeCustomer.defaultPaymentMethod).id
  );
  const selectListing = (
    <select
      onChange={e => {
        const listingId = e.target.value;
        setSelectedListingId(listingId);
        setSelectedListing(listings.find(l => l.id.uuid === listingId));
      }}
    >
      <option disabled value="" selected>
        Select A Listing
      </option>
      {listings.map(l => (
        <option key={l.id.uuid} value={l.id.uuid}>
          {l.attributes.title}
        </option>
      ))}
    </select>
  );
  const paymentForm = validCouponCode ? (
    <button
      onClick={e => {
        e.preventDefault();
        handleSubmitPlatformFee();
      }}
    >
      Submit
    </button>
  ) : (
    <StripePaymentFormPlatformFee
      className={css.paymentForm}
      onSubmit={handleSubmitPlatformFee}
      inProgress={submittingPlatformFee}
      disabled={showCreateListingPopup || !selectedListing}
      formId="TransactionInitPagePaymentForm"
      // Message above submit button
      // paymentInfo={intl.formatMessage({
      //   id: 'TransactionInitPage.paymentInfo',
      // })}
      // authorDisplayName={currentAuthor.attributes.profile.displayName}
      authorDisplayName={'currentAuthor'}
      showInitialMessageInput={false}
      initialValues={initalValuesForStripePayment}
      // initiateOrderError={initiateOrderError}
      initiateOrderError={null}
      // confirmCardPaymentError={confirmCardPaymentError}
      confirmCardPaymentError={null}
      // confirmPaymentError={confirmPaymentError}
      confirmPaymentError={null}
      // hasHandledCardPayment={hasPaymentIntentUserActionsDone}
      hasHandledCardPayment={false}
      // loadingData={!stripeCustomerFetched}
      loadingData={false}
      defaultPaymentMethod={
        hasDefaultPaymentMethod ? currentUser.stripeCustomer.defaultPaymentMethod : null
      }
      paymentIntent={null}
      // paymentIntent={paymentIntent}
      onStripeInitialized={onStripeInitialized}
      showInitialMessageInput={true}
    />
  );

  const couponCodeComp = (
    <input
      onChange={e => {
        const val = e.target.value;
        console.log('🚀 | file: TransactionInitPage.js | line 640 | val', val);
        setCouponCode(val);
      }}
      type="text"
    />
  );

  // TransactionPanel is presentational component
  // that currently handles showing everything inside layout's main view area.
  const panel = isDataAvailable ? (
    <TransactionInitPanel
      className={detailsClassName}
      currentUser={currentUser}
      currentListing={currentListing}
      fetchMessagesInProgress={fetchMessagesInProgress}
      totalMessagePages={totalMessagePages}
      oldestMessagePageFetched={oldestMessagePageFetched}
      messages={messages}
      initialMessageFailed={initialMessageFailed}
      savePaymentMethodFailed={savePaymentMethodFailed}
      fetchMessagesError={fetchMessagesError}
      onManageDisableScrolling={onManageDisableScrolling}
      transactionRole={transactionRole}
      nextTransitions={processTransitions}
      paymentForm={paymentForm}
      showCreateListingPopup={showCreateListingPopup}
      setShowCreateListingPopup={setShowCreateListingPopup}
      selectListing={selectListing}
      selectedListing={selectedListing}
      couponCodeComp={couponCodeComp}
      validCouponCode={validCouponCode}
    />
  ) : (
    loadingOrFailedFetching
  );

  return (
    <Page
      title={intl.formatMessage({ id: 'TransactionInitPage.title' }, { title: listingTitle })}
      scrollingDisabled={scrollingDisabled}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>
        <LayoutWrapperMain>
          <div className={css.root}>{panel}</div>
        </LayoutWrapperMain>
        <LayoutWrapperFooter className={css.footer}>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </Page>
  );
};

TransactionInitPageComponent.defaultProps = {
  currentUser: null,
  showListingError: null,
  acceptSaleError: null,
  declineSaleError: null,
  transaction: null,
  fetchMessagesError: null,
  initialMessageFailedToTransaction: null,
  savePaymentMethodFailed: false,
  sendMessageError: null,
  timeSlots: null,
  fetchTimeSlotsError: null,
  lineItems: null,
  fetchLineItemsError: null,
};

const { bool, func, oneOf, shape, string, array, arrayOf, number } = PropTypes;

TransactionInitPageComponent.propTypes = {
  params: shape({ id: string }).isRequired,
  transactionRole: oneOf([PROVIDER, CUSTOMER]).isRequired,
  currentUser: propTypes.currentUser,
  showListingError: propTypes.error,
  acceptSaleError: propTypes.error,
  declineSaleError: propTypes.error,
  acceptInProgress: bool.isRequired,
  declineInProgress: bool.isRequired,
  onAcceptSale: func.isRequired,
  onDeclineSale: func.isRequired,
  scrollingDisabled: bool.isRequired,
  transaction: propTypes.transaction,
  fetchMessagesError: propTypes.error,
  totalMessagePages: number.isRequired,
  oldestMessagePageFetched: number.isRequired,
  messages: arrayOf(propTypes.message).isRequired,
  initialMessageFailedToTransaction: propTypes.uuid,
  savePaymentMethodFailed: bool,
  sendMessageInProgress: bool.isRequired,
  sendMessageError: propTypes.error,
  onShowMoreMessages: func.isRequired,
  onSendMessage: func.isRequired,
  timeSlots: arrayOf(propTypes.timeSlot),
  fetchTimeSlotsError: propTypes.error,
  callSetInitialValues: func.isRequired,
  onInitializeCardPaymentData: func.isRequired,
  onFetchTransactionLineItems: func.isRequired,

  // line items
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    showListingError,
    acceptSaleError,
    declineSaleError,
    acceptInProgress,
    declineInProgress,
    transactionRef,
    fetchMessagesInProgress,
    fetchMessagesError,
    totalMessagePages,
    oldestMessagePageFetched,
    messages,
    initialMessageFailedToTransaction,
    savePaymentMethodFailed,
    sendMessageInProgress,
    sendMessageError,
    sendReviewInProgress,
    sendReviewError,
    timeSlots,
    fetchTimeSlotsError,
    processTransitions,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,

    stripeCustomerFetched,
    contactingAs,
    guest,
    host,
    currentPageResultIds,
    queryInProgress,
  } = state.TransactionInitPage;
  console.log(
    '🚀 | file: TransactionInitPage.js | line 7514 | state.TransactionInitPage',
    state.TransactionInitPage
  );
  console.log('🚀 | file: TransactionInitPage.js | line 754 | host', host);
  console.log('🚀 | file: TransactionInitPage.js | line 754 | guest', guest);
  const { currentUser } = state.user;

  const listings = currentPageResultIds && getOwnListingsById(state, currentPageResultIds);

  const getListing = id => {
    const ref = { id, type: 'listing' };
    const listings = getMarketplaceEntities(state, [ref]);
    return listings.length === 1 ? listings[0] : null;
  };
  const transactions = getMarketplaceEntities(state, transactionRef ? [transactionRef] : []);
  const transaction = transactions.length > 0 ? transactions[0] : null;

  return {
    currentUser,
    getListing,
    listings,
    showListingError,
    acceptSaleError,
    declineSaleError,
    acceptInProgress,
    declineInProgress,
    scrollingDisabled: isScrollingDisabled(state),
    transaction,
    fetchMessagesInProgress,
    fetchMessagesError,
    totalMessagePages,
    oldestMessagePageFetched,
    messages,
    initialMessageFailedToTransaction,
    savePaymentMethodFailed,
    sendMessageInProgress,
    sendMessageError,
    sendReviewInProgress,
    sendReviewError,
    timeSlots,
    fetchTimeSlotsError,
    processTransitions,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,

    contactingAs,
    stripeCustomerFetched,
    guest,
    host,
    queryInProgress,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    fetchStripeCustomer: () => dispatch(stripeCustomer()),
    onManageDisableScrolling: (componentId, disableScrolling) =>
      dispatch(manageDisableScrolling(componentId, disableScrolling)),
    callSetInitialValues: (setInitialValues, values) => dispatch(setInitialValues(values)),
    onInitializeCardPaymentData: () => dispatch(initializeCardPaymentData()),
    onSendMessage: params => dispatch(sendMessage(params)),

    onInitiateOrder: params => dispatch(initiateOrder(params)),
    onCreateTransaction: params => dispatch(createTransaction(params)),
    onRetrievePaymentIntent: params => dispatch(retrievePaymentIntent(params)),
    onConfirmCardPayment: params => dispatch(confirmCardPayment(params)),
    onConfirmPayment: params => dispatch(confirmPayment(params)),
    onSavePaymentMethod: (stripeCustomer, stripePaymentMethodId) =>
      dispatch(savePaymentMethod(stripeCustomer, stripePaymentMethodId)),
  };
};

const TransactionInitPage = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(TransactionInitPageComponent);

export default TransactionInitPage;
