import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import { IconCamera, IconComputer, IconHandshake, NamedLink } from '../../components';

import css from './SectionHowItWorks.module.css';

const SectionHowItWorks = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);
  const listingLink = (
    <NamedLink
      name="SearchPage"
      to={{
        search:
          'pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
      }}
    >
      browse listings
    </NamedLink>
  );
  const advertLink = (
    <NamedLink
      name="SearchPage"
      to={{
        search:
          'pub_listingType=advert&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
      }}
    >
      browse adverts
    </NamedLink>
  );
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionHowItWorks.titleLineOne" />
      </div>

      <div className={css.steps}>
        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <IconCamera />
            {/* <FormattedMessage id="SectionHowItWorks.part1Title" /> */}
          </h2>
          <p className={css.stepText}>
            <FormattedMessage id="SectionHowItWorks.part1Text" />
          </p>
        </div>

        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <IconComputer />
            {/* <FormattedMessage id="SectionHowItWorks.part2Title" /> */}
          </h2>
          <p className={css.stepText}>
            <FormattedMessage id="SectionHowItWorks.part2Text" />
          </p>
        </div>

        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <IconHandshake />
            {/* <FormattedMessage id="SectionHowItWorks.part3Title" /> */}
          </h2>
          <p className={css.stepText}>
            <FormattedMessage
              id="SectionHowItWorks.part3Text"
              values={{ listingsLink: listingLink, advertsLink: advertLink }}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

SectionHowItWorks.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionHowItWorks.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHowItWorks;
