import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { createSlug, stringify } from '../../util/urlHelpers';
import { NamedLink, Button, ExternalLink } from '../../components';

import css from './TransactionPanel.module.css';
const lineBreak = (
  <>
    <br />
    <br />
  </>
);
export const HEADING_HOST_ENQUIRED = 'host_enquired';
export const HEADING_RENTER_ENQUIRED = 'renter_enquired';
export const HEADING_HOST_DECLINED_COMMUNICATION = 'host_declined_communication';
export const HEADING_WAS_APPROVED_BY_RENTER = 'was_approved_by_renter';
export const HEADING_RENTAL_AGREEMENT_DISCUSSION = 'rental_agreement_discussion';
export const HEADING_RENTAL_AGREEMENT_REQUESTED = 'rental_agreement_requested';
export const HEADING_REVERSED_TRANSACTION_FLOW = 'reversed_transaction_flow';
export const HEADING_RENTER_DECLINED_COMMUNICATION = 'renter_declined_communication';
export const HEADING_CANCELLED_DURING_RAD = 'cancelled_during_rad';
export const HEADING_RENTAL_AGREEMENT_SENT = 'rental_agreement_sent';
export const HEADING_CANCELLED_AFTER_AGREEENT_SENT = 'cancelled_after_agreement_sent';
export const HEADING_RENTAL_AGREEMENT_FINALIZED = 'rental_agreement_finalized';
export const HEADING_PENDING_PAYMENT = 'pending_payment';

// old

export const HEADING_ENQUIRED = 'enquired';
export const HEADING_PAYMENT_PENDING = 'pending-payment';
export const HEADING_PAYMENT_EXPIRED = 'payment-expired';
export const HEADING_REQUESTED = 'requested';
export const HEADING_ACCEPTED = 'accepted';
export const HEADING_DECLINED = 'declined';
export const HEADING_CANCELED = 'canceled';
export const HEADING_DELIVERED = 'delivered';
export const HEADING_RENT_PAID = 'rentPaid';
export const HEADING_RENT_CANCELLED = 'rentCancelled';
export const HEADING_RENT_EXTENDED = 'rentExtended';
export const HEADING_RENT_PAYMENT_METHOD_MISSING = 'rentPaymentMethodMissing';

const createListingLink = (listingId, label, listingDeleted, searchParams = {}, className = '') => {
  if (!listingDeleted) {
    const params = { id: listingId, slug: createSlug(label) };
    const to = { search: stringify(searchParams) };
    return (
      <NamedLink className={className} name="ListingPage" params={params} to={to}>
        {label}
      </NamedLink>
    );
  } else {
    return <FormattedMessage id="TransactionPanel.deletedListingOrderTitle" />;
  }
};

const ListingDeletedInfoMaybe = props => {
  return props.listingDeleted ? (
    <p className={css.transactionInfoMessage}>
      <FormattedMessage id="TransactionPanel.messageDeletedListing" />
    </p>
  ) : null;
};

const HeadingCustomer = props => {
  const { className, id, values, listingDeleted } = props;
  return (
    <React.Fragment>
      <h1 className={className}>
        <span className={css.mainTitle}>
          <FormattedMessage id={id} values={values} />
        </span>
      </h1>
      <ListingDeletedInfoMaybe listingDeleted={listingDeleted} />
    </React.Fragment>
  );
};

const HeadingWithSubtitle = props => {
  const {
    className,
    id,
    values,
    subtitleId,
    subtitleValues,
    children,
    isProvider,
    listingDeleted,
    isCustomerBanned,
  } = props;
  return (
    <React.Fragment>
      <h1 className={className}>
        <span className={css.mainTitle}>
          <FormattedMessage id={id} values={values} />
        </span>
        {subtitleId && <FormattedMessage id={subtitleId} values={subtitleValues} />}
      </h1>
      {children}
      {isProvider ? (
        <CustomerBannedInfoMaybe isCustomerBanned={isCustomerBanned} />
      ) : (
        <ListingDeletedInfoMaybe listingDeleted={listingDeleted} />
      )}
    </React.Fragment>
  );
};

const CustomerBannedInfoMaybe = props => {
  return props.isCustomerBanned ? (
    <p className={css.transactionInfoMessage}>
      <FormattedMessage id="TransactionPanel.customerBannedStatus" />
    </p>
  ) : null;
};

const HeadingProvider = props => {
  const { className, id, values, isCustomerBanned, children, isProvider } = props;
  return (
    <React.Fragment>
      <h1 className={className}>
        <span className={css.mainTitle}>
          <FormattedMessage id={id} values={values} />
        </span>
      </h1>
      {children}
      <CustomerBannedInfoMaybe isCustomerBanned={isCustomerBanned} />
    </React.Fragment>
  );
};

// Functional component as a helper to choose and show Order or Sale heading info:
// title, subtitle, and message
const PanelHeading = props => {
  const {
    className,
    rootClassName,
    panelHeadingState,
    customerName,
    providerName,
    listingId,
    listingTitle,
    listingDeleted,
    isCustomerBanned,
    otherUserDisplayName,
    listingType,
    relatedTxId,
    showRelatedLink,
    relatedLink,
  } = props;

  const isCustomer = props.transactionRole === 'customer';

  const defaultRootClassName = css.heading;
  const titleClasses = classNames(rootClassName || defaultRootClassName, className);
  const listingLink = createListingLink(listingId, listingTitle, listingDeleted);
  const browseLink = (
    <NamedLink
      className={css.buttonLink}
      name={'SearchPage'}
      to={{
        search: `?pub_listingType=${
          listingType === 'listing' && isCustomer ? 'listing' : 'advert'
        }`,
      }}
    >
      <Button className={css.roundButton}>Browse</Button>
    </NamedLink>
  );
  const accountSettingsLink = (
    <NamedLink className={css.buttonLink} name={'AccountSettingsPage'}>
      <Button className={css.roundButton}>Account Settings</Button>
    </NamedLink>
  );
  const messageValues = {
    otherName: otherUserDisplayName,
    providerName,
    listingLink,
    listingTitle,
    customerName,
    listingLink,
    listingType,
    lineBreak,
    browseLink,
    accountSettingsLink,
    faqLink: <NamedLink name={'FAQPage'}>FAQs</NamedLink>,
    templateLink: (...chuncks) => (
      <ExternalLink href="/Rental_agreement_template.pdf">{chuncks}</ExternalLink>
    ),
  };
  switch (panelHeadingState) {
    case HEADING_HOST_ENQUIRED:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_hostEnquiredTitle`}
          values={messageValues}
          listingDeleted={listingDeleted}
          isProvider={!isCustomer}
          isCustomerBanned={isCustomerBanned}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_hostEnquiredSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
          {showRelatedLink && relatedLink}
        </HeadingWithSubtitle>
      );
    case HEADING_RENTER_ENQUIRED:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
          {showRelatedLink && relatedLink}
        </HeadingWithSubtitle>
      );

    case HEADING_HOST_DECLINED_COMMUNICATION:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_hostDeclinedTitle${
            !!relatedTxId ? '_rev' : ''
          }`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_hostDeclinedSubTitle${
                  !!relatedTxId ? '_rev' : ''
                }`}
                values={messageValues}
              />
            </p>
          ) : null}
          {showRelatedLink && relatedLink}
        </HeadingWithSubtitle>
      );
    case HEADING_RENTER_DECLINED_COMMUNICATION:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterDeclinedTitle${
            !!relatedTxId ? '_rev' : ''
          }`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterDeclinedSubTitle${
                  !!relatedTxId ? '_rev' : ''
                }`}
                values={messageValues}
              />
            </p>
          ) : null}
          {showRelatedLink && relatedLink}
        </HeadingWithSubtitle>
      );
    case HEADING_RENTAL_AGREEMENT_DISCUSSION:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementDiscussionTitle${
            !!relatedTxId ? '_rev' : ''
          }`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementDiscussionSubTitle${
                  !!relatedTxId ? '_rev' : ''
                }`}
                values={messageValues}
              />
            </p>
          ) : null}
          {showRelatedLink && relatedLink}
        </HeadingWithSubtitle>
      );
    case HEADING_WAS_APPROVED_BY_RENTER:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_wasApprovedByRenterTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_wasApprovedByRenterSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
          {showRelatedLink && relatedLink}
        </HeadingWithSubtitle>
      );
    case HEADING_REVERSED_TRANSACTION_FLOW:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_reversedTransactionFlowTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_reversedTransactionFlowSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_CANCELLED_DURING_RAD:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_cancelledDuringRadTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_cancelledDuringRadSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_RENTAL_AGREEMENT_REQUESTED:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementRequestedTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementRequestedSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
          {showRelatedLink && relatedLink}
        </HeadingWithSubtitle>
      );
    case HEADING_RENTAL_AGREEMENT_SENT:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementSentTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementSentSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
          {showRelatedLink && relatedLink}
        </HeadingWithSubtitle>
      );
    case HEADING_CANCELLED_AFTER_AGREEENT_SENT:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_cancelledAfterAgreementSentTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${
                  isCustomer ? 'c' : 'p'
                }_cancelledAfterAgreementSentSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_RENTAL_AGREEMENT_FINALIZED:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
          {showRelatedLink && relatedLink}
        </HeadingWithSubtitle>
      );
    case HEADING_RENT_PAID:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalPaidTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalPaidSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
          {showRelatedLink && relatedLink}
        </HeadingWithSubtitle>
      );
    case HEADING_RENT_CANCELLED:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalCancelledTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalCancelledSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_RENT_PAYMENT_METHOD_MISSING:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentPaymentMethodMissingTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentPaymentMethodMissingSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_RENT_EXTENDED:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalExtendedTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalExtendedSubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_PAYMENT_EXPIRED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionPanel.orderPaymentExpiredTitle"
          values={messageValues}
          listingDeleted={listingDeleted}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.salePaymentExpiredTitle"
          values={messageValues}
          isCustomerBanned={isCustomerBanned}
        />
      );
    case HEADING_REQUESTED:
      return isCustomer ? (
        <HeadingCustomerWithSubtitle
          className={titleClasses}
          id="TransactionPanel.orderPreauthorizedTitle"
          values={messageValues}
          subtitleId="TransactionPanel.orderPreauthorizedSubtitle"
          subtitleValues={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id="TransactionPanel.orderPreauthorizedInfo"
                values={messageValues}
              />
            </p>
          ) : null}
        </HeadingCustomerWithSubtitle>
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.saleRequestedTitle"
          values={messageValues}
        >
          {!isCustomerBanned ? (
            <p className={titleClasses}>
              <FormattedMessage id="TransactionPanel.saleRequestedInfo" values={messageValues} />
            </p>
          ) : null}
        </HeadingProvider>
      );
    case HEADING_ACCEPTED:
      return isCustomer ? (
        <HeadingCustomerWithSubtitle
          className={titleClasses}
          id="TransactionPanel.orderPreauthorizedTitle"
          values={messageValues}
          subtitleId="TransactionPanel.orderAcceptedSubtitle"
          subtitleValues={messageValues}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.saleAcceptedTitle"
          values={messageValues}
        />
      );
    case HEADING_DECLINED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionPanel.orderDeclinedTitle"
          values={messageValues}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.saleDeclinedTitle"
          values={messageValues}
          isCustomerBanned={isCustomerBanned}
        />
      );
    case HEADING_CANCELED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionPanel.orderCancelledTitle"
          values={messageValues}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.saleCancelledTitle"
          values={messageValues}
        />
      );
    case HEADING_DELIVERED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionPanel.orderDeliveredTitle"
          values={messageValues}
          isCustomerBanned={isCustomerBanned}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.saleDeliveredTitle"
          values={messageValues}
          isCustomerBanned={isCustomerBanned}
        />
      );
    default:
      console.warn('Unknown state given to panel heading.');
      return null;
  }
};

export default PanelHeading;
