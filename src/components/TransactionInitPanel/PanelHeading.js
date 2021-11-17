import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { createSlug, stringify } from '../../util/urlHelpers';
import { NamedLink } from '../../components';

import css from './TransactionInitPanel.module.css';

export const HEADING_READY = 'ready';

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

const HeadingCustomer = props => {
  const { className, id, subId, values, subValues, listingDeleted } = props;
  return (
    <React.Fragment>
      <h1 className={className}>
        <span className={css.mainTitle}>
          <FormattedMessage id={id} values={values} />
        </span>
      </h1>
      {subId && (
        <div className={css.subTitle}>
          <FormattedMessage id={subId} values={subValues} />
        </div>
      )}
      <ListingDeletedInfoMaybe listingDeleted={listingDeleted} />
    </React.Fragment>
  );
};

const HeadingCustomerWithSubtitle = props => {
  const { className, id, values, subtitleId, subtitleValues, children, listingDeleted } = props;
  return (
    <React.Fragment>
      <h1 className={className}>
        <span className={css.mainTitle}>
          <FormattedMessage id={id} values={values} />
        </span>
        <FormattedMessage id={subtitleId} values={subtitleValues} />
      </h1>
      {children}
      <ListingDeletedInfoMaybe listingDeleted={listingDeleted} />
    </React.Fragment>
  );
};

const CustomerBannedInfoMaybe = props => {
  return props.isCustomerBanned ? (
    <p className={css.transactionInfoMessage}>
      <FormattedMessage id="TransactionInitPanel.customerBannedStatus" />
    </p>
  ) : null;
};

const HeadingProvider = props => {
  const { className, id, values, isCustomerBanned, children } = props;
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
  console.log(props);
  const isCustomer = props.transactionRole === 'customer';

  const defaultRootClassName = css.heading;
  const titleClasses = classNames(rootClassName || defaultRootClassName, className);
  const listingLink = createListingLink(listingId, listingTitle, listingDeleted);

  switch (panelHeadingState) {
    case HEADING_READY:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionInitPanel.orderReadyTitle"
          subId={'TransactionInitPanel.orderReadySubTitle'}
          values={{ listingType: 'listing', otherName: providerName }}
          listingDeleted={listingDeleted}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionInitPanel.saleReadyTitle"
          values={{ customerName, listingLink }}
          isCustomerBanned={isCustomerBanned}
        />
      );
    case HEADING_ENQUIRED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionInitPanel.orderEnquiredTitle"
          values={{ listingLink }}
          listingDeleted={listingDeleted}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionInitPanel.saleEnquiredTitle"
          values={{ customerName, listingLink }}
          isCustomerBanned={isCustomerBanned}
        />
      );
    case HEADING_PAYMENT_PENDING:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionInitPanel.orderPaymentPendingTitle"
          values={{ listingLink }}
          listingDeleted={listingDeleted}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionInitPanel.salePaymentPendingTitle"
          values={{ customerName, listingLink }}
          isCustomerBanned={isCustomerBanned}
        >
          <p className={css.transactionInfoMessage}>
            <FormattedMessage
              id="TransactionInitPanel.salePaymentPendingInfo"
              values={{ customerName }}
            />
          </p>
        </HeadingProvider>
      );
    case HEADING_PAYMENT_EXPIRED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionInitPanel.orderPaymentExpiredTitle"
          values={{ listingLink }}
          listingDeleted={listingDeleted}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionInitPanel.salePaymentExpiredTitle"
          values={{ customerName, listingLink }}
          isCustomerBanned={isCustomerBanned}
        />
      );
    case HEADING_REQUESTED:
      return isCustomer ? (
        <HeadingCustomerWithSubtitle
          className={titleClasses}
          id="TransactionInitPanel.orderPreauthorizedTitle"
          values={{ customerName }}
          subtitleId="TransactionInitPanel.orderPreauthorizedSubtitle"
          subtitleValues={{ listingLink }}
        >
          {!listingDeleted ? (
            <p className={css.transactionInfoMessage}>
              <FormattedMessage
                id="TransactionInitPanel.orderPreauthorizedInfo"
                values={{ providerName }}
              />
            </p>
          ) : null}
        </HeadingCustomerWithSubtitle>
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionInitPanel.saleRequestedTitle"
          values={{ customerName, listingLink }}
        >
          {!isCustomerBanned ? (
            <p className={titleClasses}>
              <FormattedMessage
                id="TransactionInitPanel.saleRequestedInfo"
                values={{ customerName }}
              />
            </p>
          ) : null}
        </HeadingProvider>
      );
    case HEADING_ACCEPTED:
      return isCustomer ? (
        <HeadingCustomerWithSubtitle
          className={titleClasses}
          id="TransactionInitPanel.orderPreauthorizedTitle"
          values={{ customerName }}
          subtitleId="TransactionInitPanel.orderAcceptedSubtitle"
          subtitleValues={{ listingLink }}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionInitPanel.saleAcceptedTitle"
          values={{ customerName, listingLink }}
        />
      );
    case HEADING_DECLINED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionInitPanel.orderDeclinedTitle"
          values={{ customerName, listingLink }}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionInitPanel.saleDeclinedTitle"
          values={{ customerName, listingLink }}
          isCustomerBanned={isCustomerBanned}
        />
      );
    case HEADING_CANCELED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionInitPanel.orderCancelledTitle"
          values={{ customerName, listingLink }}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionInitPanel.saleCancelledTitle"
          values={{ customerName, listingLink }}
        />
      );
    case HEADING_DELIVERED:
      return isCustomer ? (
        <HeadingCustomer
          className={titleClasses}
          id="TransactionInitPanel.orderDeliveredTitle"
          values={{ customerName, listingLink }}
          isCustomerBanned={isCustomerBanned}
        />
      ) : (
        <HeadingProvider
          className={titleClasses}
          id="TransactionInitPanel.saleDeliveredTitle"
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
