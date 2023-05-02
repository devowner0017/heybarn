import { useDispatch, useSelector } from 'react-redux';
import Button, { PrimaryButton } from '../Button/Button';
import {
  getOwnListingsById,
  loadAdvertData,
  loadListingData,
} from '../../containers/ManageListingsPage/ManageListingsPage.duck';
import { useCallback, useEffect } from 'react';
import { LISTING_LIVE } from '../../util/types';
import { createResourceLocatorString } from '../../util/routes';
import routeConfiguration from '../../routeConfiguration';

import config from '../../config';
import { isAnyFilterActive } from '../../util/search';
import { useHistory } from 'react-router-dom';

import css from './SearchFiltersPrimary.module.css';

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

const MatchingListings = ({ searchType }) => {
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
          responseListingType !== searchType && state === 'published'
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
    if (searchType === 'advert') {
      dispatch(loadListingData());
    } else {
      dispatch(loadAdvertData());
    }
  }, [searchType]);

  const filterConfig = config.custom.filters;
  const districtConfig = filterConfig.find(f => f.id === 'locDistrict');

  const handleSearch = useCallback(() => {
    // Search schema:
    // listing      public  ageOfSpace     long
    // listing      public  amenities      multi-enum
    // listing      public  availableFrom  long
    // listing      public  availableTo    long
    // listing      public  listingState   enum
    // listing      public  listingType    enum
    // listing      public  locDistrict    enum
    // listing      public  locIsland      enum
    // listing      public  locRegion      enum
    // listing      public  notDeleted     boolean
    // listing      public  notHidden      boolean
    // listing      public  preferredUse   multi-enum
    // listing      public  sizeOfSpace    long

    const whitelistedParams = [
      'locDistrict',
      'locIsland',
      'locRegion',
      'ageOfSpace',
      // 'amenities',
      // 'availableFrom',
      // 'availableTo',
      // 'listingState',
      'listingType',
      'locDistrict',
      'locIsland',
      // 'preferredUse',
      'sizeOfSpace',
    ];

    const searchParams = {
      ...Object.keys(matchingListing.attributes.publicData)
      .reduce((acc, key) => {
        const value = matchingListing.attributes.publicData[key];
        if (value && whitelistedParams.includes(key)) {
          acc[`pub_${key}`] = value;
          if (key === 'locDistrict') {
            const bounds = districtConfig?.config?.options?.find?.(o => o.key === value)?.bounds;

            if (bounds) {
              acc['bounds'] = bounds;
              acc['mapSearch'] = true;
            }
          }
        }
        return acc;
      }, {}),
      pub_listingType: searchType,
    };
    const search = cleanSearchFromConflictingParams(
      searchParams,
      config.custom.sortConfig,
      config.custom.filters
    );
    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, search));
  }, [matchingListing]);

  return matchingListing ? (
    <Button className={css.matchingButton} onClick={handleSearch}>
      Show me matching renters
    </Button>
  ) : null;
};

export default MatchingListings;
