import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import {
  ManageListingCard,
  Page,
  PaginationLinks,
  UserNav,
  LayoutWrapperTopbar,
  LayoutWrapperManageListingsSideNav,
  LayoutSideNavigation,
  LayoutWrapperFooter,
  Footer,
  LayoutWrapperMain,
  NotificationBadge,
} from '../../components';
import { TopbarContainer } from '../../containers';
import { isScrollingDisabled, manageDisableScrolling } from '../../ducks/UI.duck';

import {
  closeListing,
  openListing,
  discardListing,
  deleteListing,
  hideListing,
  getOwnListingsById,
} from './ManageListingsPage.duck';
import css from './ManageListingsPage.module.css';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { capitalize } from 'lodash';

export class ManageListingsPageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { listingMenuOpen: null, showConfirmDeleteModal: false, deleteListingId: null };
    this.onToggleMenu = this.onToggleMenu.bind(this);
  }

  onToggleMenu(listing) {
    this.setState({ listingMenuOpen: listing });
  }

  render() {
    const {
      closingListing,
      closingListingError,
      listings,
      onCloseListing,
      onOpenListing,
      onDiscardListing,
      discardingListing,
      discardingListingError,
      onDeleteListing,
      onHideListing,
      deletingListing,
      deletingListingError,
      hidingListing,
      hidingListingError,
      openingListing,
      openingListingError,
      pagination,
      queryInProgress,
      queryListingsError,
      queryParams,
      scrollingDisabled,
      providerNotificationCount,
      onManageDisableScrolling,
      intl,
    } = this.props;
    const listingType = location.pathname.startsWith('/adverts') ? 'advert' : 'listing';
    const hasPaginationInfo = !!pagination && pagination.totalItems != null;
    const listingsAreLoaded = !queryInProgress && hasPaginationInfo;

    const loadingResults = (
      <h2>
        <FormattedMessage id={`ManageListingsPage.loadingOwn${listingType}s`} />
      </h2>
    );

    const queryError = (
      <h2 className={css.error}>
        <FormattedMessage id="ManageListingsPage.queryError" />
      </h2>
    );

    const noResults =
      listingsAreLoaded && pagination.totalItems === 0 ? (
        <h1 className={css.title}>
          <FormattedMessage id={`ManageListingsPage.noResults${listingType}`} />
        </h1>
      ) : null;

    const heading =
      listingsAreLoaded && pagination.totalItems > 0 ? (
        <h1 className={css.title}>
          <FormattedMessage
            id={`ManageListingsPage.youHave${listingType}`}
            values={{ count: pagination.totalItems }}
          />
        </h1>
      ) : (
        noResults
      );

    const page = queryParams ? queryParams.page : 1;
    const paginationLinks =
      listingsAreLoaded && pagination && pagination.totalPages > 1 ? (
        <PaginationLinks
          className={css.pagination}
          pageName="ManageListingsPage"
          pageSearchParams={{ page }}
          pagination={pagination}
        />
      ) : null;

    const listingMenuOpen = this.state.listingMenuOpen;
    const closingErrorListingId = !!closingListingError && closingListingError.listingId;
    const openingErrorListingId = !!openingListingError && openingListingError.listingId;
    const discardingErrorListingId = !!discardingListingError && discardingListingError.listingId;
    const deletingErrorListingId = !!deletingListingError && deletingListingError.listingId;
    const hidingErrorListingId = !!hidingListingError && hidingListingError.listingId;

    const title = intl.formatMessage({ id: `ManageListingsPage.title${listingType}` });

    const panelWidth = 62.5;
    // Render hints for responsive image
    const renderSizes = [
      `(max-width: 767px) 100vw`,
      `(max-width: 1920px) ${panelWidth / 2}vw`,
      `${panelWidth / 3}vw`,
    ].join(', ');

    const providerNotificationBadge =
      providerNotificationCount > 0 ? (
        <NotificationBadge count={providerNotificationCount} />
      ) : null;

    const tabs = [
      {
        text: (
          <span>
            <FormattedMessage id="InboxPage.salesTabTitle" />
            {providerNotificationBadge}
          </span>
        ),
        selected: false,
        linkProps: {
          name: 'InboxPage',
        },
      },
    ];
    const handleDeleteListing = id => {
      this.setState({ deleteListingId: id, showConfirmDeleteModal: true });
    };
    return (
      <Page title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSideNavigation>
          <LayoutWrapperTopbar>
            <TopbarContainer currentPage={`Manage${capitalize(listingType)}sPage`} />
            <UserNav selectedPageName={`Manage${capitalize(listingType)}sPage`} />
          </LayoutWrapperTopbar>
          <LayoutWrapperManageListingsSideNav
            currentTab={`${capitalize(listingType)}sTab`}
            extraTabs={tabs}
          />
          <LayoutWrapperMain>
            {queryInProgress ? loadingResults : null}
            {queryListingsError ? queryError : null}
            <div className={css.listingPanel}>
              {heading}
              <div className={css.listingCards}>
                {listings?.map(l => (
                  <ManageListingCard
                    className={css.listingCard}
                    key={l.id.uuid}
                    listing={l}
                    isMenuOpen={!!listingMenuOpen && listingMenuOpen.id.uuid === l.id.uuid}
                    actionsInProgressListingId={
                      openingListing || closingListing || discardingListing || deletingListing
                    }
                    onToggleMenu={this.onToggleMenu}
                    onCloseListing={onCloseListing}
                    onOpenListing={onOpenListing}
                    onDiscardListing={onDiscardListing}
                    handleDeleteListing={handleDeleteListing}
                    onHideListing={onHideListing}
                    hasOpeningError={openingErrorListingId.uuid === l.id.uuid}
                    hasDiscardingError={discardingErrorListingId.uuid === l.id.uuid}
                    hasDeletingError={deletingErrorListingId.uuid === l.id.uuid}
                    hasHidingError={hidingErrorListingId.uuid === l.id.uuid}
                    hasClosingError={closingErrorListingId.uuid === l.id.uuid}
                    renderSizes={renderSizes}
                  />
                ))}
              </div>
              {paginationLinks}
            </div>
            <ConfirmationModal
              id="ConfirmationModal"
              isOpen={this.state.showConfirmDeleteModal}
              onCloseModal={() => this.setState({ showConfirmDeleteModal: false })}
              onManageDisableScrolling={onManageDisableScrolling}
              negativeAction={() => onDeleteListing(this.state.deleteListingId, listingType)}
              affirmativeButtonText={'Cancel'}
              negativeButtonText={`Delete this ${listingType}`}
              affirmativeInProgress={null}
              negativeInProgress={deletingListing}
              affirmativeError={null}
              negativeError={deletingListingError}
              titleText={<FormattedMessage id="ManageListingspage.deleteConfirmationTitle" />}
              contentText={<FormattedMessage id="ManageListingspage.deleteConfirmationSubTitle" />}
            />
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSideNavigation>
      </Page>
    );
  }
}

ManageListingsPageComponent.defaultProps = {
  listings: [],
  pagination: null,
  queryListingsError: null,
  queryParams: null,
  closingListing: null,
  closingListingError: null,
  openingListing: null,
  openingListingError: null,
};

const { arrayOf, bool, func, object, shape, string } = PropTypes;

ManageListingsPageComponent.propTypes = {
  closingListing: shape({ uuid: string.isRequired }),
  closingListingError: shape({
    listingId: propTypes.uuid.isRequired,
    error: propTypes.error.isRequired,
  }),
  listings: arrayOf(propTypes.ownListing),
  onCloseListing: func.isRequired,
  onOpenListing: func.isRequired,
  openingListing: shape({ uuid: string.isRequired }),
  openingListingError: shape({
    listingId: propTypes.uuid.isRequired,
    error: propTypes.error.isRequired,
  }),
  pagination: propTypes.pagination,
  queryInProgress: bool.isRequired,
  queryListingsError: propTypes.error,
  queryParams: object,
  scrollingDisabled: bool.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    currentPageResultIds,
    pagination,
    queryInProgress,
    queryListingsError,
    queryParams,
    openingListing,
    openingListingError,
    closingListing,
    closingListingError,

    discardingListing,
    discardingListingError,
    deletingListing,
    deletingListingError,
    hidingListing,
    hidingListingError,
  } = state.ManageListingsPage;
  const { currentUserNotificationCount: providerNotificationCount } = state.user;

  const listings = getOwnListingsById(state, currentPageResultIds);
  return {
    currentPageResultIds,
    listings,
    pagination,
    queryInProgress,
    queryListingsError,
    queryParams,
    scrollingDisabled: isScrollingDisabled(state),
    openingListing,
    openingListingError,
    closingListing,
    closingListingError,
    providerNotificationCount,

    discardingListing,
    discardingListingError,

    deletingListing,
    deletingListingError,
    hidingListing,
    hidingListingError,
  };
};

const mapDispatchToProps = dispatch => ({
  onOpenListing: listingId => dispatch(openListing(listingId)),
  onCloseListing: listingId => dispatch(closeListing(listingId)),
  onDiscardListing: listingId => dispatch(discardListing(listingId)),
  onDeleteListing: (listingId, listingType) => dispatch(deleteListing(listingId, listingType)),
  onHideListing: (listingId, listingType, hide) =>
    dispatch(hideListing(listingId, listingType, hide)),
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
});

const ManageListingsPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(ManageListingsPageComponent);

export default ManageListingsPage;
