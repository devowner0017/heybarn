import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Slider from 'react-slick';

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

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className={classes}>
      <div className={classNames(css.title, { [css.reversedTitle]: reversed })}>
        {heading}
        {link}
      </div>
      <div className={css.sliderWrapper}>
        <Slider {...sliderSettings}>
          {listings.map((l, index) => {
            return (
              <ListingCard
                key={l.id.uuid}
                listing={l}
                renderSizes={cardRenderSizes}
                className={classNames({ [css.reversedListingCard]: reversed })}
                minInfo
              />
            );
          })}
        </Slider>
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
