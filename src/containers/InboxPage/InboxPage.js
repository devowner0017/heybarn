import React, { PropTypes } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import {
  Avatar,
  NamedLink,
  NamedRedirect,
  NotificationBadge,
  PageLayout,
  PaginationLinks,
  TabNav,
  Topbar,
} from '../../components';
import * as propTypes from '../../util/propTypes';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { logout, authenticationInProgress } from '../../ducks/Auth.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/UI.duck';
import { loadData } from './InboxPage.duck';

import css from './InboxPage.css';

const { arrayOf, bool, func, instanceOf, number, object, oneOf, shape, string } = PropTypes;

// Formatted username
const username = user => {
  const profile = user && user.attributes && user.attributes.profile ? user.attributes.profile : {};
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    name: profile.firstName ? `${profile.firstName} ${profile.lastName}` : '',
  };
};

// Localised timestamp when the given transaction was updated
const timestamp = (intl, tx) => {
  const defaultValue = { datetime: '', date: '' };
  const date = tx.attributes ? tx.attributes.lastTransitionedAt : null;
  const dateFormatOptions = {
    month: 'long',
    day: 'numeric',
  };
  return date
    ? {
        datetime: `${intl.formatDate(date)} ${intl.formatTime(date)}`,
        date: intl.formatDate(date, dateFormatOptions),
      }
    : defaultValue;
};

// Translated name of the state of the given transaction
const txState = (intl, tx, isOrder) => {
  const { attributes: { state } } = tx;
  if (state === propTypes.TX_STATE_ACCEPTED) {
    return {
      nameClassName: css.nameAccepted,
      timeClassName: css.timeAccepted,
      stateClassName: css.stateAccepted,
      state: intl.formatMessage({
        id: 'InboxPage.stateAccepted',
      }),
    };
  } else if (state === propTypes.TX_STATE_REJECTED) {
    return {
      nameClassName: css.nameDeclined,
      timeClassName: css.timeDeclined,
      stateClassName: css.stateDeclined,
      state: intl.formatMessage({
        id: 'InboxPage.stateDeclined',
      }),
    };
  } else if (state === propTypes.TX_STATE_DELIVERED) {
    return {
      nameClassName: css.nameDelivered,
      timeClassName: css.timeDelivered,
      stateClassName: css.stateDelivered,
      state: intl.formatMessage({
        id: 'InboxPage.stateDelivered',
      }),
    };
  }
  return {
    nameClassName: isOrder ? css.nameRequested : css.namePending,
    timeClassName: isOrder ? css.timeRequested : css.timePending,
    stateClassName: isOrder ? css.stateRequested : css.statePending,
    state: isOrder
      ? intl.formatMessage({
          id: 'InboxPage.stateRequested',
        })
      : intl.formatMessage({
          id: 'InboxPage.statePending',
        }),
  };
};

export const InboxItem = props => {
  const { type, tx, intl } = props;
  const { customer, provider } = tx;
  const isOrder = type === 'order';
  const otherUser = username(isOrder ? provider : customer);
  const changedDate = timestamp(intl, tx);
  const stateData = txState(intl, tx, isOrder);
  const isSaleNotification = !isOrder && tx.attributes.state === propTypes.TX_STATE_PREAUTHORIZED;

  const rowNotificationDot = isSaleNotification ? <div className={css.notificationDot} /> : null;

  return (
    <NamedLink
      className={css.itemLink}
      name={isOrder ? 'OrderDetailsPage' : 'SaleDetailsPage'}
      params={{ id: tx.id.uuid }}
    >
      <div className={css.itemAvatar}>
        <Avatar firstName={otherUser.firstName} lastName={otherUser.lastName} />
      </div>
      <div className={css.rowNotificationDot}>
        {rowNotificationDot}
      </div>
      <div className={css.itemInfo}>
        <div className={classNames(css.itemUsername, stateData.nameClassName)}>
          {otherUser.name}
        </div>
        <div
          className={classNames(css.itemTimestamp, stateData.timeClassName)}
          title={changedDate.datetime}
        >
          {changedDate.date}
        </div>
      </div>
      <div className={classNames(css.itemState, stateData.stateClassName)}>{stateData.state}</div>
    </NamedLink>
  );
};

InboxItem.propTypes = {
  type: oneOf(['order', 'sale']).isRequired,
  tx: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export const InboxPageComponent = props => {
  const {
    authInProgress,
    currentUser,
    currentUserHasListings,
    fetchInProgress,
    fetchOrdersOrSalesError,
    history,
    intl,
    isAuthenticated,
    location,
    onLogout,
    onManageDisableScrolling,
    pagination,
    params,
    providerNotificationCount,
    scrollingDisabled,
    transactions,
  } = props;
  const { tab } = params;

  const validTab = tab === 'orders' || tab === 'sales';
  if (!validTab) {
    return <NamedRedirect name="NotFoundPage" />;
  }

  const isOrders = tab === 'orders';

  const ordersTitle = intl.formatMessage({ id: 'InboxPage.ordersTitle' });
  const salesTitle = intl.formatMessage({ id: 'InboxPage.salesTitle' });
  const title = isOrders ? ordersTitle : salesTitle;

  const toTxItem = tx => {
    return (
      <li key={tx.id.uuid} className={css.listItem}>
        <InboxItem type={isOrders ? 'order' : 'sale'} tx={tx} intl={intl} />
      </li>
    );
  };

  const error = fetchOrdersOrSalesError
    ? <p className={css.error}>
        <FormattedMessage id="InboxPage.fetchFailed" />
      </p>
    : null;

  const noResults = !fetchInProgress && transactions.length === 0 && !fetchOrdersOrSalesError
    ? <li key="noResults" className={css.noResults}>
        <FormattedMessage id={isOrders ? 'InboxPage.noOrdersFound' : 'InboxPage.noSalesFound'} />
      </li>
    : null;

  const hasTransactions = !fetchInProgress && transactions && transactions.length > 0;
  const pagingLinks = hasTransactions && pagination && pagination.totalPages > 1
    ? <PaginationLinks
        className={css.pagination}
        pageName="InboxPage"
        pagePathParams={params}
        pagination={pagination}
      />
    : null;

  const providerNotificationBadge = providerNotificationCount > 0
    ? <NotificationBadge count={providerNotificationCount} />
    : null;
  const tabs = [
    {
      text: <span><FormattedMessage id="InboxPage.ordersTabTitle" /></span>,
      selected: isOrders,
      linkProps: {
        name: 'InboxPage',
        params: { tab: 'orders' },
      },
    },
    {
      text: (
        <span><FormattedMessage id="InboxPage.salesTabTitle" />{providerNotificationBadge}</span>
      ),
      selected: !isOrders,
      linkProps: {
        name: 'InboxPage',
        params: { tab: 'sales' },
      },
    },
  ];
  const nav = <TabNav className={css.tabs} tabs={tabs} />;

  return (
    <PageLayout title={title} scrollingDisabled={scrollingDisabled}>
      <Topbar
        mobileRootClassName={css.mobileTopbar}
        isAuthenticated={isAuthenticated}
        authInProgress={authInProgress}
        currentUser={currentUser}
        currentUserHasListings={currentUserHasListings}
        notificationCount={providerNotificationCount}
        history={history}
        location={location}
        onLogout={onLogout}
        onManageDisableScrolling={onManageDisableScrolling}
      />
      <div className={css.heading}>
        <h1 className={css.title}>
          <FormattedMessage id="InboxPage.title" />
        </h1>
        {nav}
      </div>
      {error}
      <ul className={css.itemList}>
        {!fetchInProgress ? transactions.map(toTxItem) : null}
        {noResults}
      </ul>
      {pagingLinks}
    </PageLayout>
  );
};

InboxPageComponent.defaultProps = {
  currentUser: null,
  fetchOrdersOrSalesError: null,
  pagination: null,
  providerNotificationCount: 0,
};

InboxPageComponent.propTypes = {
  params: shape({
    tab: string.isRequired,
  }).isRequired,

  authInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentUserHasListings: bool.isRequired,
  fetchInProgress: bool.isRequired,
  fetchOrdersOrSalesError: instanceOf(Error),
  isAuthenticated: bool.isRequired,
  onLogout: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  pagination: propTypes.pagination,
  providerNotificationCount: number,
  scrollingDisabled: bool.isRequired,
  transactions: arrayOf(propTypes.transaction).isRequired,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: object.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    fetchInProgress,
    fetchOrdersOrSalesError,
    pagination,
    transactionRefs,
  } = state.InboxPage;
  const { isAuthenticated } = state.Auth;
  const {
    currentUser,
    currentUserHasListings,
    currentUserNotificationCount: providerNotificationCount,
  } = state.user;
  return {
    fetchInProgress,
    fetchOrdersOrSalesError,
    isAuthenticated,
    authInProgress: authenticationInProgress(state),
    currentUser,
    currentUserHasListings,
    pagination,
    providerNotificationCount,
    transactions: getMarketplaceEntities(state, transactionRefs),
    scrollingDisabled: isScrollingDisabled(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onLogout: historyPush => dispatch(logout(historyPush)),
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
});

const InboxPage = compose(connect(mapStateToProps, mapDispatchToProps), withRouter, injectIntl)(
  InboxPageComponent
);

InboxPage.loadData = loadData;

export default InboxPage;
