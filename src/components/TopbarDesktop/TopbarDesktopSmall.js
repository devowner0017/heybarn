import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import routeConfiguration, { ACCOUNT_SETTINGS_PAGES } from '../../routeConfiguration';
import { propTypes } from '../../util/types';
import {
  Avatar,
  InlineTextButton,
  Logo,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
} from '../../components';
import { TopbarSearchForm } from '../../forms';

import css from './TopbarDesktopSmall.module.css';
import { AvatarMedium } from '../Avatar/Avatar';
import ProfileSettingsPage from '../../containers/ProfileSettingsPage/ProfileSettingsPage';
import DropdownButton from '../Dropdown/Dropdown';
import { useHistory } from 'react-router-dom';
import { createResourceLocatorString } from '../../util/routes';
import logoImg from '../../components/Logo/orange_logo.png';

const TopbarDesktop = props => {
  const {
    className,
    currentUser,
    currentPage,
    rootClassName,
    currentUserHasListings,
    notificationCount,
    intl,
    isAuthenticated,
    onLogout,
    onSearchSubmit,
    initialSearchFormValues,
  } = props;
  const [mounted, setMounted] = useState(false);

  const history = useHistory();

  useEffect(() => {
    setMounted(true);
  }, []);
  const { firstName, lastName } = currentUser?.attributes?.profile || {};
  const { email } = currentUser?.attributes || {};
  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;

  const classes = classNames(rootClassName || css.root, className);

  const search = (
    <TopbarSearchForm
      className={css.searchLink}
      desktopInputRoot={css.topbarSearchWithLeftPadding}
      onSubmit={onSearchSubmit}
      initialValues={initialSearchFormValues}
    />
  );

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

  const notificationDot = notificationCount > 0 ? <div className={css.notificationDot} /> : null;

  const inboxLink = authenticatedOnClientSide ? (
    <NamedLink
      className={css.inboxLink}
      name="InboxPage"
      params={{ tab: currentUserHasListings ? 'sales' : 'orders' }}
    >
      <span className={css.inbox}>
        <FormattedMessage id="TopbarDesktop.inbox" />
        {notificationDot}
      </span>
    </NamedLink>
  ) : null;

  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  const profileMenu = authenticatedOnClientSide ? (
    <Menu>
      <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
        <Avatar className={css.avatar} user={currentUser} disableProfileLink />
      </MenuLabel>
      <MenuContent className={css.profileMenuContent}>
        <MenuItem key="Profile">
          <div className={css.profileMenuWrapper}>
            <div className={css.menuAvatar}>
              <AvatarMedium className={css.bigAvatar} user={currentUser} disableProfileLink />
            </div>
            <div className={css.profileInfoWrapper}>
              <div className={css.nameWrapper}>
                {firstName} {lastName}
              </div>
              <div className={css.emailWrapper}>{email}</div>
              <div className={css.profileLink}>
                <NamedLink name={'ProfileSettingsPage'}>View account</NamedLink>
              </div>
            </div>
          </div>
        </MenuItem>
        <MenuItem key="logout">
          <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.logout" />
          </InlineTextButton>
        </MenuItem>
      </MenuContent>
    </Menu>
  ) : null;

  const signupLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="SignupPage" className={css.signupLink}>
      <span className={css.signup}>
        <FormattedMessage id="TopbarDesktop.signup" />
      </span>
    </NamedLink>
  );

  const loginLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="LoginPage" className={css.loginLink}>
      <span className={css.login}>
        <FormattedMessage id="TopbarDesktop.login" />
      </span>
    </NamedLink>
  );

  const separator = isAuthenticatedOrJustHydrated ? null : <span className={css.separator} />;

  return (
    <nav className={classes}>
      <NamedLink className={css.logoLink} name="LandingPage">
        {/* <Logo
          format="desktop"
          className={css.logo}
          alt={intl.formatMessage({ id: 'TopbarDesktop.logo' })}
        /> */}
        <img src={logoImg} className={css.logo} />
      </NamedLink>
      <div className={css.dropdownContainer}>
        <DropdownButton className={css.dropdown} buttonText="Space Owners" options={optionsArr} />
        <DropdownButton className={css.dropdown} buttonText="Renters" options={advertOptionsArr} />
      </div>
      <div className={css.buttonRecomendWrapper}>
        <NamedLink className={css.buttonRecomend} name="LandingPage">
          <FormattedMessage
            id="TopbarDesktop.recommend"
            values={{
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={18}>
                  <path
                    data-name="Icon awesome-thumbs-up"
                    d="M3.232 6.961H.746A.746.746 0 0 0 0 7.707v7.458a.746.746 0 0 0 .746.746h2.486a.746.746 0 0 0 .746-.746V7.707a.746.746 0 0 0-.746-.746Zm-1.243 7.707a.746.746 0 1 1 .746-.746.746.746 0 0 1-.746.746Zm9.944-12.137c0 1.318-.807 2.057-1.034 2.938h3.161a1.857 1.857 0 0 1 1.851 1.805 2.25 2.25 0 0 1-.6 1.529 2.6 2.6 0 0 1-.289 2.47 2.457 2.457 0 0 1-.509 2.323 1.65 1.65 0 0 1-.191 1.387c-.634.911-2.206.924-3.536.924h-.096a8.921 8.921 0 0 1-3.715-.986 4.891 4.891 0 0 0-1.636-.5.373.373 0 0 1-.366-.373V7.406a.372.372 0 0 1 .111-.265c1.231-1.216 1.76-2.5 2.769-3.515A3.764 3.764 0 0 0 8.641 1.8C8.779 1.221 9.069 0 9.7 0c.742 0 2.233.249 2.233 2.531Z"
                  />
                </svg>
              ),
            }}
          />
        </NamedLink>
      </div>
      {inboxLink}
      {profileMenu}
      {signupLink}
      {separator}
      {loginLink}
    </nav>
  );
};

const { bool, func, object, number, string } = PropTypes;

TopbarDesktop.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  currentPage: null,
  notificationCount: 0,
  initialSearchFormValues: {},
};

TopbarDesktop.propTypes = {
  rootClassName: string,
  className: string,
  currentUserHasListings: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentPage: string,
  isAuthenticated: bool.isRequired,
  onLogout: func.isRequired,
  notificationCount: number,
  onSearchSubmit: func.isRequired,
  initialSearchFormValues: object,
  intl: intlShape.isRequired,
};

export default TopbarDesktop;
