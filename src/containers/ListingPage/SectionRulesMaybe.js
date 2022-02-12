import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import css from './SectionRulesMaybe.module.css';
import config from '../../config';
import { findConfigForSelectFilter } from '../../util/search';

const SectionRulesMaybe = props => {
  const { className, rootClassName, publicData, listingType, filterConfig } = props;
  const advertAccessFrequencyOption = findConfigForSelectFilter(
    'advertAccessFrequency',
    filterConfig
  );
  const listingAccessFrequencyOption = findConfigForSelectFilter(
    'listingAccessFrequency',
    filterConfig
  );

  const classes = classNames(rootClassName || css.root, className);
  const accFreq =
    publicData && publicData.accessFrequency ? (
      <div className={classes}>
        <h2 className={css.title}>
          <FormattedMessage id="ListingPage.accessFrequencyTitle" />
        </h2>
        <ul>
          {publicData.accessFrequency.map(access => {
            return (
              <li className={css.rules}>
                {listingType === 'advert'
                  ? advertAccessFrequencyOption?.options?.find(o => o.key === access)?.label
                  : listingAccessFrequencyOption?.options?.find(o => {
                      return o.key === access;
                    })?.label}
              </li>
            );
          })}
        </ul>
      </div>
    ) : null;
  const addTerms =
    publicData && publicData.rules ? (
      <div className={classes}>
        <h2 className={css.title}>
          <FormattedMessage id="ListingPage.rulesTitle" />
        </h2>
        <div className={css.rules}>{publicData.rules}</div>
      </div>
    ) : null;
  return (
    <>
      {accFreq}
      {addTerms}
    </>
  );
};
SectionRulesMaybe.defaultProps = {
  className: null,
  rootClassName: null,
  filterConfig: config.custom.filters,
};

SectionRulesMaybe.propTypes = {
  className: string,
  rootClassName: string,
  publicData: shape({
    rules: string,
  }),
};

export default SectionRulesMaybe;
