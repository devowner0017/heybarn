import React from 'react';
import classNames from 'classnames';

import { FormattedMessage } from '../../../util/reactIntl';

import css from './SectionRent.module.css';
import { NamedLink } from '../../../components';

const ArrowIcon = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={35.112} height={35.733} {...props}>
    <g
      data-name="Icon feather-arrow-right"
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path data-name="Path 61" d="M.75 17.867h33.612" />
      <path data-name="Path 62" d="m17.556 1.061 16.806 16.806-16.806 16.806" />
    </g>
  </svg>
);

const SearchIcon = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={13.325} height={13.327} {...props}>
    <path
      data-name="Icon awesome-search"
      d="m.181 11.522 2.595-2.595a.624.624 0 0 1 .442-.182h.424a5.411 5.411 0 1 1 .937.937v.424a.624.624 0 0 1-.182.442L1.8 13.143a.622.622 0 0 1-.882 0l-.737-.737a.628.628 0 0 1 0-.884Zm7.73-2.777A3.331 3.331 0 1 0 4.58 5.414a3.33 3.33 0 0 0 3.331 3.331Z"
      fill="#c35827"
    />
  </svg>
);

export const SectionRent = () => {
  return (
    <div className={css.heroRentWrapper}>
      <div className={classNames(css.heroRentColumn, css.rent)}>
        <div className={css.heroRentColumnHeader}>
          <div className={css.heroArrow}>
            <ArrowIcon />
          </div>
          <div className={css.heroRentColumnTitle}>
            <FormattedMessage id="SectionHero.rentTitle" />
          </div>
        </div>
        <div className={css.buttonWrapper}>
          <NamedLink
            name="SearchPage"
            to={{
              search:
                'pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
            }}
            className={classNames(css.heroButton, css.rentButton)}
          >
            <FormattedMessage id="SectionHero.rentButton" />
          </NamedLink>
        </div>
      </div>

      <div className={classNames(css.heroRentColumn, css.find)}>
        <div className={css.heroRentColumnHeader}>
          <div className={css.heroArrow}>
            <ArrowIcon />
          </div>
          <div className={css.heroRentColumnTitle}>
            <FormattedMessage id="SectionHero.findTitle" />
          </div>
        </div>
        <div className={css.buttonWrapper}>
          <NamedLink
            name="SearchPage"
            to={{
              search:
                'pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
            }}
            className={classNames(css.heroButton, css.findButton)}
          >
            <FormattedMessage id="SectionHero.findButton" values={{ icon: <SearchIcon /> }} />
          </NamedLink>
        </div>
      </div>
    </div>
  );
};

export default SectionRent;
