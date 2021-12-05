import pick from 'lodash/pick';
import config from '../../config';
import { types as sdkTypes } from '../../util/sdkLoader';
import { storableError } from '../../util/errors';
import { TRANSITION_HOST_FEE_PAID, TRANSITION_RENTER_FEE_PAID } from '../../util/transaction';
import * as log from '../../util/log';
import {
  updatedEntities,
  denormalisedEntities,
  denormalisedResponseEntities,
} from '../../util/data';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { fetchCurrentUser, fetchCurrentUserHasOrdersSuccess } from '../../ducks/user.duck';
import { updateListingState } from '../../util/api';
import { LISTING_LIVE, LISTING_UNDER_ENQUIRY } from '../../util/types';
import { queryOwnListings } from '../ManageListingsPage/ManageListingsPage.duck';
const { UUID } = sdkTypes;

// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/TransactionInitPage/SET_INITIAL_VALUES';

export const SHOW_LISTING_REQUEST = 'app/TransactionInitPage/SHOW_LISTING_REQUEST';
export const SHOW_LISTING_ERROR = 'app/TransactionInitPage/SHOW_LISTING_ERROR';

export const INITIATE_ORDER_REQUEST = 'app/TransactionInitPage/INITIATE_ORDER_REQUEST';
export const INITIATE_ORDER_SUCCESS = 'app/TransactionInitPage/INITIATE_ORDER_SUCCESS';
export const INITIATE_ORDER_ERROR = 'app/TransactionInitPage/INITIATE_ORDER_ERROR';

export const ACCEPT_SALE_REQUEST = 'app/TransactionInitPage/ACCEPT_SALE_REQUEST';
export const ACCEPT_SALE_SUCCESS = 'app/TransactionInitPage/ACCEPT_SALE_SUCCESS';
export const ACCEPT_SALE_ERROR = 'app/TransactionInitPage/ACCEPT_SALE_ERROR';

export const DECLINE_SALE_REQUEST = 'app/TransactionInitPage/DECLINE_SALE_REQUEST';
export const DECLINE_SALE_SUCCESS = 'app/TransactionInitPage/DECLINE_SALE_SUCCESS';
export const DECLINE_SALE_ERROR = 'app/TransactionInitPage/DECLINE_SALE_ERROR';

export const STRIPE_CUSTOMER_REQUEST = 'app/TransactionInitPage/STRIPE_CUSTOMER_REQUEST';
export const STRIPE_CUSTOMER_SUCCESS = 'app/TransactionInitPage/STRIPE_CUSTOMER_SUCCESS';
export const STRIPE_CUSTOMER_ERROR = 'app/TransactionInitPage/STRIPE_CUSTOMER_ERROR';

export const FETCH_LISTINGS_REQUEST = 'app/TransactionInitPage/FETCH_LISTINGS_REQUEST';
export const FETCH_LISTINGS_SUCCESS = 'app/TransactionInitPage/FETCH_LISTINGS_SUCCESS';
export const FETCH_LISTINGS_ERROR = 'app/TransactionInitPage/FETCH_LISTINGS_ERROR';

export const ADD_OWN_ENTITIES = 'app/TransactionInitPage/ADD_OWN_ENTITIES';

// ================ Reducer ================ //

const initialState = {
  acceptInProgress: false,
  acceptSaleError: null,
  declineInProgress: false,
  declineSaleError: null,
  stripeCustomerFetched: false,
  requestedListing: null,
  requestedAdvert: null,
  guest: null,
  host: null,
  contactingAs: null,

  queryParams: null,
  queryInProgress: false,
  queryListingsError: null,
  ownEntities: {},
  currentPageResultIds: null,
};

const resultIds = data => data.data.map(l => l.id);

const merge = (state, sdkResponse) => {
  const apiResponse = sdkResponse.data;
  return {
    ...state,
    ownEntities: updatedEntities({ ...state.ownEntities }, apiResponse),
  };
};

export default function checkoutPageReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_VALUES:
      return { ...initialState, ...payload };

    case SHOW_LISTING_REQUEST:
      return { ...state, id: payload.id, showListingError: null };
    case SHOW_LISTING_ERROR:
      return { ...state, showListingError: payload };

    case INITIATE_ORDER_REQUEST:
      return { ...state, initiateOrderError: null };
    case INITIATE_ORDER_SUCCESS:
      return { ...state, transaction: payload };
    case INITIATE_ORDER_ERROR:
      console.error(payload); // eslint-disable-line no-console
      return { ...state, initiateOrderError: payload };

    case STRIPE_CUSTOMER_REQUEST:
      return { ...state, stripeCustomerFetched: false };
    case STRIPE_CUSTOMER_SUCCESS:
      return { ...state, stripeCustomerFetched: true };
    case STRIPE_CUSTOMER_ERROR:
      console.error(payload); // eslint-disable-line no-console
      return { ...state, stripeCustomerFetchError: payload };

    case FETCH_LISTINGS_REQUEST:
      return {
        ...state,
        queryParams: payload.queryParams,
        queryInProgress: true,
        queryListingsError: null,
        currentPageResultIds: [],
      };
    case FETCH_LISTINGS_SUCCESS:
      return {
        ...state,
        currentPageResultIds: resultIds(payload.data),
        pagination: payload.data.meta,
        queryInProgress: false,
      };
    case FETCH_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, queryInProgress: false, queryListingsError: payload };

    case ADD_OWN_ENTITIES:
      return merge(state, payload);

    default:
      return state;
  }
}

// ================ Selectors ================ //

/**
 * Get the denormalised own listing entities with the given IDs
 *
 * @param {Object} state the full Redux store
 * @param {Array<UUID>} listingIds listing IDs to select from the store
 */
export const getOwnListingsById = (state, listingIds) => {
  const { ownEntities } = state.ManageListingsPage;
  const resources = listingIds.map(id => ({
    id,
    type: 'ownListing',
  }));
  const throwIfNotFound = false;
  return denormalisedEntities(ownEntities, resources, throwIfNotFound);
};

// ================ Action creators ================ //
export const setInitialValues = initialValues => {
  return {
    type: SET_INITIAL_VALUES,
    payload: pick(initialValues, Object.keys(initialState)),
  };
};

export const showListingRequest = id => ({
  type: SHOW_LISTING_REQUEST,
  payload: { id },
});

export const showListingError = e => ({
  type: SHOW_LISTING_ERROR,
  error: true,
  payload: e,
});

const initiateOrderRequest = () => ({ type: INITIATE_ORDER_REQUEST });

const initiateOrderSuccess = order => ({
  type: INITIATE_ORDER_SUCCESS,
  payload: order,
});

const initiateOrderError = e => ({
  type: INITIATE_ORDER_ERROR,
  error: true,
  payload: e,
});

export const queryListingsRequest = queryParams => ({
  type: FETCH_LISTINGS_REQUEST,
  payload: { queryParams },
});

export const queryListingsSuccess = response => ({
  type: FETCH_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const queryListingsError = e => ({
  type: FETCH_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const stripeCustomerRequest = () => ({ type: STRIPE_CUSTOMER_REQUEST });
export const stripeCustomerSuccess = () => ({ type: STRIPE_CUSTOMER_SUCCESS });
export const stripeCustomerError = e => ({
  type: STRIPE_CUSTOMER_ERROR,
  error: true,
  payload: e,
});

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
      dispatch(addMarketplaceEntities(data));
      return data;
    })
    .catch(e => {
      dispatch(showListingError(storableError(e)));
    });
};

export const createTransaction = orderParams => (dispatch, getState, sdk) => {
  dispatch(initiateOrderRequest());

  // TODO UPDATE THIS WHEN WE BUILD THE OTHER SIDE OF THE MARKETPLACE
  const isRequestFromHost = orderParams.protectedData.contactingAs === 'host';

  const transition = isRequestFromHost ? TRANSITION_HOST_FEE_PAID : TRANSITION_RENTER_FEE_PAID;

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

    updateListingState({ id: orderParams.listingId, listingState: LISTING_UNDER_ENQUIRY })
      .then(r => {})
      .catch(e => {});
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

export const sendMessage = params => (dispatch, getState, sdk) => {
  const message = params.message;
  const orderId = params.tx.id;
  const paymentIntent = params.paymentIntent;
  if (message) {
    return sdk.messages
      .send({ transactionId: orderId, content: message })
      .then(() => {
        return { orderId, messageSuccess: true, paymentIntent };
      })
      .catch(e => {
        log.error(e, 'initial-message-send-failed', { txId: orderId });
        return { orderId, messageSuccess: false };
      });
  } else {
    return Promise.resolve({ orderId, messageSuccess: true });
  }
};

// StripeCustomer is a relantionship to currentUser
// We need to fetch currentUser with correct params to include relationship
export const stripeCustomer = () => (dispatch, getState, sdk) => {
  dispatch(stripeCustomerRequest());
  return dispatch(fetchCurrentUser({ include: ['stripeCustomer.defaultPaymentMethod'] }))
    .then(response => {
      dispatch(stripeCustomerSuccess());
    })
    .catch(e => {
      dispatch(stripeCustomerError(storableError(e)));
    });
};

// This works the same way as addMarketplaceEntities,
// but we don't want to mix own listings with searched listings
// (own listings data contains different info - e.g. exact location etc.)
export const addOwnEntities = sdkResponse => ({
  type: ADD_OWN_ENTITIES,
  payload: sdkResponse,
});

export const fetchOwnListings = listingType => (dispatch, getState, sdk) => {
  dispatch(queryListingsRequest());
  const { currentUser } = getState().user;
  if (!currentUser) return null;
  return dispatch(
    queryOwnListings({
      page: 1,
      pub_listingType: listingType,
      perPage: 100,
      include: ['images'],
      'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
      'limit.images': 1,
    })
  )
    .then(ownListingsResponse => {
      const filteredResults = ownListingsResponse.data.data.filter(r => {
        const {
          publicData: { listingType: responseListingType, listingState },
          state,
        } = r.attributes;
        return (
          responseListingType === listingType &&
          listingState === LISTING_LIVE &&
          state === 'published'
        );
      });
      let alteredResponse = ownListingsResponse;
      alteredResponse.data.data = filteredResults;
      alteredResponse.data.meta.totalItems = filteredResults.length;
      dispatch(addOwnEntities(alteredResponse));
      dispatch(queryListingsSuccess(alteredResponse));
      return alteredResponse;
    })
    .catch(e => {
      dispatch(queryListingsError(storableError(e)));
      throw e;
    });
};

// loadData is a collection of async calls that need to be made
// before page has all the info it needs to render itself
export const loadData = params => (dispatch, getState) => {
  const { id, listingType } = params;
  const listingId = new UUID(id);

  // In case a transaction reference is found from a previous
  // data load -> clear the state. Otherwise keep the non-null
  // and non-empty values which may have been set from a previous page.
  // const initialValues = txRef ? {} : pickBy(state, isNonEmpty);
  // dispatch(setInitialValues(initialValues));

  return Promise.all([dispatch(showListing(listingId)), dispatch(fetchOwnListings(listingType))]);
};
