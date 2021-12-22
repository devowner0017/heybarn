import { storableError } from '../../util/errors';
import { retrieveRecommendedUsersFromApi } from '../../util/api';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { denormalisedResponseEntities } from '../../util/data';
import config from '../../config';
import { types as sdkTypes } from '../../util/sdkLoader';
import { LISTING_LIVE } from '../../util/types';
const { UUID } = sdkTypes;

// ================ Action types ================ //

export const RETRIEVE_RECOMMENDED_LISTINGS_REQUEST =
  'app/LandingPage/RETRIEVE_RECOMMENDED_LISTINGS_REQUEST';
export const RETRIEVE_RECOMMENDED_LISTINGS_SUCCESS =
  'app/LandingPage/RETRIEVE_RECOMMENDED_LISTINGS_SUCCESS';
export const RETRIEVE_RECOMMENDED_LISTINGS_ERROR =
  'app/LandingPage/RETRIEVE_RECOMMENDED_LISTINGS_ERROR';

export const RETRIEVE_RECOMMENDED_ADVERTS_REQUEST =
  'app/LandingPage/RETRIEVE_RECOMMENDED_ADVERTS_REQUEST';
export const RETRIEVE_RECOMMENDED_ADVERTS_SUCCESS =
  'app/LandingPage/RETRIEVE_RECOMMENDED_ADVERTS_SUCCESS';
export const RETRIEVE_RECOMMENDED_ADVERTS_ERROR =
  'app/LandingPage/RETRIEVE_RECOMMENDED_ADVERTS_ERROR';

export const RETRIEVE_RECOMMENDED_USERS_REQUEST =
  'app/LandingPage/RETRIEVE_RECOMMENDED_USERS_REQUEST';
export const RETRIEVE_RECOMMENDED_USERS_SUCCESS =
  'app/LandingPage/RETRIEVE_RECOMMENDED_USERS_SUCCESS';
export const RETRIEVE_RECOMMENDED_USERS_ERROR = 'app/LandingPage/RETRIEVE_RECOMMENDED_USERS_ERROR';

// ================ Reducer ================ //

const initialState = {
  searchListingsInProgress: false,
  retrieveRecommendedListingsError: null,
  currentPageResultIds: [],
};

const resultIds = data => data.data.map(l => l.id);

const listingPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case RETRIEVE_RECOMMENDED_LISTINGS_REQUEST:
      return {
        ...state,
        searchListingsInProgress: true,
        retrieveRecommendedListingsError: null,
      };
    case RETRIEVE_RECOMMENDED_LISTINGS_SUCCESS:
      return {
        ...state,
        currentPageListingsResultIds: resultIds(payload.data),
        searchListingsInProgress: false,
      };
    case RETRIEVE_RECOMMENDED_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, searchInProgress: false, retrieveRecommendedListingsError: payload };

    case RETRIEVE_RECOMMENDED_ADVERTS_REQUEST:
      return {
        ...state,
        searchAdvertsInProgress: true,
        retrieveRecommendedAdvertsError: null,
      };
    case RETRIEVE_RECOMMENDED_ADVERTS_SUCCESS:
      return {
        ...state,
        currentPageAdvertsResultIds: resultIds(payload.data),
        searchInProgress: false,
      };
    case RETRIEVE_RECOMMENDED_ADVERTS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, searchAdvertsInProgress: false, retrieveRecommendedAdvertsError: payload };

    default:
      return state;
  }
};

export default listingPageReducer;

// ================ Action creators ================ //

export const retrieveRecommendedListingsRequest = searchParams => ({
  type: RETRIEVE_RECOMMENDED_LISTINGS_REQUEST,
  payload: { searchParams },
});

export const retrieveRecommendedListingsSuccess = response => ({
  type: RETRIEVE_RECOMMENDED_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const retrieveRecommendedListingsError = e => ({
  type: RETRIEVE_RECOMMENDED_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const retrieveRecommendedAdvertsRequest = searchParams => ({
  type: RETRIEVE_RECOMMENDED_ADVERTS_REQUEST,
  payload: { searchParams },
});

export const retrieveRecommendedAdvertsSuccess = response => ({
  type: RETRIEVE_RECOMMENDED_ADVERTS_SUCCESS,
  payload: { data: response.data },
});

export const retrieveRecommendedAdvertsError = e => ({
  type: RETRIEVE_RECOMMENDED_ADVERTS_ERROR,
  error: true,
  payload: e,
});

export const retrieveRecommendedListings = _ => (dispatch, getState, sdk) => {
  dispatch(retrieveRecommendedListingsRequest());
  const params = {
    pub_listingType: 'listing',
    pub_listingState: LISTING_LIVE,
    pub_notDeleted: true,
    include: ['author', 'images'],
    'fields.listing': ['title', 'geolocation', 'price', 'publicData'],
    'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
    'fields.image': [
      'variants.scaled-small',
      'variants.scaled-medium',
      'variants.landscape-crop',
      'variants.landscape-crop2x',
    ],
    'limit.images': 1,
    per_page: 12,
  };

  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(retrieveRecommendedListingsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(retrieveRecommendedListingsError(storableError(e)));
      throw e;
    });
};
export const retrieveRecommendedAdverts = _ => (dispatch, getState, sdk) => {
  dispatch(retrieveRecommendedAdvertsRequest());
  const params = {
    pub_listingType: 'advert',
    pub_notDeleted: true,
    pub_listingState: LISTING_LIVE,
    include: ['author', 'images'],
    'fields.listing': ['title', 'geolocation', 'price', 'publicData'],
    'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
    'fields.image': [
      'variants.scaled-small',
      'variants.scaled-medium',
      'variants.landscape-crop',
      'variants.landscape-crop2x',
    ],
    'limit.images': 1,
    per_page: 12,
  };

  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(retrieveRecommendedAdvertsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(retrieveRecommendedAdvertsError(storableError(e)));
      throw e;
    });
};

export const loadData = params => (dispatch, getState, sdk) => {
  return Promise.all([
    dispatch(retrieveRecommendedListings()),
    dispatch(retrieveRecommendedAdverts()),
  ]);
};
