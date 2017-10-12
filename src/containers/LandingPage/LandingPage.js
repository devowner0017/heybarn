import React, { PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import config from '../../config';
import { Page, HeroSection } from '../../components';
import { TopbarContainer } from '../../containers';

import facebookImage from '../../assets/saunatimeFacebook-1200x630.jpg';
import twitterImage from '../../assets/saunatimeTwitter-600x314.jpg';
import css from './LandingPage.css';

export const LandingPageComponent = props => {
  const {
    authInfoError,
    history,
    intl,
    location,
    logoutError,
    scrollingDisabled,
  } = props;

  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org
  // We are using JSON-LD format
  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({ id: 'LandingPage.schemaTitle' }, { siteTitle });
  const schemaDescription = intl.formatMessage({ id: 'LandingPage.schemaDescription' });
  const schemaImage = `${config.canonicalRootURL}/${facebookImage}`;

  return (
    <Page
      className={css.root}
      authInfoError={authInfoError}
      logoutError={logoutError}
      scrollingDisabled={scrollingDisabled}
      contentType="website"
      description={schemaDescription}
      title={schemaTitle}
      facebookImages={[{ url: facebookImage, width: 1200, height: 630 }]}
      twitterImages={[{ url: twitterImage, width: 600, height: 314 }]}
      schema={
        `
        {
          "@context": "http://schema.org",
          "@type": "WebPage",
          "description": "${schemaDescription}",
          "name": "${schemaTitle}",
          "image": [
            "${schemaImage}"
          ]
        }
      `
      }
    >
      <TopbarContainer />
      <div className={css.heroContainer}>
        <HeroSection className={css.hero} history={history} location={location} />
      </div>
    </Page>
  );
};

LandingPageComponent.defaultProps = {
  authInfoError: null,
  logoutError: null,
};

const { bool, instanceOf, object } = PropTypes;

LandingPageComponent.propTypes = {
  authInfoError: instanceOf(Error),
  logoutError: instanceOf(Error),
  scrollingDisabled: bool.isRequired,

  // from withRouter
  history: object.isRequired,
  location: object.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { authInfoError, logoutError } = state.Auth;
  return {
    authInfoError,
    logoutError,
    scrollingDisabled: isScrollingDisabled(state),
  };
};

const LandingPage = compose(connect(mapStateToProps), injectIntl, withRouter)(LandingPageComponent);

export default LandingPage;
