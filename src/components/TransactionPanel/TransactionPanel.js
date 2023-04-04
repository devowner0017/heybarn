import React, { Component } from 'react';
import { array, arrayOf, bool, func, number, string } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import routeConfiguration from '../../routeConfiguration';
import { createResourceLocatorString, findRouteByRouteName } from '../../util/routes';

import classNames from 'classnames';
import {
  TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY,
  txIsAccepted,
  txIsCanceled,
  txIsDeclined,
  txIsEnquired,
  txIsPaid,
  wasCancelled,
  wasExtended,
  txIsRenterEnquired,
  txIsHostEnquired,
  txIsPaymentExpired,
  txIsPaymentPending,
  txIsRequested,
  txHasBeenDelivered,
  txHasHostDeclined,
  txHasRenterDeclined,
  txIsRentalAgreementDiscussion,
  txIsReversedTransactionFlow,
  txIsCancelledDuringRad,
  txIsRentalAgreementSent,
  txIsCancelledAfterAgreementSent,
  txIsRentalAgreementSigned,
  TRANSITION_REQUEST_PAYMENT,
  TRANSITION_HOST_ACCEPTS_COMMUNICATION,
  TRANSITION_RENTER_ACCEPTS_COMMUNICATION,
  TRANSITION_HOST_DECLINES_COMMUNICATION,
  TRANSITION_HOST_SENDS_AGREEMENT,
  TRANSITION_RENTER_SIGNS_RENTAL_AGREEMENT,
  txIsRentalAgreementRequested,
} from '../../util/transaction';
import { createSlug } from '../../util/urlHelpers';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import {
  ensureListing,
  ensureStripeCustomer,
  ensureTransaction,
  ensureUser,
  userDisplayNameAsString,
} from '../../util/data';
import { isMobileSafari } from '../../util/userAgent';
import { formatMoney } from '../../util/currency';
import {
  AvatarLarge,
  BookingPanel,
  NamedLink,
  ReviewModal,
  UpdatePaymentMethodsPanel,
  UserDisplayName,
} from '../../components';
import { SendMessageForm } from '../../forms';
import config from '../../config';

// These are internal components that make this file more readable.
import AddressLinkMaybe from './AddressLinkMaybe';
import BreakdownMaybe from './BreakdownMaybe';
import DetailCardHeadingsMaybe from './DetailCardHeadingsMaybe';
import DetailCardImage from './DetailCardImage';
import FeedSection from './FeedSection';
import ActionButtonsMaybe from './ActionButtonsMaybe';
import PanelHeading, {
  HEADING_PAYMENT_PENDING,
  HEADING_RENTAL_AGREEMENT_REQUESTED,
  HEADING_RENT_PAID,
  HEADING_WAS_APPROVED_BY_RENTER,
  HEADING_DELIVERED,
  HEADING_RENTER_ENQUIRED,
  HEADING_HOST_ENQUIRED,
  HEADING_HOST_DECLINED_COMMUNICATION,
  HEADING_RENTER_DECLINED_COMMUNICATION,
  HEADING_RENTAL_AGREEMENT_DISCUSSION,
  HEADING_CANCELLED_DURING_RAD,
  HEADING_RENTAL_AGREEMENT_SENT,
  HEADING_CANCELLED_AFTER_AGREEENT_SENT,
  HEADING_RENT_CANCELLED,
  HEADING_RENT_EXTENDED,
  HEADING_RENTAL_AGREEMENT_FINALIZED,
  HEADING_RENT_PAYMENT_METHOD_MISSING,
} from './PanelHeading';

import { cancelDuringRad } from '../../containers/TransactionPage/TransactionPage.duck';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import RentalAgreementModal from '../RentalAgreementModal/RentalAgreementModal';
import NamedRedirect from '../NamedRedirect/NamedRedirect';
import { getPropByName } from '../../util/devHelpers';
import SubscriptionBreakdown from '../SubscriptionBreakdown/SubscriptionBreakdown';
import StripeActionsMaybe from './StripeActionsMaybe';
import css from './TransactionPanel.module.css';
import Button from '../Button/Button';

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

export class TransactionPanelComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendMessageFormFocused: false,
      isReviewModalOpen: false,
      reviewSubmitted: false,
      showConfirmationModal: false,
    };
    this.isMobSaf = false;
    this.sendMessageFormName = 'TransactionPanel.SendMessageForm';

    this.onOpenReviewModal = this.onOpenReviewModal.bind(this);
    this.onSubmitReview = this.onSubmitReview.bind(this);
    this.onSendMessageFormFocus = this.onSendMessageFormFocus.bind(this);
    this.onSendMessageFormBlur = this.onSendMessageFormBlur.bind(this);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
    this.scrollToMessage = this.scrollToMessage.bind(this);
    this.setShowConfirmationModal = this.setShowConfirmationModal.bind(this);
    this.handleOpenRentalAgreementModal = this.handleOpenRentalAgreementModal.bind(this);
  }

  componentDidMount() {
    this.isMobSaf = isMobileSafari();
  }
  setShowConfirmationModal(val) {
    this.setState({ showConfirmationModal: val });
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

  handleOpenRentalAgreementModal(val) {
    this.setState({ showRentalAgreementModal: val });
  }

  render() {
    const {
      history,
      rootClassName,
      className,
      currentUser,
      transaction,
      totalMessagePages,
      oldestMessagePageFetched,
      messages,
      initialMessageFailed,
      savePaymentMethodFailed,
      fetchMessagesInProgress,
      fetchMessagesError,
      sendMessageInProgress,
      sendMessageError,
      onManageDisableScrolling,
      onShowMoreMessages,
      transactionRole,
      intl,
      nextTransitions,
      onHostAcceptCommunication,
      onRenterAcceptsCommunication,
      onDeclineCommunication,
      acceptCommunicationInProgress,
      declineCommunicationInProgress,
      acceptCommunicationError,
      declineCommunicationError,
      onSendRentalAgreement,
      onRequestRentalAgreement,
      onCancelDuringRad,
      sendRentalAgreementInProgress,
      sendRentalAgreementError,
      cancelDuringRadInProgress,
      cancelDuringRadError,
      ensuredRelated,
      cancelAfterAgreementSentInProgress,
      cancelAfterAgreementSentError,
      onCancelAfterAgreementSent,
      onCancelStripeAgreement,
      onExtendStripeAgreement,
      onUpdateSubscriptionPaymentMethod,
      cancelSubscriptionInProgress,
      cancelSubscriptionError,
      extendSubscriptionInProgress,
      extendSubscriptionError,
      subscription,
    } = this.props;

    const subscriptionHasDefaultPaymentMethod = !!subscription?.default_payment_method;

    const currentTransaction = ensureTransaction(transaction);

    const currentListing = ensureListing(currentTransaction.listing);

    const deletedListingTitle = intl.formatMessage({
      id: 'TransactionPanel.deletedListingTitle',
    });

    const listingTitle = currentListing.attributes.deleted
      ? deletedListingTitle
      : currentListing.attributes.title;
    const firstImage =
      currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

    const currentListingSlug = createSlug(listingTitle);

    const showOtherListing = currentListing?.author?.id?.uuid === currentUser?.id?.uuid;
    const otherListing = showOtherListing ? ensuredRelated : currentListing;

    const relatedTitle = ensuredRelated.attributes.title;
    const relatedFirstImage =
      ensuredRelated.images && ensuredRelated.images.length > 0 ? ensuredRelated.images[0] : null;
    const relatedListingSlug = createSlug(relatedTitle || '');

    const otherListingTitle = showOtherListing ? relatedTitle : listingTitle;
    const otherListingImage = showOtherListing ? relatedFirstImage : firstImage;
    const otherListingSlug = showOtherListing ? relatedListingSlug : currentListingSlug;

    const currentProvider = ensureUser(currentTransaction.provider);
    const currentCustomer = ensureUser(currentTransaction.customer);
    const isCustomer = transactionRole === 'customer';
    const isProvider = transactionRole === 'provider';

    const listingLoaded = !!currentListing.id;
    const listingDeleted = listingLoaded && currentListing.attributes.deleted;
    const iscustomerLoaded = !!currentCustomer.id;
    const isCustomerBanned = iscustomerLoaded && currentCustomer.attributes.banned;
    const isCustomerDeleted = iscustomerLoaded && currentCustomer.attributes.deleted;
    const isProviderLoaded = !!currentProvider.id;
    const isProviderBanned = isProviderLoaded && currentProvider.attributes.banned;
    const isProviderDeleted = isProviderLoaded && currentProvider.attributes.deleted;

    const stateDataFn = tx => {
      const relatedTxId = getPropByName(tx, 'relatedTxId');

      if (txIsRenterEnquired(tx)) {
        const transitions = Array.isArray(nextTransitions)
          ? nextTransitions.map(transition => {
              return transition.attributes.name;
            })
          : [];
        const hasCorrectNextTransition =
          transitions.length > 0 && transitions.includes(TRANSITION_HOST_ACCEPTS_COMMUNICATION);
        return {
          headingState: HEADING_RENTER_ENQUIRED,
          showDetailCardHeadings: true,
          showAcceptCommunicationButtons:
            isProvider && !isCustomerBanned && hasCorrectNextTransition,
          showRelatedLink: otherListing?.id?.uuid,
          stripeIdRequired: !isCustomer,
          allowMessages: true,
          confirmationModalProps: {
            negativeAction: () =>
              onDeclineCommunication({
                txId: tx.id,
                isRenterEnquired: true,
              }),
            affirmativeButtonText: 'Cancel',
            negativeButtonText: 'Decline This Transaction',
            affirmativeInProgress: acceptCommunicationInProgress,
            negativeInProgress: declineCommunicationInProgress,
            affirmativeError: acceptCommunicationError,
            negativeError: declineCommunicationError,
            titleText: <FormattedMessage id="TransactionPanel.declineConfirmationTitle" />,
            contentText: <FormattedMessage id="TransactionPanel.declineConfirmationSubTitle" />,
          },
        };
      }
      // ****
      else if (txIsHostEnquired(tx)) {
        const transitions = Array.isArray(nextTransitions)
          ? nextTransitions.map(transition => {
              return transition.attributes.name;
            })
          : [];
        const hasCorrectNextTransition =
          transitions.length > 0 && transitions.includes(TRANSITION_RENTER_ACCEPTS_COMMUNICATION);
        return {
          headingState: HEADING_HOST_ENQUIRED,
          showDetailCardHeadings: true,
          showAcceptCommunicationButtons:
            isProvider && !isCustomerBanned && hasCorrectNextTransition,
          showRelatedLink: otherListing?.id?.uuid,
          allowMessages: true,
          confirmationModalProps: {
            negativeAction: () =>
              onDeclineCommunication({
                txId: tx.id,
                isRenterEnquired: false,
              }),
            affirmativeButtonText: 'Cancel',
            negativeButtonText: 'Decline This Transaction',
            affirmativeInProgress: acceptCommunicationInProgress,
            negativeInProgress: declineCommunicationInProgress,
            affirmativeError: acceptCommunicationError,
            negativeError: declineCommunicationError,
            titleText: <FormattedMessage id="TransactionPanel.declineConfirmationTitle" />,
            contentText: <FormattedMessage id="TransactionPanel.declineConfirmationSubTitle" />,
          },
        };
      }
      // ****
      else if (txHasHostDeclined(tx)) {
        return {
          headingState: HEADING_HOST_DECLINED_COMMUNICATION,
          relatedTxId,
          showDetailCardHeadings: true,
        };
      }
      // ****
      else if (txHasRenterDeclined(tx)) {
        return {
          headingState: HEADING_RENTER_DECLINED_COMMUNICATION,
          relatedTxId,
          showDetailCardHeadings: true,
        };
      }
      // ****
      else if (txIsRentalAgreementDiscussion(tx)) {
        return {
          headingState: HEADING_RENTAL_AGREEMENT_DISCUSSION,
          relatedTxId,
          showDetailCardHeadings: true,
          showRentalAgreementButtons: true,
          stripeIdRequired: !isCustomer,
          showRelatedLink: otherListing?.id?.uuid,
          allowMessages: true,
          confirmationModalProps: {
            negativeAction: () =>
              onCancelDuringRad({
                txId: tx.id,
                actor: isCustomer ? 'customer' : 'provider',
              }),
            affirmativeButtonText: 'Do Not Cancel',
            negativeButtonText: 'Cancel This Transaction',
            affirmativeInProgress: sendRentalAgreementInProgress,
            negativeInProgress: cancelDuringRadInProgress,
            affirmativeError: sendRentalAgreementError,
            negativeError: cancelDuringRadError,
            titleText: <FormattedMessage id="TransactionPanel.cancelConfirmationTitle" />,
            contentText: <FormattedMessage id="TransactionPanel.cancelConfirmationSubTitle" />,
          },
          rentalAgreementModalProps: {
            listing: currentListing,
            affirmativeAction: values => {
              const {
                startDate,
                endDate,
                ongoingContract: [ongoingContract] = [],
                price,
                ...rest
              } = values;
              onSendRentalAgreement({
                contractLines: {
                  ongoingContract,
                  price: price.amount,
                  ...rest,
                },
                bookingDates: { startDate, endDate },
                txId: currentTransaction.id,
                listingId: currentListing.id,
              });
              this.handleOpenRentalAgreementModal(false);
            },
            negativeAction: () =>
              onCancelDuringRad({
                txId: tx.id,
                actor: isCustomer ? 'customer' : 'provider',
              }),
            affirmativeButtonText: 'Send it!',
            negativeButtonText: 'Maybe later',
            affirmativeInProgress: sendRentalAgreementInProgress,
            negativeInProgress: cancelDuringRadInProgress,
            affirmativeError: sendRentalAgreementError,
            negativeError: cancelDuringRadError,
            titleText: <FormattedMessage id="RentalAgreementModal.rentalAgreementModalTitle" />,
            contentText: (
              <FormattedMessage id="RentalAgreementModal.rentalAgreementModalSubTitle" />
            ),
          },
        };
      }
      //*** */
      else if (txIsRentalAgreementRequested(tx)) {
        return {
          headingState: HEADING_RENTAL_AGREEMENT_REQUESTED,
          relatedTxId,
          showDetailCardHeadings: true,
          showRentalAgreementButtons: true,
          allowMessages: true,
          hideAffirmative: isCustomer,
          showRelatedLink: showOtherListing && otherListing?.id?.uuid,
          wasRequested: true,
          confirmationModalProps: {
            negativeAction: () =>
              onCancelDuringRad({
                txId: tx.id,
                actor: isCustomer ? 'customer' : 'provider',
                wasRequested: true,
              }),
            affirmativeButtonText: 'Cancel',
            negativeButtonText: 'Cancel This Transaction',
            affirmativeInProgress: sendRentalAgreementInProgress,
            negativeInProgress: cancelDuringRadInProgress,
            affirmativeError: sendRentalAgreementError,
            negativeError: cancelDuringRadError,
            titleText: <FormattedMessage id="TransactionPanel.cancelConfirmationTitle" />,
            contentText: <FormattedMessage id="TransactionPanel.cancelConfirmationSubTitle" />,
          },
          rentalAgreementModalProps: {
            listing: currentListing,
            affirmativeAction: values => {
              const {
                startDate,
                endDate,
                ongoingContract: [ongoingContract] = [],
                price,
                ...rest
              } = values;
              onSendRentalAgreement({
                contractLines: {
                  ongoingContract,
                  price: price.amount,
                  ...rest,
                },
                bookingDates: { startDate, endDate },
                txId: currentTransaction.id,
                listingId: currentListing.id,
                wasRequested: true,
              });
              this.handleOpenRentalAgreementModal(false);
            },
            negativeAction: () =>
              onCancelDuringRad({
                txId: tx.id,
                actor: isCustomer ? 'customer' : 'provider',
                wasRequested: true,
              }),
            affirmativeButtonText: 'Send it!',
            negativeButtonText: 'Maybe later',
            affirmativeInProgress: sendRentalAgreementInProgress,
            negativeInProgress: cancelDuringRadInProgress,
            affirmativeError: sendRentalAgreementError,
            negativeError: cancelDuringRadError,
            titleText: <FormattedMessage id="RentalAgreementModal.rentalAgreementModalTitle" />,
            contentText: (
              <FormattedMessage id="RentalAgreementModal.rentalAgreementModalSubTitle" />
            ),
          },
        };
      }
      // ****
      else if (txIsReversedTransactionFlow(tx)) {
        const relatedTxId = getPropByName(tx, 'relatedTxId');
        const routes = routeConfiguration();
        history.replace(
          createResourceLocatorString(
            `${isCustomer ? 'Sale' : 'Order'}DetailsPage`,
            routes,
            { id: relatedTxId },
            {}
          )
        );
      }
      // ****
      else if (txIsCancelledDuringRad(tx)) {
        return {
          showDetailCardHeadings: true,
          headingState: HEADING_CANCELLED_DURING_RAD,
        };
      }
      // ****
      else if (txIsRentalAgreementSent(tx)) {
        return {
          headingState: HEADING_RENTAL_AGREEMENT_SENT,
          showDetailCardHeadings: true,
          showBreakdowns: isCustomer,
          showRelatedLink: showOtherListing && otherListing?.id?.uuid,
          allowMessages: true,
          confirmationModalProps: {
            negativeAction: () =>
              onCancelAfterAgreementSent({
                txId: tx.id,
                actor: isCustomer ? 'customer' : 'provider',
              }),
            affirmativeButtonText: 'Cancel',
            negativeButtonText: 'Cancel This Transaction',
            affirmativeInProgress: sendRentalAgreementInProgress,
            negativeInProgress: cancelAfterAgreementSentInProgress,
            affirmativeError: sendRentalAgreementError,
            negativeError: cancelAfterAgreementSentError,
            titleText: <FormattedMessage id="TransactionPanel.cancelConfirmationTitle" />,
            contentText: <FormattedMessage id="TransactionPanel.cancelConfirmationSubTitle" />,
          },
        };
      }
      // ****
      else if (txIsCancelledAfterAgreementSent(tx)) {
        return {
          headingState: HEADING_CANCELLED_AFTER_AGREEENT_SENT,
        };
      }
      // ****
      else if (txIsRentalAgreementSigned(tx)) {
        const transitions = Array.isArray(nextTransitions)
          ? nextTransitions.map(transition => {
              return transition.attributes.name;
            })
          : [];
        return {
          headingState: HEADING_RENTAL_AGREEMENT_FINALIZED,
          showBreakdowns: true,
          showRelatedLink: showOtherListing && otherListing?.id?.uuid,
          showPaymentFormButtons: isCustomer && !isProviderBanned,
          allowMessages: true,
        };
      } else if (txIsPaid(tx) && !wasCancelled(tx) && !subscriptionHasDefaultPaymentMethod) {
        return {
          headingState: HEADING_RENT_PAYMENT_METHOD_MISSING,
          showDetailCardHeadings: isCustomer,
          showAddress: isCustomer,
          allowMessages: true,
          showSubscriptionDetails: true,
          showSubscriptionStats: true,
          showSubscriptionActions: !isCustomer,
          showUpdatePaymentMethodsPanel: true,
        };
      } else if (txIsPaid(tx) && wasCancelled(tx)) {
        return {
          headingState: HEADING_RENT_CANCELLED,
          showDetailCardHeadings: isCustomer,
          showAddress: isCustomer,
          allowMessages: true,
          showSubscriptionDetails: true,
          showSubscriptionStats: true,
          showSubscriptionActions: false,
        };
      } else if (txIsPaid(tx) && wasExtended(tx)) {
        return {
          headingState: HEADING_RENT_EXTENDED,
          showDetailCardHeadings: isCustomer,
          showAddress: isCustomer,
          allowMessages: true,
          stripeActionProps: {
            cancelAgreement: () =>
              onCancelStripeAgreement({
                txId: tx.id,
                actor: isCustomer ? 'customer' : 'provider',
                subscription,
              }),
            cancelSubscriptionInProgress,
            cancelSubscriptionError,
            extendSubscriptionInProgress,
            extendSubscriptionError,
          },
          showSubscriptionDetails: true,
          showSubscriptionStats: true,
          showSubscriptionActions: !isCustomer,
        };
      } else if (txIsPaid(tx)) {
        return {
          headingState: HEADING_RENT_PAID,
          showDetailCardHeadings: isCustomer,
          showAddress: isCustomer,
          allowMessages: true,
          stripeActionProps: {
            cancelAgreement: () =>
              onCancelStripeAgreement({
                txId: tx.id,
                actor: isCustomer ? 'customer' : 'provider',
                subscription,
              }),
            extendAgreement: () => {
              return onExtendStripeAgreement({
                txId: tx.id,
                actor: isCustomer ? 'customer' : 'provider',
                subscription,
              });
            },
            cancelSubscriptionInProgress,
            cancelSubscriptionError,
            extendSubscriptionInProgress,
            extendSubscriptionError,
          },
          showSubscriptionDetails: true,
          showSubscriptionStats: true,
          showSubscriptionActions: !isCustomer,
        };
      }
      // ****
      else if (txHasBeenDelivered(tx)) {
        return {
          headingState: HEADING_DELIVERED,
          showDetailCardHeadings: isCustomer,
          showAddress: isCustomer,
          showBreakdowns: true,
          allowMessages: true,
        };
      } else if (txIsPaymentPending(tx)) {
        return {
          headingState: HEADING_PAYMENT_PENDING,
          showDetailCardHeadings: isCustomer,
          showBreakdowns: true,
          allowMessages: true,
        };
      } else {
        return {
          headingState: 'unknown',
        };
      }
    };
    const stateData = stateDataFn(currentTransaction) || {};

    const relatedLink = (
        <NamedLink
          className={css.viewButton}
          name={'ListingPage'}
          params={{
            id: otherListing?.id?.uuid,
            slug: otherListingSlug,
          }}
          to={{ state: { fromPage: this.props.location.pathname } }}
        >
          Check them out!
        </NamedLink>
      ),
      handlePaymentRedirect = values => {
        const {
          history,
          params,
          listing,
          callSetInitialValues,
          onInitializeCardPaymentData,
          currentUser,
          transaction,
        } = this.props;
        const typeOfLIsting = listing?.attributes?.publicData.listingType;
        const contactingAs = typeOfLIsting === 'listing' ? 'renter' : 'host';
        const { booking } = transaction;
        const initialValues = {
          contactingAs,
          host: ensuredRelated.author,
          guest: currentUser,
          listing: currentListing,
          relatedListing: ensuredRelated,
          transaction,
          confirmPaymentError: null,
          bookingDates: {
            bookingStart: booking?.attributes?.start,
            bookingEnd: booking?.attributes?.end,
          },
        };

        const saveToSessionStorage = true;
        const routes = routeConfiguration();
        // Customize checkout page state with current listing and selected bookingDates
        const { setInitialValues } = findRouteByRouteName(`CheckoutPage`, routes);

        callSetInitialValues(setInitialValues, initialValues, saveToSessionStorage);

        // Clear previous Stripe errors from store if there is any
        onInitializeCardPaymentData();

        // Redirect to CheckoutPage
        history.push(
          createResourceLocatorString(`CheckoutPage`, routes, { id: transaction.id.uuid }, {})
        );
      };

    const {
      authorDisplayName,
      customerDisplayName,
      otherUserDisplayName,
      otherUserDisplayNameString,
    } = displayNames(currentUser, currentProvider, currentCustomer, intl);

    const { publicData, geolocation } = currentListing.attributes;
    const location = publicData && publicData.location ? publicData.location : {};
    const listingType = publicData && publicData.listingType;

    const unitType = config.bookingUnitType;
    const isNightly = unitType === LINE_ITEM_NIGHT;
    const isDaily = unitType === LINE_ITEM_DAY;
    const isWeekly = true;

    const unitTranslationKey = isWeekly
      ? 'TransactionInitPanel.perWeek'
      : isNightly
      ? 'TransactionPanel.perNight'
      : isDaily
      ? 'TransactionPanel.perDay'
      : 'TransactionPanel.perUnit';

    const price = currentListing.attributes.price;
    const bookingSubTitle =
      listingType === 'listing' && price
        ? `${formatMoney(intl, price)} ${intl.formatMessage({ id: unitTranslationKey })}`
        : '';

    const relatedPrice = ensuredRelated.attributes.price;
    const relatedBookingSubTitle =
      listingType === 'advert' && relatedPrice
        ? `${formatMoney(intl, relatedPrice)} ${intl.formatMessage({ id: unitTranslationKey })}`
        : '';

    const acceptCommunicationButtons = (
      <ActionButtonsMaybe
        showButtons={stateData.showAcceptCommunicationButtons}
        affirmativeInProgress={acceptCommunicationInProgress}
        negativeInProgress={declineCommunicationInProgress}
        affirmativeError={acceptCommunicationError}
        negativeError={declineCommunicationError}
        affirmativeAction={() => {
          const isRenterEnquired = stateData.headingState === 'renter_enquired';
          if (isRenterEnquired) {
            onHostAcceptCommunication({
              txId: currentTransaction.id,
            });
          } else {
            onRenterAcceptsCommunication({
              // This is the *HOSTS LISTING ID* to create a new transaction
              listingId: ensuredRelated.id,
              // This transaction id, to attach to the new transaction
              relatedTxId: currentTransaction.id,
              // The ADVERT ID to attach to the new transaction
              relatedListingId: currentListing.id,
              relatedListingTitle: currentListing.attributes.title,
            });
          }
        }}
        negativeAction={() => {
          this.setShowConfirmationModal(true);
        }}
        affirmativeText={'Accept'}
        negativeText={'Decline'}
      />
    );
    const ensuredStripeCustomer = ensureStripeCustomer(currentUser.stripeAccount);
    const missingStripeId =
      stateData.stripeIdRequired && !ensuredStripeCustomer?.attributes?.stripeAccountId;
    const rentalAgreementButtons = (
      <ActionButtonsMaybe
        showButtons={stateData.showRentalAgreementButtons}
        affirmativeInProgress={sendRentalAgreementInProgress}
        negativeInProgress={cancelDuringRadInProgress}
        affirmativeError={sendRentalAgreementError}
        negativeError={cancelDuringRadError}
        affirmativeDisabled={missingStripeId}
        affirmativeAction={() => {
          if (isCustomer) {
            onRequestRentalAgreement({
              txId: currentTransaction.id,
              listingId: currentListing.id,
              wasRequested: stateData.wasRequested,
            });
          } else {
            this.handleOpenRentalAgreementModal(true);
          }
        }}
        negativeAction={() => this.setShowConfirmationModal(true)}
        affirmativeText={`${isCustomer ? 'Request' : 'Create'} Rental Agreement`}
        negativeText={'Cancel Transaction'}
        // hideAffirmative={stateData.hideAffirmative}
        hideAffirmative
      />
    );

    const stripeActionButtons = (
      <StripeActionsMaybe
        onManageDisableScrolling={onManageDisableScrolling}
        showButtons={stateData.showSubscriptionActions}
        title={'Rental Actions'}
        {...stateData.stripeActionProps}
      />
    );
    const paymentFormButtons = (
      <ActionButtonsMaybe
        showButtons={stateData.showPaymentFormButtons}
        affirmativeAction={handlePaymentRedirect}
        negativeAction={() => null}
        affirmativeText={'Pay Rent!'}
        hideNegative={true}
      />
    );
    const showSendMessageForm =
      !isCustomerBanned &&
      !isCustomerDeleted &&
      !isProviderBanned &&
      !isProviderDeleted &&
      stateData.allowMessages;

    const sendMessagePlaceholder = intl.formatMessage(
      { id: 'TransactionPanel.sendMessagePlaceholder' },
      { name: otherUserDisplayNameString }
    );

    const paymentMethodsPageLink = (
      <NamedLink name="PaymentMethodsPage">
        <FormattedMessage id="TransactionPanel.paymentMethodsPageLink" />
      </NamedLink>
    );

    const classes = classNames(rootClassName || css.root, className);
    const subscriptionBreakdown = (
      <SubscriptionBreakdown
        transaction={currentTransaction}
        subscription={subscription}
        transactionRole={transactionRole}
      />
    );
    return (
      <div className={classes}>
        <div className={css.container}>
          <div className={css.txInfo}>
            <DetailCardImage
              rootClassName={css.imageWrapperMobile}
              avatarWrapperClassName={css.avatarWrapperMobile}
              listingTitle={otherListingTitle}
              image={otherListingImage}
              provider={currentProvider}
              isCustomer={isCustomer}
            />
            <PanelHeading
              panelHeadingState={stateData.headingState}
              relatedTxId={stateData.relatedTxId}
              transactionRole={transactionRole}
              providerName={authorDisplayName}
              customerName={customerDisplayName}
              isCustomerBanned={isCustomerBanned}
              listingId={currentListing.id && currentListing.id.uuid}
              listingTitle={listingTitle}
              listingDeleted={listingDeleted}
              listingType={listingType}
              showRelatedLink={stateData.showRelatedLink}
              relatedLink={relatedLink}
            />
            <div className={css.bookingDetailsMobile}>
              <AddressLinkMaybe
                rootClassName={css.addressMobile}
                location={location}
                geolocation={geolocation}
                showAddress={stateData.showAddress}
              />
              {stateData.showBreakdowns && (
                <BreakdownMaybe
                  transaction={currentTransaction}
                  transactionRole={transactionRole}
                />
              )}{' '}
              {stateData.showSubscriptionStats && subscriptionBreakdown}
            </div>
            {savePaymentMethodFailed ? (
              <p className={css.genericError}>
                <FormattedMessage
                  id="TransactionPanel.savePaymentMethodFailed"
                  values={{ paymentMethodsPageLink }}
                />
              </p>
            ) : null}
            {stateData.showUpdatePaymentMethodsPanel && (
              <UpdatePaymentMethodsPanel
                currentUser={currentUser}
                onUpdateSubscriptionPaymentMethod={onUpdateSubscriptionPaymentMethod}
                subscription={subscription}
                transaction={ensureTransaction(transaction)}
              />
            )}
            {showSendMessageForm ? (
              <>
                <FeedSection
                  rootClassName={css.feedContainer}
                  currentTransaction={currentTransaction}
                  currentUser={currentUser}
                  fetchMessagesError={fetchMessagesError}
                  fetchMessagesInProgress={fetchMessagesInProgress}
                  initialMessageFailed={initialMessageFailed}
                  messages={messages}
                  oldestMessagePageFetched={oldestMessagePageFetched}
                  onOpenReviewModal={this.onOpenReviewModal}
                  onShowMoreMessages={() => onShowMoreMessages(currentTransaction.id)}
                  totalMessagePages={totalMessagePages}
                />
                <SendMessageForm
                  formId={this.sendMessageFormName}
                  rootClassName={css.sendMessageForm}
                  messagePlaceholder={sendMessagePlaceholder}
                  inProgress={sendMessageInProgress}
                  sendMessageError={sendMessageError}
                  onFocus={this.onSendMessageFormFocus}
                  onBlur={this.onSendMessageFormBlur}
                  onSubmit={this.onMessageSubmit}
                />
              </>
            ) : null}
            {stateData.showAcceptCommunicationButtons ? (
              <div className={css.mobileActionButtons}>
                {acceptCommunicationButtons}
                {missingStripeId && (
                  <div className={css.finishStripeText}>
                    You need to <NamedLink name={'StripePayoutPage'}>finish verifying</NamedLink>{' '}
                    your stripe account before you can create a rental agreement.
                  </div>
                )}
              </div>
            ) : null}
            {stateData.showRentalAgreementButtons ? (
              <div className={css.mobileActionButtons}>
                {rentalAgreementButtons}
                {missingStripeId && (
                  <div className={css.finishStripeText}>
                    You need to <NamedLink name={'StripePayoutPage'}>finish verifying</NamedLink>f
                    your stripe account before you can create a rental agreement.
                  </div>
                )}
              </div>
            ) : null}
            {stateData.showPaymentFormButtons ? (
              <div className={css.mobileActionButtons}>{paymentFormButtons}</div>
            ) : null}
            {stateData.showSubscriptionActions ? (
              <div className={css.mobileActionButtons}>{stripeActionButtons}</div>
            ) : null}
          </div>

          <div className={css.asideDesktop}>
            <div className={css.detailCard}>
              <DetailCardImage
                avatarWrapperClassName={css.avatarWrapperDesktop}
                listingTitle={showOtherListing ? otherListingTitle : listingTitle}
                image={showOtherListing ? otherListingImage : firstImage}
                provider={currentProvider}
                isCustomer={isCustomer}
              />
              {!!(showOtherListing ? otherListing?.id?.uuid : currentListing?.id?.uuid) && (
                <NamedLink
                  name={currentListing?.id?.uuid ? 'ListingPage' : 'LandingPage'}
                  params={{
                    id: showOtherListing ? otherListing?.id?.uuid : currentListing?.id?.uuid,
                    slug: showOtherListing ? otherListingSlug : currentListingSlug,
                  }}
                >
                  <DetailCardHeadingsMaybe
                    showDetailCardHeadings={stateData.showDetailCardHeadings}
                    listingTitle={showOtherListing ? otherListingTitle : listingTitle}
                    subTitle={showOtherListing ? null : bookingSubTitle}
                    location={location}
                    geolocation={geolocation}
                    showAddress={stateData.showAddress}
                  />
                </NamedLink>
              )}

              {stateData.showBreakdowns && (
                <BreakdownMaybe
                  className={css.breakdownContainer}
                  transaction={currentTransaction}
                  transactionRole={transactionRole}
                />
              )}
              {stateData.showSubscriptionStats && (
                <div className={css.desktopSubscriptionBreakdown}>{subscriptionBreakdown}</div>
              )}
              {stateData.showAcceptCommunicationButtons ? (
                <div className={css.desktopActionButtons}>
                  {acceptCommunicationButtons}
                  {missingStripeId && (
                    <div className={css.finishStripeText}>
                      You need to <NamedLink name={'StripePayoutPage'}>finish verifying</NamedLink>{' '}
                      your stripe account before you can create a rental agreement.
                    </div>
                  )}
                </div>
              ) : null}
              {stateData.showRentalAgreementButtons ? (
                <div className={css.desktopActionButtons}>
                  {rentalAgreementButtons}
                  {missingStripeId && (
                    <div className={css.finishStripeText}>
                      You need to <NamedLink name={'StripePayoutPage'}>finish verifying</NamedLink>{' '}
                      your stripe account before you can create a rental agreement.
                    </div>
                  )}
                </div>
              ) : null}
              {stateData.showPaymentFormButtons ? (
                <div className={css.desktopActionButtons}>{paymentFormButtons}</div>
              ) : null}
              {stateData.showSubscriptionActions ? (
                <div className={css.desktopActionButtons}>{stripeActionButtons}</div>
              ) : null}
            </div>
            {ensuredRelated && (
              <div className={css.detailCard}>
                <DetailCardImage
                  avatarWrapperClassName={css.avatarWrapperDesktop}
                  listingTitle={showOtherListing ? listingTitle : relatedTitle}
                  image={showOtherListing ? firstImage : relatedFirstImage}
                  provider={currentCustomer}
                  isCustomer={isCustomer}
                />
                <NamedLink
                  name={ensuredRelated?.id?.uuid ? 'ListingPage' : 'LandingPage'}
                  params={{
                    id: showOtherListing ? currentListing.id.uuid : ensuredRelated?.id?.uuid,
                    slug: showOtherListing ? currentListingSlug : relatedListingSlug,
                  }}
                >
                  <DetailCardHeadingsMaybe
                    showDetailCardHeadings={stateData.showDetailCardHeadings}
                    listingTitle={showOtherListing ? listingTitle : relatedTitle}
                    subTitle={showOtherListing ? null : relatedBookingSubTitle}
                  />
                </NamedLink>
              </div>
            )}
          </div>
        </div>
        {/* <ReviewModal
          id="ReviewOrderModal"
          isOpen={this.state.isReviewModalOpen}
          onCloseModal={() => this.setState({ isReviewModalOpen: false })}
          onManageDisableScrolling={onManageDisableScrolling}
          onSubmitReview={this.onSubmitReview}
          revieweeName={otherUserDisplayName}
          reviewSent={this.state.reviewSubmitted}
          sendReviewInProgress={sendReviewInProgress}
          sendReviewError={sendReviewError}
        /> */}
        <ConfirmationModal
          id="ConfirmationModal"
          isOpen={this.state.showConfirmationModal}
          onCloseModal={() => this.setShowConfirmationModal(false)}
          onManageDisableScrolling={onManageDisableScrolling}
          {...stateData.confirmationModalProps}
        />
        <RentalAgreementModal
          id="RentalAgreementModal"
          isOpen={this.state.showRentalAgreementModal}
          onCloseModal={() => this.handleOpenRentalAgreementModal(false)}
          onManageDisableScrolling={onManageDisableScrolling}
          {...stateData.rentalAgreementModalProps}
        />
      </div>
    );
  }
}

TransactionPanelComponent.defaultProps = {
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

TransactionPanelComponent.propTypes = {
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

  // line items
  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape,
};

const TransactionPanel = injectIntl(TransactionPanelComponent);

export default TransactionPanel;
