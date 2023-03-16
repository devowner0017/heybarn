import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { twitterPageURL } from '../../util/urlHelpers';
import config from '../../config';
import {
  IconSocialMediaFacebook,
  IconSocialMediaInstagram,
  IconSocialMediaTwitter,
  Logo,
  ExternalLink,
  NamedLink,
} from '../../components';

import css from './Footer.module.css';
import DropdownButton from '../Dropdown/Dropdown';

const renderSocialMediaLinks = intl => {
  const { siteFacebookPage, siteInstagramPage, siteTwitterHandle } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  const goToFb = intl.formatMessage({ id: 'Footer.goToFacebook' });
  const goToInsta = intl.formatMessage({ id: 'Footer.goToInstagram' });
  const goToTwitter = intl.formatMessage({ id: 'Footer.goToTwitter' });

  const fbLink = siteFacebookPage ? (
    <ExternalLink key="linkToFacebook" href={siteFacebookPage} className={css.icon} title={goToFb}>
      <IconSocialMediaFacebook />
    </ExternalLink>
  ) : null;

  const twitterLink = siteTwitterPage ? (
    <ExternalLink
      key="linkToTwitter"
      href={siteTwitterPage}
      className={css.icon}
      title={goToTwitter}
    >
      <IconSocialMediaTwitter />
    </ExternalLink>
  ) : null;

  const instragramLink = siteInstagramPage ? (
    <ExternalLink
      key="linkToInstagram"
      href={siteInstagramPage}
      className={css.icon}
      title={goToInsta}
    >
      <IconSocialMediaInstagram />
    </ExternalLink>
  ) : null;
  return [fbLink, twitterLink, instragramLink].filter(v => v != null);
};

const Footer = props => {
  const { rootClassName, className, intl } = props;
  const socialMediaLinks = renderSocialMediaLinks(intl);
  const classes = classNames(rootClassName || css.root, className);

  const optionsArr = [
    {
      name: 'rent',
      label: (
        <NamedLink name="NewListingPage">
          <FormattedMessage id="TopbarDesktop.createListing" />
        </NamedLink>
      ),
    },
    {
      name: 'browse',
      label: (
        <NamedLink
          name="SearchPage"
          to={{
            search:
              'pub_listingType=advert&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
          }}
        >
          Browse renter requests
        </NamedLink>
      ),
    },
  ];

  const advertOptionsArr = [
    {
      name: 'rent',
      label: (
        <NamedLink name="NewAdvertPage">
          <FormattedMessage id="TopbarDesktop.createAdvert" />
        </NamedLink>
      ),
    },
    {
      name: 'browse',
      label: (
        <NamedLink
          name="SearchPage"
          to={{
            search:
              'pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618',
          }}
        >
          Find your space
        </NamedLink>
      ),
    },
  ];

  return (
    <div className={classes}>
      <div className={css.topBorderWrapper}>
        <div className={css.content}>
          <div className={css.links}>
            <div className={css.infoLinks}>
              <ul className={css.list}>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" className={css.link}>
                    <FormattedMessage id="Footer.toAboutPage" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="FAQPage" className={css.link}>
                    <FormattedMessage id="Footer.toFAQPage" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="ContactPage" className={css.link}>
                    <FormattedMessage id="Footer.toContactPage" />
                  </NamedLink>
                </li>
              </ul>
            </div>
            <div className={css.dropdownContainer}>
              <DropdownButton
                reverse
                className={css.dropdown}
                buttonClassName={css.button}
                buttonText="Space Owners"
                options={optionsArr}
              />
              <DropdownButton
                reverse
                className={css.dropdown}
                buttonClassName={css.button}
                buttonText="Renters"
                options={advertOptionsArr}
              />
            </div>
            <div className={css.infoLinks}>
              <ul className={css.list}>
                <li className={css.listItem}>
                  <NamedLink name="LandingPage" className={css.link}>
                    <FormattedMessage
                      id="Footer.copyright"
                      values={{ year: new Date().getFullYear() }}
                    />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="PrivacyPolicyPage" className={css.link}>
                    <FormattedMessage id="Footer.privacyPolicy" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="TermsOfServicePage" className={css.link}>
                    <FormattedMessage id="Footer.termsOfUse" />
                  </NamedLink>
                </li>
              </ul>
            </div>
            <div className={css.extraLinks}>
              <div className={css.someLinks}>{socialMediaLinks}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Footer.defaultProps = {
  rootClassName: null,
  className: null,
};

Footer.propTypes = {
  rootClassName: string,
  className: string,
  intl: intlShape.isRequired,
};

export default injectIntl(Footer);
