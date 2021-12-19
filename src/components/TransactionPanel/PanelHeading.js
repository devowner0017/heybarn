import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { createSlug, stringify } from '../../util/urlHelpers';
import { NamedLink } from '../../components';

import css from './TransactionPanel.module.css';

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
  } = props;

  const isCustomer = props.transactionRole === 'customer';

  const defaultRootClassName = css.heading;
  const titleClasses = classNames(rootClassName || defaultRootClassName, className);
  const listingLink = createListingLink(listingId, listingTitle, listingDeleted);

  switch (panelHeadingState) {
    case HEADING_HOST_ENQUIRED:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_hostEnquiredTitle`}
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_hostEnquiredSubTitle`}
          values={{ listingLink, providerName, customerName, listingLink }}
          listingDeleted={listingDeleted}
          isProvider={!isCustomer}
          isCustomerBanned={isCustomerBanned}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_hostEnquiredSubTitle`}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_RENTER_ENQUIRED:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredTitle`}
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );

    case HEADING_HOST_DECLINED_COMMUNICATION:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_hostDeclinedTitle`}
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_hostDeclinedSubTitle`}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_RENTER_DECLINED_COMMUNICATION:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterDeclinedTitle`}
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterDeclinedSubTitle`}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_RENTAL_AGREEMENT_DISCUSSION:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementDiscussionTitle`}
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementDiscussionSubTitle`}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_WAS_APPROVED_BY_RENTER:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_wasApprovedByRenterTitle`}
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_wasApprovedByRenterSubTitle`}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_REVERSED_TRANSACTION_FLOW:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_reversedTransactionFlowTitle`}
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_reversedTransactionFlowSubTitle`}
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
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_cancelledDuringRadSubTitle`}
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
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementRequestedSubTitle`}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_RENTAL_AGREEMENT_SENT:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementSentTitle`}
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementSentSubTitle`}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_CANCELLED_AFTER_AGREEENT_SENT:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_cancelledAfterAgreementSentTitle`}
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${
                  isCustomer ? 'c' : 'p'
                }_cancelledAfterAgreementSentSubTitle`}
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
          // subId={`TransactionPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedSubTitle`}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_RENT_PAID:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalPaidTitle`}
          values={{ providerName, listingLink, customerName, listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionPanel.${isCustomer ? 'c' : 'p'}_rentalPaidSubTitle`}
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
          values={{ listingLink }}
          listingDeleted={listingDeleted}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.salePaymentExpiredTitle"
          values={{ customerName, listingLink }}
          isCustomerBanned={isCustomerBanned}
        />
      );
    case HEADING_REQUESTED:
      return isCustomer ? (
        <HeadingCustomerWithSubtitle
          className={titleClasses}
          id="TransactionPanel.orderPreauthorizedTitle"
          values={{ customerName }}
          subtitleId="TransactionPanel.orderPreauthorizedSubtitle"
          subtitleValues={{ listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id="TransactionPanel.orderPreauthorizedInfo"
                values={{ providerName }}
              />
            </p>
          ) : null}
        </HeadingCustomerWithSubtitle>
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.saleRequestedTitle"
          values={{ customerName, listingLink }}
        >
          {!isCustomerBanned ? (
            <p className={titleClasses}>
              <FormattedMessage id="TransactionPanel.saleRequestedInfo" values={{ customerName }} />
            </p>
          ) : null}
        </HeadingProvider>
      );
    case HEADING_ACCEPTED:
      return isCustomer ? (
        <HeadingCustomerWithSubtitle
          className={titleClasses}
          id="TransactionPanel.orderPreauthorizedTitle"
          values={{ customerName }}
          subtitleId="TransactionPanel.orderAcceptedSubtitle"
          subtitleValues={{ listingLink }}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.saleAcceptedTitle"
          values={{ customerName, listingLink }}
        />
      );
    case HEADING_DECLINED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionPanel.orderDeclinedTitle"
          values={{ customerName, listingLink }}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.saleDeclinedTitle"
          values={{ customerName, listingLink }}
          isCustomerBanned={isCustomerBanned}
        />
      );
    case HEADING_CANCELED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionPanel.orderCancelledTitle"
          values={{ customerName, listingLink }}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.saleCancelledTitle"
          values={{ customerName, listingLink }}
        />
      );
    case HEADING_DELIVERED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionPanel.orderDeliveredTitle"
          values={{ customerName, listingLink }}
          isCustomerBanned={isCustomerBanned}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionPanel.saleDeliveredTitle"
          values={{ customerName, listingLink }}
          isCustomerBanned={isCustomerBanned}
        />
      );
    default:
      console.warn('Unknown state given to panel heading.');
      return null;
  }
};

export default PanelHeading;
