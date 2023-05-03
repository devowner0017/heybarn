import { ensureTransaction } from './data';
import { getPropByName } from './devHelpers';

/**
 * Transitions
 *
 * These strings must sync with values defined in Flex API,
 * since transaction objects given by API contain info about last transitions.
 * All the actions in API side happen in transitions,
 * so we need to understand what those strings mean.
 */

// When a customer makes a booking to a listing, a transaction is
// created with the initial request-payment transition.
// At this transition a PaymentIntent is created by Marketplace API.
// After this transition, the actual payment must be made on client-side directly to Stripe.
export const TRANSITION_HOST_FEE_PAID = 'transition/host-fee-paid';
export const TRANSITION_RENTER_FEE_PAID = 'transition/renter-fee-paid';
export const TRANSITION_EXPIRE_HOST_ENQUIRY = 'transition/expire-host-enquiry';
export const TRANSITION_EXPIRE_RENTER_ENQUIRY = 'transition/expire-renter-enquiry';
export const TRANSITION_HOST_APPROVED_BY_RENTER = 'transition/host-approved-by-renter';
export const TRANSITION_HOST_ACCEPTS_COMMUNICATION = 'transition/host-accepts-communication';
export const TRANSITION_HOST_DECLINES_COMMUNICATION = 'transition/host-declines-communication';
export const TRANSITION_RENTER_ACCEPTS_COMMUNICATION = 'transition/renter-accepts-communication';
export const TRANSITION_RENTER_DECLINES_COMMUNICATION = 'transition/renter-declines-communication';
export const TRANSITION_HOST_SENDS_AGREEMENT = 'transition/host-sends-agreement';
export const TRANSITION_HOST_SENDS_AGREEMENT_AFTER_REQUEST =
  'transition/host-sends-agreement-after-request';
export const TRANSITION_RENTER_REQUESTS_AGREEMENT = 'transition/renter-requests-agreement';
export const TRANSITION_HOST_CANCELS_DURING_RAD = 'transition/host-cancels-during-rad';
export const TRANSITION_RENTER_CANCELS_DURING_RAD = 'transition/renter-cancels-during-rad';
export const TRANSITION_HOST_CANCELS_AFTER_REQUEST = 'transition/host-cancels-after-request';
export const TRANSITION_RENTER_CANCELS_AFTER_REQUEST = 'transition/renter-cancels-after-request';
export const TRANSITION_OPERATOR_CANCELS_DURING_RAD = 'transition/operator-cancels-during-rad';
export const TRANSITION_OPERATOR_CANCELS_AFTER_REQUEST = 'transition/operator-cancels-during-rad';
export const TRANSITION_HOST_CANCELS_AFTER_CONTRACT_START =
  'transition/host-cancels-after-contract-start';
export const TRANSITION_RENTER_CANCELS_AFTER_CONTRACT_START =
  'transition/renter-cancels-after-contract-start';

export const TRANSITION_RENTER_SIGNS_RENTAL_AGREEMENT = 'transition/renter-signs-rental-agreement';
export const TRANSITION_HOST_CANCELS_AFTER_AGREEMENT_SENT =
  'transition/host-cancels-after-agreement-sent';
export const TRANSITION_RENTER_CANCELS_AFTER_AGREEMENT_SENT =
  'transition/renter-cancels-after-agreement-sent';
export const TRANSITION_OPERATOR_CANCELS_AFTER_AGREEMENT_SENT =
  'transition/operator-cancels-after-agreement-sent';
export const TRANSITION_OPERATOR_CONFIRMS_RENTAL_AGREEMENT =
  'transition/operator-confirms-rental-agreement';

export const TRANSITION_REQUEST_PAYMENT = 'transition/request-payment';

// Stripe SDK might need to ask 3D security from customer, in a separate front-end step.
// Therefore we need to make another transition to Marketplace API,
// to tell that the payment is confirmed.
export const TRANSITION_CONFIRM_PAYMENT = 'transition/confirm-payment';

// The backend will mark the transaction completed.
export const TRANSITION_COMPLETE = 'transition/complete';

// A customer can also initiate a transaction with an enquiry, and
// then transition that with a request.
export const TRANSITION_ENQUIRE = 'transition/enquire';
export const TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY = 'transition/request-payment-after-enquiry';

// If the payment is not confirmed in the time limit set in transaction process (by default 15min)
// the transaction will expire automatically.
export const TRANSITION_EXPIRE_PAYMENT = 'transition/expire-payment';

// When the provider accepts or declines a transaction from the
// SalePage, it is transitioned with the accept or decline transition.
export const TRANSITION_ACCEPT = 'transition/accept';
export const TRANSITION_DECLINE = 'transition/decline';

// The backend automatically expire the transaction.
export const TRANSITION_EXPIRE = 'transition/expire';

// Admin can also cancel the transition.
export const TRANSITION_CANCEL = 'transition/cancel';

// Reviews are given through transaction transitions. Review 1 can be
// by provider or customer, and review 2 will be the other party of
// the transaction.
export const TRANSITION_REVIEW_1_BY_PROVIDER = 'transition/review-1-by-provider';
export const TRANSITION_REVIEW_2_BY_PROVIDER = 'transition/review-2-by-provider';
export const TRANSITION_REVIEW_1_BY_CUSTOMER = 'transition/review-1-by-customer';
export const TRANSITION_REVIEW_2_BY_CUSTOMER = 'transition/review-2-by-customer';
export const TRANSITION_EXPIRE_CUSTOMER_REVIEW_PERIOD = 'transition/expire-customer-review-period';
export const TRANSITION_EXPIRE_PROVIDER_REVIEW_PERIOD = 'transition/expire-provider-review-period';
export const TRANSITION_EXPIRE_REVIEW_PERIOD = 'transition/expire-review-period';

// RENTER RED DOTS
const ORDER_NOTIFICATION_TRANSITIONS = [
  TRANSITION_HOST_FEE_PAID,
  TRANSITION_RENTER_FEE_PAID,
  'transition/host-sends-agreement',
  'transition/host-sends-agreement-after-request',
  'transition/renter-signs-rental-agreement',
];
// HOST RED DOTS
const SALE_NOTIFICATION_TRANSITIONS = [
  'transition/renter-fee-paid',
  'transition/host-accepts-communication',
  'transition/renter-requests-agreement',
];
export const ACTIVE_TRANSITIONS = [
  TRANSITION_CONFIRM_PAYMENT,
  TRANSITION_RENTER_ACCEPTS_COMMUNICATION,
  TRANSITION_HOST_FEE_PAID,
  TRANSITION_RENTER_FEE_PAID,
  TRANSITION_HOST_APPROVED_BY_RENTER,
  TRANSITION_HOST_ACCEPTS_COMMUNICATION,
  TRANSITION_RENTER_ACCEPTS_COMMUNICATION,
  TRANSITION_HOST_SENDS_AGREEMENT,
  TRANSITION_RENTER_REQUESTS_AGREEMENT,
  TRANSITION_RENTER_SIGNS_RENTAL_AGREEMENT,
  TRANSITION_REQUEST_PAYMENT,
  TRANSITION_CONFIRM_PAYMENT,
  TRANSITION_COMPLETE,
  TRANSITION_ENQUIRE,
  TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY,
];
/**
 *
 *
 * Actors
 *
 * There are 4 different actors that might initiate transitions:
 */

// Roles of actors that perform transaction transitions
export const TX_TRANSITION_ACTOR_CUSTOMER = 'customer';
export const TX_TRANSITION_ACTOR_PROVIDER = 'provider';
export const TX_TRANSITION_ACTOR_SYSTEM = 'system';
export const TX_TRANSITION_ACTOR_OPERATOR = 'operator';

export const TX_TRANSITION_ACTORS = [
  TX_TRANSITION_ACTOR_CUSTOMER,
  TX_TRANSITION_ACTOR_PROVIDER,
  TX_TRANSITION_ACTOR_SYSTEM,
  TX_TRANSITION_ACTOR_OPERATOR,
];

/**
 * States
 *
 * These constants are only for making it clear how transitions work together.
 * You should not use these constants outside of this file.
 *
 * Note: these states are not in sync with states used transaction process definitions
 *       in Marketplace API. Only last transitions are passed along transaction object.
 */
const STATE_INITIAL = 'initial';

const STATE_HOST_ENQUIRED = 'host-enquired';
const STATE_RENTER_ENQUIRED = 'renter-enquired';
const STATE_HOST_DECLINED_COMMUNICATION = 'host-declined-communication';
const STATE_RENTER_DECLINED_COMMUNICATION = 'renter-declined-communication';
const STATE_REVERSED_TRANSACTION_FLOW = 'reversed-transaction-flow';
const STATE_RENTAL_AGREEMENT_DISCUSSION = 'rental-agreement-discussion';
const STATE_CANCELLED_DURING_RAD = 'cancelled-during-rad';
const STATE_RENTAL_AGREEMENT_SENT = 'rental-agreement-sent';
const STATE_RENTAL_AGREEMENT_REQUESTED = 'rental-agreement-requested';
const STATE_CANCELLED_AFTER_AGREEMENT_SENT = 'cancelled-after-agreement-sent';
const STATE_RENTAL_AGREEMENT_FINALIZED = 'rental-agreement-finalized';
const STATE_PENDING_PAYMENT = 'pending-payment';
const STATE_PREAUTHORIZED = 'preauthorized';
const STATE_DELIVERED = 'delivered';

const STATE_PAYMENT_EXPIRED = 'payment-expired';
const STATE_ENQUIRY = 'enquiry';
const STATE_DECLINED = 'declined';
const STATE_ACCEPTED = 'accepted';
const STATE_CANCELED = 'canceled';
const STATE_REVIEWED = 'reviewed';
const STATE_REVIEWED_BY_CUSTOMER = 'reviewed-by-customer';
const STATE_REVIEWED_BY_PROVIDER = 'reviewed-by-provider';
const STATE_ENQUIRY_EXPIRED = 'enquiry-expired';

/**
 * Description of transaction process
 *
 * You should keep this in sync with transaction process defined in Marketplace API
 *
 * Note: we don't use yet any state machine library,
 *       but this description format is following Xstate (FSM library)
 *       https://xstate.js.org/docs/
 */
const stateDescription = {
  // id is defined only to support Xstate format.
  // However if you have multiple transaction processes defined,
  // it is best to keep them in sync with transaction process aliases.
  id: 'flex-default-process/release-1',

  // This 'initial' state is a starting point for new transaction
  initial: STATE_INITIAL,

  // States
  states: {
    [STATE_INITIAL]: {
      on: {
        [TRANSITION_HOST_FEE_PAID]: STATE_HOST_ENQUIRED,
        [TRANSITION_RENTER_FEE_PAID]: STATE_RENTER_ENQUIRED,
        [TRANSITION_HOST_APPROVED_BY_RENTER]: STATE_RENTAL_AGREEMENT_DISCUSSION,
      },
    },

    [STATE_RENTER_ENQUIRED]: {
      on: {
        [TRANSITION_HOST_ACCEPTS_COMMUNICATION]: STATE_RENTAL_AGREEMENT_DISCUSSION,
        [TRANSITION_HOST_DECLINES_COMMUNICATION]: STATE_HOST_DECLINED_COMMUNICATION,
        [TRANSITION_EXPIRE_RENTER_ENQUIRY]: STATE_ENQUIRY_EXPIRED,
      },
    },

    [STATE_HOST_ENQUIRED]: {
      on: {
        [TRANSITION_RENTER_ACCEPTS_COMMUNICATION]: STATE_REVERSED_TRANSACTION_FLOW,
        [TRANSITION_RENTER_DECLINES_COMMUNICATION]: STATE_RENTER_DECLINED_COMMUNICATION,
        [TRANSITION_EXPIRE_HOST_ENQUIRY]: STATE_ENQUIRY_EXPIRED,
      },
    },

    [STATE_ENQUIRY_EXPIRED]: {},

    [STATE_RENTER_DECLINED_COMMUNICATION]: {},
    [STATE_HOST_DECLINED_COMMUNICATION]: {},
    [STATE_REVERSED_TRANSACTION_FLOW]: {},

    [STATE_RENTAL_AGREEMENT_DISCUSSION]: {
      on: {
        [TRANSITION_HOST_SENDS_AGREEMENT]: STATE_RENTAL_AGREEMENT_SENT,
        [TRANSITION_RENTER_REQUESTS_AGREEMENT]: STATE_RENTAL_AGREEMENT_REQUESTED,
        [TRANSITION_HOST_CANCELS_DURING_RAD]: STATE_CANCELLED_DURING_RAD,
        [TRANSITION_RENTER_CANCELS_DURING_RAD]: STATE_CANCELLED_DURING_RAD,
        [TRANSITION_OPERATOR_CANCELS_DURING_RAD]: STATE_CANCELLED_DURING_RAD,
      },
    },
    [STATE_RENTAL_AGREEMENT_REQUESTED]: {
      on: {
        [TRANSITION_HOST_SENDS_AGREEMENT_AFTER_REQUEST]: STATE_RENTAL_AGREEMENT_SENT,
        [TRANSITION_HOST_CANCELS_AFTER_REQUEST]: STATE_CANCELLED_DURING_RAD,
        [TRANSITION_RENTER_CANCELS_AFTER_REQUEST]: STATE_CANCELLED_DURING_RAD,
        [TRANSITION_OPERATOR_CANCELS_AFTER_REQUEST]: STATE_CANCELLED_DURING_RAD,
      },
    },

    [STATE_CANCELLED_DURING_RAD]: {},

    [STATE_RENTAL_AGREEMENT_SENT]: {
      on: {
        [TRANSITION_RENTER_SIGNS_RENTAL_AGREEMENT]: STATE_RENTAL_AGREEMENT_FINALIZED,
        [TRANSITION_HOST_CANCELS_AFTER_AGREEMENT_SENT]: STATE_CANCELLED_AFTER_AGREEMENT_SENT,
        [TRANSITION_RENTER_CANCELS_AFTER_AGREEMENT_SENT]: STATE_CANCELLED_AFTER_AGREEMENT_SENT,
        [TRANSITION_OPERATOR_CANCELS_AFTER_AGREEMENT_SENT]: STATE_CANCELLED_AFTER_AGREEMENT_SENT,
        [TRANSITION_OPERATOR_CONFIRMS_RENTAL_AGREEMENT]: STATE_RENTAL_AGREEMENT_FINALIZED,
      },
    },

    [STATE_CANCELLED_AFTER_AGREEMENT_SENT]: {},

    [STATE_RENTAL_AGREEMENT_FINALIZED]: {
      on: {
        [TRANSITION_REQUEST_PAYMENT]: STATE_PENDING_PAYMENT,
      },
    },

    [STATE_PENDING_PAYMENT]: {
      on: {
        [TRANSITION_EXPIRE_PAYMENT]: STATE_PAYMENT_EXPIRED,
        [TRANSITION_CONFIRM_PAYMENT]: STATE_PREAUTHORIZED,
      },
    },

    [STATE_PAYMENT_EXPIRED]: {},

    [STATE_PREAUTHORIZED]: {
      on: {
        [TRANSITION_COMPLETE]: STATE_DELIVERED,
        [TRANSITION_HOST_CANCELS_AFTER_CONTRACT_START]: STATE_DELIVERED,
      },
    },

    [STATE_DELIVERED]: {
      on: {
        [TRANSITION_EXPIRE_REVIEW_PERIOD]: STATE_REVIEWED,
        [TRANSITION_REVIEW_1_BY_CUSTOMER]: STATE_REVIEWED_BY_CUSTOMER,
        [TRANSITION_REVIEW_1_BY_PROVIDER]: STATE_REVIEWED_BY_PROVIDER,
      },
    },

    [STATE_REVIEWED_BY_CUSTOMER]: {
      on: {
        [TRANSITION_REVIEW_2_BY_PROVIDER]: STATE_REVIEWED,
        [TRANSITION_EXPIRE_PROVIDER_REVIEW_PERIOD]: STATE_REVIEWED,
      },
    },
    [STATE_REVIEWED_BY_PROVIDER]: {
      on: {
        [TRANSITION_REVIEW_2_BY_CUSTOMER]: STATE_REVIEWED,
        [TRANSITION_EXPIRE_CUSTOMER_REVIEW_PERIOD]: STATE_REVIEWED,
      },
    },
    [STATE_REVIEWED]: { type: 'final' },
  },
};

// Note: currently we assume that state description doesn't contain nested states.
const statesFromStateDescription = description => description.states || {};

// Get all the transitions from states object in an array
const getTransitions = states => {
  const stateNames = Object.keys(states);

  const transitionsReducer = (transitionArray, name) => {
    const stateTransitions = states[name] && states[name].on;
    const transitionKeys = stateTransitions ? Object.keys(stateTransitions) : [];
    return [
      ...transitionArray,
      ...transitionKeys.map(key => ({ key, value: stateTransitions[key] })),
    ];
  };

  return stateNames.reduce(transitionsReducer, []);
};

// This is a list of all the transitions that this app should be able to handle.
export const TRANSITIONS = getTransitions(statesFromStateDescription(stateDescription)).map(
  t => t.key
);

// This function returns a function that has given stateDesc in scope chain.
const getTransitionsToStateFn = stateDesc => state =>
  getTransitions(statesFromStateDescription(stateDesc))
    .filter(t => t.value === state)
    .map(t => t.key);

// Get all the transitions that lead to specified state.
const getTransitionsToState = getTransitionsToStateFn(stateDescription);

// This is needed to fetch transactions that need response from provider.
// I.e. transactions which provider needs to accept or decline
export const transitionsToRequested = getTransitionsToState(STATE_PREAUTHORIZED);

/**
 * Helper functions to figure out if transaction is in a specific state.
 * State is based on lastTransition given by transaction object and state description.
 */

const txLastTransition = tx => ensureTransaction(tx).attributes.lastTransition;

export const txIsHostEnquired = tx =>
  getTransitionsToState(STATE_HOST_ENQUIRED).includes(txLastTransition(tx));

export const txIsRenterEnquired = tx => {
  return getTransitionsToState(STATE_RENTER_ENQUIRED).includes(txLastTransition(tx));
};

export const txIsEnquiryExpired = tx =>
  getTransitionsToState(STATE_ENQUIRY_EXPIRED).includes(txLastTransition(tx));

export const txHasHostDeclined = tx =>
  getTransitionsToState(STATE_HOST_DECLINED_COMMUNICATION).includes(txLastTransition(tx));

export const txHasRenterDeclined = tx =>
  getTransitionsToState(STATE_RENTER_DECLINED_COMMUNICATION).includes(txLastTransition(tx));

export const txIsRentalAgreementDiscussion = tx =>
  getTransitionsToState(STATE_RENTAL_AGREEMENT_DISCUSSION).includes(txLastTransition(tx)) ||
  ['transition/host-approved-by-renter'].includes(txLastTransition(tx));

export const txIsRentalAgreementRequested = tx =>
  getTransitionsToState(STATE_RENTAL_AGREEMENT_REQUESTED).includes(txLastTransition(tx));

export const txIsReversedTransactionFlow = tx =>
  getTransitionsToState(STATE_REVERSED_TRANSACTION_FLOW).includes(txLastTransition(tx));

export const txIsCancelledDuringRad = tx =>
  getTransitionsToState(STATE_CANCELLED_DURING_RAD).includes(txLastTransition(tx));

export const txIsRentalAgreementSent = tx =>
  getTransitionsToState(STATE_RENTAL_AGREEMENT_SENT).includes(txLastTransition(tx));

export const txIsCancelledAfterAgreementSent = tx =>
  getTransitionsToState(STATE_CANCELLED_AFTER_AGREEMENT_SENT).includes(txLastTransition(tx));

export const txIsRentalAgreementSigned = tx =>
  getTransitionsToState(STATE_RENTAL_AGREEMENT_FINALIZED).includes(txLastTransition(tx));

export const txIsPaymentPending = tx =>
  getTransitionsToState(STATE_PENDING_PAYMENT).includes(txLastTransition(tx));

export const txNeedsNotificationSale = tx =>
  SALE_NOTIFICATION_TRANSITIONS.includes(txLastTransition(tx));
export const txNeedsNotificationOrder = tx =>
  ORDER_NOTIFICATION_TRANSITIONS.includes(txLastTransition(tx));
// Note: state name used in Marketplace API docs (and here) is actually preauthorized
// However, word "requested" is used in many places so that we decided to keep it.
export const txIsRequested = tx =>
  getTransitionsToState(STATE_PREAUTHORIZED).includes(txLastTransition(tx));
// Note: state name used in Marketplace API docs (and here) is actually preauthorized
// However, word "requested" is used in many places so that we decided to keep it.
export const txIsPaid = tx =>
  getTransitionsToState(STATE_PREAUTHORIZED).includes(txLastTransition(tx));
export const wasCancelled = tx => {
  const cancelledAgreement = getPropByName(tx, 'agreementCancelled');
  return !!cancelledAgreement;
};
export const wasExtended = tx => {
  const extendedAgreement = getPropByName(tx, 'agreementExtended');
  return !!extendedAgreement;
};
export const txIsDelivered = tx =>
  getTransitionsToState(STATE_DELIVERED).includes(txLastTransition(tx));

const firstReviewTransitions = [
  ...getTransitionsToState(STATE_REVIEWED_BY_CUSTOMER),
  ...getTransitionsToState(STATE_REVIEWED_BY_PROVIDER),
];
export const txIsInFirstReview = tx => firstReviewTransitions.includes(txLastTransition(tx));

export const txIsInFirstReviewBy = (tx, isCustomer) =>
  isCustomer
    ? getTransitionsToState(STATE_REVIEWED_BY_CUSTOMER).includes(txLastTransition(tx))
    : getTransitionsToState(STATE_REVIEWED_BY_PROVIDER).includes(txLastTransition(tx));

export const txIsReviewed = tx =>
  getTransitionsToState(STATE_REVIEWED).includes(txLastTransition(tx));

// OLD

export const txIsEnquired = tx =>
  getTransitionsToState(STATE_ENQUIRY).includes(txLastTransition(tx));

export const txIsPaymentExpired = tx =>
  getTransitionsToState(STATE_PAYMENT_EXPIRED).includes(txLastTransition(tx));

export const txIsAccepted = tx =>
  getTransitionsToState(STATE_ACCEPTED).includes(txLastTransition(tx));

export const txIsDeclined = tx =>
  getTransitionsToState(STATE_DECLINED).includes(txLastTransition(tx));

export const txIsCanceled = tx =>
  getTransitionsToState(STATE_CANCELED).includes(txLastTransition(tx));

/**
 * Helper functions to figure out if transaction has passed a given state.
 * This is based on transitions history given by transaction object.
 */

const txTransitions = tx => ensureTransaction(tx).attributes.transitions || [];
const hasPassedTransition = (transitionName, tx) =>
  !!txTransitions(tx).find(t => t.transition === transitionName);

const hasPassedStateFn = state => tx =>
  getTransitionsToState(state).filter(t => hasPassedTransition(t, tx)).length > 0;

export const txHasBeenAccepted = hasPassedStateFn(STATE_ACCEPTED);
export const txHasBeenDelivered = hasPassedStateFn(STATE_DELIVERED);

/**
 * Other transaction related utility functions
 */

export const transitionIsReviewed = transition =>
  getTransitionsToState(STATE_REVIEWED).includes(transition);

export const transitionIsFirstReviewedBy = (transition, isCustomer) =>
  isCustomer
    ? getTransitionsToState(STATE_REVIEWED_BY_CUSTOMER).includes(transition)
    : getTransitionsToState(STATE_REVIEWED_BY_PROVIDER).includes(transition);

export const getReview1Transition = isCustomer =>
  isCustomer ? TRANSITION_REVIEW_1_BY_CUSTOMER : TRANSITION_REVIEW_1_BY_PROVIDER;

export const getReview2Transition = isCustomer =>
  isCustomer ? TRANSITION_REVIEW_2_BY_CUSTOMER : TRANSITION_REVIEW_2_BY_PROVIDER;

// Check if a transition is the kind that should be rendered
// when showing transition history (e.g. ActivityFeed)
// The first transition and most of the expiration transitions made by system are not relevant
export const isRelevantPastTransition = transition => {
  return [
    TRANSITION_ACCEPT,
    TRANSITION_CANCEL,
    // TRANSITION_COMPLETE,
    TRANSITION_CONFIRM_PAYMENT,
    TRANSITION_DECLINE,
    TRANSITION_EXPIRE,
    // TRANSITION_REVIEW_1_BY_CUSTOMER,
    // TRANSITION_REVIEW_1_BY_PROVIDER,
    // TRANSITION_REVIEW_2_BY_CUSTOMER,
    // TRANSITION_REVIEW_2_BY_PROVIDER,
  ].includes(transition);
};

export const isCustomerReview = transition => {
  return [TRANSITION_REVIEW_1_BY_CUSTOMER, TRANSITION_REVIEW_2_BY_CUSTOMER].includes(transition);
};

export const isProviderReview = transition => {
  return [TRANSITION_REVIEW_1_BY_PROVIDER, TRANSITION_REVIEW_2_BY_PROVIDER].includes(transition);
};

export const getUserTxRole = (currentUserId, transaction) => {
  const tx = ensureTransaction(transaction);
  const customer = tx.customer;
  if (currentUserId && currentUserId.uuid && tx.id && customer.id) {
    // user can be either customer or provider
    return currentUserId.uuid === customer.id.uuid
      ? TX_TRANSITION_ACTOR_CUSTOMER
      : TX_TRANSITION_ACTOR_PROVIDER;
  } else {
    throw new Error(`Parameters for "userIsCustomer" function were wrong.
      currentUserId: ${currentUserId}, transaction: ${transaction}`);
  }
};

export const txRoleIsProvider = userRole => userRole === TX_TRANSITION_ACTOR_PROVIDER;
export const txRoleIsCustomer = userRole => userRole === TX_TRANSITION_ACTOR_CUSTOMER;

// Check if the given transition is privileged.
//
// Privileged transitions need to be handled from a secure context,
// i.e. the backend. This helper is used to check if the transition
// should go through the local API endpoints, or if using JS SDK is
// enough.
export const isPrivileged = transition => {
  return [TRANSITION_REQUEST_PAYMENT, TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY].includes(
    transition
  );
};
