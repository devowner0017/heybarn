import { fetchRentalPayments, cancelRentalPayments, extendRentalPayments, updateSubscriptionPM } from '../util/api';
import { storableError } from '../util/errors';
import * as log from '../util/log';

// ================ Action types ================ //

export const STRIPE_ACCOUNT_CLEAR_ERROR = 'app/stripe/STRIPE_ACCOUNT_CLEAR_ERROR';

export const ACCOUNT_OPENER_CREATE_REQUEST = 'app/stripe/ACCOUNT_OPENER_CREATE_REQUEST';
export const ACCOUNT_OPENER_CREATE_SUCCESS = 'app/stripe/ACCOUNT_OPENER_CREATE_SUCCESS';
export const ACCOUNT_OPENER_CREATE_ERROR = 'app/stripe/ACCOUNT_OPENER_CREATE_ERROR';

export const PERSON_CREATE_REQUEST = 'app/stripe/PERSON_CREATE_REQUEST';
export const PERSON_CREATE_SUCCESS = 'app/stripe/PERSON_CREATE_SUCCESS';
export const PERSON_CREATE_ERROR = 'app/stripe/PERSON_CREATE_ERROR';

export const CLEAR_PAYMENT_TOKEN = 'app/stripe/CLEAR_PAYMENT_TOKEN';

export const HANDLE_CARD_PAYMENT_REQUEST = 'app/stripe/HANDLE_CARD_PAYMENT_REQUEST';
export const HANDLE_CARD_PAYMENT_SUCCESS = 'app/stripe/HANDLE_CARD_PAYMENT_SUCCESS';
export const HANDLE_CARD_PAYMENT_ERROR = 'app/stripe/HANDLE_CARD_PAYMENT_ERROR';

export const HANDLE_CARD_SETUP_REQUEST = 'app/stripe/HANDLE_CARD_SETUP_REQUEST';
export const HANDLE_CARD_SETUP_SUCCESS = 'app/stripe/HANDLE_CARD_SETUP_SUCCESS';
export const HANDLE_CARD_SETUP_ERROR = 'app/stripe/HANDLE_CARD_SETUP_ERROR';

export const CLEAR_HANDLE_CARD_PAYMENT = 'app/stripe/CLEAR_HANDLE_CARD_PAYMENT';

export const RETRIEVE_PAYMENT_INTENT_REQUEST = 'app/stripe/RETRIEVE_PAYMENT_INTENT_REQUEST';
export const RETRIEVE_PAYMENT_INTENT_SUCCESS = 'app/stripe/RETRIEVE_PAYMENT_INTENT_SUCCESS';
export const RETRIEVE_PAYMENT_INTENT_ERROR = 'app/stripe/RETRIEVE_PAYMENT_INTENT_ERROR';

export const FETCH_SUBSCRIPTION_REQUEST = 'app/stripe/FETCH_SUBSCRIPTION_REQUEST';
export const FETCH_SUBSCRIPTION_SUCCESS = 'app/stripe/FETCH_SUBSCRIPTION_SUCCESS';
export const FETCH_SUBSCRIPTION_ERROR = 'app/stripe/FETCH_SUBSCRIPTION_ERROR';

export const CANCEL_SUBSCRIPTION_REQUEST = 'app/stripe/CANCEL_SUBSCRIPTION_REQUEST';
export const CANCEL_SUBSCRIPTION_SUCCESS = 'app/stripe/CANCEL_SUBSCRIPTION_SUCCESS';
export const CANCEL_SUBSCRIPTION_ERROR = 'app/stripe/CANCEL_SUBSCRIPTION_ERROR';

export const EXTEND_SUBSCRIPTION_REQUEST = 'app/stripe/EXTEND_SUBSCRIPTION_REQUEST';
export const EXTEND_SUBSCRIPTION_SUCCESS = 'app/stripe/EXTEND_SUBSCRIPTION_SUCCESS';
export const EXTEND_SUBSCRIPTION_ERROR = 'app/stripe/EXTEND_SUBSCRIPTION_ERROR';

export const UPDATE_SUBSCRIPTION_PM_REQUEST = 'app/stripe/UPDATE_SUBSCRIPTION_PM_REQUEST';
export const UPDATE_SUBSCRIPTION_PM_SUCCESS = 'app/stripe/UPDATE_SUBSCRIPTION_PM_SUCCESS';
export const UPDATE_SUBSCRIPTION_PM_ERROR = 'app/stripe/UPDATE_SUBSCRIPTION_PM_ERROR';

// ================ Reducer ================ //

const initialState = {
  confirmCardPaymentInProgress: false,
  confirmCardPaymentError: null,
  handleCardSetupInProgress: false,
  handleCardSetupError: null,
  paymentIntent: null,
  setupIntent: null,
  retrievePaymentIntentInProgress: false,
  retrievePaymentIntentError: null,

  subscription: null,

  fetchSubscriptionInProgress: false,
  fetchSubscriptionError: null,

  cancelSubscriptionInProgress: false,
  cancelSubscriptionError: null,

  extendSubscriptionInProgress: false,
  extendSubscriptionError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case STRIPE_ACCOUNT_CLEAR_ERROR:
      return { ...initialState };

    case ACCOUNT_OPENER_CREATE_REQUEST:
      return {
        ...state,
        createAccountOpenerError: null,
        createAccountOpenerInProgress: true,
      };
    case ACCOUNT_OPENER_CREATE_SUCCESS:
      return { ...state, createAccountOpenerInProgress: false, personAccountOpener: payload };
    case ACCOUNT_OPENER_CREATE_ERROR:
      console.error(payload);
      return { ...state, createAccountOpenerError: payload, createAccountOpenerInProgress: false };

    case PERSON_CREATE_REQUEST:
      return {
        ...state,
        persons: [
          ...state.persons,
          {
            ...payload,
            createStripePersonError: null,
            createStripePersonInProgress: true,
          },
        ],
      };
    case PERSON_CREATE_SUCCESS:
      return {
        ...state,
        persons: state.persons.map(p => {
          return p.personToken === payload.personToken
            ? { ...payload, createStripePersonInProgress: false }
            : p;
        }),
      };
    case PERSON_CREATE_ERROR:
      console.error(payload);
      return {
        ...state,
        persons: state.persons.map(p => {
          return p.personToken === payload.personToken
            ? { ...p, createStripePersonInProgress: false, createStripePersonError: payload.error }
            : p;
        }),
      };

    case HANDLE_CARD_PAYMENT_REQUEST:
      return {
        ...state,
        confirmCardPaymentError: null,
        confirmCardPaymentInProgress: true,
      };
    case HANDLE_CARD_PAYMENT_SUCCESS:
      return { ...state, paymentIntent: payload, confirmCardPaymentInProgress: false };
    case HANDLE_CARD_PAYMENT_ERROR:
      console.error(payload);
      return { ...state, confirmCardPaymentError: payload, confirmCardPaymentInProgress: false };

    case HANDLE_CARD_SETUP_REQUEST:
      return {
        ...state,
        handleCardSetupError: null,
        handleCardSetupInProgress: true,
      };
    case HANDLE_CARD_SETUP_SUCCESS:
      return { ...state, setupIntent: payload, handleCardSetupInProgress: false };
    case HANDLE_CARD_SETUP_ERROR:
      console.error(payload);
      return { ...state, handleCardSetupError: payload, handleCardSetupInProgress: false };

    case CLEAR_HANDLE_CARD_PAYMENT:
      return {
        ...state,
        confirmCardPaymentInProgress: false,
        confirmCardPaymentError: null,
        paymentIntent: null,
      };

    case RETRIEVE_PAYMENT_INTENT_REQUEST:
      return {
        ...state,
        retrievePaymentIntentError: null,
        retrievePaymentIntentInProgress: true,
      };
    case RETRIEVE_PAYMENT_INTENT_SUCCESS:
      return { ...state, paymentIntent: payload, retrievePaymentIntentInProgress: false };
    case RETRIEVE_PAYMENT_INTENT_ERROR:
      console.error(payload);
      return {
        ...state,
        retrievePaymentIntentError: payload,
        retrievePaymentIntentInProgress: false,
      };

    case FETCH_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        fetchSubscriptionError: null,
        fetchSubscriptionInProgress: true,
      };
    case FETCH_SUBSCRIPTION_SUCCESS:
      return { ...state, subscription: payload, fetchSubscriptionInProgress: false };
    case FETCH_SUBSCRIPTION_ERROR:
      console.error(payload);
      return {
        ...state,
        fetchSubscriptionError: payload,
        fetchSubscriptionInProgress: false,
      };

    case CANCEL_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        cancelSubscriptionError: null,
        cancelSubscriptionInProgress: true,
      };
    case CANCEL_SUBSCRIPTION_SUCCESS:
      return { ...state, subscription: payload, cancelSubscriptionInProgress: false };
    case CANCEL_SUBSCRIPTION_ERROR:
      console.error(payload);
      return {
        ...state,
        cancelSubscriptionError: payload,
        cancelSubscriptionInProgress: false,
      };

      case EXTEND_SUBSCRIPTION_REQUEST:
        return {
          ...state,
          extendSubscriptionError: null,
          extendSubscriptionInProgress: true,
        };
      case EXTEND_SUBSCRIPTION_SUCCESS:
        return { ...state, subscription: payload, extendSubscriptionInProgress: false };
      case EXTEND_SUBSCRIPTION_ERROR:
        console.error(payload);
        return {
          ...state,
          extendSubscriptionError: payload,
          extendSubscriptionInProgress: false,
        };

        case UPDATE_SUBSCRIPTION_PM_REQUEST:
          return {
            ...state,
            updateSubscriptionPaymentMethodError: null,
            updateSubscriptionPaymentMethodInProgress: true,
          };
        case UPDATE_SUBSCRIPTION_PM_SUCCESS:
          return { ...state, subscription: payload, updateSubscriptionPaymentMethodInProgress: false };
        case UPDATE_SUBSCRIPTION_PM_ERROR:
          console.error(payload);
          return {
            ...state,
            updateSubscriptionPaymentMethodError: payload,
            updateSubscriptionPaymentMethodInProgress: false,
          };

    default:
      return state;
  }
}

// ================ Action creators ================ //

export const stripeAccountClearError = () => ({
  type: STRIPE_ACCOUNT_CLEAR_ERROR,
});

export const confirmCardPaymentRequest = () => ({
  type: HANDLE_CARD_PAYMENT_REQUEST,
});

export const confirmCardPaymentSuccess = payload => ({
  type: HANDLE_CARD_PAYMENT_SUCCESS,
  payload,
});

export const confirmCardPaymentError = payload => ({
  type: HANDLE_CARD_PAYMENT_ERROR,
  payload,
  error: true,
});

export const handleCardSetupRequest = () => ({
  type: HANDLE_CARD_SETUP_REQUEST,
});

export const handleCardSetupSuccess = payload => ({
  type: HANDLE_CARD_SETUP_SUCCESS,
  payload,
});

export const handleCardSetupError = payload => ({
  type: HANDLE_CARD_SETUP_ERROR,
  payload,
  error: true,
});

export const initializeCardPaymentData = () => ({
  type: CLEAR_HANDLE_CARD_PAYMENT,
});

export const retrievePaymentIntentRequest = () => ({
  type: RETRIEVE_PAYMENT_INTENT_REQUEST,
});

export const retrievePaymentIntentSuccess = payload => ({
  type: RETRIEVE_PAYMENT_INTENT_SUCCESS,
  payload,
});

export const retrievePaymentIntentError = payload => ({
  type: RETRIEVE_PAYMENT_INTENT_ERROR,
  payload,
  error: true,
});

export const fetchSubscriptionRequest = () => ({
  type: FETCH_SUBSCRIPTION_REQUEST,
});

export const fetchSubscriptionSuccess = payload => ({
  type: FETCH_SUBSCRIPTION_SUCCESS,
  payload,
});

export const fetchSubscriptionError = payload => ({
  type: FETCH_SUBSCRIPTION_ERROR,
  payload,
  error: true,
});

export const cancelSubscriptionRequest = () => ({
  type: CANCEL_SUBSCRIPTION_REQUEST,
});

export const cancelSubscriptionSuccess = payload => ({
  type: CANCEL_SUBSCRIPTION_SUCCESS,
  payload,
});

export const cancelSubscriptionError = payload => ({
  type: CANCEL_SUBSCRIPTION_ERROR,
  payload,
  error: true,
});

export const extendSubscriptionRequest = () => ({
  type: EXTEND_SUBSCRIPTION_REQUEST,
});

export const extendSubscriptionSuccess = payload => ({
  type: EXTEND_SUBSCRIPTION_SUCCESS,
  payload,
});

export const extendSubscriptionError = payload => ({
  type: EXTEND_SUBSCRIPTION_ERROR,
  payload,
  error: true,
});

export const updateSubscriptionPaymentMethodRequest = () => ({
  type: UPDATE_SUBSCRIPTION_PM_REQUEST,
});

export const updateSubscriptionPaymentMethodSuccess = payload => ({
  type: UPDATE_SUBSCRIPTION_PM_SUCCESS,
  payload,
});

export const updateSubscriptionPaymentMethodError = payload => ({
  type: UPDATE_SUBSCRIPTION_PM_ERROR,
  payload,
  error: true,
});

// ================ Thunks ================ //

export const retrievePaymentIntent = params => dispatch => {
  const { stripe, stripePaymentIntentClientSecret } = params;
  dispatch(retrievePaymentIntentRequest());

  return stripe
    .retrievePaymentIntent(stripePaymentIntentClientSecret)
    .then(response => {
      if (response.error) {
        return Promise.reject(response);
      } else {
        dispatch(retrievePaymentIntentSuccess(response.paymentIntent));
        return response;
      }
    })
    .catch(err => {
      // Unwrap Stripe error.
      const e = err.error || storableError(err);
      dispatch(retrievePaymentIntentError(e));

      // Log error
      const { code, doc_url, message, payment_intent } = err.error || {};
      const loggableError = err.error
        ? {
            code,
            message,
            doc_url,
            paymentIntentStatus: payment_intent
              ? payment_intent.status
              : 'no payment_intent included',
          }
        : e;
      log.error(loggableError, 'stripe-retrieve-payment-intent-failed', {
        stripeMessage: loggableError.message,
      });
      throw err;
    });
};

export const fetchSubscription = params => dispatch => {
console.log("🚀 | file: stripe.duck.js | line 361 | params", params);
  dispatch(fetchSubscriptionRequest());

  return fetchRentalPayments(params)
    .then(response => {
      console.log('🚀 | file: stripe.duck.js | line 287 | response', response);
      if (response.error) {
        return Promise.reject(response);
      } else {
        dispatch(fetchSubscriptionSuccess(response));
        fetchSubscription({ subId: response.id })
        return response;
      }
    })
    .catch(err => {
      // Unwrap Stripe error.
      const e = err.error || storableError(err);
      dispatch(fetchSubscriptionError(e));

      log.error(e, 'stripe-fetch-subscription-failed');
    });
};

export const cancelSubscription = params => dispatch => {
  dispatch(cancelSubscriptionRequest());

  return cancelRentalPayments(params)
    .then(response => {
      console.log('🚀 | file: stripe.duck.js | line 287 | response', response);
      if (response.error) {
        return Promise.reject(response);
      } else {
        dispatch(cancelSubscriptionSuccess(response));
        return response;
      }
    })
    .catch(err => {
      // Unwrap Stripe error.
      const e = err.error || storableError(err);
      dispatch(cancelSubscriptionError(e));

      log.error(e, 'stripe-cancel-subscription-failed');
    });
};

export const extendSubscription = params => dispatch => {
  dispatch(extendSubscriptionRequest());
  console.log('🚀 | file: stripe.duck.js | line 411 | params', params);
  return extendRentalPayments(params)
    .then(response => {
      console.log('🚀 | file: stripe.duck.js | line 287 | response', response);
      if (response.error) {
        return Promise.reject(response);
      } else {
        dispatch(extendSubscriptionSuccess(response));
        fetchSubscription({ subId: response.id })
        return response;
      }
    })
    .catch(err => {
      // Unwrap Stripe error.
      const e = err.error || storableError(err);
      dispatch(extendSubscriptionError(e));

      log.error(e, 'stripe-extend-subscription-failed');
    });
};

export const updateSubscriptionPaymentMethod = params => dispatch => {
  dispatch(updateSubscriptionPaymentMethodRequest());
  console.log('🚀 | file: stripe.duck.js | line 411 | params', params);
  return updateSubscriptionPM(params)
    .then(response => {
      console.log('🚀 | file: stripe.duck.js | line 287 | response', response);
      if (response.error) {
        return Promise.reject(response);
      } else {
        dispatch(updateSubscriptionPaymentMethodSuccess(response));
        fetchSubscription({ subId: response.id })
        return response;
      }
    })
    .catch(err => {
      // Unwrap Stripe error.
      const e = err.error || storableError(err);
      dispatch(updateSubscriptionPaymentMethodError(e));

      log.error(e, 'update-subs-payment-method-failed');
    });
};

export const confirmCardPayment = params => dispatch => {
  console.log('🚀 | file: stripe.duck.js | line 244 | params', params);
  // It's required to use the same instance of Stripe as where the card has been created
  // so that's why Stripe needs to be passed here and we can't create a new instance.
  const { stripe, paymentParams, stripePaymentIntentClientSecret } = params;

  dispatch(confirmCardPaymentRequest());

  // When using default payment method paymentParams.payment_method is
  // already set Flex API side, when request-payment transition is made
  // so there's no need for paymentParams
  const args = paymentParams
    ? [stripePaymentIntentClientSecret, paymentParams]
    : [stripePaymentIntentClientSecret];

  return stripe
    .confirmCardPayment(...args)
    .then(response => {
      console.log('🚀 | file: stripe.duck.js | line 261 | response', response);
      if (response.error) {
        return Promise.reject(response);
      } else {
        dispatch(confirmCardPaymentSuccess(response));
        return { ...response };
      }
    })
    .catch(err => {
      // Unwrap Stripe error.
      const e = err.error || storableError(err);
      dispatch(confirmCardPaymentError(e));

      // Log error
      const containsPaymentIntent = err.error && err.error.payment_intent;
      const { code, doc_url, message, payment_intent } = containsPaymentIntent ? err.error : {};
      const loggableError = containsPaymentIntent
        ? {
            code,
            message,
            doc_url,
            paymentIntentStatus: payment_intent.status,
          }
        : e;
      log.error(loggableError, 'stripe-handle-card-payment-failed', {
        stripeMessage: loggableError.message,
      });
      throw e;
    });
};

export const handleCardSetup = params => dispatch => {
  // It's required to use the same instance of Stripe as where the card has been created
  // so that's why Stripe needs to be passed here and we can't create a new instance.
  const { stripe, card, setupIntentClientSecret, paymentParams } = params;

  dispatch(handleCardSetupRequest());

  return stripe
    .handleCardSetup(setupIntentClientSecret, card, paymentParams)
    .then(response => {
      if (response.error) {
        return Promise.reject(response);
      } else {
        dispatch(handleCardSetupSuccess(response));
        return response;
      }
    })
    .catch(err => {
      // Unwrap Stripe error.
      const e = err.error || storableError(err);
      dispatch(handleCardSetupError(e));

      // Log error
      const containsSetupIntent = err.error && err.error.setup_intent;
      const { code, doc_url, message, setup_intent } = containsSetupIntent ? err.error : {};
      const loggableError = containsSetupIntent
        ? {
            code,
            message,
            doc_url,
            paymentIntentStatus: setup_intent.status,
          }
        : e;
      log.error(loggableError, 'stripe-handle-card-setup-failed', {
        stripeMessage: loggableError.message,
      });
      throw e;
    });
};
