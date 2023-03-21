import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { NamedLink } from '../../components';

import heroVideo from './video.mp4';

import css from './SectionHero.module.css';

const SectionHero = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.videoBackground}>
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      <div className={css.heroContent}>
        <div>
          <h1 className={css.heroMainTitle}>
            Rent your space <span>|</span> Find your space
          </h1>
          <h2 className={css.heroSubTitle}>
            <FormattedMessage id="SectionHero.subTitle" />
          </h2>
          <h1 className={css.heroMobileTitle}>Find and advertise space on Kiwi properties</h1>
        </div>
      </div>
      <div>
        <h3 className={css.heroCtaText}>
          <FormattedMessage id="SectionHero.ctaText" />
        </h3>
      </div>
    </div>
  );
};

SectionHero.defaultProps = { rootClassName: null, className: null };

SectionHero.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHero;
