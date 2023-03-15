import React, { Component } from 'react';
import { array, arrayOf, bool, func, number, string } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY, txIsEnquired } from '../../util/transaction';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import { ensureTransaction, ensureUser, userDisplayNameAsString } from '../../util/data';
import { isMobileSafari } from '../../util/userAgent';
import { formatMoney } from '../../util/currency';
import { AvatarLarge, CreateListingModal, NamedLink, UserDisplayName, Button } from '..';
import config from '../../config';

// These are internal components that make this file more readable.
import DetailCardHeadingsMaybe from './DetailCardHeadingsMaybe';
import DetailCardImage from './DetailCardImage';
import PanelHeading, { HEADING_READY, HEADING_ENQUIRED } from './PanelHeading';

import css from './TransactionInitPanel.module.css';
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString } from '../../util/routes';

// Helper function to get display names for different roles
const displayNames = (currentUser, currentProvider, currentCustomer, intl) => {
  const authorDisplayName = <UserDisplayName user={currentProvider} intl={intl} />;
  const customerDisplayName = <UserDisplayName user={currentCustomer} intl={intl} />;

  let otherUserDisplayName = '';
  let otherUserDisplayNameString = '';
  const currentUserIsCustomer =
    currentUser.id && currentCustomer.id && currentUser.id.uuid === currentCustomer.id.uuid;
  const currentUserIsProvider =
    currentUser.id && currentProvider.id && currentUser.id.uuid === currentProvider.id.uuid;

  if (currentUserIsCustomer) {
    otherUserDisplayName = authorDisplayName;
    otherUserDisplayNameString = userDisplayNameAsString(currentProvider, '');
  } else if (currentUserIsProvider) {
    otherUserDisplayName = customerDisplayName;
    otherUserDisplayNameString = userDisplayNameAsString(currentCustomer, '');
  }

  return {
    authorDisplayName,
    customerDisplayName,
    otherUserDisplayName,
    otherUserDisplayNameString,
  };
};

export class TransactionInitPanelComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendMessageFormFocused: false,
      isReviewModalOpen: false,
      reviewSubmitted: false,
    };
    this.isMobSaf = false;
    this.sendMessageFormName = 'TransactionInitPanel.SendMessageForm';

    this.onOpenReviewModal = this.onOpenReviewModal.bind(this);
    this.onSubmitReview = this.onSubmitReview.bind(this);
    this.onSendMessageFormFocus = this.onSendMessageFormFocus.bind(this);
    this.onSendMessageFormBlur = this.onSendMessageFormBlur.bind(this);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
    this.scrollToMessage = this.scrollToMessage.bind(this);
  }

  componentDidMount() {
    this.isMobSaf = isMobileSafari();
  }

  onOpenReviewModal() {
    this.setState({ isReviewModalOpen: true });
  }

  onSubmitReview(values) {
    const { onSendReview, transaction, transactionRole } = this.props;
    const currentTransaction = ensureTransaction(transaction);
    const { reviewRating, reviewContent } = values;
    const rating = Number.parseInt(reviewRating, 10);
    onSendReview(transactionRole, currentTransaction, rating, reviewContent)
      .then(r => this.setState({ isReviewModalOpen: false, reviewSubmitted: true }))
      .catch(e => {
        // Do nothing.
      });
  }

  onSendMessageFormFocus() {
    this.setState({ sendMessageFormFocused: true });
    if (this.isMobSaf) {
      // Scroll to bottom
      window.scroll({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' });
    }
  }

  onSendMessageFormBlur() {
    this.setState({ sendMessageFormFocused: false });
  }

  onMessageSubmit(values, form) {
    const message = values.message ? values.message.trim() : null;
    const { transaction, onSendMessage } = this.props;
    const ensuredTransaction = ensureTransaction(transaction);

    if (!message) {
      return;
    }
    onSendMessage(ensuredTransaction.id, message)
      .then(messageId => {
        form.reset();
        this.scrollToMessage(messageId);
      })
      .catch(e => {
        // Ignore, Redux handles the error
      });
  }

  scrollToMessage(messageId) {
    const selector = `#msg-${messageId.uuid}`;
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }

  render() {
    const {
      rootClassName,
      history,
      pageLocation,
      className,
      currentUser,
      currentListing,
      savePaymentMethodFailed,
      sendReviewInProgress,
      sendReviewError,
      onManageDisableScrolling,
      transactionRole,
      intl,
      nextTransitions,
      paymentForm,
      showCreateListingPopup,
      setShowCreateListingPopup,
      selectListing,
      selectedListing,
      couponCodeComp,
      listingType,
      guest,
      host,
      contactingAs,
    } = this.props;

    const currentProvider = ensureUser(currentListing.author);
    const currentCustomer = ensureUser(currentUser);
    const isCustomer = transactionRole === 'customer';
    const isProvider = transactionRole === 'provider';
    const listingLoaded = !!currentListing.id;
    const listingDeleted = listingLoaded && currentListing.attributes.deleted;
    const iscustomerLoaded = !!currentCustomer.id;
    const isCustomerBanned = iscustomerLoaded && currentCustomer.attributes.banned;
    const isProviderLoaded = !!currentProvider.id;
    const isProviderBanned = isProviderLoaded && currentProvider.attributes.banned;

    const stateDataFn = tx => {
      // THIS WAS JUST FOR EXAMPLE PURPOSES
      // WE CAN USE IT FOR ERRORS THOUGH
      if (txIsEnquired(tx)) {
        const transitions = Array.isArray(nextTransitions)
          ? nextTransitions.map(transition => {
              return transition.attributes.name;
            })
          : [];
        const hasCorrectNextTransition =
          transitions.length > 0 && transitions.includes(TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY);
        return {
          headingState: HEADING_ENQUIRED,
          showBookingPanel: isCustomer && !isProviderBanned && hasCorrectNextTransition,
        };
      } else {
        return {
          headingState: HEADING_READY,
          showDetailCardHeadings: true,
        };
      }
    };
    const stateData = stateDataFn(currentListing);
    const handleRedirect = () => {
      const routes = routeConfiguration();
      history.push(
        createResourceLocatorString(
          `New${listingType === 'listing' ? 'Advert' : 'Listing'}Page`,
          routes,
          {},
          {}
        ),
        {
          fromPage: pageLocation.pathname,
          guest,
          host,
          contactingAs,
        }
      );
    };
    const deletedListingTitle = intl.formatMessage({
      id: 'TransactionInitPanel.deletedListingTitle',
    });

    const {
      authorDisplayName,
      customerDisplayName,
      otherUserDisplayName,
      otherUserDisplayNameString,
    } = displayNames(currentUser, currentProvider, currentCustomer, intl);

    const { publicData, geolocation } = currentListing.attributes;
    const location = publicData && publicData.location ? publicData.location : {};

    const listingTitle = currentListing.attributes.deleted
      ? deletedListingTitle
      : currentListing.attributes.title;
    const selectedListingTitle = selectedListing?.attributes.title;
    const selectedListingPriceRaw = selectedListing?.attributes.price;
    const selectedListingPrice = selectedListingPriceRaw
      ? `${formatMoney(intl, selectedListingPriceRaw)}`
      : '';

    const unitType = config.bookingUnitType;
    const isNightly = unitType === LINE_ITEM_NIGHT;
    const isDaily = unitType === LINE_ITEM_DAY;
    const isWeekly = true;

    const unitTranslationKey = isWeekly
      ? 'TransactionInitPanel.perWeek'
      : isNightly
      ? 'TransactionInitPanel.perNight'
      : isDaily
      ? 'TransactionInitPanel.perDay'
      : 'TransactionInitPanel.perUnit';

    const priceRaw = currentListing.attributes.price;
    const price = priceRaw ? `${formatMoney(intl, priceRaw)}` : '';

    const firstImage =
      currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

    const selectedFirstImage =
      selectedListing?.images?.length > 0 ? selectedListing.images[0] : null;

    const paymentMethodsPageLink = (
      <NamedLink name="PaymentMethodsPage">
        <FormattedMessage id="TransactionInitPanel.paymentMethodsPageLink" />
      </NamedLink>
    );
    const createAListingButton = (
      <Button className={css.createAListingButton} onClick={() => handleRedirect()}>
        <FormattedMessage
          id="TransactionInitPanel.createAListingButton"
          values={{ listingType: listingType === 'listing' ? 'advert' : 'listing' }}
        />
      </Button>
    );

    const classes = classNames(rootClassName || css.root, className);
    return (
      <div className={classes}>
        <div className={css.container}>
          <div className={css.txInfo}>
            <DetailCardImage
              rootClassName={css.imageWrapperMobile}
              avatarWrapperClassName={css.avatarWrapperMobile}
              listingTitle={listingTitle}
              image={firstImage}
              provider={currentProvider}
              isCustomer={isCustomer}
            />
            {isProvider ? (
              <div className={css.avatarWrapperProviderDesktop}>
                <AvatarLarge user={currentCustomer} className={css.avatarDesktop} />
              </div>
            ) : null}
            <div className={css.panelContentWrapper}>
              <PanelHeading
                panelHeadingState={stateData.headingState}
                transactionRole={transactionRole}
                providerName={authorDisplayName}
                customerName={customerDisplayName}
                otherUserDisplayName={otherUserDisplayName}
                isCustomerBanned={isCustomerBanned}
                listingId={currentListing.id && currentListing.id.uuid}
                listingTitle={listingTitle}
                listingDeleted={listingDeleted}
                listingType={listingType}
              />
              {savePaymentMethodFailed ? (
                <p className={css.genericError}>
                  <FormattedMessage
                    id="TransactionInitPanel.savePaymentMethodFailed"
                    values={{ paymentMethodsPageLink }}
                  />
                </p>
              ) : null}

              {createAListingButton}
              <div style={{ textAlign: 'center' }}>Or</div>
              {selectListing}
              {paymentForm}
              {/* {couponCodeComp} */}
            </div>
          </div>

          <div className={css.asideDesktop}>
            <div className={css.detailCard}>
              <DetailCardImage
                avatarWrapperClassName={css.avatarWrapperDesktop}
                listingTitle={listingTitle}
                image={firstImage}
                provider={currentProvider}
                isCustomer={isCustomer}
              />
              <DetailCardHeadingsMaybe
                showDetailCardHeadings={stateData.showDetailCardHeadings}
                listingTitle={listingTitle}
                listing={currentListing}
                price={!listingType === 'advert' && price}
                location={pageLocation}
                geolocation={geolocation}
                showPrice={!listingType === 'advert'}
              />
            </div>
            {selectedListing && (
              <div className={css.detailCard}>
                <DetailCardImage
                  avatarWrapperClassName={css.avatarWrapperDesktop}
                  listingTitle={selectedListingTitle}
                  image={selectedFirstImage}
                  provider={currentUser}
                  isCustomer={isCustomer}
                />
                <DetailCardHeadingsMaybe
                  showDetailCardHeadings={stateData.showDetailCardHeadings}
                  listingTitle={selectedListingTitle}
                  listing={currentListing}
                  price={listingType === 'advert' && selectedListingPrice}
                  location={pageLocation}
                  geolocation={geolocation}
                  showPrice={!listingType === 'advert'}
                />
              </div>
            )}
          </div>
        </div>
        <CreateListingModal
          id="CreateListingModal"
          isOpen={showCreateListingPopup}
          onCloseModal={() => setShowCreateListingPopup(false)}
          onManageDisableScrolling={onManageDisableScrolling}
          listingType={listingType}
          pageLocation={pageLocation}
          authorName={authorDisplayName}
          redirectProps={{ guest, host, contactingAs }}
        />
      </div>
    );
  }
}

TransactionInitPanelComponent.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  acceptSaleError: null,
  declineSaleError: null,
  fetchMessagesError: null,
  initialMessageFailed: false,
  savePaymentMethodFailed: false,
  sendMessageError: null,
  sendReviewError: null,
  timeSlots: null,
  fetchTimeSlotsError: null,
  nextTransitions: null,
  lineItems: null,
  fetchLineItemsError: null,
};

TransactionInitPanelComponent.propTypes = {
  rootClassName: string,
  className: string,

  currentUser: propTypes.currentUser,
  transaction: propTypes.transaction.isRequired,
  totalMessagePages: number.isRequired,
  oldestMessagePageFetched: number.isRequired,
  messages: arrayOf(propTypes.message).isRequired,
  initialMessageFailed: bool,
  savePaymentMethodFailed: bool,
  fetchMessagesInProgress: bool.isRequired,
  fetchMessagesError: propTypes.error,
  sendMessageInProgress: bool.isRequired,
  sendMessageError: propTypes.error,
  sendReviewInProgress: bool.isRequired,
  sendReviewError: propTypes.error,
  onManageDisableScrolling: func.isRequired,
  onShowMoreMessages: func.isRequired,
  onSendMessage: func.isRequired,
  onSendReview: func.isRequired,
  onSubmitBookingRequest: func.isRequired,
  timeSlots: arrayOf(propTypes.timeSlot),
  fetchTimeSlotsError: propTypes.error,
  nextTransitions: array,

  // Sale related props
  onAcceptSale: func.isRequired,
  onDeclineSale: func.isRequired,
  acceptInProgress: bool.isRequired,
  declineInProgress: bool.isRequired,
  acceptSaleError: propTypes.error,
  declineSaleError: propTypes.error,

  // line items
  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape,
};

const TransactionInitPanel = injectIntl(TransactionInitPanelComponent);

export default TransactionInitPanel;
