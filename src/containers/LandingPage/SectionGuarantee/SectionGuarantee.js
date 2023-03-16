import React from 'react';
import css from './SectionGuarantee.module.css';

import { FormattedMessage } from '../../../util/reactIntl';
import { NamedLink } from '../../../components';
import classNames from 'classnames';

const SectionGuarantee = () => {
  return (
    <section className={css.section}>
      <h2 className={css.heading}>
        <FormattedMessage id="SectionGuarantee.heading" />
      </h2>
      <div className={css.columns}>
        <div className={css.column}>
          <div className={css.columnWrapper1}>
            <h3 className={css.columnTitle1}>
              <FormattedMessage id="SectionGuarantee.column1.title" />
            </h3>
            <p className={css.columnContent1}>
              <FormattedMessage id="SectionGuarantee.column1.content" />
            </p>
            <NamedLink name="NewListingPage" className={classNames(css.button, css.rentButton)}>
              <FormattedMessage id="SectionHero.rentButton" />
            </NamedLink>

            <NamedLink
              name="SearchPage"
              to={{
                search:
                  'pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
              }}
              className={classNames(css.button, css.findButton)}
            >
              <FormattedMessage
                id="SectionGuarantee.findButton"
                values={{ icon: <SearchIcon /> }}
              />
            </NamedLink>
          </div>
        </div>
        <div className={css.column}>
          <div className={css.columnWrapper2}>
            <h3 className={css.columnTitle2}>
              <FormattedMessage id="SectionGuarantee.column2.title" />
            </h3>
            <p className={css.columnContent2}>
              <FormattedMessage id="SectionGuarantee.column2.content" />
            </p>
          </div>
        </div>
        <div className={css.column}>
          <div className={css.columnWrapper3}>
            <h3 className={css.columnTitle3}>
              <FormattedMessage id="SectionGuarantee.column3.title" />
            </h3>
            <p className={css.columnContent3}>
              <FormattedMessage id="SectionGuarantee.column3.content" />
            </p>

            <NamedLink
              name="SearchPage"
              to={{
                search:
                  'pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
              }}
              className={classNames(css.button, css.downloadButton)}
            >
              <FormattedMessage
                id="SectionGuarantee.downloadButton"
                values={{ icon: <DownloadIcon /> }}
              />
            </NamedLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionGuarantee;

const SearchIcon = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={13.325} height={13.327} {...props}>
    <path
      data-name="Icon awesome-search"
      d="m.181 11.522 2.595-2.595a.624.624 0 0 1 .442-.182h.424a5.411 5.411 0 1 1 .937.937v.424a.624.624 0 0 1-.182.442L1.8 13.143a.622.622 0 0 1-.882 0l-.737-.737a.628.628 0 0 1 0-.884Zm7.73-2.777A3.331 3.331 0 1 0 4.58 5.414a3.33 3.33 0 0 0 3.331 3.331Z"
      fill="currentColor"
    />
  </svg>
);

const DownloadIcon = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20.192} height={20.192} {...props}>
    <g
      data-name="Icon feather-download"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <path
        data-name="Path 318"
        d="M19.192 13.128v4.043a2.021 2.021 0 0 1-2.021 2.021H3.021A2.021 2.021 0 0 1 1 17.171v-4.043"
      />
      <path data-name="Path 319" d="m5.043 8.075 5.053 5.053 5.054-5.053" />
      <path data-name="Path 320" d="M10.096 13.128V1" />
    </g>
  </svg>
);
