import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ListingCard } from '..';

import css from './SectionRecommendation.module.css';

const SectionRecommendation = props => {
  const { rootClassName, listings, reversed } = props;
  if (listings.length < 5) return null;

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

  const maxListings = 10;
  const listingsToShow = listings.slice(0, maxListings);

  console.log('listingsToShow', listingsToShow);

  return (
    <div className={classes}>
      <div className={css.listingCards}>
        {listingsToShow?.map((l, index) => {
          return (
            <ListingCard
              key={l.id.uuid}
              listing={l}
              renderSizes={cardRenderSizes}
              className={classNames(css.listingCard, {
                [css.reversedListingCard]: reversed,
              })}
              minInfo
              isRecommendation
            />
          );
        })}
      </div>
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
