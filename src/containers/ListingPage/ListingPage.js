import React, { Component } from 'react';
import { array, arrayOf, bool, func, shape, string, oneOf } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import config from '../../config';
import routeConfiguration from '../../routeConfiguration';
import { findOptionsForSelectFilter } from '../../util/search';
import {
  LISTING_STATE_PENDING_APPROVAL,
  LISTING_STATE_CLOSED,
  LISTING_UNDER_ENQUIRY,
  propTypes,
  LISTING_LIVE,
} from '../../util/types';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  LISTING_PAGE_DRAFT_VARIANT,
  LISTING_PAGE_PENDING_APPROVAL_VARIANT,
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_EDIT,
  createSlug,
} from '../../util/urlHelpers';
import { formatMoney } from '../../util/currency';
import { createResourceLocatorString, findRouteByRouteName } from '../../util/routes';
import {
  ensureListing,
  ensureOwnListing,
  ensureUser,
  userDisplayNameAsString,
} from '../../util/data';
import { richText } from '../../util/richText';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck';
import { initializeCardPaymentData } from '../../ducks/stripe.duck.js';
import {
  Page,
  NamedLink,
  NamedRedirect,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ContactPanel,
  Modal,
  Button,
} from '../../components';
import { TopbarContainer, NotFoundPage } from '../../containers';

import {
  sendEnquiry,
  fetchTransactionLineItems,
  setInitialValues,
  showListing,
} from './ListingPage.duck';
import SectionImages from './SectionImages';
import SectionAvatar from './SectionAvatar';
import SectionHeading from './SectionHeading';
import SectionDescriptionMaybe from './SectionDescriptionMaybe';
import SectionFeaturesMaybe from './SectionFeaturesMaybe';
import SectionHostMaybe from './SectionHostMaybe';
import SectionRulesMaybe from './SectionRulesMaybe';
import SectionMapMaybe from './SectionMapMaybe';
import css from './ListingPage.module.css';
import { capitalize } from 'lodash';
import { deleteListing, hideListing } from '../ManageListingsPage/ManageListingsPage.duck';

const MIN_LENGTH_FOR_LONG_WORDS_IN_TITLE = 16;

const { UUID } = sdkTypes;

const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: `(${price.currency})`,
      priceTitle: `Unsupported currency (${price.currency})`,
    };
  }
  return {};
};

export class ListingPageComponent extends Component {
  constructor(props) {
    super(props);
    const { enquiryModalOpenForListingId, params } = props;
    this.state = {
      pageClassNames: [],
      imageCarouselOpen: false,
      enquiryModalOpen: enquiryModalOpenForListingId === params.id,
      showPublishedListingModal: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitContactUser = this.submitContactUser.bind(this);
    this.onContactUser = this.onContactUser.bind(this);
    this.onSubmitEnquiry = this.onSubmitEnquiry.bind(this);
    this.setShowPublishedListingModal = this.setShowPublishedListingModal.bind(this);
  }

  componentDidMount() {
    const { location } = this.props;
    const { showPublishedListingModal } = this.state;
    const { published } = location?.state ? location.state : {};
    if (published && !showPublishedListingModal) {
      this.setState({ showPublishedListingModal: true });
    }
  }

  setShowPublishedListingModal(val) {
    const { location, history } = this.props;
    this.setState({
      showPublishedListingModal: val,
    });
    // Need to replace the state to prevent pop up from repeating
    if (!val) history.replace({ pathname: location.pathname, state: {} });
  }

  submitContactUser(values) {
    const {
      history,
      getListing,
      params,
      callSetInitialValues,
      onInitializeCardPaymentData,
      currentUser,
    } = this.props;
    const listingId = new UUID(params.id);
    const listing = getListing(listingId);
    const typeOfListing = listing?.attributes?.publicData.listingType;
    const contactingAs = typeOfListing === 'listing' ? 'renter' : 'host';
    // const { bookingDates, ...bookingData } = values;

    const initialValues = {
      contactingAs,
      host: typeOfListing === 'listing' ? listing.author : currentUser,
      guest: typeOfListing === 'listing' ? currentUser : listing.author,
      confirmPaymentError: null,
    };
    const saveToSessionStorage = !this.props.currentUser;
    const routes = routeConfiguration();
    // Customize checkout page state with current listing and selected bookingDates
    const { setInitialValues } = findRouteByRouteName(
      `TransactionInitPage${typeOfListing === 'listing' ? 'L' : 'A'}`,
      routes
    );
    callSetInitialValues(setInitialValues, initialValues, saveToSessionStorage);

    // Clear previous Stripe errors from store if there is any
    onInitializeCardPaymentData();

    // Redirect to CheckoutPage
    history.push(
      createResourceLocatorString(
        `TransactionInitPage${typeOfListing === 'listing' ? 'L' : 'A'}`,
        routes,
        { id: listing.id.uuid, slug: createSlug(listing.attributes.title) },
        {}
      )
    );
  }
  handleSubmit(values) {
    const {
      history,
      getListing,
      params,
      callSetInitialValues,
      onInitializeCardPaymentData,
    } = this.props;
    const listingId = new UUID(params.id);
    const listing = getListing(listingId);

    const { bookingDates, ...bookingData } = values;

    const initialValues = {
      listing,
      bookingData,
      bookingDates: {
        bookingStart: bookingDates.startDate,
        bookingEnd: bookingDates.endDate,
      },
      confirmPaymentError: null,
    };

    const saveToSessionStorage = !this.props.currentUser;

    const routes = routeConfiguration();
    // Customize checkout page state with current listing and selected bookingDates
    const { setInitialValues } = findRouteByRouteName('CheckoutPage', routes);

    callSetInitialValues(setInitialValues, initialValues, saveToSessionStorage);

    // Clear previous Stripe errors from store if there is any
    onInitializeCardPaymentData();

    // Redirect to CheckoutPage
    history.push(
      createResourceLocatorString(
        'CheckoutPage',
        routes,
        { id: listing.id.uuid, slug: createSlug(listing.attributes.title) },
        {}
      )
    );
  }

  onContactUser() {
    const { currentUser, history, callSetInitialValues, params, location } = this.props;

    if (!currentUser) {
      const state = {
        from: `${location.pathname}${location.search}${location.hash}`,
      };

      // We need to log in before showing the modal, but first we need to ensure
      // that modal does open when user is redirected back to this listingpage
      callSetInitialValues(setInitialValues, {
        enquiryModalOpenForListingId: params.id,
      });

      // signup and return back to listingPage.
      history.push(createResourceLocatorString('SignupPage', routeConfiguration(), {}, {}), state);
    } else {
      this.setState({ enquiryModalOpen: true });
    }
  }

  onSubmitEnquiry(values) {
    const { history, params, onSendEnquiry } = this.props;
    const routes = routeConfiguration();
    const listingId = new UUID(params.id);
    const { message } = values;

    onSendEnquiry(listingId, message.trim())
      .then(txId => {
        this.setState({ enquiryModalOpen: false });

        // Redirect to OrderDetailsPage
        history.push(
          createResourceLocatorString('OrderDetailsPage', routes, { id: txId.uuid }, {})
        );
      })
      .catch(() => {
        // Ignore, error handling in duck file
      });
  }

  render() {
    const {
      unitType,
      currentUser,
      getListing,
      getOwnListing,
      intl,
      onManageDisableScrolling,
      params: rawParams,
      location,
      scrollingDisabled,
      showListingError,
      timeSlots,
      fetchTimeSlotsError,
      filterConfig,
      onFetchTransactionLineItems,
      lineItems,
      fetchLineItemsInProgress,
      fetchLineItemsError,
      currentUserInTransaction,
      hidingListing,
      hidingListingError,
      deletingListing,
      deletingListingError,
      onHideListing,
      onDeleteListing,
      requestShowListing,
    } = this.props;

    const listingId = new UUID(rawParams.id);
    const isPendingApprovalVariant = rawParams.variant === LISTING_PAGE_PENDING_APPROVAL_VARIANT;
    const isDraftVariant = rawParams.variant === LISTING_PAGE_DRAFT_VARIANT;
    const currentListing =
      isPendingApprovalVariant || isDraftVariant
        ? ensureOwnListing(getOwnListing(listingId))
        : ensureListing(getListing(listingId));

    const listingSlug = rawParams.slug || createSlug(currentListing.attributes.title || '');
    const params = { slug: listingSlug, ...rawParams };

    const listingType = isDraftVariant
      ? LISTING_PAGE_PARAM_TYPE_DRAFT
      : LISTING_PAGE_PARAM_TYPE_EDIT;
    const listingTab = isDraftVariant ? 'photos' : 'description';

    const isApproved =
      currentListing.id && currentListing.attributes.state !== LISTING_STATE_PENDING_APPROVAL;

    const pendingIsApproved = isPendingApprovalVariant && isApproved;

    // If a /pending-approval URL is shared, the UI requires
    // authentication and attempts to fetch the listing from own
    // listings. This will fail with 403 Forbidden if the author is
    // another user. We use this information to try to fetch the
    // public listing.
    const pendingOtherUsersListing =
      (isPendingApprovalVariant || isDraftVariant) &&
      showListingError &&
      showListingError.status === 403;
    const shouldShowPublicListingPage = pendingIsApproved || pendingOtherUsersListing;

    if (shouldShowPublicListingPage) {
      return <NamedRedirect name="ListingPage" params={params} search={location.search} />;
    }

    const {
      description = '',
      geolocation = null,
      price = null,
      title = '',
      publicData,
    } = currentListing.attributes;

    const {
      listingType: typeOfListing,
      listingState,
      locRegion: region,
      preferredUse: need,
      notDeleted,
    } = publicData;
    const isDeleted = notDeleted === false;
    if (isDeleted)
      return (
        <NamedRedirect
          name={'SearchPage'}
          to={{
            search: `?address=New%20Zealand&pub_listingType=${typeOfListing}`,
          }}
        />
      );
    const listingUnderEnquiry = listingState === LISTING_UNDER_ENQUIRY;

    const richTitle = (
      <>
        {richText(title, {
          longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_TITLE,
          longWordClass: css.longWord,
        })}
      </>
    );

    const bookingTitle = (
      <FormattedMessage id="ListingPage.bookingTitle" values={{ title: richTitle }} />
    );

    const topbar = <TopbarContainer />;

    if (showListingError && showListingError.status === 404) {
      // 404 listing not found

      return <NotFoundPage />;
    } else if (showListingError) {
      // Other error in fetching listing

      const errorTitle = intl.formatMessage({
        id: 'ListingPage.errorLoadingListingTitle',
      });

      return (
        <Page title={errorTitle} scrollingDisabled={scrollingDisabled}>
          <LayoutSingleColumn className={css.pageRoot}>
            <LayoutWrapperTopbar>{topbar}</LayoutWrapperTopbar>
            <LayoutWrapperMain>
              <p className={css.errorText}>
                <FormattedMessage id="ListingPage.errorLoadingListingMessage" />
              </p>
            </LayoutWrapperMain>
            <LayoutWrapperFooter>
              <Footer />
            </LayoutWrapperFooter>
          </LayoutSingleColumn>
        </Page>
      );
    } else if (!currentListing.id) {
      // Still loading the listing

      const loadingTitle = intl.formatMessage({
        id: `ListingPage.loading${typeOfListing}Title`,
      });

      return (
        <Page title={loadingTitle} scrollingDisabled={scrollingDisabled}>
          <LayoutSingleColumn className={css.pageRoot}>
            <LayoutWrapperTopbar>{topbar}</LayoutWrapperTopbar>
            <LayoutWrapperMain>
              <p className={css.loadingText}>
                <FormattedMessage id="ListingPage.loadingListingMessage" />
              </p>
            </LayoutWrapperMain>
            <LayoutWrapperFooter>
              <Footer />
            </LayoutWrapperFooter>
          </LayoutSingleColumn>
        </Page>
      );
    }

    const handleViewPhotosClick = e => {
      // Stop event from bubbling up to prevent image click handler
      // trying to open the carousel as well.
      e.stopPropagation();
      this.setState({
        imageCarouselOpen: true,
      });
    };
    const authorAvailable = currentListing && currentListing.author;
    const userAndListingAuthorAvailable = !!(currentUser && authorAvailable);
    const isOwnListing =
      userAndListingAuthorAvailable && currentListing.author.id.uuid === currentUser.id.uuid;

    const currentAuthor = authorAvailable ? currentListing.author : null;
    const ensuredAuthor = ensureUser(currentAuthor);

    // When user is banned or deleted the listing is also deleted.
    // Because listing can be never showed with banned or deleted user we don't have to provide
    // banned or deleted display names for the function
    const authorDisplayName = userDisplayNameAsString(ensuredAuthor, '');

    const { formattedPrice, priceTitle } = priceData(price, intl);

    // TO EXCHANGE DETAILS
    const handleContactUser = values => {
      const isCurrentlyClosed = currentListing.attributes.state === LISTING_STATE_CLOSED;
      if (isOwnListing || isCurrentlyClosed) {
        window.scrollTo(0, 0);
      } else {
        this.submitContactUser(values);
      }
    };

    const handleBookingSubmit = values => {
      const isCurrentlyClosed = currentListing.attributes.state === LISTING_STATE_CLOSED;
      if (isOwnListing || isCurrentlyClosed) {
        window.scrollTo(0, 0);
      } else {
        this.handleSubmit(values);
      }
    };

    const listingImages = (listing, variantName) =>
      (listing.images || [])
        .map(image => {
          const variants = image.attributes.variants;
          const variant = variants ? variants[variantName] : null;

          // deprecated
          // for backwards combatility only
          const sizes = image.attributes.sizes;
          const size = sizes ? sizes.find(i => i.name === variantName) : null;

          return variant || size;
        })
        .filter(variant => variant != null);

    const facebookImages = listingImages(currentListing, 'facebook');
    const twitterImages = listingImages(currentListing, 'twitter');
    const schemaImages = JSON.stringify(facebookImages.map(img => img.url));
    const siteTitle = config.siteTitle;
    const schemaTitle = intl.formatMessage(
      { id: 'ListingPage.schemaTitle' },
      { title, price: formattedPrice, siteTitle }
    );

    const hostLink = (
      <NamedLink
        className={css.authorNameLink}
        name={`${capitalize(typeOfListing)}Page`}
        params={params}
        to={{ hash: '#host' }}
      >
        {authorDisplayName}
      </NamedLink>
    );

    const amenityOptions = findOptionsForSelectFilter('amenities', filterConfig);

    const hasImages = currentListing.images && currentListing.images.length > 0;
    const totalImages = hasImages ? currentListing.images.length : 0;

    return (
      <Page
        title={schemaTitle}
        scrollingDisabled={scrollingDisabled}
        author={authorDisplayName}
        contentType="website"
        description={description}
        facebookImages={facebookImages}
        twitterImages={twitterImages}
        schema={{
          '@context': 'http://schema.org',
          '@type': 'ItemPage',
          description: description,
          name: schemaTitle,
          image: schemaImages,
        }}
      >
        <LayoutSingleColumn className={css.pageRoot}>
          <LayoutWrapperTopbar>{topbar}</LayoutWrapperTopbar>
          <LayoutWrapperMain className={css.layoutWrapperMain}>
            <div>
              <div className={css.imgHeader}>
                <div>
                  <h1>Pole Shed, Stabling or Covered Yards</h1>
                </div>
                <div>
                  <span>Manawatu</span>
                  <a href="/s?pub_listingType=listing&address=New%20Zealand&bounds=-34.0465240000456%2C179.9%2C-52.6693956973145%2C165.770163500618">
                    Back to search
                  </a>
                </div>
              </div>
              <div className={css.imageContainer}>
                <div className={css.mainImage}>
                  <SectionImages
                    // title={title}
                    listing={currentListing}
                    // isOwnListing={isOwnListing}
                    // listingUnderEnquiry={listingUnderEnquiry}
                    // currentUserInTransaction={currentUserInTransaction}
                    imageCarouselOpen={this.state.imageCarouselOpen}
                    onImageCarouselClose={() => this.setState({ imageCarouselOpen: false })}
                    handleViewPhotosClick={handleViewPhotosClick}
                    onManageDisableScrolling={onManageDisableScrolling}
                    // typeOfListing={typeOfListing}
                    // fromPage={location?.state?.fromPage}
                    need={need}
                  />
                </div>
                {totalImages && (
                  <div className={css.smallImages}>
                    <div className={css.heightAuto}>
                      <SectionImages
                        // title={title}
                        listing={currentListing}
                        // isOwnListing={isOwnListing}
                        // listingUnderEnquiry={listingUnderEnquiry}
                        // currentUserInTransaction={currentUserInTransaction}
                        imageCarouselOpen={this.state.imageCarouselOpen}
                        onImageCarouselClose={() => this.setState({ imageCarouselOpen: false })}
                        handleViewPhotosClick={handleViewPhotosClick}
                        onManageDisableScrolling={onManageDisableScrolling}
                        // typeOfListing={typeOfListing}
                        // fromPage={location?.state?.fromPage}
                        // need={need}
                      />
                    </div>
                    <div className={css.heightAuto}>
                      <SectionImages
                        // title={title}
                        listing={currentListing}
                        // isOwnListing={isOwnListing}
                        // listingUnderEnquiry={listingUnderEnquiry}
                        // currentUserInTransaction={currentUserInTransaction}
                        imageCarouselOpen={this.state.imageCarouselOpen}
                        onImageCarouselClose={() => this.setState({ imageCarouselOpen: false })}
                        handleViewPhotosClick={handleViewPhotosClick}
                        onManageDisableScrolling={onManageDisableScrolling}
                        // typeOfListing={typeOfListing}
                        // fromPage={location?.state?.fromPage}
                        // need={need}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className={css.contentContainer}>
                {/* <SectionAvatar user={currentAuthor} params={params} /> */}
                <div className={css.mainContent}>
                  <div>
                    {/* <SectionHeading
                      priceTitle={priceTitle}
                      formattedPrice={formattedPrice}
                      richTitle={richTitle}
                      hostLink={hostLink}
                      region={region}
                      preferredUse={need}
                      listingType={typeOfListing}
                    /> */}
                    {/* <SectionDescriptionMaybe
                      description={description}
                      listingType={typeOfListing}
                    /> */}
                    <div className={css.idealStorageTag}>
                      <h2>Ideal for storage</h2>
                      <div>
                        <h3>
                          Owned by <span>Hayden M</span>
                        </h3>
                        <h3 className={css.dollar}>NZ $30.00/wk</h3>
                      </div>
                    </div>
                    <hr className={css.underline}></hr>
                    <div>
                      <h3 className={css.space}>About this page</h3>
                      <p>So many sheds, not enough of my own toys to fill them all.</p>
                      <p>
                        Covered yard spaces, pole shedding and enclosed stabling areas available for
                        long/short term storage of trailers, attachments, feed or other
                        gear/equipment.
                      </p>
                    </div>
                    <hr className={css.underline}></hr>
                    <div>
                      <h3 className={css.space}>Size of space</h3>
                      <p>
                        Garage 3.6m x 6.1m<br></br>20.7m of floor space
                      </p>
                    </div>
                    <hr className={css.underline}></hr>
                    <SectionFeaturesMaybe
                      options={amenityOptions}
                      publicData={publicData}
                      listingType={typeOfListing}
                    />
                    <hr className={css.underline}></hr>
                    <SectionRulesMaybe publicData={publicData} listingType={typeOfListing} />
                    <hr className={css.underline}></hr>
                    <div>
                      <h3 className={css.space}>Property Rules</h3>
                      <p>
                        No Smoking<br></br>Pets are allowed
                      </p>
                    </div>
                    <hr className={css.underline}></hr>
                    <br></br>
                    <div>
                      <ContactPanel
                        className={css.__bookingPanel}
                        listing={currentListing}
                        isOwnListing={isOwnListing}
                        listingUnderEnquiry={listingUnderEnquiry}
                        unitType={unitType}
                        onSubmit={handleContactUser}
                        title={bookingTitle}
                        authorDisplayName={authorDisplayName}
                        onManageDisableScrolling={onManageDisableScrolling}
                        timeSlots={timeSlots}
                        fetchTimeSlotsError={fetchTimeSlotsError}
                        onFetchTransactionLineItems={onFetchTransactionLineItems}
                        lineItems={lineItems}
                        fetchLineItemsInProgress={fetchLineItemsInProgress}
                        fetchLineItemsError={fetchLineItemsError}
                        currentUserInTransaction={currentUserInTransaction}
                        hidingListing={hidingListing}
                        hidingListingError={hidingListingError}
                        deletingListing={deletingListing}
                        deletingListingError={deletingListingError}
                        onHideListing={onHideListing}
                        onDeleteListing={onDeleteListing}
                        requestShowListing={requestShowListing}
                        editParams={{
                          id: listingId.uuid,
                          slug: listingSlug,
                          type: listingType,
                          tab: listingTab,
                        }}
                        fromPage={location?.state?.fromPage}
                      />
                      {/* <button className={css.contactButton}>CONTACT SPACE OWNER</button> */}
                    </div>
                  </div>
                </div>
                <div>
                  <ContactPanel
                    className={css.bookingPanel}
                    listing={currentListing}
                    isOwnListing={isOwnListing}
                    listingUnderEnquiry={listingUnderEnquiry}
                    unitType={unitType}
                    onSubmit={handleContactUser}
                    title={bookingTitle}
                    authorDisplayName={authorDisplayName}
                    onManageDisableScrolling={onManageDisableScrolling}
                    timeSlots={timeSlots}
                    fetchTimeSlotsError={fetchTimeSlotsError}
                    onFetchTransactionLineItems={onFetchTransactionLineItems}
                    lineItems={lineItems}
                    fetchLineItemsInProgress={fetchLineItemsInProgress}
                    fetchLineItemsError={fetchLineItemsError}
                    currentUserInTransaction={currentUserInTransaction}
                    hidingListing={hidingListing}
                    hidingListingError={hidingListingError}
                    deletingListing={deletingListing}
                    deletingListingError={deletingListingError}
                    onHideListing={onHideListing}
                    onDeleteListing={onDeleteListing}
                    requestShowListing={requestShowListing}
                    editParams={{
                      id: listingId.uuid,
                      slug: listingSlug,
                      type: listingType,
                      tab: listingTab,
                    }}
                    fromPage={location?.state?.fromPage}
                  />
                  <div className={css.spaceowner}>
                    <div className={css.spaceownercontainer}>
                      <div className={css.image}>
                        <div className={css._h2}>
                          <h2>
                            Your space owner<br></br>
                            <span className={css.name}>
                              Owned by <span className={css.Name}>Hayden M</span>
                            </span>
                          </h2>
                        </div>
                        <div className={css._image}></div>
                      </div>
                      <div>
                        <p>
                          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                          eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                          voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
                          clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
                          amet, consetetur sadipscingelitr, sed diam nonumy
                        </p>
                      </div>
                      <div>
                        <a href="/u/6405e51c-04b9-493f-814f-96c00608607b" className={css.link}>
                          View profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={css.mapwrap}>
                <SectionMapMaybe
                  geolocation={geolocation}
                  publicData={publicData}
                  listingId={currentListing.id}
                  listingType={typeOfListing}
                />
              </div>
            </div>
            <Modal
              id={`ListingPage.publishedListingModal`}
              isOpen={this.state.showPublishedListingModal}
              onClose={_ => this.setShowPublishedListingModal(false)}
              onManageDisableScrolling={onManageDisableScrolling}
            >
              <div>
                <h1 className={css.modalTitle}>
                  <FormattedMessage
                    id="ListingPage.publishedListingTitle"
                    values={{ listingType: typeOfListing }}
                  />
                </h1>
                <div className={css.publishedListingButtonWrapper}>
                  <Button onClick={() => this.setShowPublishedListingModal(false)}>
                    Lets see it!
                  </Button>
                </div>
              </div>
            </Modal>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
}

ListingPageComponent.defaultProps = {
  unitType: config.bookingUnitType,
  currentUser: null,
  enquiryModalOpenForListingId: null,
  showListingError: null,
  reviews: [],
  fetchReviewsError: null,
  timeSlots: null,
  fetchTimeSlotsError: null,
  sendEnquiryError: null,
  filterConfig: config.custom.filters,
  lineItems: null,
  fetchLineItemsError: null,
};

ListingPageComponent.propTypes = {
  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  unitType: propTypes.bookingUnitType,
  // from injectIntl
  intl: intlShape.isRequired,

  params: shape({
    id: string.isRequired,
    slug: string,
    variant: oneOf([LISTING_PAGE_DRAFT_VARIANT, LISTING_PAGE_PENDING_APPROVAL_VARIANT]),
  }).isRequired,

  isAuthenticated: bool.isRequired,
  currentUser: propTypes.currentUser,
  getListing: func.isRequired,
  getOwnListing: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  scrollingDisabled: bool.isRequired,
  enquiryModalOpenForListingId: string,
  showListingError: propTypes.error,
  callSetInitialValues: func.isRequired,
  reviews: arrayOf(propTypes.review),
  fetchReviewsError: propTypes.error,
  timeSlots: arrayOf(propTypes.timeSlot),
  fetchTimeSlotsError: propTypes.error,
  sendEnquiryInProgress: bool.isRequired,
  sendEnquiryError: propTypes.error,
  onSendEnquiry: func.isRequired,
  onInitializeCardPaymentData: func.isRequired,
  filterConfig: array,
  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,
};

const mapStateToProps = state => {
  const { isAuthenticated } = state.Auth;
  const {
    showListingError,
    reviews,
    fetchReviewsError,
    timeSlots,
    fetchTimeSlotsError,
    sendEnquiryInProgress,
    sendEnquiryError,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    enquiryModalOpenForListingId,
    currentUserInTransaction,
  } = state.ListingPage;
  const { currentUser } = state.user;
  const {
    hidingListing,
    hidingListingError,
    deletingListing,
    deletingListingError,
  } = state.ListingPage;
  const getListing = id => {
    const ref = { id, type: 'listing' };
    const listings = getMarketplaceEntities(state, [ref]);
    return listings.length === 1 ? listings[0] : null;
  };

  const getOwnListing = id => {
    const ref = { id, type: 'ownListing' };
    const listings = getMarketplaceEntities(state, [ref]);
    return listings.length === 1 ? listings[0] : null;
  };

  return {
    isAuthenticated,
    currentUser,
    getListing,
    getOwnListing,
    scrollingDisabled: isScrollingDisabled(state),
    enquiryModalOpenForListingId,
    showListingError,
    reviews,
    fetchReviewsError,
    timeSlots,
    fetchTimeSlotsError,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    sendEnquiryInProgress,
    sendEnquiryError,
    currentUserInTransaction,
    hidingListing,
    hidingListingError,
    deletingListing,
    deletingListingError,
  };
};

const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  callSetInitialValues: (setInitialValues, values, saveToSessionStorage) =>
    dispatch(setInitialValues(values, saveToSessionStorage)),
  onFetchTransactionLineItems: (bookingData, listingId, isOwnListing) =>
    dispatch(fetchTransactionLineItems(bookingData, listingId, isOwnListing)),
  onSendEnquiry: (listingId, message) => dispatch(sendEnquiry(listingId, message)),
  onInitializeCardPaymentData: () => dispatch(initializeCardPaymentData()),
  onDeleteListing: (listingId, listingType) => dispatch(deleteListing(listingId, listingType)),
  onHideListing: (listingId, listingType, hide) =>
    dispatch(hideListing(listingId, listingType, hide)),
  requestShowListing: listingId => dispatch(showListing(listingId)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const ListingPage = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(ListingPageComponent);

export default ListingPage;
