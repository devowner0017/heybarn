import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import config from '../../config';
import { getListingsById } from '../../ducks/marketplaceData.duck';

import {
  Page,
  SectionHero,
  SectionHowItWorks,
  SectionLocations,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  SectionRecommendation,
  NamedLink,
  SectionBanner,
} from '../../components';
import { TopbarContainer } from '../../containers';

import facebookImage from '../../assets/saunatimeFacebook-1200x630.jpg';
import twitterImage from '../../assets/saunatimeTwitter-600x314.jpg';
import css from './LandingPage.module.css';
import SectionRent from './SectionRent/SectionRent';
import SectionGuarantee from './SectionGuarantee/SectionGuarantee';
import { SectionStory } from './SctionStory/SectionStory';
import SectionHelpUs from './SectionHelpUs/SectionHelpUs';
import SectionTestimonials from './SectionTestimonials/SectionTestimonials';

export const LandingPageComponent = props => {
  const { history, intl, location, scrollingDisabled, pageListings, pageAdverts } = props;

  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org
  // We are using JSON-LD format
  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({ id: 'LandingPage.schemaTitle' }, { siteTitle });
  const schemaDescription = intl.formatMessage({ id: 'LandingPage.schemaDescription' });
  const schemaImage = `${config.canonicalRootURL}${facebookImage}`;
  return (
    <Page
      className={css.root}
      scrollingDisabled={scrollingDisabled}
      contentType="website"
      description={schemaDescription}
      title={schemaTitle}
      facebookImages={[{ url: facebookImage, width: 1200, height: 630 }]}
      twitterImages={[
        { url: `${config.canonicalRootURL}${twitterImage}`, width: 600, height: 314 },
      ]}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'WebPage',
        description: schemaDescription,
        name: schemaTitle,
        image: [schemaImage],
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>
        <LayoutWrapperMain>
          <div className={css.heroContainer}>
            <SectionHero className={css.hero} history={history} location={location} />
          </div>

          <SectionRent />

          <ul className={css.sections}>
            {!!pageListings?.length && (
              <li className={css.section}>
                <div className={css.sectionContent}>
                  <SectionRecommendation listings={pageListings} linkName={'NewListingPage'} />
                </div>
              </li>
            )}
            {!!pageAdverts?.length && (
              <li className={css.section}>
                <div className={classNames(css.sectionContent)}>
                  <SectionRecommendation
                    listings={pageAdverts}
                    heading={'Find a new exciting idea for your property'}
                    reversed
                    linkName={'NewAdvertPage'}
                    linkText={'Advertise your need'}
                  />
                </div>
              </li>
            )}
            <li className={css.section}>
              <div className={css.sectionContent}>
                <SectionHowItWorks />
              </div>
            </li>
            <li className={css.section}>
              <div className={css.sectionContent}>
                <SectionGuarantee />
              </div>
            </li>
            <li className={css.section}>
              <div className={css.sectionContent}>
                <SectionStory />
              </div>
            </li>
            <li className={css.section}>
              <div className={css.sectionContent}>
                <SectionHelpUs />
              </div>
            </li>
            <li className={css.section}>
              <div className={css.sectionContent}>
                <SectionTestimonials />
              </div>
            </li>
          </ul>
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </Page>
  );
};

const { bool, object } = PropTypes;

LandingPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,

  // from withRouter
  history: object.isRequired,
  location: object.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentPageListingsResultIds, currentPageAdvertsResultIds } = state.LandingPage;
  const pageListings =
    currentPageListingsResultIds && getListingsById(state, currentPageListingsResultIds);
  const pageAdverts =
    currentPageAdvertsResultIds && getListingsById(state, currentPageAdvertsResultIds);

  return {
    scrollingDisabled: isScrollingDisabled(state),
    pageListings,
    pageAdverts,
  };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPage = compose(withRouter, connect(mapStateToProps), injectIntl)(LandingPageComponent);
LandingPage.loadData = params => {
  return loadData(params);
};

export default LandingPage;
