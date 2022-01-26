import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { createSlug, stringify } from '../../util/urlHelpers';
import { NamedLink } from '../../components';

import css from './TransactionInitPanel.module.css';
import ExternalLink from '../ExternalLink/ExternalLink';

export const HEADING_READY = 'ready';
const lineBreak = (
  <>
    <br />
    <br />
  </>
);
// OLD BELOW
export const HEADING_ENQUIRED = 'enquired';
export const HEADING_PAYMENT_PENDING = 'pending-payment';
export const HEADING_PAYMENT_EXPIRED = 'payment-expired';
export const HEADING_REQUESTED = 'requested';
export const HEADING_ACCEPTED = 'accepted';
export const HEADING_DECLINED = 'declined';
export const HEADING_CANCELED = 'canceled';
export const HEADING_DELIVERED = 'delivered';

const createListingLink = (listingId, label, listingDeleted, searchParams = {}, className = '') => {
  if (!listingDeleted && !!listingId) {
    const params = { id: listingId, slug: createSlug(label) };
    const to = { search: stringify(searchParams) };
    return (
      <NamedLink className={className} name="ListingPage" params={params} to={to}>
        {label}
      </NamedLink>
    );
  } else {
    return <FormattedMessage id="TransactionInitPanel.deletedListingOrderTitle" />;
  }
};

const ListingDeletedInfoMaybe = props => {
  return props.listingDeleted ? (
    <p className={css.transactionInfoMessage}>
      <FormattedMessage id="TransactionInitPanel.messageDeletedListing" />
    </p>
  ) : null;
};

const CustomerBannedInfoMaybe = props => {
  return props.isCustomerBanned ? (
    <p className={css.transactionInfoMessage}>
      <FormattedMessage id="TransactionInitPanel.customerBannedStatus" />
    </p>
  ) : null;
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
// Functional component as a helper to choose and show Order or Sale heading info:
// title, subtitle, and message
const PanelHeading = props => {
  const {
    className,
    rootClassName,
    panelHeadingState,
    customerName,
    providerName,
    otherUserDisplayName,
    listingId,
    listingTitle,
    listingDeleted,
    isCustomerBanned,
    listingType,
  } = props;
  console.log('🚀 | file: PanelHeading.js | line 101 | listingDeleted', listingDeleted);
  console.log('🚀 | file: PanelHeading.js | line 97 | listingType', listingType);
  console.log('🚀 | file: PanelHeading.js | line 96 | customerName', customerName);
  console.log('🚀 | file: PanelHeading.js | line 96 | providerName', providerName);
  console.log(props);
  const isCustomer = props.transactionRole === 'customer';

  const defaultRootClassName = css.heading;
  const titleClasses = classNames(rootClassName || defaultRootClassName, className);
  const listingLink = createListingLink(listingId, listingTitle, listingDeleted);

  console.log('🚀 | file: PanelHeading.js | line 123 | panelHeadingState', panelHeadingState);
  const messageValues = {
    otherName: otherUserDisplayName,
    providerName,
    listingLink,
    customerName,
    listingLink,
    listingType: listingType === 'advert' ? 'listing' : listingType,
    stripeLink: (
      <ExternalLink href="https://www.stripe.com">Stripe payment processing platform</ExternalLink>
    ),
    lineBreak,
  };

  switch (panelHeadingState) {
    case HEADING_READY:
      return (
        <HeadingWithSubtitle
          className={titleClasses}
          id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_${listingType}ReadyTitle`}
          values={messageValues}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_${listingType}ReadySubTitle`}
                values={messageValues}
              />
            </p>
          ) : null}
        </HeadingWithSubtitle>
      );
    case HEADING_ENQUIRED:
      <HeadingWithSubtitle
        className={titleClasses}
        id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedTitle`}
        values={messageValues}
      >
        {!listingDeleted ? (
          <p className={css.transactionInfoMessage}>
            <FormattedMessage
              id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedSubTitle`}
              values={messageValues}
            />
          </p>
        ) : null}
      </HeadingWithSubtitle>;
    case HEADING_PAYMENT_PENDING:
      <HeadingWithSubtitle
        className={titleClasses}
        id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedTitle`}
        values={messageValues}
      >
        {!listingDeleted ? (
          <p className={css.transactionInfoMessage}>
            <FormattedMessage
              id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedSubTitle`}
              values={messageValues}
            />
          </p>
        ) : null}
      </HeadingWithSubtitle>;
    case HEADING_PAYMENT_EXPIRED:
      <HeadingWithSubtitle
        className={titleClasses}
        id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedTitle`}
        // subId={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
        values={messageValues}
      >
        {!listingDeleted ? (
          <p className={css.transactionInfoMessage}>
            <FormattedMessage
              id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedSubTitle`}
              values={messageValues}
            />
          </p>
        ) : null}
      </HeadingWithSubtitle>;
    case HEADING_REQUESTED:
      <HeadingWithSubtitle
        className={titleClasses}
        id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedTitle`}
        // subId={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
        values={messageValues}
      >
        {!listingDeleted ? (
          <p className={css.transactionInfoMessage}>
            <FormattedMessage
              id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedSubTitle`}
              values={messageValues}
            />
          </p>
        ) : null}
      </HeadingWithSubtitle>;
    case HEADING_ACCEPTED:
      <HeadingWithSubtitle
        className={titleClasses}
        id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedTitle`}
        // subId={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_renterEnquiredSubTitle`}
        values={messageValues}
      >
        {!listingDeleted ? (
          <p className={css.transactionInfoMessage}>
            <FormattedMessage
              id={`TransactionInitPanel.${isCustomer ? 'c' : 'p'}_rentalAgreementFinalizedSubTitle`}
              values={messageValues}
            />
          </p>
        ) : null}
      </HeadingWithSubtitle>;
    default:
      console.warn('Unknown state given to panel heading.');
      return null;
  }
};

export default PanelHeading;
