import React, { useMemo } from 'react';
import Slider from 'react-slick';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage } from '../../containers';
import TopbarContainerSmall from '../TopbarContainer/TopbarContainerSmall';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';

import css from './AboutPage.module.css';
import image from './about-us-1056.jpg';
import classNames from 'classnames';
import { NamedLink } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';
import CSS from '../LandingPage/SectionRent/SectionRent.module.css';
import SearchIcon from '../../components/Topbar/SearchIcon';

import Css from '../LandingPage/SectionTestimonials/SectionTestimonials.module.css';
import logo1 from '../LandingPage/SectionTestimonials/logo-1.png';
import logo2 from '../LandingPage/SectionTestimonials/logo-2.png';
import logo3 from '../LandingPage/SectionTestimonials/logo-3.png';
import logo4 from '../LandingPage/SectionTestimonials/logo-4.png';

const AboutPage = () => {
  const { siteTwitterHandle, siteFacebookPage } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);
  const settings = useMemo(
    () => ({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
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
  // prettier-ignore
  return (
    <StaticPage
      title="About Us"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'AboutPage',
        description: 'About Heybarn',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainerSmall />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <div className={css.contentWrapper}>

            <div className={css.contentHeader}>
              <div className={css.contentSearch}>
                <div><h1>Over half of Kiwis told us that they would rather rent from other Kiwis than commercial storage operators.</h1></div>
                <p>Search our listings</p>
              </div>

              <div className={css.contentButton}>
                <div className={css.rentBtn}>
                  <NamedLink name="NewListingPage" className={classNames(CSS.heroButton, CSS.rentButton)}>
                    <FormattedMessage id="SectionHero.rentButton" />
                  </NamedLink>
                </div>
                <div className={css.findBtn}>
                  <NamedLink
                    name="SearchPage"
                    to={{
                      search:
                        'pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
                    }}
                    className={classNames(CSS.heroButton, CSS.findButton)}
                  >
                    <FormattedMessage id="SectionHero.findButton" values={{ icon: <SearchIcon /> }} />
                  </NamedLink>
                </div>
              </div>
            </div>

            <div>
              <div>
                <p id={css.featured}>Proudly featured in:</p>
              </div>
              <div className={css.slider}>
                {/* <SectionTestimonials /> */}
                <Slider {...settings}>
                  <div className={Css.slideWrapper}>
                    <div className={Css.imageWrapper} style={{ backgroundImage: `url('${logo4}')` }} />
                  </div>
                  <div className={Css.slideWrapper}>
                    <div className={Css.imageWrapper} style={{ backgroundImage: `url('${logo2}')` }} />
                  </div>
                  <div className={Css.slideWrapper}>
                    <div className={Css.imageWrapper} style={{ backgroundImage: `url('${logo1}')` }} />
                  </div>
                  <div className={Css.slideWrapper}>
                    <div className={Css.imageWrapper} style={{ backgroundImage: `url('${logo3}')` }} />
                  </div>
                  <div className={Css.slideWrapper}>
                    <div className={Css.imageWrapper} style={{ backgroundImage: `url('${logo4}')` }} />
                  </div>
                </Slider>
              </div>
            </div>

            <div className={css.spaceSection}>
              <div className={css.spaceSection__header}>
                <h1>Kiwis need more space</h1>
                <p>Whether for storage, business, events or creative pursuits, space is hard to find with commercial
                  self-storage occupancy rates in New Zealand consistently over 90%. Over a quarter of properties throughout
                  New Zealand have quality shed space which is ready to rent.
                </p>
              </div>
              <br />
              <div className={css.spaceSection__content}>
                <h2>This equates to over</h2>
                <div className={css.million}>
                  <div className={css.number}>4</div>
                  <div className={css.content}>million m</div><div className={css.contentSpan}>2</div>
                </div>
                <h2>of under-utilised space.</h2>
              </div>
            </div>

            <div className={css.founders}>
              <div className={css.founders_head}>
                <div className={css.founders_image}></div><br></br><span>The Heybarn team: Tom Brownlie, Dan Lynch, Dave Blunt and Jaimie Hunnam</span>
              </div>
              <div className={css.founders_content}>
                <div className={css.founder}>
                  <div className={css.founderContent}>
                    <h1>Heybarn founders</h1>
                    <p>Jaimie and Tom, developed heybarn after realising a site wasn't available which was specifically designed
                      to allow the owners of New Zealand properties to advertise their available space. Later joined by Dan and Dave,
                      the heybarn team has developed a site that takes the best elements of AirBnB, Tinder and commercial real estate agencies.
                    </p>
                    <p>The heybarn user experience has been carefully designed with a focus on security, control and maximising your chance
                      of finding a successful rental arrangement.
                    </p>
                  </div>
                  <div>
                    <img src="/static/media/image-right.de67b3df.png"></img>
                  </div>
                </div>
                <hr></hr>
                <h1 id={css.head}>The heybarn team</h1>
                <p>have worked widely across New Zealand and live on rural properties. They are excited to bring a new source of
                  passive income to New Zealand property owners, as well as encouraging Kiwis to find an alternative to commercial
                  building rentals.
                </p>
                <h3>Need space or have space? Heybarn is for you.</h3>
                <h3>Follow us on Facebook and Instagram.</h3>
                <a href="https://www.facebook.com/heybarn" target="_blank" rel="noopener noreferrer">
                  {/* <span style={{ color: 'red' }}> */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                    <path data-name="Icon awesome-facebook-f" d="m14.696 16.517.816-5.314h-5.1V7.754a2.657 2.657 0 0 1 3-2.871h2.318V.359A28.268 28.268 0 0 0 11.612 0c-4.2 0-6.944 2.545-6.944 7.153V11.2H0v5.314h4.668v12.849h5.745V16.517Z" fill="#fff"></path>
                  </svg>
                  {/* </span> */}
                </a>
                <a href="https://www.instagram.com/heybarn_nz" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 26.779 26.779">
                    <path data-name="Icon metro-instagram" d="M21.499 0H4.279a4.292 4.292 0 0 0-4.28 4.28v17.219a4.292 4.292 0 0 0 4.28 4.28h17.22a4.292 4.292 0 0 0 4.28-4.28V4.28A4.292 4.292 0 0 0 21.499 0ZM8.252 11.278h9.277a4.909 4.909 0 1 1-9.274 0Zm14.3 0v9.666a1.616 1.616 0 0 1-1.611 1.611H4.829a1.616 1.616 0 0 1-1.611-1.611v-9.666h2.52a7.326 7.326 0 1 0 14.294 0h2.52Zm0-5.64a.808.808 0 0 1-.806.806h-1.607a.808.808 0 0 1-.806-.806v-1.61a.808.808 0 0 1 .806-.806h1.611a.808.808 0 0 1 .806.806Z" fill="#fff">
                    </path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default AboutPage;

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={classNames(css.arrow, 'slick-prev', 'slick-arrow', {
      'slick-disabled': currentSlide === 0,
    })}
    aria-hidden="true"
    aria-disabled={currentSlide === 0 ? true : false}
    style={{ marginTop: -25, marginLeft: -20 }}
  >
    <PrevArrow />
  </button>
);

const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={classNames(css.arrow, 'slick-next', 'slick-arrow', {
      'slick-disabled': currentSlide === slideCount - 1,
    })}
    aria-hidden="true"
    aria-disabled={currentSlide === slideCount - 1 ? true : false}
    type="button"
    style={{ marginTop: -25, marginRight: -20 }}
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
