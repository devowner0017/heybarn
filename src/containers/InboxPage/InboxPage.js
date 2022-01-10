import React from 'react';
import { arrayOf, bool, number, oneOf, shape, string } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import {
  txIsEnquired,
  txIsRequested,
  txHasBeenDelivered,
  txIsPaymentExpired,
  txIsPaid,
  txIsPaymentPending,
  txIsHostEnquired,
  txIsRenterEnquired,
  txHasHostDeclined,
  txHasRenterDeclined,
  txIsRentalAgreementDiscussion,
  txIsRentalAgreementRequested,
  txIsReversedTransactionFlow,
  txIsCancelledDuringRad,
  txIsRentalAgreementSent,
  txIsCancelledAfterAgreementSent,
  txIsRentalAgreementSigned,
  txNeedsNotificationOrder,
  txNeedsNotificationSale,
} from '../../util/transaction';
import { propTypes, DATE_TYPE_DATE } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import {
  AvatarMedium,
  BookingTimeInfo,
  NamedLink,
  NotificationBadge,
  Page,
  PaginationLinks,
  TabNav,
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer,
  IconSpinner,
  UserDisplayName,
  UserNav,
  LayoutWrapperManageListingsSideNav,
} from '../../components';
import { TopbarContainer, NotFoundPage } from '../../containers';
import config from '../../config';

import css from './InboxPage.module.css';

const formatDate = (intl, date) => {
  return {
    short: intl.formatDate(date, {
      month: 'short',
      day: 'numeric',
    }),
    long: `${intl.formatDate(date)} ${intl.formatTime(date)}`,
  };
};

// Translated name of the state of the given transaction
export const txState = (intl, tx, type) => {
  console.log('🚀 | file: InboxPage.js | line 68 | txState | type', type);
  console.log('🚀 | file: InboxPage.js | line 225 | txState | tx', tx);
  const isOrder = type === 'order';
  console.log("🚀 | file: InboxPage.js | line 71 | txState | isOrder", isOrder);
  if (txIsHostEnquired(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: isOrder ? css.bookingNoActionNeeded : css.bookingActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: !isOrder ? css.stateNoActionNeeded : css.stateActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateEnquiry',
      }),
    };
  } else if (txIsRenterEnquired(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: isOrder ? css.bookingNoActionNeeded : css.bookingActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: !isOrder ? css.stateNoActionNeeded : css.stateActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateEnquiry',
      }),
    };
  } else if (txHasHostDeclined(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: css.bookingActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: css.stateNoActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateDeclined',
      }),
    };
  } else if (txHasRenterDeclined(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: css.bookingNoActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: css.stateNoActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateDeclined',
      }),
    };
  } else if (txIsRentalAgreementDiscussion(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: css.bookingActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: css.stateActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateAgreementDiscussion',
      }),
    };
  } else if (txIsRentalAgreementRequested(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: css.bookingActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: !isOrder ? css.stateNoActionNeeded : css.stateActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateAgreementRequested',
      }),
    };
  } else if (txIsReversedTransactionFlow(tx)) {
    return null;
    //  {
    //   nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
    //   // bookingClassName: css.bookingActionNeeded,
    //   lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
    //   stateClassName: css.stateNoActionNeeded,
    //   state: intl.formatMessage({
    //     id: 'InboxPage.stateReversedTransaction',
    //   }),
    // };
  } else if (txIsCancelledDuringRad(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: css.bookingNoActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: css.stateNoActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateCancelled',
      }),
    };
  } else if (txIsRentalAgreementSent(tx)) {
    console.log(tx);
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: css.bookingActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: !isOrder ? css.stateActionNeeded : css.stateNoActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateRentalAgreementSent',
      }),
    };
  } else if (txIsCancelledAfterAgreementSent(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: css.bookingNoActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: css.stateNoActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateCancelled',
      }),
    };
  } else if (txIsRentalAgreementSigned(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: css.bookingActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: !isOrder ? css.stateActionNeeded : css.stateNoActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateRentalAgreementFinalized',
      }),
    };
  } else if (txIsPaymentPending(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      // bookingClassName: css.bookingActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: css.stateActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.statePaymentPending',
      }),
    };
  } else if (txIsPaid(tx)) {
    return {
      nameClassName: isOrder ? css.nameNotEmphasized : css.nameEmphasized,
      bookingClassName: css.bookingActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtEmphasized,
      stateClassName: css.stateNoActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateRentPaid',
      }),
    };
  } else if (txIsPaymentExpired(tx)) {
    return {
      nameClassName: css.nameNotEmphasized,
      // bookingClassName: css.bookingNoActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtNotEmphasized,
      stateClassName: css.stateNoActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateExpired',
      }),
    };
  } else if (txHasBeenDelivered(tx)) {
    return {
      nameClassName: css.nameNotEmphasized,
      // bookingClassName: css.bookingNoActionNeeded,
      lastTransitionedAtClassName: css.lastTransitionedAtNotEmphasized,
      stateClassName: css.stateNoActionNeeded,
      state: intl.formatMessage({
        id: 'InboxPage.stateDelivered',
      }),
    };
  } else {
    console.warn('This transition is unknown:', tx.attributes.lastTransition);
    return null;
  }
};

// Functional component as internal helper to print BookingTimeInfo if that is needed
const BookingInfoMaybe = props => {
  const { bookingClassName, isOrder, intl, tx, unitType } = props;
  const isEnquiry = txIsEnquired(tx);

  if (isEnquiry) {
    return null;
  }

  // If you want to show the booking price after the booking time on InboxPage you can
  // add the price after the BookingTimeInfo component. You can get the price by uncommenting
  // sthe following lines:

  // const bookingPrice = isOrder ? tx.attributes.payinTotal : tx.attributes.payoutTotal;
  // const price = bookingPrice ? formatMoney(intl, bookingPrice) : null;

  // Remember to also add formatMoney function from 'util/currency.js' and add this after BookingTimeInfo:
  // <div className={css.itemPrice}>{price}</div>

  return (
    <div className={classNames(css.bookingInfoWrapper, bookingClassName)}>
      <BookingTimeInfo
        bookingClassName={bookingClassName}
        isOrder={isOrder}
        intl={intl}
        tx={tx}
        unitType={unitType}
        dateType={DATE_TYPE_DATE}
      />
    </div>
  );
};

BookingInfoMaybe.propTypes = {
  intl: intlShape.isRequired,
  isOrder: bool.isRequired,
  tx: propTypes.transaction.isRequired,
  unitType: propTypes.bookingUnitType.isRequired,
};

export const InboxItem = props => {
  const { unitType, type, tx, intl, stateData, currentUser } = props;
  console.log('🚀 | file: InboxPage.js | line 267 | tx', tx);
  console.log('🚀 | file: InboxPage.js | line 265 | currentUser', currentUser);
  console.log('🚀 | file: InboxPage.js | line 265 | tx', tx);
  const { customer, provider, listing } = tx;
  const isOrder = provider.id.uuid !== currentUser.id.uuid;
  console.log('🚀 | file: InboxPage.js | line 269 | isOrder', isOrder);
  const listingTitle = listing?.attributes?.title;
  const otherUser = isOrder ? provider : customer;
  const otherUserDisplayName = <UserDisplayName user={otherUser} intl={intl} />;
  const isOtherUserBanned = otherUser.attributes.banned;

  const isSaleNotification = isOrder ? txNeedsNotificationOrder(tx) : txNeedsNotificationSale(tx);
  const rowNotificationDot = isSaleNotification ? <div className={css.notificationDot} /> : null;
  const lastTransitionedAt = formatDate(intl, tx.attributes.lastTransitionedAt);

  const linkClasses = classNames(css.itemLink, {
    [css.bannedUserLink]: isOtherUserBanned,
  });

  return (
    <div className={css.item}>
      <div className={css.itemAvatar}>
        <AvatarMedium user={otherUser} />
      </div>
      <NamedLink
        className={linkClasses}
        name={isOrder ? 'OrderDetailsPage' : 'SaleDetailsPage'}
        params={{ id: tx.id.uuid }}
      >
        <div className={css.rowNotificationDot}>{rowNotificationDot}</div>
        <div className={css.itemInfo}>
          <div className={classNames(css.itemUsername, stateData.nameClassName)}>
            {otherUserDisplayName}
          </div>
          <div className={classNames(css.listingName)}>
            {listingTitle}
            {/* <BookingInfoMaybe
            bookingClassName={stateData.bookingClassName}
            intl={intl}
            isOrder={isOrder}
            tx={tx}
            unitType={unitType}
          /> */}
          </div>
        </div>
        <div className={css.itemState}>
          <div className={classNames(css.stateName, stateData.stateClassName)}>
            {stateData.state}
          </div>
          <div
            className={classNames(css.lastTransitionedAt, stateData.lastTransitionedAtClassName)}
            title={lastTransitionedAt.long}
          >
            {lastTransitionedAt.short}
          </div>
        </div>
      </NamedLink>
    </div>
  );
};

InboxItem.propTypes = {
  unitType: propTypes.bookingUnitType.isRequired,
  type: oneOf(['order', 'sale']).isRequired,
  tx: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export const InboxPageComponent = props => {
  const {
    unitType,
    currentUser,
    fetchInProgress,
    fetchOrdersOrSalesError,
    intl,
    pagination,
    params,
    providerNotificationCount,
    scrollingDisabled,
    transactions,
  } = props;
  const { tab } = params;
  const ensuredCurrentUser = ensureCurrentUser(currentUser);

  const title = intl.formatMessage({ id: 'InboxPage.ordersTitle' });

  const toTxItem = tx => {
    console.log('🚀 | file: InboxPage.js | line 357 | tx', tx);
    const isCustomer = ensuredCurrentUser.id.uuid === tx.customer.id.uuid;
    const type = isCustomer ? 'sale' : 'order';
    const stateData = txState(intl, tx, type);
    console.log('🚀 | file: InboxPage.js | line 369 | stateData', stateData);
    // Render InboxItem only if the latest transition of the transaction is handled in the `txState` function.
    return stateData ? (
      <li key={tx.id.uuid} className={css.listItem}>
        <InboxItem
          unitType={unitType}
          type={type}
          tx={tx}
          intl={intl}
          stateData={stateData}
          currentUser={ensuredCurrentUser}
        />
      </li>
    ) : null;
  };

  const error = fetchOrdersOrSalesError ? (
    <p className={css.error}>
      <FormattedMessage id="InboxPage.fetchFailed" />
    </p>
  ) : null;

  const noResults =
    !fetchInProgress && transactions.length === 0 && !fetchOrdersOrSalesError ? (
      <li key="noResults" className={css.noResults}>
        <FormattedMessage id={isOrders ? 'InboxPage.noOrdersFound' : 'InboxPage.noSalesFound'} />
      </li>
    ) : null;

  const hasOrderOrSaleTransactions = tx => {
    return tx && tx.length > 0;
  };
  const hasTransactions = !fetchInProgress && hasOrderOrSaleTransactions(transactions);
  const pagingLinks =
    hasTransactions && pagination && pagination.totalPages > 1 ? (
      <PaginationLinks
        className={css.pagination}
        pageName="InboxPage"
        pagePathParams={params}
        pagination={pagination}
      />
    ) : null;

  const providerNotificationBadge =
    providerNotificationCount > 0 ? <NotificationBadge count={providerNotificationCount} /> : null;
  console.log(
    '🚀 | file: InboxPage.js | line 397 | providerNotificationCount',
    providerNotificationCount
  );

  const tabs = [
    {
      text: (
        <span>
          <FormattedMessage id="InboxPage.salesTabTitle" />
          {providerNotificationBadge}
        </span>
      ),
      selected: true,
      linkProps: {
        name: 'InboxPage',
      },
    },
  ];

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation>
        <LayoutWrapperTopbar>
          <TopbarContainer
            className={css.topbar}
            mobileRootClassName={css.mobileTopbar}
            desktopClassName={css.desktopTopbar}
            currentPage="InboxPage"
          />
          <UserNav selectedPageName={`InboxPage`} />
        </LayoutWrapperTopbar>
        <LayoutWrapperManageListingsSideNav currentTab={`InboxTab`} extraTabs={tabs} />
        <LayoutWrapperMain className={css.inboxPageWrapper}>
          {error}
          <h1 className={css.title}>
            <FormattedMessage id="InboxPage.title" />
          </h1>
          <ul className={css.itemList}>
            {!fetchInProgress ? (
              transactions.map(toTxItem)
            ) : (
              <li className={css.listItemsLoading}>
                <IconSpinner />
              </li>
            )}
            {noResults}
          </ul>
          {pagingLinks}
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSideNavigation>
    </Page>
  );
};

InboxPageComponent.defaultProps = {
  unitType: config.bookingUnitType,
  currentUser: null,
  currentUserHasOrders: null,
  fetchOrdersOrSalesError: null,
  pagination: null,
  providerNotificationCount: 0,
  sendVerificationEmailError: null,
};

InboxPageComponent.propTypes = {
  params: shape({
    tab: string.isRequired,
  }).isRequired,

  unitType: propTypes.bookingUnitType,
  currentUser: propTypes.currentUser,
  fetchInProgress: bool.isRequired,
  fetchOrdersOrSalesError: propTypes.error,
  pagination: propTypes.pagination,
  providerNotificationCount: number,
  scrollingDisabled: bool.isRequired,
  transactions: arrayOf(propTypes.transaction).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { fetchInProgress, fetchOrdersOrSalesError, pagination, transactionRefs } = state.InboxPage;
  const { currentUser, currentUserNotificationCount: providerNotificationCount } = state.user;
  return {
    currentUser,
    fetchInProgress,
    fetchOrdersOrSalesError,
    pagination,
    providerNotificationCount,
    scrollingDisabled: isScrollingDisabled(state),
    transactions: getMarketplaceEntities(state, transactionRefs),
  };
};

const InboxPage = compose(connect(mapStateToProps), injectIntl)(InboxPageComponent);

export default InboxPage;
