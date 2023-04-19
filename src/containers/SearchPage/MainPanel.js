import React, { Component } from 'react';
import { array, bool, func, number, object, shape, string } from 'prop-types';
import debounce from 'lodash/debounce';
import unionWith from 'lodash/unionWith';
import classNames from 'classnames';
import omit from 'lodash/omit';
import config from '../../config';
import { parse, stringify } from '../../util/urlHelpers';
import routeConfiguration from '../../routeConfiguration';
import { FormattedMessage } from '../../util/reactIntl';
import { createResourceLocatorString, pathByRouteName } from '../../util/routes';
import { isAnyFilterActive } from '../../util/search';
import { propTypes } from '../../util/types';
import {
  SearchResultsPanel,
  SearchFiltersMobile,
  SearchFiltersPrimary,
  SearchFiltersSecondary,
  SortBy,
  Button,
  ModalInMobile,
  SearchMap,
} from '../../components';

import FilterComponent from './FilterComponent';
import { validFilterParams, validURLParamsForExtendedData } from './SearchPage.helpers';

import css from './SearchPage.module.css';

// Primary filters have their content in dropdown-popup.
// With this offset we move the dropdown to the left a few pixels on desktop layout.
const FILTER_DROPDOWN_OFFSET = -14;
const MODAL_BREAKPOINT = 768; // Search is in modal on mobile layout
const SEARCH_WITH_MAP_DEBOUNCE = 300; // Little bit of debounce before search is initiated.

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

/**
 * MainPanel contains search results and filters.
 * There are 3 presentational container-components that show filters:
 * SearchfiltersMobile, SearchFiltersPrimary, and SearchFiltersSecondary.
 * The last 2 are for desktop layout.
 */
class MainPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSecondaryFiltersOpen: false,
      currentQueryParams: props.urlQueryParams,
      isSearchMapOpenOnMobile: props.mapData.tab === 'map',
      isMobileModalOpen: false,
      isMapOpen: false,
      mapOpening: false,
      mapOpened: false,
      mapClosing: false,
      mapClosed: true,
      mapState: css.mapOpened,
    };

    this.searchMapListingsInProgress = false;

    this.onMapMoveEnd = debounce(this.onMapMoveEnd.bind(this), SEARCH_WITH_MAP_DEBOUNCE);
    this.onOpenMobileModal = this.onOpenMobileModal.bind(this);
    this.onCloseMobileModal = this.onCloseMobileModal.bind(this);
    this.onOpenMap = this.onOpenMap.bind(this);

    this.applyFilters = this.applyFilters.bind(this);
    this.cancelFilters = this.cancelFilters.bind(this);
    this.resetAll = this.resetAll.bind(this);

    this.initialValues = this.initialValues.bind(this);
    this.getHandleChangedValueFn = this.getHandleChangedValueFn.bind(this);

    // SortBy
    this.handleSortBy = this.handleSortBy.bind(this);
  }

  onMapMoveEnd(viewportBoundsChanged, data) {
    const { viewportBounds, viewportCenter } = data;

    const routes = routeConfiguration();
    const searchPagePath = pathByRouteName('SearchPage', routes);
    const currentPath =
      typeof window !== 'undefined' && window.location && window.location.pathname;

    // When using the ReusableMapContainer onMapMoveEnd can fire from other pages than SearchPage too
    const isSearchPage = currentPath === searchPagePath;

    // If mapSearch url param is given
    // or original location search is rendered once,
    // we start to react to "mapmoveend" events by generating new searches
    // (i.e. 'moveend' event in Mapbox and 'bounds_changed' in Google Maps)
    if (viewportBoundsChanged && isSearchPage) {
      const { history, location, filterConfig } = this.props;

      // parse query parameters, including a custom attribute named category
      const { address, bounds, mapSearch, ...rest } = parse(location.search, {
        latlng: ['origin'],
        latlngBounds: ['bounds'],
      });

      //const viewportMapCenter = SearchMap.getMapCenter(map);
      const originMaybe = config.sortSearchByDistance ? { origin: viewportCenter } : {};

      const searchParams = {
        address,
        ...originMaybe,
        bounds: viewportBounds,
        mapSearch: true,
        ...validFilterParams(rest, filterConfig),
      };

      history.push(createResourceLocatorString('SearchPage', routes, {}, searchParams));
    }
  }

  // Invoked when a modal is opened from a child component,
  // for example when a filter modal is opened in mobile view
  onOpenMobileModal() {
    this.setState({ isMobileModalOpen: true });
  }

  // Invoked when a modal is closed from a child component,
  // for example when a filter modal is opened in mobile view
  onCloseMobileModal() {
    this.setState({ isMobileModalOpen: false });
  }

  handleOpenMap() {
    this.setState({ isMapOpen: true, mapState: css.mapOpened });
    setTimeout(() => {
      this.setState({ mapState: css.mapOpened });
    }, 1000);
  }

  handleCloseMap() {
    this.setState({ isMapOpen: false, mapState: css.mapClosed });
    setTimeout(() => {
      this.setState({ mapState: css.mapClosed });
    }, 1000);
  }

  onOpenMap() {
    if (!!this.state.isMapOpen) {
      this.handleCloseMap();
    } else {
      this.handleOpenMap();
    }
  }

  // Apply the filters by redirecting to SearchPage with new filters.
  applyFilters() {
    const { history, urlQueryParams, sortConfig, filterConfig } = this.props;
    const searchParams = { ...urlQueryParams, ...this.state.currentQueryParams };
    const search = cleanSearchFromConflictingParams(searchParams, sortConfig, filterConfig);

    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, search));
  }

  // Close the filters by clicking cancel, revert to the initial params
  cancelFilters() {
    this.setState({ currentQueryParams: {} });
  }

  // Reset all filter query parameters
  resetAll(e) {
    const { urlQueryParams, history, filterConfig } = this.props;
    const filterQueryParamNames = filterConfig.map(f => f.queryParamNames);

    // Reset state
    this.setState({ currentQueryParams: {} });

    // Reset routing params
    const queryParams = omit(urlQueryParams, filterQueryParamNames);
    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  }

  initialValues(queryParamNames) {
    // Query parameters that are visible in the URL
    const urlQueryParams = this.props.urlQueryParams;
    // Query parameters that are in state (user might have not yet clicked "Apply")
    const currentQueryParams = this.state.currentQueryParams;

    // Get initial value for a given parameter from state if its there.
    const getInitialValue = paramName => {
      const currentQueryParam = currentQueryParams[paramName];
      const hasQueryParamInState = typeof currentQueryParam !== 'undefined';
      return hasQueryParamInState ? currentQueryParam : urlQueryParams[paramName];
    };

    // Return all the initial values related to given queryParamNames
    // InitialValues for "amenities" filter could be
    // { amenities: "has_any:towel,jacuzzi" }
    const isArray = Array.isArray(queryParamNames);
    return isArray
      ? queryParamNames.reduce((acc, paramName) => {
          return { ...acc, [paramName]: getInitialValue(paramName) };
        }, {})
      : {};
  }

  getHandleChangedValueFn(useHistoryPush) {
    const { urlQueryParams, history, sortConfig, filterConfig } = this.props;

    return updatedURLParams => {
      const updater = prevState => {
        const { address, bounds } = urlQueryParams;
        const mergedQueryParams = { ...urlQueryParams, ...prevState.currentQueryParams };

        // Address and bounds are handled outside of MainPanel.
        // I.e. TopbarSearchForm && search by moving the map.
        // We should always trust urlQueryParams with those.
        return {
          currentQueryParams: { ...mergedQueryParams, ...updatedURLParams, address, bounds },
        };
      };

      const callback = () => {
        if (useHistoryPush) {
          const searchParams = this.state.currentQueryParams;
          const search = cleanSearchFromConflictingParams(searchParams, sortConfig, filterConfig);
          history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, search));
        }
      };

      this.setState(updater, callback);
    };
  }

  handleSortBy(urlParam, values) {
    const { history, urlQueryParams } = this.props;
    const queryParams = values
      ? { ...urlQueryParams, [urlParam]: values }
      : omit(urlQueryParams, urlParam);

    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  }

  render() {
    const {
      className,
      rootClassName,
      urlQueryParams,
      searchInProgress,
      searchListingsError,
      searchParamsAreInSync,
      onActivateListing,
      onManageDisableScrolling,
      onOpenModal,
      onCloseModal,
      pagination,
      searchParamsForPagination,
      showAsModalMaxWidth,
      filterConfig,
      sortConfig,
      mapSwitch,
      searchType,
    } = this.props;

    const {
      id,
      reusableContainerClassName,
      center,
      location,
      listings,
      zoom,
      mapsConfig,
      activeListingId,
      messages,
      mapClass,
      mapListings,
    } = this.props.mapData;

    const { isMapOpen, mapClosed, mapClosing, mapOpened, mapOpening } = this.state;

    const { mapSearch, page, pub_listingType, ...searchInURL } = parse(location.search, {
      latlng: ['origin'],
      latlngBounds: ['bounds'],
    });

    const onMapIconClick = () => {
      this.useLocationSearchBounds = true;
      this.setState({ isSearchMapOpenOnMobile: true });
    };

    const { address, bounds, origin } = searchInURL || {};

    const primaryFilters = filterConfig.filter(f => f.group === 'primary');
    const secondaryFilters = filterConfig.filter(f => f.group !== 'primary');
    const hasSecondaryFilters = !!(
      secondaryFilters &&
      secondaryFilters.length > 0 &&
      secondaryFilters.some(s => s.listingType.includes(searchType) && s.type !== 'none')
    );

    // Selected aka active filters
    const selectedFilters = validFilterParams(urlQueryParams, filterConfig);
    const selectedFiltersCount = Object.keys(selectedFilters).length;

    // Selected aka active secondary filters
    const selectedSecondaryFilters = hasSecondaryFilters
      ? validFilterParams(urlQueryParams, secondaryFilters)
      : {};
    const selectedSecondaryFiltersCount = Object.keys(selectedSecondaryFilters).length;

    const isSecondaryFiltersOpen = !!hasSecondaryFilters && this.state.isSecondaryFiltersOpen;
    const propsForSecondaryFiltersToggle = hasSecondaryFilters
      ? {
          isSecondaryFiltersOpen: this.state.isSecondaryFiltersOpen,
          toggleSecondaryFiltersOpen: isOpen => {
            this.setState({ isSecondaryFiltersOpen: isOpen });
          },
          selectedSecondaryFiltersCount,
        }
      : {};

    const hasPaginationInfo = !!pagination && pagination.totalItems != null;
    const totalItems = searchParamsAreInSync && hasPaginationInfo ? pagination.totalItems : 0;
    const listingsAreLoaded = !searchInProgress && searchParamsAreInSync && hasPaginationInfo;
    const sortBy = mode => {
      const conflictingFilterActive = isAnyFilterActive(
        sortConfig.conflictingFilters,
        urlQueryParams,
        filterConfig
      );

      const mobileClassesMaybe =
        mode === 'mobile'
          ? {
              rootClassName: css.sortBy,
              menuLabelRootClassName: css.sortByMenuLabel,
            }
          : {};
      return sortConfig.active ? (
        <SortBy
          {...mobileClassesMaybe}
          sort={urlQueryParams[sortConfig.queryParamName]}
          isConflictingFilterActive={!!conflictingFilterActive}
          onSelect={this.handleSortBy}
          showAsPopup
          contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
        />
      ) : null;
    };
    const typeButton = (
      <Button
        className={css.typeButton}
        onClick={() =>
          this.getHandleChangedValueFn(true)({
            pub_listingType: searchType === 'advert' ? 'listing' : 'advert',
          })
        }
      >
        Switch to {searchType === 'advert' ? 'listings' : 'adverts'}
      </Button>
    );
    const classes = classNames(rootClassName || css.searchResultContainer, className);

    const isWindowDefined = typeof window !== 'undefined';
    const isMobileLayout = isWindowDefined && window.innerWidth < MODAL_BREAKPOINT;
    const shouldShowSearchMap =
      !isMobileLayout || (isMobileLayout && this.state.isSearchMapOpenOnMobile);

    return (
      <div className={classes}>
        {mapSwitch}
        <SearchFiltersPrimary
          className={css.searchFiltersPrimary}
          sortByComponent={sortBy('desktop')}
          typeButton={typeButton}
          searchType={searchType}
          listingsAreLoaded={listingsAreLoaded}
          resultsCount={totalItems}
          searchInProgress={searchInProgress}
          searchListingsError={searchListingsError}
          {...propsForSecondaryFiltersToggle}
        >
          {primaryFilters.map(config => {
            return (
              <FilterComponent
                key={`SearchFiltersPrimary.${config.id}`}
                idPrefix="SearchFiltersPrimary"
                filterConfig={config}
                urlQueryParams={urlQueryParams}
                initialValues={this.initialValues}
                getHandleChangedValueFn={this.getHandleChangedValueFn}
                showAsPopup
                contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
                searchType={searchType}
              />
            );
          })}
        </SearchFiltersPrimary>
        <SearchFiltersMobile
          className={css.searchFiltersMobile}
          urlQueryParams={urlQueryParams}
          sortByComponent={sortBy('mobile')}
          listingsAreLoaded={listingsAreLoaded}
          resultsCount={totalItems}
          typeButton={typeButton}
          searchType={searchType}
          searchInProgress={searchInProgress}
          searchListingsError={searchListingsError}
          showAsModalMaxWidth={showAsModalMaxWidth}
          onMapIconClick={onMapIconClick}
          onManageDisableScrolling={onManageDisableScrolling}
          onOpenModal={onOpenModal}
          onCloseModal={onCloseModal}
          resetAll={this.resetAll}
          selectedFiltersCount={selectedFiltersCount}
        >
          {filterConfig.map(config => {
            return (
              <FilterComponent
                key={`SearchFiltersMobile.${config.id}`}
                idPrefix="SearchFiltersMobile"
                filterConfig={config}
                urlQueryParams={urlQueryParams}
                initialValues={this.initialValues}
                getHandleChangedValueFn={this.getHandleChangedValueFn}
                liveEdit
                showAsPopup={false}
                searchType={searchType}
              />
            );
          })}
        </SearchFiltersMobile>
        <div className={css.mainContent}>
          {isSecondaryFiltersOpen && !!secondaryFilters?.length ? (
            <div className={classNames(css.searchFiltersPanel)}>
              <SearchFiltersSecondary
                urlQueryParams={urlQueryParams}
                listingsAreLoaded={listingsAreLoaded}
                applyFilters={this.applyFilters}
                cancelFilters={this.cancelFilters}
                resetAll={this.resetAll}
                onClosePanel={() => this.setState({ isSecondaryFiltersOpen: false })}
              >
                {secondaryFilters.map(config => {
                  return (
                    <FilterComponent
                      key={`SearchFiltersSecondary.${config.id}`}
                      idPrefix="SearchFiltersSecondary"
                      filterConfig={config}
                      urlQueryParams={urlQueryParams}
                      initialValues={this.initialValues}
                      getHandleChangedValueFn={this.getHandleChangedValueFn}
                      showAsPopup={false}
                      searchType={searchType}
                    />
                  );
                })}
              </SearchFiltersSecondary>
            </div>
          ) : (
            <div
              className={classNames(css.listings, {
                [css.newSearchInProgress]: !listingsAreLoaded,
              })}
            >
              {searchListingsError ? (
                <h2 className={css.error}>
                  <FormattedMessage id="SearchPage.searchError" />
                </h2>
              ) : null}
              <SearchResultsPanel
                className={css.searchListingsPanel}
                listings={listings}
                pagination={listingsAreLoaded ? pagination : null}
                search={searchParamsForPagination}
                setActiveListing={onActivateListing}
                isMapOpen={isMapOpen}
              />
            </div>
          )}

          <div className={css.mapContent}>
            <ModalInMobile
              className={css.mapPanel}
              id="SearchPage.map"
              isModalOpenOnMobile={this.state.isSearchMapOpenOnMobile}
              onClose={() => this.setState({ isSearchMapOpenOnMobile: false })}
              showAsModalMaxWidth={MODAL_BREAKPOINT}
              onManageDisableScrolling={onManageDisableScrolling}
            >
              <div className={classNames(css.mapWrapper)}>
                {shouldShowSearchMap ? (
                  <SearchMap
                    reusableContainerClassName={classNames(
                      css.map
                      // { [css.mapClosing]: mapClosing },
                      // { [css.mapClosed]: mapClosed },
                      // { [css.mapOpening]: mapOpening },
                      // { [css.mapOpened]: mapOpened }
                    )}
                    mapClass={this.state.mapState}
                    activeListingId={activeListingId}
                    bounds={bounds}
                    center={origin}
                    isSearchMapOpenOnMobile={this.state.isSearchMapOpenOnMobile}
                    location={location}
                    listings={mapListings || []}
                    onMapMoveEnd={this.onMapMoveEnd}
                    onCloseAsModal={() => {
                      onManageDisableScrolling('SearchPage.map', false);
                    }}
                    // messages={intl.messages}
                  />
                ) : null}
              </div>
            </ModalInMobile>
          </div>
        </div>
      </div>
    );
  }
}

MainPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listings: [],
  resultsCount: 0,
  pagination: null,
  searchParamsForPagination: {},
  filterConfig: config.custom.filters,
  sortConfig: config.custom.sortConfig,
};

MainPanel.propTypes = {
  className: string,
  rootClassName: string,

  urlQueryParams: object.isRequired,
  listings: array,
  searchInProgress: bool.isRequired,
  searchListingsError: propTypes.error,
  searchParamsAreInSync: bool.isRequired,
  onActivateListing: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onOpenModal: func.isRequired,
  onCloseModal: func.isRequired,
  onMapIconClick: func.isRequired,
  pagination: propTypes.pagination,
  searchParamsForPagination: object,
  showAsModalMaxWidth: number.isRequired,
  filterConfig: propTypes.filterConfig,
  sortConfig: propTypes.sortConfig,

  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string.isRequired,
  }).isRequired,
};

export default MainPanel;
