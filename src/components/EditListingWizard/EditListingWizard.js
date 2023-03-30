import React, { Component, useEffect } from 'react';
import { array, bool, func, number, object, oneOf, shape, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString } from '../../util/routes';
import { withViewport } from '../../util/contextHelpers';
import { propTypes } from '../../util/types';
import {
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_NEW,
  LISTING_PAGE_PARAM_TYPES,
} from '../../util/urlHelpers';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureCurrentUser, ensureListing } from '../../util/data';

import {
  Modal,
  NamedRedirect,
  Tabs,
  StripeConnectAccountStatusBox,
  NamedLink,
} from '../../components';
import { StripeConnectAccountForm } from '../../forms';

import EditListingWizardTab, {
  AVAILABILITY,
  DESCRIPTION,
  FEATURES,
  POLICY,
  LOCATION,
  PRICING,
  PHOTOS,
} from './EditListingWizardTab';
import css from './EditListingWizard.module.css';
import ExternalLink from '../ExternalLink/ExternalLink';

// Show availability calendar only if environment variable availabilityEnabled is true
const availabilityMaybe = config.enableAvailability ? [AVAILABILITY] : [];

// You can reorder these panels.
// Note 1: You need to change save button translations for new listing flow
// Note 2: Ensure that draft listing is created after the first panel
// and listing publishing happens after last panel.
export const TABS = [DESCRIPTION, LOCATION, POLICY, PRICING, ...availabilityMaybe, PHOTOS];
export const LISTING_TABS = [DESCRIPTION, LOCATION, ...availabilityMaybe, PRICING, PHOTOS];
export const ADVERT_TABS = [DESCRIPTION, LOCATION, ...availabilityMaybe, PHOTOS];
// Tabs are horizontal in small screens
const MAX_HORIZONTAL_NAV_SCREEN_WIDTH = 1023;

const STRIPE_ONBOARDING_RETURN_URL_SUCCESS = 'success';
const STRIPE_ONBOARDING_RETURN_URL_FAILURE = 'failure';

const tabLabel = (intl, tab, listingType) => {
  let key = null;
  if (tab === DESCRIPTION) {
    key = 'EditListingWizard.tabLabelDescription';
  } else if (tab === LOCATION) {
    key = `EditListingWizard.tabLabel${listingType}Location`;
  } else if (tab === PRICING) {
    key = 'EditListingWizard.tabLabelPricing';
  } else if (tab === AVAILABILITY) {
    key = 'EditListingWizard.tabLabelAvailability';
  } else if (tab === PHOTOS) {
    key = 'EditListingWizard.tabLabelPhotos';
  }

  return intl.formatMessage({ id: key });
};

/**
 * Check if a wizard tab is completed.
 *
 * @param tab wizard's tab
 * @param listing is contains some specific data if tab is completed
 *
 * @return true if tab / step is completed.
 */
const tabCompleted = (tab, listing) => {
  const {
    availabilityPlan,
    description,
    geolocation,
    price,
    title,
    publicData,
  } = listing.attributes;
  const listingType = publicData?.listingType;
  const isListing = listingType === 'listing';
  const images = listing.images;

  switch (tab) {
    case DESCRIPTION:
      return !!(description && title);
    case LOCATION:
      return !!(
        !!listingType &&
        geolocation &&
        publicData &&
        publicData.location &&
        publicData.location.address &&
        typeof publicData.rules !== 'undefined'
      );
    case POLICY:
      return !!(!!listingType && publicData && typeof publicData.rules !== 'undefined');
    case PRICING:
      return !!listingType && isListing && !!price;
    case AVAILABILITY:
      return !!listingType && !!availabilityPlan;
    case PHOTOS:
      return !!listingType && images && images.length > 0;
    default:
      return false;
  }
};

/**
 * Check which wizard tabs are active and which are not yet available. Tab is active if previous
 * tab is completed. In edit mode all tabs are active.
 *
 * @param isNew flag if a new listing is being created or an old one being edited
 * @param listing data to be checked
 *
 * @return object containing activity / editability of different tabs of this wizard
 */
const tabsActive = (isNew, listing, tabsForListingType) => {
  return tabsForListingType.reduce((acc, tab) => {
    const previousTabIndex = tabsForListingType.findIndex(t => t === tab) - 1;
    const isActive =
      previousTabIndex >= 0
        ? !isNew || tabCompleted(tabsForListingType[previousTabIndex], listing)
        : true;
    return { ...acc, [tab]: isActive };
  }, {});
};

const scrollToTab = (tabPrefix, tabId) => {
  const el = document.querySelector(`#${tabPrefix}_${tabId}`);
  if (el) {
    el.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }
};

// Create return URL for the Stripe onboarding form
const createReturnURL = (returnURLType, rootURL, routes, pathParams) => {
  const path = createResourceLocatorString(
    'EditListingStripeOnboardingPage',
    routes,
    { ...pathParams, returnURLType },
    {}
  );
  const root = rootURL.replace(/\/$/, '');
  return `${root}${path}`;
};

// Get attribute: stripeAccountData
const getStripeAccountData = stripeAccount => stripeAccount.attributes.stripeAccountData || null;

// Get last 4 digits of bank account returned in Stripe account
const getBankAccountLast4Digits = stripeAccountData =>
  stripeAccountData && stripeAccountData.external_accounts.data.length > 0
    ? stripeAccountData.external_accounts.data[0].last4
    : null;

// Check if there's requirements on selected type: 'past_due', 'currently_due' etc.
const hasRequirements = (stripeAccountData, requirementType) =>
  stripeAccountData != null &&
  stripeAccountData.requirements &&
  Array.isArray(stripeAccountData.requirements[requirementType]) &&
  stripeAccountData.requirements[requirementType].length > 0;

// Redirect user to Stripe's hosted Connect account onboarding form
const handleGetStripeConnectAccountLinkFn = (getLinkFn, commonParams) => type => () => {
  getLinkFn({ type, ...commonParams })
    .then(url => {
      window.location.href = url;
    })
    .catch(err => console.error(err));
};

const RedirectToStripe = ({ redirectFn }) => {
  useEffect(redirectFn('custom_account_verification'), []);
  return <FormattedMessage id="EditListingWizard.redirectingToStripe" />;
};

// Create a new or edit listing through EditListingWizard
class EditListingWizard extends Component {
  constructor(props) {
    super(props);

    // Having this info in state would trigger unnecessary rerendering
    this.hasScrolledToTab = false;

    this.state = {
      draftId: null,
      showPayoutDetails: false,
    };
    this.handleCreateFlowTabScrolling = this.handleCreateFlowTabScrolling.bind(this);
    this.handlePublishListing = this.handlePublishListing.bind(this);
    this.handlePayoutModalClose = this.handlePayoutModalClose.bind(this);
    this.handlePayoutSubmit = this.handlePayoutSubmit.bind(this);
  }

  componentDidMount() {
    const { stripeOnboardingReturnURL } = this.props;

    if (stripeOnboardingReturnURL != null && !this.showPayoutDetails) {
      this.setState({ showPayoutDetails: true });
    }
  }

  handleCreateFlowTabScrolling(shouldScroll) {
    this.hasScrolledToTab = shouldScroll;
  }

  handlePublishListing(id) {
    const { onPublishListingDraft, currentUser, stripeAccount, isAdvert } = this.props;

    const stripeConnected =
      currentUser && currentUser.stripeAccount && !!currentUser.stripeAccount.id;

    const stripeAccountData = stripeConnected ? getStripeAccountData(stripeAccount) : null;

    const requirementsMissing =
      stripeAccount &&
      (hasRequirements(stripeAccountData, 'past_due') ||
        hasRequirements(stripeAccountData, 'currently_due'));

    // setting to true for now, so listings don't need a stripe account to be published
    if ((stripeConnected && !requirementsMissing) || isAdvert) {
      onPublishListingDraft(id);
    } else {
      this.setState({
        draftId: id,
        showPayoutDetails: true,
      });
    }
  }
  handleSkipStripe(id) {
    const { onPublishListingDraft } = this.props;

    onPublishListingDraft(id);
  }

  handlePayoutModalClose() {
    this.setState({ showPayoutDetails: false });
  }

  handlePayoutSubmit(values) {
    this.props
      .onPayoutDetailsSubmit(values)
      .then(response => {
        this.props.onManageDisableScrolling('EditListingWizard.payoutModal', false);
      })
      .catch(() => {
        // do nothing
      });
  }

  render() {
    const {
      id,
      className,
      rootClassName,
      params,
      listing,
      viewport,
      intl,
      errors,
      fetchInProgress,
      payoutDetailsSaveInProgress,
      payoutDetailsSaved,
      onManageDisableScrolling,
      onPayoutDetailsFormChange,
      onGetStripeConnectAccountLink,
      getAccountLinkInProgress,
      createStripeAccountError,
      updateStripeAccountError,
      fetchStripeAccountError,
      stripeAccountFetched,
      stripeAccount,
      stripeAccountError,
      stripeAccountLinkError,
      currentUser,
      isAdvert,
      ...rest
    } = this.props;

    const selectedTab = params.tab;
    const isNewListingFlow = [LISTING_PAGE_PARAM_TYPE_NEW, LISTING_PAGE_PARAM_TYPE_DRAFT].includes(
      params.type
    );
    const rootClasses = rootClassName || css.root;
    const classes = classNames(rootClasses, className);
    const currentListing = ensureListing(listing);
    const { publicData } = currentListing.attributes;

    const isDraft = currentListing.id && currentListing.attributes.state === LISTING_STATE_DRAFT;

    const listingType = isDraft ? publicData.listingType : isAdvert ? 'advert' : 'listing';
    const tabsForListingType = listingType === 'listing' ? LISTING_TABS : ADVERT_TABS;
    const tabsStatus = tabsActive(isNewListingFlow, currentListing, tabsForListingType);
    const currentTabIndex = tabsForListingType.indexOf(selectedTab);
    const nearestActiveTab = tabsForListingType
      .slice(0, currentTabIndex)
      .reverse()
      .find(t => tabsStatus[t]);
    // If selectedTab is not active, redirect to the beginning of wizard
    if (!tabsStatus[selectedTab]) {
      return (
        <NamedRedirect
          name={isAdvert ? 'EditAdvertPage' : 'EditListingPage'}
          params={{ ...params, tab: nearestActiveTab }}
        />
      );
    }
    const backButton = nearestActiveTab && (
      <NamedLink
        className={css.backButton}
        name={isAdvert ? 'EditAdvertPage' : 'EditListingPage'}
        params={{ ...params, tab: nearestActiveTab }}
      >
        {'< '} Back
      </NamedLink>
    );
    const { width } = viewport;
    const hasViewport = width > 0;
    const hasHorizontalTabLayout = hasViewport && width <= MAX_HORIZONTAL_NAV_SCREEN_WIDTH;
    const hasVerticalTabLayout = hasViewport && width > MAX_HORIZONTAL_NAV_SCREEN_WIDTH;
    const hasFontsLoaded =
      hasViewport && document.documentElement.classList.contains('fontsLoaded');

    // Check if scrollToTab call is needed (tab is not visible on mobile)
    if (hasVerticalTabLayout) {
      this.hasScrolledToTab = true;
    } else if (hasHorizontalTabLayout && !this.hasScrolledToTab && hasFontsLoaded) {
      const tabPrefix = id;
      scrollToTab(tabPrefix, selectedTab);
      this.hasScrolledToTab = true;
    }

    const tabLink = tab => {
      return { name: isAdvert ? 'EditAdvertPage' : 'EditListingPage', params: { ...params, tab } };
    };

    const formDisabled = getAccountLinkInProgress;
    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const currentUserLoaded = !!ensuredCurrentUser.id;
    const stripeConnected = currentUserLoaded && !!stripeAccount && !!stripeAccount.id;

    const rootURL = config.canonicalRootURL;
    const routes = routeConfiguration();
    const { returnURLType, ...pathParams } = params;
    const successURL = createReturnURL(
      STRIPE_ONBOARDING_RETURN_URL_SUCCESS,
      rootURL,
      routes,
      pathParams
    );
    const failureURL = createReturnURL(
      STRIPE_ONBOARDING_RETURN_URL_FAILURE,
      rootURL,
      routes,
      pathParams
    );

    const accountId = stripeConnected ? stripeAccount.id : null;
    const stripeAccountData = stripeConnected ? getStripeAccountData(stripeAccount) : null;

    const requirementsMissing =
      stripeAccount &&
      (hasRequirements(stripeAccountData, 'past_due') ||
        hasRequirements(stripeAccountData, 'currently_due'));

    const savedCountry = stripeAccountData ? stripeAccountData.country : null;

    const handleGetStripeConnectAccountLink = handleGetStripeConnectAccountLinkFn(
      onGetStripeConnectAccountLink,
      {
        accountId,
        successURL,
        failureURL,
      }
    );

    const returnedNormallyFromStripe = returnURLType === STRIPE_ONBOARDING_RETURN_URL_SUCCESS;
    const returnedAbnormallyFromStripe = returnURLType === STRIPE_ONBOARDING_RETURN_URL_FAILURE;
    const showVerificationNeeded = stripeConnected && requirementsMissing;

    // Redirect from success URL to basic path for StripePayoutPage
    if (returnedNormallyFromStripe && stripeConnected && !requirementsMissing) {
      return (
        <NamedRedirect name={isAdvert ? 'EditAdvertPage' : 'EditListingPage'} params={pathParams} />
      );
    }

    return (
      <div className={classes}>
        <Tabs
          rootClassName={css.tabsContainer}
          navRootClassName={css.nav}
          tabRootClassName={css.tab}
        >
          {tabsForListingType.map(tab => {
            return (
              <EditListingWizardTab
                {...rest}
                key={tab}
                tabId={`${id}_${tab}`}
                tabLabel={tabLabel(intl, tab, listingType)}
                tabLinkProps={tabLink(tab)}
                selected={selectedTab === tab}
                disabled={isNewListingFlow && !tabsStatus[tab]}
                tab={tab}
                intl={intl}
                params={params}
                listing={listing}
                marketplaceTabs={tabsForListingType}
                errors={errors}
                handleCreateFlowTabScrolling={this.handleCreateFlowTabScrolling}
                handlePublishListing={this.handlePublishListing}
                fetchInProgress={fetchInProgress}
                currentUser={ensuredCurrentUser}
                isAdvert={isAdvert}
                listingType={listingType}
                backButton={backButton}
              />
            );
          })}
        </Tabs>
        <Modal
          id="EditListingWizard.payoutModal"
          isOpen={this.state.showPayoutDetails}
          onClose={this.handlePayoutModalClose}
          onManageDisableScrolling={onManageDisableScrolling}
          usePortal
        >
          <div className={css.modalPayoutDetailsWrapper}>
            <h1 className={css.modalTitle}>
              <FormattedMessage id="EditListingWizard.payoutModalTitleOneMoreThing" />
              <br />
              <FormattedMessage id="EditListingWizard.payoutModalTitlePayoutPreferences" />
            </h1>
            {!currentUserLoaded ? (
              <FormattedMessage id="StripePayoutPage.loadingData" />
            ) : returnedAbnormallyFromStripe && !stripeAccountLinkError ? (
              <p className={css.modalMessage}>
                <RedirectToStripe redirectFn={handleGetStripeConnectAccountLink} />
              </p>
            ) : (
              <>
                <p className={css.modalMessage}>
                  Almost done! In order to send you money, we need to create Stripe account for you.
                  Heybarn has partnered with{' '}
                  <ExternalLink href={'https://www.stripe.com'}>Stripe</ExternalLink>, a global
                  payment service, to provide a secure online payment service. To do this, Stripe
                  requires some extra details. Heybarn does not access these details
                </p>
                <p className={css.modalMessage}>
                  If you are listing as an individual, you will be asked for some{' '}
                  <b>personal details </b>
                  (including date of birth) and <b>proof of identification</b> (e.g., a driving
                  licence) and <b>proof of address</b> (e.g., a utility bill).
                </p>
                <p className={css.modalMessage}>
                  If you wish to list your shed under a business, then you will be asked{' '}
                  <b>for personal details</b> of key representatives, directors and/or business
                  executives (including their dates of birth) and <b>proof of identification</b> and{' '}
                  <b>proof of address</b>
                  for the business.
                </p>
                <StripeConnectAccountForm
                  disabled={formDisabled}
                  inProgress={payoutDetailsSaveInProgress}
                  ready={payoutDetailsSaved}
                  currentUser={ensuredCurrentUser}
                  stripeBankAccountLastDigits={getBankAccountLast4Digits(stripeAccountData)}
                  savedCountry={savedCountry}
                  submitButtonText={intl.formatMessage({
                    id: 'StripePayoutPage.submitButtonText',
                  })}
                  stripeAccountError={stripeAccountError}
                  stripeAccountFetched={stripeAccountFetched}
                  stripeAccountLinkError={stripeAccountLinkError}
                  onChange={onPayoutDetailsFormChange}
                  onSubmit={rest.onPayoutDetailsSubmit}
                  onGetStripeConnectAccountLink={handleGetStripeConnectAccountLink}
                  stripeConnected={stripeConnected}
                >
                  {stripeConnected && !returnedAbnormallyFromStripe && showVerificationNeeded ? (
                    <StripeConnectAccountStatusBox
                      type="verificationNeeded"
                      inProgress={getAccountLinkInProgress}
                      onGetStripeConnectAccountLink={handleGetStripeConnectAccountLink(
                        'custom_account_verification'
                      )}
                    />
                  ) : stripeConnected && savedCountry && !returnedAbnormallyFromStripe ? (
                    <StripeConnectAccountStatusBox
                      type="verificationSuccess"
                      inProgress={getAccountLinkInProgress}
                      disabled={payoutDetailsSaveInProgress}
                      onGetStripeConnectAccountLink={handleGetStripeConnectAccountLink(
                        'custom_account_update'
                      )}
                    />
                  ) : null}
                </StripeConnectAccountForm>
              </>
            )}
            <div className={css.skipStripeWrapper}>
              <p className={css.modalMessage}>
                If you would like to skip this step for now, you can publish you listing for people
                to look at, but you will not be able to receive payments nor communicate from people
                until you finalise these details.{' '}
              </p>
              <div
                className={css.skipStripeLink}
                onClick={() => this.handleSkipStripe(currentListing.id)}
              >
                Finish it later
              </div>
              <p className={css.modalMessage}>
                Your details can also be edited from your Account Setting page on the Payment
                Details tab.{' '}
              </p>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

EditListingWizard.defaultProps = {
  className: null,
  currentUser: null,
  rootClassName: null,
  listing: null,
  stripeAccount: null,
  stripeAccountFetched: null,
  updateInProgress: false,
  createStripeAccountError: null,
  updateStripeAccountError: null,
  fetchStripeAccountError: null,
  stripeAccountError: null,
  stripeAccountLinkError: null,
};

EditListingWizard.propTypes = {
  id: string.isRequired,
  className: string,
  currentUser: propTypes.currentUser,
  rootClassName: string,
  params: shape({
    id: string.isRequired,
    slug: string.isRequired,
    type: oneOf(LISTING_PAGE_PARAM_TYPES).isRequired,
    tab: oneOf(TABS).isRequired,
  }).isRequired,
  stripeAccount: object,
  stripeAccountFetched: bool,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: shape({
    attributes: shape({
      publicData: object,
      description: string,
      geolocation: object,
      pricing: object,
      title: string,
    }),
    images: array,
  }),

  errors: shape({
    createListingDraftError: object,
    updateListingError: object,
    publishListingError: object,
    showListingsError: object,
    uploadImageError: object,
  }).isRequired,
  createStripeAccountError: propTypes.error,
  updateStripeAccountError: propTypes.error,
  fetchStripeAccountError: propTypes.error,
  stripeAccountError: propTypes.error,
  stripeAccountLinkError: propTypes.error,

  fetchInProgress: bool.isRequired,
  getAccountLinkInProgress: bool.isRequired,
  payoutDetailsSaveInProgress: bool.isRequired,
  payoutDetailsSaved: bool.isRequired,
  onPayoutDetailsFormChange: func.isRequired,
  onGetStripeConnectAccountLink: func.isRequired,
  onManageDisableScrolling: func.isRequired,

  // from withViewport
  viewport: shape({
    width: number.isRequired,
    height: number.isRequired,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default compose(withViewport, injectIntl)(EditListingWizard);
