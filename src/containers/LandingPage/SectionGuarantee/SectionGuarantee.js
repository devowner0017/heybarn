import React from 'react';
import css from './SectionGuarantee.module.css';

import { FormattedMessage } from '../../../util/reactIntl';
import { ExternalLink, NamedLink } from '../../../components';
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

            <div className={css.noNosWrapper}>
              <p className={css.noNos}>
                <span>
                  <IconCheckmark />
                </span>{' '}
                NO CONTRACTS
              </p>
              <p className={css.noNos}>
                <span>
                  <IconCheckmark />
                </span>{' '}
                NO HIDDEN CHARGES
              </p>
            </div>
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

            <ExternalLink
              href="/static/Rental_agreement_template.pdf"
              className={classNames(css.button, css.downloadButton)}
            >
              <FormattedMessage
                id="SectionGuarantee.downloadButton"
                values={{ icon: <DownloadIcon /> }}
              />
            </ExternalLink>
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

const IconCheckmark = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={23.558} height={23.558} {...props}>
    <defs>
      <clipPath id="abs">
        <path fill="#c35827" d="M0 0h23.558v23.558H0z" />
      </clipPath>
    </defs>
    <g clipPath="url(#abs)" fill="#c35827">
      <path
        data-name="Path 310"
        d="M11.783 3.09a8.685 8.685 0 1 0 8.685 8.685 8.694 8.694 0 0 0-8.685-8.685m4.719 4.388-7.7 8.984a.3.3 0 0 1-.227.1.3.3 0 0 1-.284-.2l-1.283-3.85a.3.3 0 1 1 .568-.189l1.107 3.352 7.361-8.585a.3.3 0 0 1 .455.39"
      />
      <path d="M20.108 3.45A11.779 11.779 0 0 0 3.45 20.108 11.779 11.779 0 0 0 20.108 3.45m-8.329 17.613a9.284 9.284 0 1 1 9.284-9.284 9.294 9.294 0 0 1-9.284 9.284" />
    </g>
  </svg>
);
