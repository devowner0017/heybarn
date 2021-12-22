import { updatedEntities, denormalisedEntities } from '../../util/data';
import { storableError } from '../../util/errors';
import { parse } from '../../util/urlHelpers';

// Pagination page size might need to be dynamic on responsive page layouts
// Current design has max 3 columns 42 is divisible by 2 and 3
// So, there's enough cards to fill all columns on full pagination pages
const RESULT_PAGE_SIZE = 42;

// ================ Action types ================ //

export const FETCH_LISTINGS_REQUEST = 'app/ManageListingsPage/FETCH_LISTINGS_REQUEST';
export const FETCH_LISTINGS_SUCCESS = 'app/ManageListingsPage/FETCH_LISTINGS_SUCCESS';
export const FETCH_LISTINGS_ERROR = 'app/ManageListingsPage/FETCH_LISTINGS_ERROR';

export const FETCH_TRANSACTIONS_REQUEST = 'app/ManageListingsPage/FETCH_TRANSACTIONS_REQUEST';
export const FETCH_TRANSACTIONS_SUCCESS = 'app/ManageListingsPage/FETCH_TRANSACTIONS_SUCCESS';
export const FETCH_TRANSACTIONS_ERROR = 'app/ManageListingsPage/FETCH_TRANSACTIONS_ERROR';

export const OPEN_LISTING_REQUEST = 'app/ManageListingsPage/OPEN_LISTING_REQUEST';
export const OPEN_LISTING_SUCCESS = 'app/ManageListingsPage/OPEN_LISTING_SUCCESS';
export const OPEN_LISTING_ERROR = 'app/ManageListingsPage/OPEN_LISTING_ERROR';

export const CLOSE_LISTING_REQUEST = 'app/ManageListingsPage/CLOSE_LISTING_REQUEST';
export const CLOSE_LISTING_SUCCESS = 'app/ManageListingsPage/CLOSE_LISTING_SUCCESS';
export const CLOSE_LISTING_ERROR = 'app/ManageListingsPage/CLOSE_LISTING_ERROR';

export const DISCARD_LISTING_REQUEST = 'app/ManageListingsPage/DISCARD_LISTING_REQUEST';
export const DISCARD_LISTING_SUCCESS = 'app/ManageListingsPage/DISCARD_LISTING_SUCCESS';
export const DISCARD_LISTING_ERROR = 'app/ManageListingsPage/DISCARD_LISTING_ERROR';

export const DELETE_LISTING_REQUEST = 'app/ManageListingsPage/DELETE_LISTING_REQUEST';
export const DELETE_LISTING_SUCCESS = 'app/ManageListingsPage/DELETE_LISTING_SUCCESS';
export const DELETE_LISTING_ERROR = 'app/ManageListingsPage/DELETE_LISTING_ERROR';

export const ADD_OWN_ENTITIES = 'app/ManageListingsPage/ADD_OWN_ENTITIES';

// ================ Reducer ================ //

const initialState = {
  pagination: null,
  queryParams: null,
  queryInProgress: false,
  queryListingsError: null,
  currentPageResultIds: [],
  ownEntities: {},
  openingListing: null,
  openingListingError: null,
  closingListing: null,
  closingListingError: null,

  discardingListing: null,
  discardingListingError: null,

  deletingListing: null,
  deletingListingError: null,
  queryTransactionsInProgress: null,
  queryTransactionsError: null,
  transactions: null,
};

const resultIds = data => data.data.map(l => l.id);

const merge = (state, sdkResponse) => {
  const apiResponse = sdkResponse.data;
  return {
    ...state,
    ownEntities: updatedEntities({ ...state.ownEntities }, apiResponse),
  };
};

const updateListingAttributes = (state, listingEntity) => {
  const oldListing = state.ownEntities.ownListing[listingEntity.id.uuid];
  const updatedListing = { ...oldListing, attributes: listingEntity.attributes };
  const ownListingEntities = {
    ...state.ownEntities.ownListing,
    [listingEntity.id.uuid]: updatedListing,
  };
  return {
    ...state,
    ownEntities: { ...state.ownEntities, ownListing: ownListingEntities },
  };
};

const manageListingsPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
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
    case FETCH_TRANSACTIONS_REQUEST:
      return {
        ...state,
        queryTransactionsInProgress: true,
        queryTransactionsError: null,
      };
    case FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: payload,
        queryTransactionsProgress: false,
      };
    case FETCH_TRANSACTIONS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, queryTransactionsProgress: false, queryTransactionsError: payload };

    case OPEN_LISTING_REQUEST:
      return {
        ...state,
        openingListing: payload.listingId,
        openingListingError: null,
      };
    case OPEN_LISTING_SUCCESS:
      return {
        ...updateListingAttributes(state, payload.data),
        openingListing: null,
      };
    case OPEN_LISTING_ERROR: {
      // eslint-disable-next-line no-console
      console.error(payload);
      return {
        ...state,
        openingListing: null,
        openingListingError: {
          listingId: state.openingListing,
          error: payload,
        },
      };
    }

    case CLOSE_LISTING_REQUEST:
      return {
        ...state,
        closingListing: payload.listingId,
        closingListingError: null,
      };
    case CLOSE_LISTING_SUCCESS:
      return {
        ...updateListingAttributes(state, payload.data),
        closingListing: null,
      };
    case CLOSE_LISTING_ERROR: {
      // eslint-disable-next-line no-console
      console.error(payload);
      return {
        ...state,
        closingListing: null,
        closingListingError: {
          listingId: state.closingListing,
          error: payload,
        },
      };
    }

    case DISCARD_LISTING_REQUEST:
      return {
        ...state,
        discardingListing: payload.listingId,
        discardingListingError: null,
      };
    case DISCARD_LISTING_SUCCESS:
      return {
        ...updateListingAttributes(state, payload.data),
        discardingListing: null,
      };
    case DISCARD_LISTING_ERROR: {
      // eslint-disable-next-line no-console
      console.error(payload);
      return {
        ...state,
        discardingListing: null,
        discardingListingError: {
          listingId: state.discardingListing,
          error: payload,
        },
      };
    }
    case DELETE_LISTING_REQUEST:
      return {
        ...state,
        deletingListing: payload.listingId,
        deletingListingError: null,
      };
    case DELETE_LISTING_SUCCESS:
      return {
        ...updateListingAttributes(state, payload.data),
        deletingListing: null,
      };
    case DELETE_LISTING_ERROR: {
      // eslint-disable-next-line no-console
      console.error(payload);
      return {
        ...state,
        deletingListing: null,
        deletingListingError: {
          listingId: state.deletingListing,
          error: payload,
        },
      };
    }

    case ADD_OWN_ENTITIES:
      return merge(state, payload);

    default:
      return state;
  }
};

export default manageListingsPageReducer;

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

// This works the same way as addMarketplaceEntities,
// but we don't want to mix own listings with searched listings
// (own listings data contains different info - e.g. exact location etc.)
export const addOwnEntities = sdkResponse => ({
  type: ADD_OWN_ENTITIES,
  payload: sdkResponse,
});

export const openListingRequest = listingId => ({
  type: OPEN_LISTING_REQUEST,
  payload: { listingId },
});

export const openListingSuccess = response => ({
  type: OPEN_LISTING_SUCCESS,
  payload: response.data,
});

export const openListingError = e => ({
  type: OPEN_LISTING_ERROR,
  error: true,
  payload: e,
});

export const closeListingRequest = listingId => ({
  type: CLOSE_LISTING_REQUEST,
  payload: { listingId },
});

export const closeListingSuccess = response => ({
  type: CLOSE_LISTING_SUCCESS,
  payload: response.data,
});

export const closeListingError = e => ({
  type: CLOSE_LISTING_ERROR,
  error: true,
  payload: e,
});

export const discardListingRequest = listingId => ({
  type: DISCARD_LISTING_REQUEST,
  payload: { listingId },
});

export const discardListingSuccess = response => ({
  type: DISCARD_LISTING_SUCCESS,
  payload: response.data,
});

export const discardListingError = e => ({
  type: DISCARD_LISTING_ERROR,
  error: true,
  payload: e,
});

export const deleteListingRequest = listingId => ({
  type: DELETE_LISTING_REQUEST,
  payload: { listingId },
});

export const deleteListingSuccess = response => ({
  type: DELETE_LISTING_SUCCESS,
  payload: response.data,
});

export const deleteListingError = e => ({
  type: DELETE_LISTING_ERROR,
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
export const queryTransactionsRequest = queryParams => ({
  type: FETCH_TRANSACTIONS_REQUEST,
  payload: { queryParams },
});

export const queryTransactionsSuccess = response => ({
  type: FETCH_TRANSACTIONS_SUCCESS,
  payload: { data: response.data },
});

export const queryTransactionsError = e => ({
  type: FETCH_TRANSACTIONS_ERROR,
  error: true,
  payload: e,
});

// Throwing error for new (loadData may need that info)
export const queryOwnListings = queryParams => (dispatch, getState, sdk) => {
  dispatch(queryListingsRequest(queryParams));
  const { perPage, ...rest } = queryParams;
  const params = { ...rest, per_page: perPage };
  const listingType = queryParams.pub_listingType;
  return sdk.ownListings
    .query(params)
    .then(response => {
      console.log('🚀 | file: ManageListingsPage.duck.js | line 361 | response', response);
      const filteredResults = response.data.data.filter(r => {
        const responseListingType = r.attributes.publicData.listingType;
        const notDeleted = r.attributes.publicData.notDeleted;
        return responseListingType === listingType && notDeleted;
      });
      let alteredResponse = response;
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
// Throwing error for new (loadData may need that info)
export const queryOwnTransactions = queryParams => (dispatch, getState, sdk) => {
  dispatch(queryTransactionsRequest(queryParams));
  return sdk.transactions
    .query({
      lastTransitions: [
        TRANSITION_HOST_FEE_PAID,
        TRANSITION_RENTER_FEE_PAID,
        TRANSITION_HOST_APPROVED_BY_RENTER,
        TRANSITION_HOST_ACCEPTS_COMMUNICATION,
        TRANSITION_HOST_DECLINES_COMMUNICATION,
        TRANSITION_RENTER_ACCEPTS_COMMUNICATION,
        TRANSITION_HOST_SENDS_AGREEMENT,
        TRANSITION_RENTER_SIGNS_RENTAL_AGREEMENT,
      ],
      ...queryParams,
    })
    .then(response => {
      dispatch(queryTransactionsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(queryTransactionsError(storableError(e)));
      throw e;
    });
};

export const closeListing = listingId => (dispatch, getState, sdk) => {
  dispatch(closeListingRequest(listingId));

  return sdk.ownListings
    .close({ id: listingId }, { expand: true })
    .then(response => {
      dispatch(closeListingSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(closeListingError(storableError(e)));
    });
};

export const discardListing = listingId => (dispatch, getState, sdk) => {
  dispatch(discardListingRequest(listingId));

  return sdk.ownListings
    .discardDraft({ id: listingId }, { expand: true })
    .then(response => {
      dispatch(discardListingSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(discardListingError(storableError(e)));
    });
};

export const deleteListing = (listingId, listingType) => (dispatch, getState, sdk) => {
  dispatch(deleteListingRequest(listingId));

  return sdk.ownListings
    .update({ id: listingId, publicData: { notDeleted: false } }, { expand: true })
    .then(response => {
      dispatch(deleteListingSuccess(response));
      if (listingType === 'adverts') {
        dispatch(
          queryOwnListings({
            pub_listingType: 'advert',
            pub_notDeleted: true,
            perPage: RESULT_PAGE_SIZE,
            include: ['images'],
            'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
            'limit.images': 1,
          })
        );
      } else {
        dispatch(
          queryOwnListings({
            pub_listingType: 'listing',
            pub_notDeleted: true,
            perPage: RESULT_PAGE_SIZE,
            include: ['images'],
            'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
            'limit.images': 1,
          })
        );
      }
      return response;
    })
    .catch(e => {
      dispatch(deleteListingError(storableError(e)));
    });
};

export const openListing = listingId => (dispatch, getState, sdk) => {
  dispatch(openListingRequest(listingId));

  return sdk.ownListings
    .open({ id: listingId }, { expand: true })
    .then(response => {
      dispatch(openListingSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(openListingError(storableError(e)));
    });
};

export const loadListingData = (props = {}) => {
  console.log('🚀 | file: ManageListingsPage.duck.js | line 467 | loadListingData | props', props);
  const { params, search } = props;
  const queryParams = parse(search);
  const page = queryParams.page || 1;
  queryOwnTransactions({
    include: ['listing'],
  });
  return queryOwnListings({
    ...queryParams,
    page,
    pub_listingType: 'listing',
    pub_notDeleted: true,
    perPage: RESULT_PAGE_SIZE,
    include: ['images'],
    'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
    'limit.images': 1,
  });
};

export const loadAdvertData = props => {
  const { params, search } = props;
  const queryParams = parse(search);
  const page = queryParams.page || 1;
  queryOwnTransactions({
    include: ['listing'],
  });
  return queryOwnListings({
    ...queryParams,
    page,
    pub_listingType: 'advert',
    pub_notDeleted: true,
    perPage: RESULT_PAGE_SIZE,
    include: ['images'],
    'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
    'limit.images': 1,
  });
};
