import React, { useMemo } from 'react';
import Slider from 'react-slick';

import css from './SectionTestimonials.module.css';

import logo1 from './logo-1.png';
import logo2 from './logo-2.png';
import logo3 from './logo-3.png';
import logo4 from './logo-4.png';
import classNames from 'classnames';

export const SectionTestimonials = () => {
  const settings = useMemo(
    () => ({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 4,
      prevArrow: <SlickArrowLeft />,
      nextArrow: <SlickArrowRight />,
      autoplay: true,
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
    }),
    []
  );

  return (
    <div className={css.root}>
      <div className={css.container}>
        <div className={css.featuredIn}>
          <h2 className={css.featuredInTitle}>Featured in:</h2>
        </div>
        <div className={css.slider}>
          <Slider {...settings}>
            <div className={css.slideWrapper}>
              <div className={css.imageWrapper} style={{ backgroundImage: `url('${logo1}')` }} />
            </div>
            <div className={css.slideWrapper}>
              <div className={css.imageWrapper} style={{ backgroundImage: `url('${logo2}')` }} />
            </div>
            <div className={css.slideWrapper}>
              <div className={css.imageWrapper} style={{ backgroundImage: `url('${logo3}')` }} />
            </div>
            <div className={css.slideWrapper}>
              <div className={css.imageWrapper} style={{ backgroundImage: `url('${logo4}')` }} />
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default SectionTestimonials;

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={classNames('slick-prev', 'slick-arrow', css.arrowLeft, {
      'slick-disabled': currentSlide === 0,
    })}
    aria-hidden="true"
    aria-disabled={currentSlide === 0 ? true : false}
    type="button"
  >
    <PrevArrow />
  </button>
);

const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={classNames('slick-next', 'slick-arrow', css.arrowRight, {
      'slick-disabled': currentSlide === slideCount - 1,
    })}
    aria-hidden="true"
    aria-disabled={currentSlide === slideCount - 1 ? true : false}
    type="button"
  >
    <NextArrow />
  </button>
);

const NextArrow = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 23.153 23.774">
    <g
      data-name="Icon feather-arrow-right"
      fill="none"
      stroke="#222"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path data-name="Path 61" d="M.75 11.887h21.652" />
      <path data-name="Path 62" d="m11.576 1.061 10.826 10.826-10.826 10.827" />
    </g>
  </svg>
);

const PrevArrow = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 23.153 23.774">
    <g
      data-name="Icon feather-arrow-right"
      fill="none"
      stroke="#222"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path data-name="Path 61" d="M22.403 11.887H.75" />
      <path data-name="Path 62" d="M11.576 1.061.75 11.887l10.826 10.827" />
    </g>
  </svg>
);
