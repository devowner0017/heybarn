import React from 'react';
import { bool, func, node, number, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './SearchFiltersPrimary.module.css';
import Css from '../../containers/LandingPage/SectionGuarantee/SectionGuarantee.module.css';

import { NamedLink } from '../../components';
const SearchFiltersPrimaryComponent = props => {
  const {
    rootClassName,
    className,
    children,
    sortByComponent,
    listingsAreLoaded,
    resultsCount,
    searchInProgress,
    isSecondaryFiltersOpen,
    toggleSecondaryFiltersOpen,
    selectedSecondaryFiltersCount,
    typeButton,
    searchType,
  } = props;

  const hasNoResult = listingsAreLoaded && resultsCount === 0;
  const classes = classNames(rootClassName || css.root, className);

  const toggleSecondaryFiltersOpenButtonClasses =
    isSecondaryFiltersOpen || selectedSecondaryFiltersCount > 0
      ? css.searchFiltersPanelOpen
      : css.searchFiltersPanelClosed;
  const toggleSecondaryFiltersOpenButton = toggleSecondaryFiltersOpen ? (
    <button
      className={toggleSecondaryFiltersOpenButtonClasses}
      onClick={() => {
        toggleSecondaryFiltersOpen(!isSecondaryFiltersOpen);
      }}
    >
      <FormattedMessage
        id="SearchFiltersPrimary.moreFiltersButton"
        values={{ count: selectedSecondaryFiltersCount }}
      />
    </button>
  ) : null;

  return (
    <div className={classes}>
      <div className={css.searchOptions}>
        <div className={css.searchOptionslogo}>Find a place to suit you</div>
        {listingsAreLoaded ? (
          <div className={css.searchResultSummary}>
            <span className={css.resultsFound}>
              <FormattedMessage
                id="SearchFiltersPrimary.foundResults"
                values={{ count: resultsCount }}
              />
            </span>
          </div>
        ) : null}
        {sortByComponent}
        {/* {typeButton} */}
      </div>

      <div className={css.filters}>
        <div className={css.filterButtons}>
          <div />
          {children}
          {children}
          {children}
        </div>
        <div className={css.filterLinks}>
          <div className={css.filterP}>
            <a
              className="button_blank"
              href="/a/draft/00000000-0000-0000-0000-000000000000/new/description"
            >
              Advertise what you need
            </a>
          </div>
          <div className={css.filterR}>
            <NamedLink name="NewListingPage" className={classNames(Css.button, Css.rentButton)}>
              <FormattedMessage id="SectionHero.rentButton" />
            </NamedLink>
          </div>
        </div>

        {/* <button className='button_rent'>+ RENT YOUR SPACE</button> */}
        {/* {toggleSecondaryFiltersOpenButton} */}
      </div>
      {/* <div className='filter'>
        <button className='_button'>Region</button>
        <button className='_button'>District</button>
        <button className='_button'>Space size</button>
        <button className='button_blank'>Advertise what you need</button>
      </div> */}

      {hasNoResult ? (
        <div className={css.noSearchResults}>
          <FormattedMessage id="SearchFiltersPrimary.noResults" values={{ searchType }} />
        </div>
      ) : null}

      {searchInProgress ? (
        <div className={css.loadingResults}>
          <FormattedMessage id="SearchFiltersPrimary.loadingResults" />
        </div>
      ) : null}
    </div>
  );
};

SearchFiltersPrimaryComponent.defaultProps = {
  rootClassName: null,
  className: null,
  resultsCount: null,
  searchInProgress: false,
  isSecondaryFiltersOpen: false,
  toggleSecondaryFiltersOpen: null,
  selectedSecondaryFiltersCount: 0,
  sortByComponent: null,
};

SearchFiltersPrimaryComponent.propTypes = {
  rootClassName: string,
  className: string,
  listingsAreLoaded: bool.isRequired,
  resultsCount: number,
  searchInProgress: bool,
  isSecondaryFiltersOpen: bool,
  toggleSecondaryFiltersOpen: func,
  selectedSecondaryFiltersCount: number,
  sortByComponent: node,
};

const SearchFiltersPrimary = SearchFiltersPrimaryComponent;

export default SearchFiltersPrimary;
