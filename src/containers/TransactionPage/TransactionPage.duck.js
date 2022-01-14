import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import config from '../../config';
import { types as sdkTypes } from '../../util/sdkLoader';
import { isTransactionsTransitionInvalidTransition, storableError } from '../../util/errors';
import {
  txIsEnquired,
  getReview1Transition,
  getReview2Transition,
  txIsInFirstReviewBy,
  TRANSITION_ACCEPT,
  TRANSITION_DECLINE,
  TRANSITION_HOST_APPROVED_BY_RENTER,
  TRANSITION_HOST_ACCEPTS_COMMUNICATION,
  TRANSITION_HOST_DECLINES_COMMUNICATION,
  TRANSITION_RENTER_ACCEPTS_COMMUNICATION,
  TRANSITION_RENTER_DECLINES_COMMUNICATION,
  TRANSITION_HOST_SENDS_AGREEMENT,
  TRANSITION_RENTER_REQUESTS_AGREEMENT,
  TRANSITION_HOST_CANCELS_DURING_RAD,
  TRANSITION_RENTER_CANCELS_DURING_RAD,
  TRANSITION_RENTER_CANCELS_AFTER_REQUEST,
  TRANSITION_RENTER_SIGNS_RENTAL_AGREEMENT,
  TRANSITION_COMPLETE,
  TRANSITION_HOST_SENDS_AGREEMENT_AFTER_REQUEST,
  TRANSITION_HOST_CANCELS_AFTER_AGREEMENT_SENT,
  TRANSITION_RENTER_CANCELS_AFTER_AGREEMENT_SENT,
} from '../../util/transaction';
import {
  transactionLineItems,
  transitionPrivileged,
  transitionPrivilegedSimple,
  sendAdminEmail,
} from '../../util/api';
import * as log from '../../util/log';
import {
  updatedEntities,
  denormalisedEntities,
  denormalisedResponseEntities,
} from '../../util/data';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { fetchCurrentUserNotifications } from '../../ducks/user.duck';
import { getPropByName } from '../../util/userHelpers';
import { fetchSubscription } from '../../ducks/stripe.duck';

const { UUID } = sdkTypes;

const MESSAGES_PAGE_SIZE = 100;
const CUSTOMER = 'customer';

// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/TransactionPage/SET_INITIAL_VALUES';

export const FETCH_TRANSACTION_REQUEST = 'app/TransactionPage/FETCH_TRANSACTION_REQUEST';
export const FETCH_TRANSACTION_SUCCESS = 'app/TransactionPage/FETCH_TRANSACTION_SUCCESS';
export const FETCH_TRANSACTION_ERROR = 'app/TransactionPage/FETCH_TRANSACTION_ERROR';

export const FETCH_RELATED_LISTING_SUCCESS = 'app/TransactionPage/FETCH_RELATED_LISTING_SUCCESS';

export const FETCH_TRANSITIONS_REQUEST = 'app/TransactionPage/FETCH_TRANSITIONS_REQUEST';
export const FETCH_TRANSITIONS_SUCCESS = 'app/TransactionPage/FETCH_TRANSITIONS_SUCCESS';
export const FETCH_TRANSITIONS_ERROR = 'app/TransactionPage/FETCH_TRANSITIONS_ERROR';

export const ACCEPT_COMMUNICATION_REQUEST = 'app/TransactionPage/ACCEPT_COMMUNICATION_REQUEST';
export const ACCEPT_COMMUNICATION_SUCCESS = 'app/TransactionPage/ACCEPT_COMMUNICATION_SUCCESS';
export const ACCEPT_COMMUNICATION_ERROR = 'app/TransactionPage/ACCEPT_COMMUNICATION_ERROR';

export const DECLINE_COMMUNICATION_REQUEST = 'app/TransactionPage/DECLINE_COMMUNICATION_REQUEST';
export const DECLINE_COMMUNICATION_SUCCESS = 'app/TransactionPage/DECLINE_COMMUNICATION_SUCCESS';
export const DECLINE_COMMUNICATION_ERROR = 'app/TransactionPage/DECLINE_COMMUNICATION_ERROR';

export const SEND_RENTAL_AGREEMENT_REQUEST = 'app/TransactionPage/SEND_RENTAL_AGREEMENT_REQUEST';
export const SEND_RENTAL_AGREEMENT_SUCCESS = 'app/TransactionPage/SEND_RENTAL_AGREEMENT_SUCCESS';
export const SEND_RENTAL_AGREEMENT_ERROR = 'app/TransactionPage/SEND_RENTAL_AGREEMENT_ERROR';

export const REQUEST_RENTAL_AGREEMENT_REQUEST =
  'app/TransactionPage/REQUEST_RENTAL_AGREEMENT_REQUEST';
export const REQUEST_RENTAL_AGREEMENT_SUCCESS =
  'app/TransactionPage/REQUEST_RENTAL_AGREEMENT_SUCCESS';
export const REQUEST_RENTAL_AGREEMENT_ERROR = 'app/TransactionPage/REQUEST_RENTAL_AGREEMENT_ERROR';

export const SIGN_RENTAL_AGREEMENT_REQUEST = 'app/TransactionPage/SIGN_RENTAL_AGREEMENT_REQUEST';
export const SIGN_RENTAL_AGREEMENT_SUCCESS = 'app/TransactionPage/SIGN_RENTAL_AGREEMENT_SUCCESS';
export const SIGN_RENTAL_AGREEMENT_ERROR = 'app/TransactionPage/SIGN_RENTAL_AGREEMENT_ERROR';

export const CANCEL_DURING_RAD_REQUEST = 'app/TransactionPage/CANCEL_DURING_RAD_REQUEST';
export const CANCEL_DURING_RAD_SUCCESS = 'app/TransactionPage/CANCEL_DURING_RAD_SUCCESS';
export const CANCEL_DURING_RAD_ERROR = 'app/TransactionPage/CANCEL_DURING_RAD_ERROR';

export const CANCEL_AFTER_AGREEMENT_SENT_REQUEST =
  'app/TransactionPage/CANCEL_AFTER_AGREEMENT_SENT_REQUEST';
export const CANCEL_AFTER_AGREEMENT_SENT_SUCCESS =
  'app/TransactionPage/CANCEL_AFTER_AGREEMENT_SENT_SUCCESS';
export const CANCEL_AFTER_AGREEMENT_SENT_ERROR =
  'app/TransactionPage/CANCEL_AFTER_AGREEMENT_SENT_ERROR';

export const ACCEPT_SALE_REQUEST = 'app/TransactionPage/ACCEPT_SALE_REQUEST';
export const ACCEPT_SALE_SUCCESS = 'app/TransactionPage/ACCEPT_SALE_SUCCESS';
export const ACCEPT_SALE_ERROR = 'app/TransactionPage/ACCEPT_SALE_ERROR';

export const DECLINE_SALE_REQUEST = 'app/TransactionPage/DECLINE_SALE_REQUEST';
export const DECLINE_SALE_SUCCESS = 'app/TransactionPage/DECLINE_SALE_SUCCESS';
export const DECLINE_SALE_ERROR = 'app/TransactionPage/DECLINE_SALE_ERROR';

export const FETCH_MESSAGES_REQUEST = 'app/TransactionPage/FETCH_MESSAGES_REQUEST';
export const FETCH_MESSAGES_SUCCESS = 'app/TransactionPage/FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_ERROR = 'app/TransactionPage/FETCH_MESSAGES_ERROR';

export const SEND_MESSAGE_REQUEST = 'app/TransactionPage/SEND_MESSAGE_REQUEST';
export const SEND_MESSAGE_SUCCESS = 'app/TransactionPage/SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_ERROR = 'app/TransactionPage/SEND_MESSAGE_ERROR';

export const SEND_REVIEW_REQUEST = 'app/TransactionPage/SEND_REVIEW_REQUEST';
export const SEND_REVIEW_SUCCESS = 'app/TransactionPage/SEND_REVIEW_SUCCESS';
export const SEND_REVIEW_ERROR = 'app/TransactionPage/SEND_REVIEW_ERROR';

export const FETCH_TIME_SLOTS_REQUEST = 'app/TransactionPage/FETCH_TIME_SLOTS_REQUEST';
export const FETCH_TIME_SLOTS_SUCCESS = 'app/TransactionPage/FETCH_TIME_SLOTS_SUCCESS';
export const FETCH_TIME_SLOTS_ERROR = 'app/TransactionPage/FETCH_TIME_SLOTS_ERROR';

export const FETCH_LINE_ITEMS_REQUEST = 'app/TransactionPage/FETCH_LINE_ITEMS_REQUEST';
export const FETCH_LINE_ITEMS_SUCCESS = 'app/TransactionPage/FETCH_LINE_ITEMS_SUCCESS';
export const FETCH_LINE_ITEMS_ERROR = 'app/TransactionPage/FETCH_LINE_ITEMS_ERROR';

// ================ Reducer ================ //

const initialState = {
  fetchTransactionInProgress: false,
  fetchTransactionError: null,
  transactionRef: null,

  acceptCommunicationInProgress: false,
  acceptCommunicationSaleError: null,
  declineCommunicationInProgress: false,
  declineCommunicationSaleError: null,

  sendRentalAgreementInProgress: false,
  sendRentalAgreementError: null,

  requestRentalAgreementInProgress: false,
  requestRentalAgreementError: null,

  signRentalAgreementInProgress: false,
  signRentalAgreementError: null,

  cancelDuringRadInProgress: false,
  cancelDuringRadError: null,

  cancelAfterAgreementSentInProgress: false,
  cancelAfterAgreementSentError: null,

  acceptInProgress: false,
  acceptSaleError: null,
  declineInProgress: false,
  declineSaleError: null,

  fetchMessagesInProgress: false,
  fetchMessagesError: null,
  totalMessages: 0,
  totalMessagePages: 0,
  oldestMessagePageFetched: 0,
  messages: [],
  initialMessageFailedToTransaction: null,
  savePaymentMethodFailed: false,
  sendMessageInProgress: false,
  sendMessageError: null,
  sendReviewInProgress: false,
  sendReviewError: null,
  timeSlots: null,
  fetchTimeSlotsError: null,
  fetchTransitionsInProgress: false,
  fetchTransitionsError: null,
  processTransitions: null,
  lineItems: null,
  fetchLineItemsInProgress: false,
  fetchLineItemsError: null,
  relatedListingRef: null,
};

// Merge entity arrays using ids, so that conflicting items in newer array (b) overwrite old values (a).
// const a = [{ id: { uuid: 1 } }, { id: { uuid: 3 } }];
// const b = [{ id: : { uuid: 2 } }, { id: : { uuid: 1 } }];
// mergeEntityArrays(a, b)
// => [{ id: { uuid: 3 } }, { id: : { uuid: 2 } }, { id: : { uuid: 1 } }]
const mergeEntityArrays = (a, b) => {
  return a.filter(aEntity => !b.find(bEntity => aEntity.id.uuid === bEntity.id.uuid)).concat(b);
};

export default function checkoutPageReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_VALUES:
      return { ...initialState, ...payload };

    case FETCH_TRANSACTION_REQUEST:
      return { ...state, fetchTransactionInProgress: true, fetchTransactionError: null };
    case FETCH_TRANSACTION_SUCCESS: {
      const transactionRef = { id: payload.data.data.id, type: 'transaction' };
      return { ...state, fetchTransactionInProgress: false, transactionRef };
    }
    case FETCH_TRANSACTION_ERROR:
      console.error(payload); // eslint-disable-line
      return { ...state, fetchTransactionInProgress: false, fetchTransactionError: payload };

    case FETCH_RELATED_LISTING_SUCCESS: {
      const relatedListingRef = { id: payload.data.data.id, type: 'listing' };
      return { ...state, relatedListingRef };
    }
    case FETCH_TRANSITIONS_REQUEST:
      return { ...state, fetchTransitionsInProgress: true, fetchTransitionsError: null };
    case FETCH_TRANSITIONS_SUCCESS:
      return { ...state, fetchTransitionsInProgress: false, processTransitions: payload };
    case FETCH_TRANSITIONS_ERROR:
      console.error(payload); // eslint-disable-line
      return { ...state, fetchTransitionsInProgress: false, fetchTransitionsError: payload };

    case ACCEPT_COMMUNICATION_REQUEST:
      return {
        ...state,
        acceptCommunicationInProgress: true,
        acceptCommunicationError: null,
        declineCommunicationError: null,
      };
    case ACCEPT_COMMUNICATION_SUCCESS:
      return { ...state, acceptCommunicationInProgress: false };
    case ACCEPT_COMMUNICATION_ERROR:
      return { ...state, acceptCommunicationInProgress: false, acceptCommunicationError: payload };

    case DECLINE_COMMUNICATION_REQUEST:
      return {
        ...state,
        declineCommunicationInProgress: true,
        declineCommunicationError: null,
        acceptCommunicationError: null,
      };
    case DECLINE_COMMUNICATION_SUCCESS:
      return { ...state, declineCommunicationInProgress: false };
    case DECLINE_COMMUNICATION_ERROR:
      return {
        ...state,
        declineCommunicationInProgress: false,
        declineCommunicationError: payload,
      };

    case SEND_RENTAL_AGREEMENT_REQUEST:
      return {
        ...state,
        sendRentalAgreementInProgress: true,
        sendRentalAgreementError: null,
      };
    case SEND_RENTAL_AGREEMENT_SUCCESS:
      return { ...state, sendRentalAgreementInProgress: false };
    case SEND_RENTAL_AGREEMENT_ERROR:
      return {
        ...state,
        sendRentalAgreementInProgress: false,
        sendRentalAgreementError: payload,
      };
    case REQUEST_RENTAL_AGREEMENT_REQUEST:
      return {
        ...state,
        requestRentalAgreementInProgress: true,
        requestRentalAgreementError: null,
      };
    case REQUEST_RENTAL_AGREEMENT_SUCCESS:
      return { ...state, requestRentalAgreementInProgress: false };
    case REQUEST_RENTAL_AGREEMENT_ERROR:
      return {
        ...state,
        requestRentalAgreementInProgress: false,
        requestRentalAgreementError: payload,
      };

    case CANCEL_DURING_RAD_REQUEST:
      return {
        ...state,
        cancelDuringRadInProgress: true,
        cancelDuringRadError: null,
      };
    case CANCEL_DURING_RAD_SUCCESS:
      return { ...state, cancelDuringRadInProgress: false };
    case CANCEL_DURING_RAD_ERROR:
      return { ...state, cancelDuringRadInProgress: false, cancelDuringRadError: payload };

    case CANCEL_AFTER_AGREEMENT_SENT_REQUEST:
      return {
        ...state,
        cancelAfterAgreementSentInProgress: true,
        cancelAfterAgreementSentError: null,
      };
    case CANCEL_AFTER_AGREEMENT_SENT_SUCCESS:
      return { ...state, cancelAfterAgreementSentInProgress: false };
    case CANCEL_AFTER_AGREEMENT_SENT_ERROR:
      return {
        ...state,
        cancelAfterAgreementSentInProgress: false,
        cancelAfterAgreementSentError: payload,
      };

    case SIGN_RENTAL_AGREEMENT_REQUEST:
      return {
        ...state,
        signRentalAgreementInProgress: true,
        signRentalAgreementError: null,
      };
    case SIGN_RENTAL_AGREEMENT_SUCCESS:
      return { ...state, signRentalAgreementInProgress: false };
    case SIGN_RENTAL_AGREEMENT_ERROR:
      return {
        ...state,
        signRentalAgreementInProgress: false,
        signRentalAgreementError: payload,
      };
    case ACCEPT_SALE_REQUEST:
      return { ...state, acceptInProgress: true, acceptSaleError: null, declineSaleError: null };
    case ACCEPT_SALE_SUCCESS:
      return { ...state, acceptInProgress: false };
    case ACCEPT_SALE_ERROR:
      return { ...state, acceptInProgress: false, acceptSaleError: payload };

    case DECLINE_SALE_REQUEST:
      return { ...state, declineInProgress: true, declineSaleError: null, acceptSaleError: null };
    case DECLINE_SALE_SUCCESS:
      return { ...state, declineInProgress: false };
    case DECLINE_SALE_ERROR:
      return { ...state, declineInProgress: false, declineSaleError: payload };

    case FETCH_MESSAGES_REQUEST:
      return { ...state, fetchMessagesInProgress: true, fetchMessagesError: null };
    case FETCH_MESSAGES_SUCCESS: {
      const oldestMessagePageFetched =
        state.oldestMessagePageFetched > payload.page
          ? state.oldestMessagePageFetched
          : payload.page;
      return {
        ...state,
        fetchMessagesInProgress: false,
        messages: mergeEntityArrays(state.messages, payload.messages),
        totalMessages: payload.totalItems,
        totalMessagePages: payload.totalPages,
        oldestMessagePageFetched,
      };
    }
    case FETCH_MESSAGES_ERROR:
      return { ...state, fetchMessagesInProgress: false, fetchMessagesError: payload };

    case SEND_MESSAGE_REQUEST:
      return {
        ...state,
        sendMessageInProgress: true,
        sendMessageError: null,
        initialMessageFailedToTransaction: null,
      };
    case SEND_MESSAGE_SUCCESS:
      return { ...state, sendMessageInProgress: false };
    case SEND_MESSAGE_ERROR:
      return { ...state, sendMessageInProgress: false, sendMessageError: payload };

    case SEND_REVIEW_REQUEST:
      return { ...state, sendReviewInProgress: true, sendReviewError: null };
    case SEND_REVIEW_SUCCESS:
      return { ...state, sendReviewInProgress: false };
    case SEND_REVIEW_ERROR:
      return { ...state, sendReviewInProgress: false, sendReviewError: payload };

    case FETCH_TIME_SLOTS_REQUEST:
      return { ...state, fetchTimeSlotsError: null };
    case FETCH_TIME_SLOTS_SUCCESS:
      return { ...state, timeSlots: payload };
    case FETCH_TIME_SLOTS_ERROR:
      return { ...state, fetchTimeSlotsError: payload };

    case FETCH_LINE_ITEMS_REQUEST:
      return { ...state, fetchLineItemsInProgress: true, fetchLineItemsError: null };
    case FETCH_LINE_ITEMS_SUCCESS:
      return { ...state, fetchLineItemsInProgress: false, lineItems: payload };
    case FETCH_LINE_ITEMS_ERROR:
      return { ...state, fetchLineItemsInProgress: false, fetchLineItemsError: payload };

    default:
      return state;
  }
}

// ================ Selectors ================ //

export const acceptOrDeclineInProgress = state => {
  return state.TransactionPage.acceptInProgress || state.TransactionPage.declineInProgress;
};
export const acceptOrDeclineCommunicationInProgress = state => {
  return (
    state.TransactionPage.acceptCommunicationInProgress ||
    state.TransactionPage.declineCommunicationInProgress
  );
};

// ================ Action creators ================ //
export const setInitialValues = initialValues => ({
  type: SET_INITIAL_VALUES,
  payload: pick(initialValues, Object.keys(initialState)),
});

const fetchTransactionRequest = () => ({ type: FETCH_TRANSACTION_REQUEST });
const fetchTransactionSuccess = response => ({
  type: FETCH_TRANSACTION_SUCCESS,
  payload: response,
});
const fetchTransactionError = e => ({ type: FETCH_TRANSACTION_ERROR, error: true, payload: e });

const fetchRelatedListingSuccess = response => ({
  type: FETCH_RELATED_LISTING_SUCCESS,
  payload: response,
});

const fetchTransitionsRequest = () => ({ type: FETCH_TRANSITIONS_REQUEST });
const fetchTransitionsSuccess = response => ({
  type: FETCH_TRANSITIONS_SUCCESS,
  payload: response,
});
const fetchTransitionsError = e => ({ type: FETCH_TRANSITIONS_ERROR, error: true, payload: e });

const acceptSaleRequest = () => ({ type: ACCEPT_SALE_REQUEST });
const acceptSaleSuccess = () => ({ type: ACCEPT_SALE_SUCCESS });
const acceptSaleError = e => ({ type: ACCEPT_SALE_ERROR, error: true, payload: e });

const declineSaleRequest = () => ({ type: DECLINE_SALE_REQUEST });
const declineSaleSuccess = () => ({ type: DECLINE_SALE_SUCCESS });
const declineSaleError = e => ({ type: DECLINE_SALE_ERROR, error: true, payload: e });

const acceptCommunicationRequest = () => ({ type: ACCEPT_COMMUNICATION_REQUEST });
const acceptCommunicationSuccess = () => ({ type: ACCEPT_COMMUNICATION_SUCCESS });
const acceptCommunicationError = e => ({
  type: ACCEPT_COMMUNICATION_ERROR,
  error: true,
  payload: e,
});

const cancelDuringRadRequest = () => ({ type: CANCEL_DURING_RAD_REQUEST });
const cancelDuringRadSuccess = () => ({ type: CANCEL_DURING_RAD_SUCCESS });
const cancelDuringRadError = e => ({
  type: CANCEL_DURING_RAD_ERROR,
  error: true,
  payload: e,
});

const cancelAfterAgreementSentRequest = () => ({ type: CANCEL_AFTER_AGREEMENT_SENT_REQUEST });
const cancelAfterAgreementSentSuccess = () => ({ type: CANCEL_AFTER_AGREEMENT_SENT_SUCCESS });
const cancelAfterAgreementSentError = e => ({
  type: CANCEL_AFTER_AGREEMENT_SENT_ERROR,
  error: true,
  payload: e,
});

const declineCommunicationRequest = () => ({ type: DECLINE_COMMUNICATION_REQUEST });
const declineCommunicationSuccess = () => ({ type: DECLINE_COMMUNICATION_SUCCESS });
const declineCommunicationError = e => ({
  type: DECLINE_COMMUNICATION_ERROR,
  error: true,
  payload: e,
});

const sendRentalAgreementRequest = () => ({ type: SEND_RENTAL_AGREEMENT_REQUEST });
const sendRentalAgreementSuccess = () => ({ type: SEND_RENTAL_AGREEMENT_SUCCESS });
const sendRentalAgreementError = e => ({
  type: SEND_RENTAL_AGREEMENT_ERROR,
  error: true,
  payload: e,
});

const requestRentalAgreementRequest = () => ({ type: REQUEST_RENTAL_AGREEMENT_REQUEST });
const requestRentalAgreementSuccess = () => ({ type: REQUEST_RENTAL_AGREEMENT_SUCCESS });
const requestRentalAgreementError = e => ({
  type: REQUEST_RENTAL_AGREEMENT_ERROR,
  error: true,
  payload: e,
});

const signRentalAgreementRequest = () => ({ type: SIGN_RENTAL_AGREEMENT_REQUEST });
const signRentalAgreementSuccess = () => ({ type: SIGN_RENTAL_AGREEMENT_SUCCESS });
const signRentalAgreementError = e => ({
  type: SIGN_RENTAL_AGREEMENT_ERROR,
  error: true,
  payload: e,
});

const fetchMessagesRequest = () => ({ type: FETCH_MESSAGES_REQUEST });
const fetchMessagesSuccess = (messages, pagination) => ({
  type: FETCH_MESSAGES_SUCCESS,
  payload: { messages, ...pagination },
});
const fetchMessagesError = e => ({ type: FETCH_MESSAGES_ERROR, error: true, payload: e });

const sendMessageRequest = () => ({ type: SEND_MESSAGE_REQUEST });
const sendMessageSuccess = () => ({ type: SEND_MESSAGE_SUCCESS });
const sendMessageError = e => ({ type: SEND_MESSAGE_ERROR, error: true, payload: e });

const sendReviewRequest = () => ({ type: SEND_REVIEW_REQUEST });
const sendReviewSuccess = () => ({ type: SEND_REVIEW_SUCCESS });
const sendReviewError = e => ({ type: SEND_REVIEW_ERROR, error: true, payload: e });

const fetchTimeSlotsRequest = () => ({ type: FETCH_TIME_SLOTS_REQUEST });
const fetchTimeSlotsSuccess = timeSlots => ({
  type: FETCH_TIME_SLOTS_SUCCESS,
  payload: timeSlots,
});
const fetchTimeSlotsError = e => ({
  type: FETCH_TIME_SLOTS_ERROR,
  error: true,
  payload: e,
});

export const fetchLineItemsRequest = () => ({ type: FETCH_LINE_ITEMS_REQUEST });
export const fetchLineItemsSuccess = lineItems => ({
  type: FETCH_LINE_ITEMS_SUCCESS,
  payload: lineItems,
});
export const fetchLineItemsError = error => ({
  type: FETCH_LINE_ITEMS_ERROR,
  error: true,
  payload: error,
});

// ================ Thunks ================ //

const listingRelationship = txResponse => {
  return txResponse.data.data.relationships.listing.data;
};

export const fetchTransaction = (id, txRole) => (dispatch, getState, sdk) => {
  dispatch(fetchTransactionRequest());
  let txResponse = null;

  return sdk.transactions
    .show(
      {
        id,
        include: [
          'customer',
          'customer.profileImage',
          'provider',
          'provider.profileImage',
          'listing',
          'booking',
          'reviews',
          'reviews.author',
          'reviews.subject',
        ],
        ...IMAGE_VARIANTS,
      },
      { expand: true }
    )
    .then(response => {
      txResponse = response;
      const listingId = listingRelationship(response).id;
      const entities = updatedEntities({}, response.data);
      const listingRef = { id: listingId, type: 'listing' };
      const transactionRef = { id, type: 'transaction' };
      const denormalised = denormalisedEntities(entities, [listingRef, transactionRef]);
      const listing = denormalised[0];
      const transaction = denormalised[1];
      const selectedListingId = getPropByName(transaction, 'selectedListingId');
      const relatedListingId = getPropByName(transaction, 'relatedListingId');
      const recurringResponse = getPropByName(transaction, 'recurringResponse');
      console.log(
        '🚀 | file: TransactionPage.duck.js | line 529 | fetchTransaction | recurringResponse',
        recurringResponse
      );
      if (!!(relatedListingId || selectedListingId)) {
        sdk.listings
          .show({
            id: selectedListingId || relatedListingId,
            include: ['author', 'author.profileImage', 'images'],
            ...IMAGE_VARIANTS,
          })
          .then(relatedListingResponse => {
            dispatch(addMarketplaceEntities(relatedListingResponse));
            dispatch(fetchRelatedListingSuccess(relatedListingResponse));
          })
          .catch(e => {});
      }
      // Fetch time slots for transactions that are in enquired state
      const canFetchTimeslots =
        txRole === 'customer' &&
        config.enableAvailability &&
        transaction &&
        txIsEnquired(transaction);

      if (canFetchTimeslots) {
        dispatch(fetchTimeSlots(listingId));
      }
      const canFetchSubscription = !!recurringResponse;
      if (canFetchSubscription) {
        dispatch(fetchSubscription({ subId: recurringResponse.id }));
      }
      const canFetchListing = listing && listing.attributes && !listing.attributes.deleted;
      if (canFetchListing) {
        return sdk.listings.show({
          id: listingId,
          include: ['author', 'author.profileImage', 'images'],
          ...IMAGE_VARIANTS,
        });
      } else {
        return response;
      }
    })
    .then(transactionListingresponse => {
      dispatch(addMarketplaceEntities(txResponse));
      dispatch(addMarketplaceEntities(transactionListingresponse));
      dispatch(fetchTransactionSuccess(txResponse));
      return transactionListingresponse;
    })
    .catch(e => {
      dispatch(fetchTransactionError(storableError(e)));
      throw e;
    });
};

export const completeSale = data => (dispatch, getState, sdk) => {
  const { txId } = data;
  if (acceptOrDeclineInProgress(getState())) {
    return Promise.reject(new Error('Accept or decline already in progress'));
  }
  dispatch(acceptSaleRequest());

  return sdk.transactions
    .transition({ id: txId, transition: TRANSITION_COMPLETE, params: {} }, { expand: true })
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(acceptSaleSuccess());
      dispatch(fetchCurrentUserNotifications());
      return response;
    })
    .catch(e => {
      dispatch(acceptSaleError(storableError(e)));
      log.error(e, 'accept-sale-failed', {
        txId,
        transition: TRANSITION_COMPLETE,
      });
      throw e;
    });
};
export const createTransaction = orderParams => (dispatch, getState, sdk) => {
  dispatch(initiateOrderRequest());

  // TODO UPDATE THIS WHEN WE BUILD THE OTHER SIDE OF THE MARKETPLACE
  const isRequestFromHost = orderParams.protectedData.contactingAs === 'host';

  const transition = TRANSITION_HOST_APPROVED_BY_RENTER;

  const bodyParams = {
    processAlias: config.bookingProcessAlias,
    transition,
    params: orderParams,
  };
  const queryParams = {
    include: ['booking', 'provider'],
    expand: true,
  };

  const handleSucces = response => {
    const entities = denormalisedResponseEntities(response);
    const order = entities[0];
    dispatch(initiateOrderSuccess(order));
    dispatch(fetchCurrentUserHasOrdersSuccess(true));
    return order;
  };

  const handleError = e => {
    dispatch(initiateOrderError(storableError(e)));
    log.error(e, 'initiate-order-failed', {
      listingId: orderParams.listingId.uuid,
    });
    throw e;
  };

  return sdk.transactions
    .initiate(bodyParams, queryParams)
    .then(handleSucces)
    .catch(handleError);
};

export const reverseTransactionFlowAndAcceptCommunication = data => (dispatch, getState, sdk) => {
  // listingId is the HOSTS LISTING
  // relatedTxId is the CURRENT HOST->RENTER TRANSACTION that is invalid
  // relatedListingId is the RENTERS ADVERT
  const { listingId, relatedTxId, relatedListingId } = data;
  if (acceptOrDeclineInProgress(getState())) {
    return Promise.reject(new Error('Accept or decline already in progress'));
  }

  dispatch(acceptCommunicationRequest());

  const bodyParams = {
    processAlias: config.bookingProcessAlias,
    transition: TRANSITION_HOST_APPROVED_BY_RENTER,
    params: {
      listingId: listingId.uuid,
      protectedData: { relatedTxId: relatedTxId.uuid, relatedListingId: relatedListingId.uuid },
    },
  };
  const queryParams = {
    include: ['booking', 'provider'],
    expand: true,
  };

  // This creates the NEW transaction (RENTER -> HOST)
  return sdk.transactions
    .initiate(bodyParams, queryParams)
    .then(response => {
      const newTx = response.data.data;
      // This transitions the OLD transaction (HOST -> RENTER) into a new state that is hidden.
      return sdk.transactions
        .transition(
          {
            id: relatedTxId,
            transition: TRANSITION_RENTER_ACCEPTS_COMMUNICATION,
            params: { protectedData: { relatedTxId: newTx.id.uuid } },
          },
          { expand: true }
        )
        .then(response => {
          dispatch(addMarketplaceEntities(response));
          dispatch(acceptCommunicationSuccess());
          dispatch(fetchCurrentUserNotifications());
          return response;
        });
    })
    .catch(e => {
      dispatch(acceptCommunicationError(storableError(e)));
      log.error(e, 'accept-communication-failed', {
        relatedTxId,
        listingId,
        transition: TRANSITION_RENTER_ACCEPTS_COMMUNICATION,
      });
      throw e;
    });
};

export const acceptCommunication = data => (dispatch, getState, sdk) => {
  const { txId, isRenterEnquired } = data;
  if (acceptOrDeclineInProgress(getState())) {
    return Promise.reject(new Error('Accept or decline already in progress'));
  }

  dispatch(acceptCommunicationRequest());

  return sdk.transactions
    .transition(
      {
        id: txId,
        transition: TRANSITION_HOST_ACCEPTS_COMMUNICATION,
        params: {},
      },
      { expand: true }
    )
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(acceptCommunicationSuccess());
      dispatch(fetchCurrentUserNotifications());
      return response;
    })
    .catch(e => {
      dispatch(acceptCommunicationError(storableError(e)));
      log.error(e, 'accept-communication-failed', {
        txId: id,
        transition: isRenterEnquired
          ? TRANSITION_HOST_ACCEPTS_COMMUNICATION
          : TRANSITION_RENTER_ACCEPTS_COMMUNICATION,
      });
      throw e;
    });
};

export const declineCommunication = data => (dispatch, getState, sdk) => {
  if (acceptOrDeclineInProgress(getState())) {
    return Promise.reject(new Error('Accept or decline already in progress'));
  }
  const { txId, isRenterEnquired } = data;
  dispatch(declineCommunicationRequest());

  return sdk.transactions
    .transition(
      {
        id: txId,
        transition: isRenterEnquired
          ? TRANSITION_HOST_DECLINES_COMMUNICATION
          : TRANSITION_RENTER_DECLINES_COMMUNICATION,
        params: {},
      },
      { expand: true }
    )
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(declineCommunicationSuccess());
      dispatch(fetchCurrentUserNotifications());
      return response;
    })
    .catch(e => {
      dispatch(declineCommunicationError(storableError(e)));
      log.error(e, 'decline-communication-failed', {
        txId: id,
        transition: isRenterEnquired
          ? TRANSITION_HOST_DECLINES_COMMUNICATION
          : TRANSITION_RENTER_DECLINES_COMMUNICATION,
      });
      throw e;
    });
};

export const cancelDuringRad = data => (dispatch, getState, sdk) => {
  console.log('🚀 | file: TransactionPage.duck.js | line 778 | data', data);
  const { txId, actor, wasRequested } = data;
  dispatch(cancelDuringRadRequest());
  const transition = wasRequested
    ? actor === 'provider'
      ? TRANSITION_HOST_CANCELS_AFTER_REQUEST
      : TRANSITION_RENTER_CANCELS_AFTER_REQUEST
    : actor === 'provider'
    ? TRANSITION_HOST_CANCELS_DURING_RAD
    : TRANSITION_RENTER_CANCELS_DURING_RAD;
  return sdk.transactions
    .transition(
      {
        id: txId,
        transition: transition,
        params: {},
      },
      { expand: true }
    )
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(cancelDuringRadSuccess());
      dispatch(fetchCurrentUserNotifications());
      return response;
    })
    .catch(e => {
      dispatch(cancelDuringRadError(storableError(e)));
      log.error(e, 'cancel-during-rad-failed', {
        txId: txId,
        transition: transition,
      });
      throw e;
    });
};

export const sendRentalAgreement = data => (dispatch, getState, sdk) => {
  // TODO: Add booking data to params here
  const { txId, listingId, wasRequested, contractLines, bookingDates } = data;

  console.log('🚀 | file: TransactionPage.duck.js | line 847 | data', data);
  const { startDate } = bookingDates;
  const endDate = bookingDates.endDate || new moment().add(1, 'years');
  console.log('🚀 | file: TransactionPage.duck.js | line 816 | endDate', endDate);
  console.log('🚀 | file: TransactionPage.duck.js | line 815 | bookingDates', bookingDates);
  dispatch(sendRentalAgreementRequest());
  const bookingData = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
  const transition = wasRequested
    ? TRANSITION_HOST_SENDS_AGREEMENT_AFTER_REQUEST
    : TRANSITION_HOST_SENDS_AGREEMENT;
  const bodyParams = {
    id: txId.uuid,
    transition: transition,
    params: {
      listingId: listingId.uuid,
      bookingStart: bookingData.startDate,
      bookingEnd: bookingData.endDate,
      protectedData: { ...contractLines, ...bookingData },
    },
  };
  const queryParams = { expand: true };
  const emailData = { ...contractLines, ...bookingData };
  console.log(emailData);
  console.log(Object.entries(emailData));
  sendAdminEmail({
    message: {
      subject: 'NEW RENTAL AGREEMENT REQUESTED',
      body:
        'A new rental agreement has been requested. Please generate the appropriate document and contact both parties to have it signed.',
    },
    content: { ...contractLines, ...bookingData },
  });
  const handleSucces = response => {
    const entities = denormalisedResponseEntities(response);
    const order = entities[0];

    dispatch(addMarketplaceEntities(response));
    dispatch(sendRentalAgreementSuccess());
    dispatch(fetchCurrentUserNotifications());

    return order;
  };

  const handleError = e => {
    dispatch(sendRentalAgreementError(storableError(e)));
    const transactionIdMaybe = txId ? { transactionId: txId.uuid } : {};
    log.error(e, 'host-sends-agreement-failed', {
      ...transactionIdMaybe,
      listingId: bodyParams?.params?.listingId?.uuid,
      bookingStart: bodyParams.bookingStart,
      bookingEnd: bodyParams.bookingEnd,
    });
    throw e;
  };

  // transition privileged
  return transitionPrivileged({ bookingData, bodyParams, queryParams })
    .then(handleSucces)
    .catch(handleError);
};

export const requestRentalAgreement = data => (dispatch, getState, sdk) => {
  // TODO: Add booking data to params here
  const { txId, listingId } = data;

  dispatch(requestRentalAgreementRequest());
  const bookingData = {
    startDate: moment()
      .add(1, 'days')
      .toISOString(),
    endDate: moment()
      .add(30, 'days')
      .toISOString(),
  };
  const bodyParams = {
    id: txId.uuid,
    transition: TRANSITION_RENTER_REQUESTS_AGREEMENT,
    params: {
      listingId: listingId.uuid,
      bookingStart: bookingData.startDate,
      bookingEnd: bookingData.endDate,
    },
  };
  const queryParams = { expand: true };

  const handleSucces = response => {
    const entities = denormalisedResponseEntities(response);
    const order = entities[0];

    dispatch(addMarketplaceEntities(response));
    dispatch(requestRentalAgreementSuccess());
    dispatch(fetchCurrentUserNotifications());
    return order;
  };

  const handleError = e => {
    dispatch(requestRentalAgreementError(storableError(e)));
    const transactionIdMaybe = txId ? { transactionId: txId.uuid } : {};
    log.error(e, 'host-requests-agreement-failed', {
      ...transactionIdMaybe,
      listingId: bodyParams?.params?.listingId?.uuid,
      bookingStart: bodyParams.bookingStart,
      bookingEnd: bodyParams.bookingEnd,
    });
    throw e;
  };

  // transition privileged
  return transitionPrivileged({ bookingData, bodyParams, queryParams })
    .then(handleSucces)
    .catch(handleError);
};

export const cancelAfterAgreementSent = data => (dispatch, getState, sdk) => {
  console.log('🚀 | file: TransactionPage.duck.js | line 778 | data', data);
  const { txId, actor } = data;
  dispatch(cancelAfterAgreementSentRequest());
  const transition =
    actor === 'provider'
      ? TRANSITION_HOST_CANCELS_AFTER_AGREEMENT_SENT
      : TRANSITION_RENTER_CANCELS_AFTER_AGREEMENT_SENT;
  return sdk.transactions
    .transition(
      {
        id: txId,
        transition: transition,
        params: {},
      },
      { expand: true }
    )
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(cancelAfterAgreementSentSuccess());
      dispatch(fetchCurrentUserNotifications());
      return response;
    })
    .catch(e => {
      dispatch(cancelAfterAgreementSentError(storableError(e)));
      log.error(e, 'cancel-during-rad-failed', {
        txId: txId,
        transition: transition,
      });
      throw e;
    });
};

export const signRentalAgreement = data => (dispatch, getState, sdk) => {
  // TODO: Add booking data to params here
  const { txId, listingId } = data;

  dispatch(signRentalAgreementRequest());
  const bookingData = {
    startDate: moment()
      .add(1, 'days')
      .toISOString(),
    endDate: moment()
      .add(30, 'days')
      .toISOString(),
  };
  const bodyParams = {
    id: txId.uuid,
    transition: TRANSITION_RENTER_SIGNS_RENTAL_AGREEMENT,
    params: {},
  };
  const queryParams = { expand: true };
  return transitionPrivilegedSimple({ bodyParams, queryParams })
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(signRentalAgreementSuccess());
      dispatch(fetchCurrentUserNotifications());
      return response;
    })
    .catch(e => {
      dispatch(signRentalAgreementError(storableError(e)));
      log.error(e, 'renter-signs-agreement-failed', {
        txId,
        transition: TRANSITION_RENTER_SIGNS_RENTAL_AGREEMENT,
      });
      throw e;
    });
};

export const acceptSale = id => (dispatch, getState, sdk) => {
  if (acceptOrDeclineInProgress(getState())) {
    return Promise.reject(new Error('Accept or decline already in progress'));
  }
  dispatch(acceptSaleRequest());

  return sdk.transactions
    .transition({ id, transition: TRANSITION_ACCEPT, params: {} }, { expand: true })
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(acceptSaleSuccess());
      dispatch(fetchCurrentUserNotifications());
      return response;
    })
    .catch(e => {
      dispatch(acceptSaleError(storableError(e)));
      log.error(e, 'accept-sale-failed', {
        txId: id,
        transition: TRANSITION_ACCEPT,
      });
      throw e;
    });
};

export const declineSale = id => (dispatch, getState, sdk) => {
  if (acceptOrDeclineInProgress(getState())) {
    return Promise.reject(new Error('Accept or decline already in progress'));
  }
  dispatch(declineSaleRequest());

  return sdk.transactions
    .transition({ id, transition: TRANSITION_DECLINE, params: {} }, { expand: true })
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(declineSaleSuccess());
      dispatch(fetchCurrentUserNotifications());
      return response;
    })
    .catch(e => {
      dispatch(declineSaleError(storableError(e)));
      log.error(e, 'reject-sale-failed', {
        txId: id,
        transition: TRANSITION_DECLINE,
      });
      throw e;
    });
};

const fetchMessages = (txId, page) => (dispatch, getState, sdk) => {
  const paging = { page, per_page: MESSAGES_PAGE_SIZE };
  dispatch(fetchMessagesRequest());

  return sdk.messages
    .query({
      transaction_id: txId,
      include: ['sender', 'sender.profileImage'],
      ...IMAGE_VARIANTS,
      ...paging,
    })
    .then(response => {
      const messages = denormalisedResponseEntities(response);
      const { totalItems, totalPages, page: fetchedPage } = response.data.meta;
      const pagination = { totalItems, totalPages, page: fetchedPage };
      const totalMessages = getState().TransactionPage.totalMessages;

      // Original fetchMessages call succeeded
      dispatch(fetchMessagesSuccess(messages, pagination));

      // Check if totalItems has changed between fetched pagination pages
      // if totalItems has changed, fetch first page again to include new incoming messages.
      // TODO if there're more than 100 incoming messages,
      // this should loop through most recent pages instead of fetching just the first one.
      if (totalItems > totalMessages && page > 1) {
        dispatch(fetchMessages(txId, 1))
          .then(() => {
            // Original fetch was enough as a response for user action,
            // this just includes new incoming messages
          })
          .catch(() => {
            // Background update, no need to to do anything atm.
          });
      }
    })
    .catch(e => {
      dispatch(fetchMessagesError(storableError(e)));
      throw e;
    });
};

export const fetchMoreMessages = txId => (dispatch, getState, sdk) => {
  const state = getState();
  const { oldestMessagePageFetched, totalMessagePages } = state.TransactionPage;
  const hasMoreOldMessages = totalMessagePages > oldestMessagePageFetched;

  // In case there're no more old pages left we default to fetching the current cursor position
  const nextPage = hasMoreOldMessages ? oldestMessagePageFetched + 1 : oldestMessagePageFetched;

  return dispatch(fetchMessages(txId, nextPage));
};

export const sendMessage = (txId, message) => (dispatch, getState, sdk) => {
  dispatch(sendMessageRequest());

  return sdk.messages
    .send({ transactionId: txId, content: message })
    .then(response => {
      const messageId = response.data.data.id;

      // We fetch the first page again to add sent message to the page data
      // and update possible incoming messages too.
      // TODO if there're more than 100 incoming messages,
      // this should loop through most recent pages instead of fetching just the first one.
      return dispatch(fetchMessages(txId, 1))
        .then(() => {
          dispatch(sendMessageSuccess());
          return messageId;
        })
        .catch(() => dispatch(sendMessageSuccess()));
    })
    .catch(e => {
      console.error(e);
      // dispatch(sendMessageError(storableError(e)));
      // Rethrow so the page can track whether the sending failed, and
      // keep the message in the form for a retry.
      // throw e;
    });
};

const REVIEW_TX_INCLUDES = ['reviews', 'reviews.author', 'reviews.subject'];
const IMAGE_VARIANTS = {
  'fields.image': [
    // Profile images
    'variants.square-small',
    'variants.square-small2x',

    // Listing images:
    'variants.landscape-crop',
    'variants.landscape-crop2x',
  ],
};

// If other party has already sent a review, we need to make transition to
// TRANSITION_REVIEW_2_BY_<CUSTOMER/PROVIDER>
const sendReviewAsSecond = (id, params, role, dispatch, sdk) => {
  const transition = getReview2Transition(role === CUSTOMER);

  const include = REVIEW_TX_INCLUDES;

  return sdk.transactions
    .transition({ id, transition, params }, { expand: true, include, ...IMAGE_VARIANTS })
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(sendReviewSuccess());
      return response;
    })
    .catch(e => {
      dispatch(sendReviewError(storableError(e)));

      // Rethrow so the page can track whether the sending failed, and
      // keep the message in the form for a retry.
      throw e;
    });
};

// If other party has not yet sent a review, we need to make transition to
// TRANSITION_REVIEW_1_BY_<CUSTOMER/PROVIDER>
// However, the other party might have made the review after previous data synch point.
// So, error is likely to happen and then we must try another state transition
// by calling sendReviewAsSecond().
const sendReviewAsFirst = (id, params, role, dispatch, sdk) => {
  const transition = getReview1Transition(role === CUSTOMER);
  const include = REVIEW_TX_INCLUDES;

  return sdk.transactions
    .transition({ id, transition, params }, { expand: true, include, ...IMAGE_VARIANTS })
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(sendReviewSuccess());
      return response;
    })
    .catch(e => {
      // If transaction transition is invalid, lets try another endpoint.
      if (isTransactionsTransitionInvalidTransition(e)) {
        return sendReviewAsSecond(id, params, role, dispatch, sdk);
      } else {
        dispatch(sendReviewError(storableError(e)));

        // Rethrow so the page can track whether the sending failed, and
        // keep the message in the form for a retry.
        throw e;
      }
    });
};

export const sendReview = (role, tx, reviewRating, reviewContent) => (dispatch, getState, sdk) => {
  const params = { reviewRating, reviewContent };

  const txStateOtherPartyFirst = txIsInFirstReviewBy(tx, role !== CUSTOMER);

  dispatch(sendReviewRequest());

  return txStateOtherPartyFirst
    ? sendReviewAsSecond(tx.id, params, role, dispatch, sdk)
    : sendReviewAsFirst(tx.id, params, role, dispatch, sdk);
};

const isNonEmpty = value => {
  return typeof value === 'object' || Array.isArray(value) ? !isEmpty(value) : !!value;
};

const timeSlotsRequest = params => (dispatch, getState, sdk) => {
  return sdk.timeslots.query(params).then(response => {
    return denormalisedResponseEntities(response);
  });
};

const fetchTimeSlots = listingId => (dispatch, getState, sdk) => {
  dispatch(fetchTimeSlotsRequest);

  // Time slots can be fetched for 90 days at a time,
  // for at most 180 days from now. If max number of bookable
  // day exceeds 90, a second request is made.

  const maxTimeSlots = 90;
  // booking range: today + bookable days -1
  const bookingRange = config.dayCountAvailableForBooking - 1;
  const timeSlotsRange = Math.min(bookingRange, maxTimeSlots);

  const start = moment
    .utc()
    .startOf('day')
    .toDate();
  const end = moment()
    .utc()
    .startOf('day')
    .add(timeSlotsRange, 'days')
    .toDate();
  const params = { listingId, start, end };

  return dispatch(timeSlotsRequest(params))
    .then(timeSlots => {
      const secondRequest = bookingRange > maxTimeSlots;

      if (secondRequest) {
        const secondRange = Math.min(maxTimeSlots, bookingRange - maxTimeSlots);
        const secondParams = {
          listingId,
          start: end,
          end: moment(end)
            .add(secondRange, 'days')
            .toDate(),
        };

        return dispatch(timeSlotsRequest(secondParams)).then(secondBatch => {
          const combined = timeSlots.concat(secondBatch);
          dispatch(fetchTimeSlotsSuccess(combined));
        });
      } else {
        dispatch(fetchTimeSlotsSuccess(timeSlots));
      }
    })
    .catch(e => {
      dispatch(fetchTimeSlotsError(storableError(e)));
    });
};

export const fetchNextTransitions = id => (dispatch, getState, sdk) => {
  dispatch(fetchTransitionsRequest());

  return sdk.processTransitions
    .query({ transactionId: id })
    .then(res => {
      dispatch(fetchTransitionsSuccess(res.data.data));
    })
    .catch(e => {
      dispatch(fetchTransitionsError(storableError(e)));
    });
};

export const fetchTransactionLineItems = ({ bookingData, listingId, isOwnListing }) => dispatch => {
  dispatch(fetchLineItemsRequest());
  transactionLineItems({ bookingData, listingId, isOwnListing })
    .then(response => {
      const lineItems = response.data;
      dispatch(fetchLineItemsSuccess(lineItems));
    })
    .catch(e => {
      dispatch(fetchLineItemsError(storableError(e)));
      log.error(e, 'fetching-line-items-failed', {
        listingId: listingId.uuid,
        bookingData: bookingData,
      });
    });
};

// loadData is a collection of async calls that need to be made
// before page has all the info it needs to render itself
export const loadData = params => (dispatch, getState) => {
  const txId = new UUID(params.id);
  const state = getState().TransactionPage;
  const txRef = state.transactionRef;
  const txRole = params.transactionRole;

  // In case a transaction reference is found from a previous
  // data load -> clear the state. Otherwise keep the non-null
  // and non-empty values which may have been set from a previous page.
  const initialValues = txRef ? {} : pickBy(state, isNonEmpty);
  dispatch(setInitialValues(initialValues));

  // Sale / order (i.e. transaction entity in API)
  return Promise.all([
    dispatch(fetchTransaction(txId, txRole)),
    dispatch(fetchMessages(txId, 1)),
    dispatch(fetchNextTransitions(txId)),
  ]);
};
