import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import { NamedLink } from '../../components';

import css from './SectionHowItWorks.module.css';

import video1 from './video-1.mp4';
import video2 from './video-2.mp4';

const SectionHowItWorks = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.steps}>
        <div className={css.step}>
          <div className={css.card}>
            <video className={css.cardImage} src={video1} controls />
            <div className={css.cardFooter}>
              <h3 className={css.cardText}>
                <FormattedMessage id="SectionHowItWorks.part1Title" />
              </h3>
            </div>
          </div>
        </div>

        <div className={css.step}>
          <div className={css.card}>
            <video className={css.cardImage} src={video2} controls />
            <div className={css.cardFooter}>
              <h3 className={css.cardText}>
                <FormattedMessage id="SectionHowItWorks.part2Title" />
              </h3>
            </div>
          </div>
        </div>

        <div className={css.step}>
          <div className={css.part3}>
            <h3 className={css.part3Title}>
              <FormattedMessage id="SectionHowItWorks.part3Title" />
            </h3>

            <p className={css.part3Text}>
              <FormattedMessage id="SectionHowItWorks.part3Text1" />
            </p>

            <p className={css.part3Text}>
              <FormattedMessage id="SectionHowItWorks.part3Text2" />
            </p>

            <NamedLink name="AboutPage" className={css.part3Link}>
              <FormattedMessage id="SectionHowItWorks.part3Link1" />
            </NamedLink>

            <NamedLink name="FAQPage" className={css.part3Link}>
              <FormattedMessage id="SectionHowItWorks.part3Link2" />
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
