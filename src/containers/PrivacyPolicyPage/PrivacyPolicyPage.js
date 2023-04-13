import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { TopbarContainer } from '../../containers';
import {
  Page,
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  PrivacyPolicy,
  Footer,
} from '../../components';
import config from '../../config';

import css from './PrivacyPolicyPage.module.css';

const PrivacyPolicyPageComponent = props => {
  const { scrollingDisabled, intl } = props;

  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({ id: 'PrivacyPolicyPage.schemaTitle' }, { siteTitle });
  const schema = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    name: schemaTitle,
  };
  return (
    <Page title={schemaTitle} scrollingDisabled={scrollingDisabled} schema={schema}>
      <LayoutSideNavigation>
        <LayoutWrapperTopbar>
          <TopbarContainer currentPage="PrivacyPolicyPage" />
        </LayoutWrapperTopbar>
        <LayoutWrapperSideNav>
          <h1 className="policy-tab">Privacy Policy</h1>
          <p className="policy-tab-p">Last updated - 26 February 2023</p>
        </LayoutWrapperSideNav>

        <LayoutWrapperMain>
          <div className={css.content}>
            <PrivacyPolicy />
          </div>
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSideNavigation>
    </Page>
  );
};

const { bool } = PropTypes;

PrivacyPolicyPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  return {
    scrollingDisabled: isScrollingDisabled(state),
  };
};

const PrivacyPolicyPage = compose(connect(mapStateToProps), injectIntl)(PrivacyPolicyPageComponent);

export default PrivacyPolicyPage;
