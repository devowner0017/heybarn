import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { createSlug } from '../../util/urlHelpers';
import { useHistory } from 'react-router';
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
  userDisplayNameAsString,
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
  PrimaryButton,
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
import { getPropByName } from '../../util/devHelpers';
import { DIRECT_FLOW, SELECT_FLOW } from '../../components/TransactionInitPanel/SelectFlowForm';

const { UUID } = sdkTypes;
const PROVIDER = 'provider';
const CUSTOMER = 'customer';
const STRIPE_PI_USER_ACTIONS_DONE_STATUSES = ['processing', 'requires_capture', 'succeeded'];

// Payment charge options
const ONETIME_PAYMENT = 'ONETIME_PAYMENT';
const PAY_AND_SAVE_FOR_LATER_USE = 'PAY_AND_SAVE_FOR_LATER_USE';
const USE_SAVED_CARD = 'USE_SAVED_CARD';

const initializeOrderPage = (initialValues, routes, dispatch) => {
  const OrderPage = findRouteByRouteName('OrderDetailsPage', routes);

  // Transaction is already created, but if the initial message
  // sending failed, we tell it to the OrderDetailsPage.
  dispatch(OrderPage.setInitialValues(initialValues));
};

const checkCouponCode = (coupon, currentUser) => {};

function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // init mutable ref container for callbacks

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb; // store current, passed callback in ref
    setState(state);
  }, []); // keep object reference stable, exactly like `useState`

  useEffect(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}

// TransactionInitPage handles data loading for Sale and Order views to transaction pages in Inbox.
export const TransactionInitPageComponent = props => {
  const {
    location,
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
    currentUserHasConnectionGuarantee,
  } = props;
  const scrollRef = useRef(null);
  const history = useHistory();
  const [showCreateListingPopup, setShowCreateListingPopup] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [validCouponCode, setValidCouponCode] = useState(null);

  const [showCreateListingDirectFlowPopup, setShowCreateListingDirectFlowPopup] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useStateCallback(location?.state?.selectedFlow);
  const [selectedListing, setSelectedListing] = useState(location?.state?.listing || null);
  const [message, setMessage] = useState(location?.state?.message || null);
  const [showConfirmActionModal, setShowConfirmActionModal] = useState(
    (!!location?.state?.listing && !currentUserHasConnectionGuarantee) || false
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [savedPaymentIntents, setSavedPaymentIntents] = useState(null);
  const [stripeFunction, setStripeFunction] = useState(null);
  const [submittingPlatformFee, setSubmittingPlatformFee] = useState(null);

  useEffect(() => {
    if (window) {
      loadInitialData();
    }
  }, []);

  useEffect(() => {
    if (couponCode === 'TEST') {
      setValidCouponCode(true);
    }
  }, [couponCode]);

  // useEffect(() => {
  //   if (!queryInProgress && !listings?.length && !showCreateListingPopup) {
  //     setShowCreateListingPopup(true);
  //   }
  // }, [queryInProgress, listings?.length, showCreateListingPopup]);

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

  const authorDisplayNameAsString = userDisplayNameAsString(currentAuthor, '');

  const currentTransaction = ensureTransaction(transaction);

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

  const fetchErrorMessage = 'TransactionInitPage.fetchOrderFailed';
  const loadingMessage = 'TransactionInitPage.loadingOrderData';

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

    const ensuredDefaultPaymentMethod = ensurePaymentMethodCard(
      ensuredStripeCustomer.defaultPaymentMethod
    );

    const hasDefaultPaymentMethod = !!(
      stripeCustomerFetched &&
      ensuredStripeCustomer.attributes.stripeCustomerId &&
      ensuredDefaultPaymentMethod.id
    );
    const stripePaymentMethodId = hasDefaultPaymentMethod
      ? ensuredDefaultPaymentMethod.attributes.stripePaymentMethodId
      : null;
    const paymentFlow = (selectedPaymentMethod, saveAfterOnetimePayment) => {
      // Payment mode could be 'replaceCard', but without explicit saveAfterOnetimePayment flag,
      // we'll handle it as one-time payment
      return selectedPaymentMethod === 'defaultCard'
        ? USE_SAVED_CARD
        : saveAfterOnetimePayment
        ? PAY_AND_SAVE_FOR_LATER_USE
        : ONETIME_PAYMENT;
    };
    const selectedPaymentFlow = paymentFlow(selectedPaymentMethod, saveAfterOnetimePayment);

    // Step 1: initiate order by requesting payment from Marketplace API
    const fnRequestPayment = fnParams => {
      // fnParams should be { listingId, bookingStart, bookingEnd }
      const hasPaymentIntents = savedPaymentIntents;

      // If paymentIntent exists, order has been initiated previously.
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
      // fnParams should be returned transaction entity

      const paymentIntent = fnParams;
      const { stripe, card, billingDetails } = handlePaymentParams;
      const stripeElementMaybe = selectedPaymentFlow !== USE_SAVED_CARD ? { card } : {};

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
      return fnParams.validCouponCode || hasPaymentIntentUserActionsDone
        ? Promise.resolve({
            paymentIntent,
          })
        : onConfirmCardPayment(params);
    };

    // // Step 3: CREATE A TRANSACTION
    // // Parameter should contain { paymentIntent, transactionId } returned in step 2
    const fnCreateTransactionObject = fnParams => {
      const paymentIntent = fnParams.paymentIntent;
      setSavedPaymentIntents(paymentIntent);

      const selectedListingIdMaybe =
        selectedFlow === DIRECT_FLOW && !selectedListing
          ? {}
          : { selectedListingId: selectedListing.id.uuid };

      return onCreateTransaction({
        listingId: listingId.uuid,
        protectedData: {
          contactingAs,
          ...selectedListingIdMaybe,
        },
      }).then(tx => {
        return { tx, paymentIntent };
      });
    };

    // Step 4: send initial message
    const fnSendMessage = fnParams => {
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
    const optionalPaymentParams =
      selectedPaymentFlow === USE_SAVED_CARD && hasDefaultPaymentMethod
        ? {
            paymentMethod: stripePaymentMethodId,
          }
        : selectedPaymentFlow === PAY_AND_SAVE_FOR_LATER_USE
        ? { setupPaymentMethodForSaving: true }
        : {};

    const orderParams = {
      ...optionalPaymentParams,
      validCouponCode,
    };

    return handlePaymentIntentCreation(orderParams);
  };

  const handleSubmitPlatformFee = (values = {}) => {
    if (submittingPlatformFee) {
      return;
    }
    setSubmittingPlatformFee(true);
    const { history, currentUser, dispatch } = props;
    const { card, paymentMethod, formValues, message: formMessage } = values;
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

    const messageParam = formMessage ? formMessage : message;

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
      message: messageParam,
      validCouponCode,
    };

    handlePaymentIntent(requestPaymentParams)
      .then(res => {
        const { orderId, messageSuccess, paymentMethodSaved } = res;
        setSubmittingPlatformFee(false);

        const routes = routeConfiguration();
        const initialMessageFailedToTransaction = !messageParam
          ? null
          : messageSuccess
          ? null
          : orderId;
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

  const handleSubmitWithConnectionGuarantee = () => {
    const { onSendMessage, onCreateTransaction, dispatch } = props;

    const handleSubmitGuarantee = handlePaymentParams => {
      const { message, validCouponCode } = handlePaymentParams;

      // // Step 1: CREATE A TRANSACTION
      const fnCreateTransactionObject = fnParams => {
        const selectedListingIdMaybe =
          selectedFlow === DIRECT_FLOW && !selectedListing
            ? {}
            : { selectedListingId: selectedListing.id.uuid };

        return onCreateTransaction({
          listingId: listingId.uuid,
          protectedData: {
            contactingAs,
            ...selectedListingIdMaybe,
          },
        }).then(tx => {
          return { tx };
        });
      };

      // Step 4: send initial message
      const fnSendMessage = fnParams => {
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

      const applyAsync = (acc, val) => acc.then(val);
      const composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));
      const handleTransactionCreation = composeAsync(fnCreateTransactionObject, fnSendMessage);

      const orderParams = { validCouponCode };

      return handleTransactionCreation(orderParams);
    };

    const messageParam = message;

    const requestPaymentParams = {
      message: messageParam,
      validCouponCode,
    };

    handleSubmitGuarantee(requestPaymentParams)
      .then(res => {
        const { orderId, messageSuccess } = res;
        const routes = routeConfiguration();
        const initialMessageFailedToTransaction = !messageParam
          ? null
          : messageSuccess
          ? null
          : orderId;
        const orderDetailsPath = pathByRouteName('OrderDetailsPage', routes, { id: orderId.uuid });
        const initialValues = {
          initialMessageFailedToTransaction,
          savePaymentMethodFailed: false,
        };

        initializeOrderPage(initialValues, routes, dispatch);
        history.push(orderDetailsPath);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const onSubmitEnquiry = values => {
    const { message } = values;

    setMessage(message);
    setEnquiryModalOpen(false);
    setShowCreateListingDirectFlowPopup(true);
  };

  const onSkipDirectFlow = () => {
    setShowCreateListingDirectFlowPopup(false);

    if (!currentUserHasConnectionGuarantee) {
      setShowConfirmActionModal(true);
    }
  };

  const showPaymentForm =
    isConfirmed &&
    (!!selectedListing || selectedFlow === DIRECT_FLOW) &&
    !currentUserHasConnectionGuarantee;
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

  const showGuaranteeSubmitFromReturn =
    !!location?.state?.listing && currentUserHasConnectionGuarantee;

  const shouldShowGuaranteeSubmitButton =
    selectedFlow !== SELECT_FLOW &&
    currentUserHasConnectionGuarantee &&
    (!!selectedListing || selectedFlow === DIRECT_FLOW);

  const guaranateeSubmitButton = shouldShowGuaranteeSubmitButton ? (
    <div className={css.guaranteeSubmitButton}>
      <PrimaryButton
        rootClassName={css.guaranteeSubmitButton}
        onClick={handleSubmitWithConnectionGuarantee}
      >
        Submit
      </PrimaryButton>
    </div>
  ) : null;

  const selectListing = (
    <>
      <h3 className={css.selectListingHeading}>
        Which {listingType === 'listing' ? 'advert' : 'listing'} would you like to present to the{' '}
        {listingType === 'listing' ? 'host' : 'renter'}?
      </h3>
      <select
        onChange={e => {
          const listingId = e.target.value;
          setSelectedListing(listings.find(l => l.id.uuid === listingId));
          scrollRef.current.scrollIntoView();
        }}
        className={css.selectListing}
        value={selectedListing ? selectedListing.id.uuid : ''}
      >
        <option disabled value="">
          Select {listingType === 'listing' ? 'An Advert' : 'A Listing'}
        </option>
        {listings?.map(l => {
          if (l.attributes.state !== 'published') return null;
          return (
            <option key={l.id.uuid} value={l.id.uuid}>
              {l.attributes.title}
            </option>
          );
        })}
      </select>
    </>
  );

  const paymentForm = showPaymentForm ? (
    validCouponCode ? (
      <button
        onClick={e => {
          e.preventDefault();
          handleSubmitPlatformFee();
        }}
      >
        Submit
      </button>
    ) : (
      <>
        <StripePaymentFormPlatformFee
          className={css.paymentForm}
          onSubmit={handleSubmitPlatformFee}
          inProgress={submittingPlatformFee}
          formId="TransactionInitPagePaymentForm"
          authorDisplayName={authorDisplayNameAsString}
          initialValues={initalValuesForStripePayment}
          initiateOrderError={null}
          confirmCardPaymentError={null}
          confirmPaymentError={null}
          hasHandledCardPayment={false}
          loadingData={false}
          defaultPaymentMethod={
            hasDefaultPaymentMethod ? currentUser.stripeCustomer.defaultPaymentMethod : null
          }
          paymentIntent={null}
          onStripeInitialized={onStripeInitialized}
          showInitialMessageInput={selectedFlow !== DIRECT_FLOW}
        />
      </>
    )
  ) : null;

  const couponCodeComp = showPaymentForm && (
    <input
      onChange={e => {
        const val = e.target.value;
        setCouponCode(val);
      }}
      type="text"
    />
  );

  // TransactionPanel is presentational component
  // that currently handles showing everything inside layout's main view area.
  const panel = isDataAvailable ? (
    <>
      <TransactionInitPanel
        pageLocation={location}
        history={history}
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
        listingType={listingType}
        guest={guest}
        host={host}
        contactingAs={contactingAs}
        enquiryModalOpen={enquiryModalOpen}
        setEnquiryModalOpen={setEnquiryModalOpen}
        onSubmitEnquiry={onSubmitEnquiry}
        selectedFlow={selectedFlow}
        setSelectedFlow={setSelectedFlow}
        showCreateListingDirectFlowPopup={showCreateListingDirectFlowPopup}
        setShowCreateListingDirectFlowPopup={setShowCreateListingDirectFlowPopup}
        onSkipDirectFlow={onSkipDirectFlow}
        message={message}
        showConfirmActionModal={showConfirmActionModal}
        setShowConfirmActionModal={setShowConfirmActionModal}
        setIsConfirmed={setIsConfirmed}
        isConfirmed={isConfirmed}
        setSelectedListing={setSelectedListing}
        currentUserHasConnectionGuarantee={currentUserHasConnectionGuarantee}
        guaranateeSubmitButton={guaranateeSubmitButton}
        onSubmitWithConnectionGuarantee={handleSubmitWithConnectionGuarantee}
      />
      <span ref={scrollRef}></span>
    </>
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
    queryInProgress,
  } = state.TransactionInitPage;
  const { currentPageResultIds } = state.ManageListingsPage;
  const { currentUser, currentUserHasConnectionGuarantee } = state.user;

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

    currentUserHasConnectionGuarantee,
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
