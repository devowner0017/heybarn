import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import { IconCamera, IconComputer, IconHandshake, NamedLink } from '../../components';

import css from './SectionHowItWorks.module.css';

import img1 from './img-1.png';
import img2 from './img-2.png';

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
      <div className={css.steps}>
        <div className={css.step}>
          <div className={css.card}>
            <img className={css.cardImage} src={img1} />
            <div className={css.cardFooter}>
              <h3 className={css.cardText}>
                <FormattedMessage id="SectionHowItWorks.part1Title" />
              </h3>
              <a className={css.readMore}>{'Read more >'}</a>
            </div>
          </div>
        </div>

        <div className={css.step}>
          <div className={css.card}>
            <img className={css.cardImage} src={img2} />
            <div className={css.cardFooter}>
              <h3 className={css.cardText}>
                <FormattedMessage id="SectionHowItWorks.part2Title" />
              </h3>
              <a className={css.readMore}>{'Read more >'}</a>
            </div>
          </div>
        </div>

        <div className={css.step}>
          <div className={css.part3}>
            <h3 className={css.part3Title}>Doing it safely</h3>

            <p className={css.part3Text}>
              Heybarn provides an innovative place specifically designed to market spaces available
              for rent on New Zealand properties.
            </p>

            <p className={css.part3Text}>
              Learn more about how you can use heybarn to advertise your space or to find the
              affordable space you need.
            </p>

            <NamedLink name="AboutPage" className={css.part3Link}>
              {'Learn more about heybarn >'}
            </NamedLink>

            <NamedLink name="FAQPage" className={css.part3Link}>
              {'FAQs >'}
            </NamedLink>
          </div>
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
