import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Slider from 'react-slick';
import { useHistory } from 'react-router-dom';

import { NamedLink, ListingCard } from '..';

import css from './SectionRecommendation.module.css';
import { Link } from '@mui/material';
import config from '../../config';

const SectionRecommendation = props => {
  const { rootClassName, listings, heading, linkName, linkText, reversed } = props;
  if (listings.length < 4) return <></>;
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
  const history = useHistory();
  const [mouseMoved, setMouseMoved] = useState(false);
  const handleClick = id => {
    if (!mouseMoved) {
      history.push(`/l/${id}`);
    }
  };
  return (
    <div className={classes}>
      <div className={css.sliderWrapper}>
        <Slider {...sliderSettings}>
          {listings?.map((l, index) => {
            return (
              <Link
                key={index}
                className={css.recoLink}
                onMouseMove={() => setMouseMoved(true)}
                onMouseDown={() => setMouseMoved(false)}
                onMouseUp={() => handleClick(l.id.uuid)}
                sx={{ textDecoration: 'none', cursor: 'pointer', color: '#4a4a4a' }}
              >
                <ListingCard
                  key={l.id.uuid}
                  listing={l}
                  renderSizes={cardRenderSizes}
                  className={classNames(css.listingCard, { [css.reversedListingCard]: reversed })}
                  minInfo
                />
              </Link>
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
