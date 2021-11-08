import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { NamedLink, ListingCard } from '..';

import css from './SectionRecommendation.module.css';

const SectionRecommendation = props => {
  const { rootClassName, listings, heading, linkName, linkText, reversed } = props;
  const classes = classNames(rootClassName || css.root);
  // Panel width relative to the viewport
  const panelMediumWidth = 50;
  const panelLargeWidth = 62.5;
  const cardRenderSizes = [
    '(max-width: 767px) 100vw',
    `(max-width: 1023px) ${panelMediumWidth}vw`,
    `(max-width: 1920px) ${panelLargeWidth / 2}vw`,
    `${panelLargeWidth / 3}vw`,
  ].join(', ');
  const link = (
    <NamedLink
      className={classNames(css.recommendationLink, { [css.reversedTitle]: reversed })}
      name={linkName}
    >
      {linkText}
    </NamedLink>
  );

  return (
    <div className={classes}>
      <div className={classNames(css.title, { [css.reversedTitle]: reversed })}>
        {/* <FormattedMessage id="SectionLocations.title" /> */}
        {heading}
        {link}
      </div>
      {listings ? (
        <div className={css.listingCards}>
          {listings.map(l => (
            <ListingCard
              key={l.id.uuid}
              listing={l}
              renderSizes={cardRenderSizes}
              className={classNames({ [css.reversedListingCard]: reversed })}
              minInfo
            />
          ))}
        </div>
      ) : null}
      {props.children}
    </div>
  );
};

SectionRecommendation.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionRecommendation.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionRecommendation;
