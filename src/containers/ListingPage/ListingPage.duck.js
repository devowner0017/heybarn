import pick from 'lodash/pick';
import moment from 'moment';
import config from '../../config';
import { types as sdkTypes } from '../../util/sdkLoader';
import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { fetchListingTransactions, transactionLineItems } from '../../util/api';
import * as log from '../../util/log';
import { denormalisedResponseEntities } from '../../util/data';
import { TRANSITION_ENQUIRE } from '../../util/transaction';
import {
  LISTING_PAGE_DRAFT_VARIANT,
  LISTING_PAGE_PENDING_APPROVAL_VARIANT,
} from '../../util/urlHelpers';
import { fetchCurrentUser, fetchCurrentUserHasOrdersSuccess } from '../../ducks/user.duck';
import { ACTIVE_TRANSITIONS } from '../../util/transaction';
const { UUID } = sdkTypes;
// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/ListingPage/SET_INITIAL_VALUES';

export const SHOW_LISTING_REQUEST = 'app/ListingPage/SHOW_LISTING_REQUEST';
export const SHOW_LISTING_ERROR = 'app/ListingPage/SHOW_LISTING_ERROR';

export const FETCH_REVIEWS_REQUEST = 'app/ListingPage/FETCH_REVIEWS_REQUEST';
export const FETCH_REVIEWS_SUCCESS = 'app/ListingPage/FETCH_REVIEWS_SUCCESS';
export const FETCH_REVIEWS_ERROR = 'app/ListingPage/FETCH_REVIEWS_ERROR';

export const GET_CURRENT_TRANSACTIONS_REQUEST = 'app/ListingPage/GET_CURRENT_TRANSACTIONS_REQUEST';
export const GET_CURRENT_TRANSACTIONS_SUCCESS = 'app/ListingPage/GET_CURRENT_TRANSACTIONS_SUCCESS';
export const GET_CURRENT_TRANSACTIONS_ERROR = 'app/ListingPage/GET_CURRENT_TRANSACTIONS_ERROR';

export const FETCH_TIME_SLOTS_REQUEST = 'app/ListingPage/FETCH_TIME_SLOTS_REQUEST';
export const FETCH_TIME_SLOTS_SUCCESS = 'app/ListingPage/FETCH_TIME_SLOTS_SUCCESS';
export const FETCH_TIME_SLOTS_ERROR = 'app/ListingPage/FETCH_TIME_SLOTS_ERROR';

export const FETCH_LINE_ITEMS_REQUEST = 'app/ListingPage/FETCH_LINE_ITEMS_REQUEST';
export const FETCH_LINE_ITEMS_SUCCESS = 'app/ListingPage/FETCH_LINE_ITEMS_SUCCESS';
export const FETCH_LINE_ITEMS_ERROR = 'app/ListingPage/FETCH_LINE_ITEMS_ERROR';

export const SEND_ENQUIRY_REQUEST = 'app/ListingPage/SEND_ENQUIRY_REQUEST';
export const SEND_ENQUIRY_SUCCESS = 'app/ListingPage/SEND_ENQUIRY_SUCCESS';
export const SEND_ENQUIRY_ERROR = 'app/ListingPage/SEND_ENQUIRY_ERROR';

// ================ Reducer ================ //

const initialState = {
  id: null,
  showListingError: null,
  reviews: [],
  fetchReviewsError: null,
  timeSlots: null,
  fetchTimeSlotsError: null,
  lineItems: null,
  fetchLineItemsInProgress: false,
  fetchLineItemsError: null,
  sendEnquiryInProgress: false,
  sendEnquiryError: null,
  enquiryModalOpenForListingId: null,
  currentUserInTransaction: false,
};

const listingPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_VALUES:
      return { ...initialState, ...payload };

    case SHOW_LISTING_REQUEST:
      return { ...state, id: payload.id, showListingError: null };
    case SHOW_LISTING_ERROR:
      return { ...state, showListingError: payload };

    case FETCH_REVIEWS_REQUEST:
      return { ...state, fetchReviewsError: null };
    case FETCH_REVIEWS_SUCCESS:
      return { ...state, reviews: payload };
    case FETCH_REVIEWS_ERROR:
      return { ...state, fetchReviewsError: payload };

    case GET_CURRENT_TRANSACTIONS_REQUEST:
      return { ...state, getCurrentTransactionsError: null };
    case GET_CURRENT_TRANSACTIONS_SUCCESS:
      return { ...state, currentUserInTransaction: payload };
    case GET_CURRENT_TRANSACTIONS_ERROR:
      return { ...state, getCurrentTransactionsError: payload };

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

    case SEND_ENQUIRY_REQUEST:
      return { ...state, sendEnquiryInProgress: true, sendEnquiryError: null };
    case SEND_ENQUIRY_SUCCESS:
      return { ...state, sendEnquiryInProgress: false };
    case SEND_ENQUIRY_ERROR:
      return { ...state, sendEnquiryInProgress: false, sendEnquiryError: payload };

    default:
      return state;
  }
};

export default listingPageReducer;

// ================ Action creators ================ //

export const setInitialValues = initialValues => ({
  type: SET_INITIAL_VALUES,
  payload: pick(initialValues, Object.keys(initialState)),
});

export const showListingRequest = id => ({
  type: SHOW_LISTING_REQUEST,
  payload: { id },
});

export const showListingError = e => ({
  type: SHOW_LISTING_ERROR,
  error: true,
  payload: e,
});

export const fetchReviewsRequest = () => ({ type: FETCH_REVIEWS_REQUEST });
export const fetchReviewsSuccess = reviews => ({ type: FETCH_REVIEWS_SUCCESS, payload: reviews });
export const fetchReviewsError = error => ({
  type: FETCH_REVIEWS_ERROR,
  error: true,
  payload: error,
});

export const getCurrentTransactionsRequest = () => ({ type: GET_CURRENT_TRANSACTIONS_REQUEST });
export const getCurrentTransactionsSuccess = reviews => ({
  type: GET_CURRENT_TRANSACTIONS_SUCCESS,
  payload: reviews,
});
export const getCurrentTransactionsError = error => ({
  type: GET_CURRENT_TRANSACTIONS_ERROR,
  error: true,
  payload: error,
});

export const fetchTimeSlotsRequest = () => ({ type: FETCH_TIME_SLOTS_REQUEST });
export const fetchTimeSlotsSuccess = timeSlots => ({
  type: FETCH_TIME_SLOTS_SUCCESS,
  payload: timeSlots,
});
export const fetchTimeSlotsError = error => ({
  type: FETCH_TIME_SLOTS_ERROR,
  error: true,
  payload: error,
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

export const sendEnquiryRequest = () => ({ type: SEND_ENQUIRY_REQUEST });
export const sendEnquirySuccess = () => ({ type: SEND_ENQUIRY_SUCCESS });
export const sendEnquiryError = e => ({ type: SEND_ENQUIRY_ERROR, error: true, payload: e });

// ================ Thunks ================ //

export const showListing = (listingId, isOwn = false) => (dispatch, getState, sdk) => {
  dispatch(showListingRequest(listingId));
  dispatch(fetchCurrentUser());
  const params = {
    id: listingId,
    include: ['author', 'author.profileImage', 'images'],
    'fields.image': [
      // Listing page
      'variants.landscape-crop',
      'variants.landscape-crop2x',
      'variants.landscape-crop4x',
      'variants.landscape-crop6x',

      // Social media
      'variants.facebook',
      'variants.twitter',

      // Image carousel
      'variants.scaled-small',
      'variants.scaled-medium',
      'variants.scaled-large',
      'variants.scaled-xlarge',

      // Avatars
      'variants.square-small',
      'variants.square-small2x',
    ],
  };

  const show = isOwn ? sdk.ownListings.show(params) : sdk.listings.show(params);

  return show
    .then(data => {
      console.log('🚀 | file: ListingPage.duck.js | line 214 | showListing | data', data);
      dispatch(addMarketplaceEntities(data));
      return data;
    })
    .catch(e => {
      dispatch(showListingError(storableError(e)));
    });
};

const currentTransactions = listingId => (dispatch, getState, sdk) => {
console.log("🚀 | file: ListingPage.duck.js | line 224 | listingId", listingId);
  dispatch(getCurrentTransactionsRequest());
  const show = sdk.listings.show({ id: listingId, include: ['author'] });

  return dispatch(fetchCurrentUser()).then(response => {
    const currentUser = getState().user.currentUser;
    if (currentUser) {
      show.then(data => {
        const listing = denormalisedResponseEntities(data)?.[0];
        const authorId = listing?.author.id.uuid;
        const isOwn = currentUser.id.uuid === authorId;
        return fetchListingTransactions({
          listingId: listingId.uuid,
          customerId: isOwn ? authorId : currentUser.id.uuid,
          providerId: isOwn ? currentUser.id.uuid : authorId,
        })
          .then(response => {
          console.log("🚀 | file: ListingPage.duck.js | line 241 | returndispatch | response", response);
            const transactions = denormalisedResponseEntities(response);
            const activeTransaction = transactions.find(t => {
              console.log('🚀 | file: ListingPage.duck.js | line 244 | returndispatch | t', t);
            return  ACTIVE_TRANSITIONS.includes(t.attributes.lastTransition);
            });
            console.log("🚀 | file: ListingPage.duck.js | line 246 | returndispatch | activeTransaction", activeTransaction);
            dispatch(getCurrentTransactionsSuccess(activeTransaction));
          })
          .catch(e => {
            dispatch(getCurrentTransactionsError(storableError(e)));
          });
      });
    }
  });
};

export const fetchReviews = listingId => (dispatch, getState, sdk) => {
  dispatch(fetchReviewsRequest());
  return sdk.reviews
    .query({
      listing_id: listingId,
      state: 'public',
      include: ['author', 'author.profileImage'],
      'fields.image': ['variants.square-small', 'variants.square-small2x'],
    })
    .then(response => {
      const reviews = denormalisedResponseEntities(response);
      dispatch(fetchReviewsSuccess(reviews));
    })
    .catch(e => {
      dispatch(fetchReviewsError(storableError(e)));
    });
};

const timeSlotsRequest = params => (dispatch, getState, sdk) => {
  return sdk.timeslots.query(params).then(response => {
    return denormalisedResponseEntities(response);
  });
};

export const fetchTimeSlots = listingId => (dispatch, getState, sdk) => {
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

export const sendEnquiry = (listingId, message) => (dispatch, getState, sdk) => {
  dispatch(sendEnquiryRequest());
  const bodyParams = {
    transition: TRANSITION_ENQUIRE,
    processAlias: config.bookingProcessAlias,
    params: { listingId },
  };
  return sdk.transactions
    .initiate(bodyParams)
    .then(response => {
      const transactionId = response.data.data.id;

      // Send the message to the created transaction
      return sdk.messages.send({ transactionId, content: message }).then(() => {
        dispatch(sendEnquirySuccess());
        dispatch(fetchCurrentUserHasOrdersSuccess(true));
        return transactionId;
      });
    })
    .catch(e => {
      dispatch(sendEnquiryError(storableError(e)));
      throw e;
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

export const loadData = (params, search) => dispatch => {
  const listingId = new UUID(params.id);

  const ownListingVariants = [LISTING_PAGE_DRAFT_VARIANT, LISTING_PAGE_PENDING_APPROVAL_VARIANT];
  if (ownListingVariants.includes(params.variant)) {
    return dispatch(showListing(listingId, true));
  }

  if (config.enableAvailability) {
    return Promise.all([
      dispatch(showListing(listingId)),
      dispatch(currentTransactions(listingId)),
      dispatch(fetchTimeSlots(listingId)),
      // dispatch(fetchReviews(listingId)),
    ]);
  } else {
    return Promise.all([
      dispatch(showListing(listingId)),
      dispatch(currentTransactions(listingId)),
      // dispatch(fetchReviews(listingId))
    ]);
  }
};
