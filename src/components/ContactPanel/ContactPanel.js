import React, { useState } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { arrayOf, array, bool, func, node, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { propTypes, LISTING_STATE_CLOSED, LINE_ITEM_NIGHT, LINE_ITEM_DAY } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { parse, stringify } from '../../util/urlHelpers';
import config from '../../config';
import { ModalInMobile, Button, NamedLink, SecondaryButton } from '..';
import { BookingDatesForm } from '../../forms';

import css from './ContactPanel.module.css';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { getPropByName } from '../../util/devHelpers';

// This defines when ModalInMobile shows content as Modal
const MODAL_BREAKPOINT = 1023;

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

const openBookModal = (isOwnListing, isClosed, history, location) => {
  if (isOwnListing || isClosed) {
    window.scrollTo(0, 0);
  } else {
    const { pathname, search, state } = location;
    const searchString = `?${stringify({ ...parse(search), book: true })}`;
    history.push(`${pathname}${searchString}`, state);
  }
};

const closeBookModal = (history, location) => {
  const { pathname, search, state } = location;
  const searchParams = omit(parse(search), 'book');
  const searchString = `?${stringify(searchParams)}`;
  history.push(`${pathname}${searchString}`, state);
};

const ContactPanel = props => {
  const {
    rootClassName,
    className,
    titleClassName,
    listing,
    isOwnListing,
    listingUnderEnquiry,
    unitType,
    onSubmit,
    title,
    subTitle,
    authorDisplayName,
    onManageDisableScrolling,
    timeSlots,
    fetchTimeSlotsError,
    history,
    location,
    intl,
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
  } = props;
  console.log(
    '🚀 | file: ContactPanel.js | line 75 | currentUserInTransaction',
    currentUserInTransaction
  );
  const [showConfirmActionModal, setShowConfirmActionModal] = useState(false);
  const [confirmProps, setConfirmProps] = useState(false);
  const price = listing.attributes.price;
  const hasListingState = !!listing.attributes.state;
  const isClosed = hasListingState && listing.attributes.state === LISTING_STATE_CLOSED;
  const showBookingDatesForm = hasListingState && !isClosed;
  const showClosedListingHelpText = listing.id && isClosed;
  const { formattedPrice, priceTitle } = priceData(price, intl);
  const isBook = !!parse(location.search).book;
  const listingType = getPropByName(listing, 'listingType');
  const publicData = getPropByName(listing, 'publicData');
  console.log('🚀 | file: ContactPanel.js | line 100 | publicData', publicData);
  const isHidden = publicData.notHidden === false;
  console.log('🚀 | file: ContactPanel.js | line 99 | listing', listing);
  console.log(
    "🚀 | file: ContactPanel.js | line 99 | getPropByName(listing, 'notHidden')",
    getPropByName(publicData, 'notHidden')
  );
  console.log('🚀 | file: ContactPanel.js | line 99 | isHidden', isHidden);
  const subTitleText = !!subTitle
    ? subTitle
    : showClosedListingHelpText
    ? intl.formatMessage({ id: 'ContactPanel.subTitleClosedListing' })
    : null;

  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY;
  const isWeekly = true;

  const unitTranslationKey = isWeekly
    ? 'ContactPanel.perWeek'
    : isNightly
    ? 'ContactPanel.perNight'
    : isDaily
    ? 'ContactPanel.perDay'
    : 'ContactPanel.perUnit';
  const classes = classNames(rootClassName || css.root, className);
  const titleClasses = classNames(titleClassName || css.bookingTitle);
  const handleTogglePrivate = func => {
    func().then(() => {
      requestShowListing(listing.id, isOwnListing);
    });
  };
  const handleMakePrivate = () => {
    setConfirmProps({
      negativeAction: _ =>
        handleTogglePrivate(async _ => await onHideListing(listing.id, listingType, false)),
      affirmativeButtonText: 'Cancel',
      negativeButtonText: `Hide this ${listingType}`,
      affirmativeInProgress: null,
      negativeInProgress: hidingListing,
      affirmativeError: null,
      negativeError: hidingListingError,
      titleText: <FormattedMessage id="ListingPage.hideConfirmationTitle" values={{listingType: listingType}}/>,
      contentText: <FormattedMessage id="ListingPage.hideConfirmationSubTitle" values={{listingType: listingType}}/>,
    });
    setShowConfirmActionModal(true);
  };
  const handleMakePublic = () => {
    setConfirmProps({
      affirmativeAction: _ =>
        handleTogglePrivate(async _ => await onHideListing(listing.id, listingType, true)),
      affirmativeButtonText: `Open this ${listingType}`,
      negativeButtonText: 'Cancel',
      affirmativeInProgress: hidingListing,
      negativeInProgress: null,
      affirmativeError: hidingListingError,
      negativeError: null,
      titleText: <FormattedMessage id="ListingPage.openConfirmationTitle" values={{listingType: listingType}}/>,
      contentText: <FormattedMessage id="ListingPage.openConfirmationSubTitle" values={{listingType: listingType}}/>,
    });
    setShowConfirmActionModal(true);
  };
  const handleDeleteListing = () => {
    setConfirmProps({
      negativeAction: _ => onDeleteListing(listing.id.uuid),
      affirmativeButtonText: 'Cancel',
      negativeButtonText: `Delete this ${listingType}`,
      affirmativeInProgress: null,
      negativeInProgress: deletingListing,
      affirmativeError: null,
      negativeError: deletingListingError,
      titleText: <FormattedMessage id="ManageListingspage.deleteConfirmationTitle" values={{listingType: listingType}}/>,
      contentText: <FormattedMessage id="ManageListingspage.deleteConfirmationSubTitle" values={{listingType: listingType}}/>,
    });
    setShowConfirmActionModal(true);
  };
  return (
    <div className={classes}>
      <ModalInMobile
        containerClassName={css.modalContainer}
        id="BookingDatesFormInModal"
        isModalOpenOnMobile={isBook}
        onClose={() => closeBookModal(history, location)}
        showAsModalMaxWidth={MODAL_BREAKPOINT}
        onManageDisableScrolling={onManageDisableScrolling}
      >
        <div className={css.modalHeading}>
          <h1 className={css.title}>{title}</h1>
          <div className={css.author}>
            <FormattedMessage id="ContactPanel.hostedBy" values={{ name: authorDisplayName }} />
          </div>
        </div>

        {!!currentUserInTransaction ? (
          <>
            <div className={css.bookingHeading}>
              <h2 className={titleClasses}>You're already in talks with {authorDisplayName}</h2>

            </div>
            <NamedLink
              className={css.bookButton}
              name={'OrderDetailsPage'}
              params={{ id: currentUserInTransaction.id.uuid }}
            >
              <Button rootClassName={css.bookButton}>
                View Transaction
                {/* <FormattedMessage id="ContactPanel.ctaButtonMessage" /> */}
              </Button>
            </NamedLink>
          </>
        ) : !isOwnListing ? (
          <>
            <div className={css.bookingHeading}>
              <h2 className={titleClasses}>{title}</h2>
              {subTitleText ? <div className={css.bookingHelp}>{subTitleText}</div> : null}
            </div>
            <Button
              rootClassName={css.bookButton}
              disabled={listingUnderEnquiry}
              onClick={onSubmit}
            >
              <FormattedMessage id="ContactPanel.ctaButtonMessage" />
            </Button>
          </>
        ) : (
          <>
            <Button
              rootClassName={css.deleteButton}
              onClick={isHidden ? handleMakePublic : handleMakePrivate}
            >
              {isHidden ? 'Open' : 'Hide'} It?
            </Button>
            <SecondaryButton
              rootClassName={css.deleteButton}
              disabled={listingUnderEnquiry}
              onClick={handleDeleteListing}
            >
              Delete Listing?
            </SecondaryButton>
          </>
        )}
      </ModalInMobile>
      <div className={css.openBookingForm}>
        <div className={css.priceContainer}>
          <div className={css.priceValue} title={priceTitle}>
            {formattedPrice}
          </div>
          <div className={css.perUnit}>
            <FormattedMessage id={unitTranslationKey} />
          </div>
        </div>

        {!!currentUserInTransaction ? (
          <NamedLink
            className={css.bookButton}
            name={'OrderDetailsPage'}
            params={{ id: currentUserInTransaction.id.uuid }}
          >
            <Button rootClassName={css.bookButton}>
              View Transaction
              {/* <FormattedMessage id="ContactPanel.ctaButtonMessage" /> */}
            </Button>
          </NamedLink>
        ) : showBookingDatesForm ? (
          <Button
            rootClassName={css.bookButton}
            disabled={listingUnderEnquiry}
            onClick={() => openBookModal(isOwnListing, isClosed, history, location)}
          >
            MOBILE
            <FormattedMessage id="ContactPanel.ctaButtonMessage" />
          </Button>
        ) : isClosed ? (
          <div className={css.closedListingButton}>
            <FormattedMessage id="ContactPanel.closedListingButtonText" />
          </div>
        ) : null}
      </div>
      <ConfirmationModal
        id="ConfirmationModal"
        isOpen={showConfirmActionModal}
        onCloseModal={() => setShowConfirmActionModal(false)}
        onManageDisableScrolling={onManageDisableScrolling}
        {...confirmProps}
      />
    </div>
  );
};

ContactPanel.defaultProps = {
  rootClassName: null,
  className: null,
  titleClassName: null,
  isOwnListing: false,
  subTitle: null,
  unitType: config.bookingUnitType,
  timeSlots: null,
  fetchTimeSlotsError: null,
  lineItems: null,
  fetchLineItemsError: null,
};

ContactPanel.propTypes = {
  rootClassName: string,
  className: string,
  titleClassName: string,
  listing: oneOfType([propTypes.listing, propTypes.ownListing]),
  isOwnListing: bool,
  unitType: propTypes.bookingUnitType,
  onSubmit: func.isRequired,
  title: oneOfType([node, string]).isRequired,
  subTitle: oneOfType([node, string]),
  authorDisplayName: oneOfType([node, string]).isRequired,
  onManageDisableScrolling: func.isRequired,
  timeSlots: arrayOf(propTypes.timeSlot),
  fetchTimeSlotsError: propTypes.error,
  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default compose(withRouter, injectIntl)(ContactPanel);
