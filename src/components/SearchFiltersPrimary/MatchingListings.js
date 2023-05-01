import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from '../Button/Button';
import {
  getOwnListingsById,
  loadListingData,
} from '../../containers/ManageListingsPage/ManageListingsPage.duck';
import { useCallback, useEffect } from 'react';
import { LISTING_LIVE } from '../../util/types';
import { createResourceLocatorString } from '../../util/routes';
import routeConfiguration from '../../routeConfiguration';

import config from '../../config';
import { isAnyFilterActive } from '../../util/search';
import { useHistory } from 'react-router-dom';

const cleanSearchFromConflictingParams = (searchParams, sortConfig, filterConfig) => {
  // Single out filters that should disable SortBy when an active
  // keyword search sorts the listings according to relevance.
  // In those cases, sort parameter should be removed.
  const sortingFiltersActive = isAnyFilterActive(
    sortConfig.conflictingFilters,
    searchParams,
    filterConfig
  );
  return sortingFiltersActive
    ? { ...searchParams, [sortConfig.queryParamName]: null }
    : searchParams;
};

const MatchingListings = ({ listingType = 'listing' }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const matchingListing = useSelector(state => {
    const { currentPageResultIds } = state.ManageListingsPage;

    const listings = getOwnListingsById(state, currentPageResultIds);

    const filteredResults = (listings || [])
      .filter(r => {
        const {
          publicData: { listingType: responseListingType, listingState },
          state,
        } = r.attributes;
        return (
          // listingState === LISTING_LIVE &&
          responseListingType === listingType && state === 'published'
        );
      })
      .sort((a, b) => {
        const aDate = new Date(a.attributes.createdAt);
        const bDate = new Date(b.attributes.createdAt);
        return bDate - aDate;
      });

    const listing = filteredResults[0];

    return listing;
  });

  useEffect(() => {
    dispatch(loadListingData());
  }, []);

  const handleSearch = useCallback(() => {
    console.log('handleSearch');

    const searchParams = {
      ...Object.keys(matchingListing.attributes.publicData).reduce((acc, key) => {
        const value = matchingListing.attributes.publicData[key];
        if (value) {
          acc[`pub_${key}`] = value;
        }
        return acc;
      }, {}),
      pub_listingType: 'advert',
    };
    const search = cleanSearchFromConflictingParams(
      searchParams,
      config.custom.sortConfig,
      config.custom.filters
    );
    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, search));
  }, [matchingListing]);

  return matchingListing ? (
    <PrimaryButton onClick={handleSearch}>Show me matching renters</PrimaryButton>
  ) : null;
};

export default MatchingListings;
