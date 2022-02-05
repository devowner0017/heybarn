import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import routeConfiguration from '../../routeConfiguration';
import {
  LINE_ITEM_NIGHT,
  LINE_ITEM_DAY,
  LISTING_STATE_PENDING_APPROVAL,
  LISTING_STATE_CLOSED,
  LISTING_STATE_DRAFT,
  LISTING_UNDER_ENQUIRY,
  propTypes,
  LISTING_UNDER_OFFER,
  LISTING_RENTAL_AGREEMENT_REQUESTED,
} from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureOwnListing } from '../../util/data';
import {
  LISTING_PAGE_PENDING_APPROVAL_VARIANT,
  LISTING_PAGE_DRAFT_VARIANT,
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_EDIT,
  createSlug,
} from '../../util/urlHelpers';
import { createResourceLocatorString, findRouteByRouteName } from '../../util/routes';
import config from '../../config';
import {
  InlineTextButton,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
  IconSpinner,
  ResponsiveImage,
  Button,
} from '../../components';

import MenuIcon from './MenuIcon';
import Overlay from './Overlay';
import css from './ManageListingCard.module.css';
import { getPropByName } from '../../util/devHelpers';

// Menu content needs the same padding
const MENU_CONTENT_OFFSET = -12;
const MAX_LENGTH_FOR_WORDS_IN_TITLE = 7;

const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: intl.formatMessage(
        { id: 'ManageListingCard.unsupportedPrice' },
        { currency: price.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'ManageListingCard.unsupportedPriceTitle' },
        { currency: price.currency }
      ),
    };
  }
  return {};
};

const createListingURL = (routes, listing) => {
  const id = listing.id.uuid;
  const slug = createSlug(listing.attributes.title);
  const isPendingApproval = listing.attributes.state === LISTING_STATE_PENDING_APPROVAL;
  const isDraft = listing.attributes.state === LISTING_STATE_DRAFT;
  const variant = isDraft
    ? LISTING_PAGE_DRAFT_VARIANT
    : isPendingApproval
    ? LISTING_PAGE_PENDING_APPROVAL_VARIANT
    : null;

  const linkProps =
    isPendingApproval || isDraft
      ? {
          name: 'ListingPageVariant',
          params: {
            id,
            slug,
            variant,
          },
        }
      : {
          name: 'ListingPage',
          params: { id, slug },
        };

  return createResourceLocatorString(linkProps.name, routes, linkProps.params, {});
};

const createTransactionURL = (routes, listing) => {
  const publicData = getPropByName(listing, 'publicData');
  const { transactionId } = publicData;

  const linkProps = transactionId && {
    name: 'SaleDetailsPage',
    params: {
      id: transactionId,
    },
  };
  return !!linkProps && createResourceLocatorString(linkProps.name, routes, linkProps.params, {});
};

// Cards are not fixed sizes - So, long words in title make flexboxed items to grow too big.
// 1. We split title to an array of words and spaces.
//    "foo bar".split(/([^\s]+)/gi) => ["", "foo", " ", "bar", ""]
// 2. Then we break long words by adding a '<span>' with word-break: 'break-all';
const formatTitle = (title, maxLength) => {
  const nonWhiteSpaceSequence = /([^\s]+)/gi;
  return title.split(nonWhiteSpaceSequence).map((word, index) => {
    return word.length > maxLength ? (
      <span key={index} style={{ wordBreak: 'break-all' }}>
        {word}
      </span>
    ) : (
      word
    );
  });
};

export const ManageListingCardComponent = props => {
  const {
    className,
    rootClassName,
    hasClosingError,
    hasOpeningError,
    hasDiscardingError,
    hasDeletingError,
    history,
    intl,
    isMenuOpen,
    actionsInProgressListingId,
    listing,
    onCloseListing,
    onOpenListing,
    onHideListing,
    onDiscardListing,
    handleDeleteListing,
    onToggleMenu,
    renderSizes,
  } = props;
  console.log('🚀 | file: ManageListingCard.js | line 149 | props', props);

  const currentListing = ensureOwnListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', price, state, publicData } = currentListing.attributes;
  if (!publicData) return null;
  const { listingState, listingType, transactionId, notHidden } = publicData;
  const isHidden = notHidden === false
  console.log("🚀 | file: ManageListingCard.js | line 157 | publicData", publicData);
  const slug = createSlug(title);
  const isPendingApproval = state === LISTING_STATE_PENDING_APPROVAL;
  const isClosed = state === LISTING_STATE_CLOSED;
  const isDraft = state === LISTING_STATE_DRAFT;
  const isUnderEnquiry = listingState === LISTING_UNDER_ENQUIRY;
  const isUnderOffer = listingState === LISTING_UNDER_OFFER;
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;
  const menuItemClasses = classNames(css.menuItem, {
    [css.menuItemDisabled]: !!actionsInProgressListingId,
  });
  const transactionUrl = createTransactionURL(routeConfiguration(), currentListing);
  const { formattedPrice, priceTitle } = priceData(price, intl);
  const hasError = hasOpeningError || hasClosingError || hasDiscardingError || hasDeletingError;
  const thisListingInProgress =
    actionsInProgressListingId && actionsInProgressListingId.uuid === id;

  const classes = classNames(rootClassName || css.root, className);

  const onOverListingLink = () => {
    // Enforce preloading of ListingPage (loadable component)
    const { component: Page } = findRouteByRouteName('ListingPage', routeConfiguration());
    // Loadable Component has a "preload" function.
    if (Page.preload) {
      Page.preload();
    }
  };

  const titleClasses = classNames(css.title, {
    [css.titlePending]: isPendingApproval,
    [css.titleDraft]: isDraft,
  });

  const editListingLinkType = isDraft
    ? LISTING_PAGE_PARAM_TYPE_DRAFT
    : LISTING_PAGE_PARAM_TYPE_EDIT;

  const unitType = config.bookingUnitType;
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY;
  const isWeekly = true;

  const unitTranslationKey = isWeekly
    ? 'ManageListingCard.perWeek'
    : isNightly
    ? 'ManageListingCard.perNight'
    : isDaily
    ? 'ManageListingCard.perDay'
    : 'ManageListingCard.perUnit';

  const draftMenu = (
    <>
      <div className={classNames(css.menuOverlayWrapper, { [css.menuOverlayOpen]: isMenuOpen })}>
        <div className={classNames(css.menuOverlay)} />
        <div className={css.menuOverlayContent}>
          <FormattedMessage id={`ManageListingCard.view${listingType}`} />
        </div>
      </div>
      <div className={css.menubarWrapperDraft}>
        <div className={css.menubarGradient} />
        <div className={css.menubar}>
          <Menu
            className={classNames(css.menu, { [css.cardIsOpen]: !isClosed })}
            contentPlacementOffset={MENU_CONTENT_OFFSET}
            contentPosition="left"
            useArrow={false}
            onToggleActive={isOpen => {
              const listingOpen = isOpen ? currentListing : null;
              onToggleMenu(listingOpen);
            }}
            isOpen={isMenuOpen}
          >
            <MenuLabel className={css.menuLabel} isOpenClassName={css.listingMenuIsOpen}>
              <div className={css.iconWrapper}>
                <MenuIcon className={css.menuIcon} isActive={isMenuOpen} />
              </div>
            </MenuLabel>
            <MenuContent rootClassName={css.menuContent}>
              <MenuItem key="discard-draft">
                <InlineTextButton
                  rootClassName={menuItemClasses}
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!actionsInProgressListingId) {
                      onToggleMenu(null);
                      onDiscardListing(currentListing.id);
                    }
                  }}
                >
                  <FormattedMessage id={`ManageListingCard.discard`} />
                </InlineTextButton>
              </MenuItem>
            </MenuContent>
          </Menu>
        </div>
      </div>
    </>
  );

  return (
    <div className={classes}>
      {isUnderEnquiry ? (
        <Overlay
          message={intl.formatMessage({ id: `ManageListingCard.${listingType}UnderEnquiry` })}
        >
          <NamedLink
            className={css.finishListingDraftLink}
            name="SaleDetailsPage"
            params={{ id: transactionId }}
          >
            <FormattedMessage id={`ManageListingCard.respondToEnquiry`} />
          </NamedLink>
        </Overlay>
      ) : isUnderOffer ? (
        <Overlay message={intl.formatMessage({ id: `ManageListingCard.${listingType}UnderOffer` })}>
          <NamedLink
            className={css.finishListingDraftLink}
            name="SaleDetailsPage"
            params={{ id: transactionId }}
          >
            <FormattedMessage id={`ManageListingCard.respondToEnquiry`} />
          </NamedLink>
        </Overlay>
      ) : isHidden ?  (
        <Overlay
          message={intl.formatMessage(
            { id: `ManageListingCard.hidden${listingType}` },
            { listingTitle: title }
          )}
        >
          <NamedLink
            name={listingType === 'listing' ? 'EditListingPage' : 'EditAdvertPage'}
            params={{ id, slug, type: editListingLinkType, tab: 'description' }}
          >
            <Button className={css.doubleMenuButton}>Edit it</Button>
          </NamedLink>
          <Button
            className={css.doubleMenuButton}
            disabled={!!actionsInProgressListingId}
            onClick={event => {
              if (!actionsInProgressListingId) {
                onHideListing(currentListing.id, listingType, true);
              }
            }}
          >
            <FormattedMessage id={`ManageListingCard.unhide${listingType}`} />
          </Button>
        </Overlay>
      ) : isDraft ? (
        <React.Fragment>
          <div className={classNames({ [css.draftNoImage]: !firstImage })} />
          {draftMenu}

          <Overlay
            message={intl.formatMessage(
              { id: 'ManageListingCard.draftOverlayText' },
              { listingType }
            )}
          >
            <NamedLink
              className={css.finishListingDraftLink}
              name={listingType === 'listing' ? 'EditListingPage' : 'EditAdvertPage'}
              params={{ id, slug, type: LISTING_PAGE_PARAM_TYPE_DRAFT, tab: 'photos' }}
            >
              <FormattedMessage id={`ManageListingCard.finish${listingType}Draft`} />
            </NamedLink>
          </Overlay>
        </React.Fragment>
      ) : isClosed ? (
        <Overlay
          message={intl.formatMessage(
            { id: `ManageListingCard.closed${listingType}` },
            { listingTitle: title }
          )}
        >
          <button
            className={css.openListingButton}
            disabled={!!actionsInProgressListingId}
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
              if (!actionsInProgressListingId) {
                onOpenListing(currentListing.id);
              }
            }}
          >
            <FormattedMessage id={`ManageListingCard.open${listingType}`} />
          </button>
        </Overlay>
      ) : null}
      {isPendingApproval ? (
        <Overlay
          message={intl.formatMessage(
            { id: 'ManageListingCard.pendingApproval' },
            { listingTitle: title }
          )}
        />
      ) : null}
      {thisListingInProgress ? (
        <Overlay>
          <IconSpinner />
        </Overlay>
      ) : hasError ? (
        <Overlay errorMessage={intl.formatMessage({ id: 'ManageListingCard.actionFailed' })} />
      ) : null}
      <div
        className={css.threeToTwoWrapper}
        tabIndex={0}
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();

          // ManageListingCard contains links, buttons and elements that are working with routing.
          // This card doesn't work if <a> or <button> is used to wrap events that are card 'clicks'.
          //
          // NOTE: It might be better to absolute-position those buttons over a card-links.
          // (So, that they have no parent-child relationship - like '<a>bla<a>blaa</a></a>')
          history.push(createListingURL(routeConfiguration(), listing));
        }}
        onMouseOver={onOverListingLink}
        onTouchStart={onOverListingLink}
      >
        <div className={css.aspectWrapper}>
          <ResponsiveImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
        </div>
        {!isDraft && (
          <>
            <div
              className={classNames(css.menuOverlayWrapper, { [css.menuOverlayOpen]: isMenuOpen })}
            >
              <div className={classNames(css.menuOverlay)} />
              <div className={css.menuOverlayContent}>
                <FormattedMessage id={`ManageListingCard.view${listingType}`} />
              </div>
            </div>
            <div className={css.menubarWrapper}>
              <div className={css.menubarGradient} />
              <div className={css.menubar}>
                <Menu
                  className={classNames(css.menu, { [css.cardIsOpen]: !isClosed })}
                  contentPlacementOffset={MENU_CONTENT_OFFSET}
                  contentPosition="left"
                  useArrow={false}
                  onToggleActive={isOpen => {
                    const listingOpen = isOpen ? currentListing : null;
                    onToggleMenu(listingOpen);
                  }}
                  isOpen={isMenuOpen}
                >
                  <MenuLabel className={css.menuLabel} isOpenClassName={css.listingMenuIsOpen}>
                    <div className={css.iconWrapper}>
                      <MenuIcon className={css.menuIcon} isActive={isMenuOpen} />
                    </div>
                  </MenuLabel>
                  <MenuContent rootClassName={css.menuContent}>
                    <MenuItem key="close-listing">
                      <InlineTextButton
                        rootClassName={menuItemClasses}
                        onClick={event => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (!actionsInProgressListingId) {
                            onToggleMenu(null);
                            onCloseListing(currentListing.id);
                          }
                        }}
                      >
                        <FormattedMessage id={`ManageListingCard.close${listingType}`} />
                      </InlineTextButton>
                    </MenuItem>
                    <MenuItem key="hide-listing">
                      <InlineTextButton
                        rootClassName={menuItemClasses}
                        onClick={event => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (!actionsInProgressListingId) {
                            onToggleMenu(null);
                            onHideListing(currentListing.id, listingType, false);
                          }
                        }}
                      >
                        <FormattedMessage id={`ManageListingCard.hide`} />
                      </InlineTextButton>
                    </MenuItem>
                    <MenuItem key="delete-listing">
                      <InlineTextButton
                        rootClassName={menuItemClasses}
                        onClick={event => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (!actionsInProgressListingId) {
                            onToggleMenu(null);
                            handleDeleteListing(currentListing.id);
                          }
                        }}
                      >
                        <FormattedMessage id={`ManageListingCard.delete`} />
                      </InlineTextButton>
                    </MenuItem>
                  </MenuContent>
                </Menu>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={css.info}>
        <div className={css.mainInfo}>
          <div className={css.titleWrapper}>
            <InlineTextButton
              rootClassName={titleClasses}
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                history.push(createListingURL(routeConfiguration(), listing));
              }}
            >
              {formatTitle(title, MAX_LENGTH_FOR_WORDS_IN_TITLE)}
            </InlineTextButton>
          </div>
        </div>

        <div className={css.manageLinks}>
          <NamedLink
            className={css.manageLink}
            name="EditListingPage"
            params={{ id, slug, type: editListingLinkType, tab: 'description' }}
          >
            <FormattedMessage id={`ManageListingCard.edit${listingType}`} />
          </NamedLink>

          {listingType === 'listing' && (
            <div className={css.price}>
              {formattedPrice ? (
                <React.Fragment>
                  <div className={css.priceValue} title={priceTitle}>
                    {formattedPrice}
                  </div>
                  <div className={css.perUnit}>
                    <FormattedMessage id={unitTranslationKey} />
                  </div>
                </React.Fragment>
              ) : (
                <div className={css.noPrice}>
                  <FormattedMessage id="ManageListingCard.priceNotSet" />
                </div>
              )}
            </div>
          )}

          {/* {availabilityEnabled ? (
            <React.Fragment>
              <span className={css.manageLinksSeparator}>{' • '}</span>

              <NamedLink
                className={css.manageLink}
                name="EditListingPage"
                params={{ id, slug, type: editListingLinkType, tab: 'availability' }}
              >
                <FormattedMessage id="ManageListingCard.manageAvailability" />
              </NamedLink>
            </React.Fragment>
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

ManageListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  actionsInProgressListingId: null,
  renderSizes: null,
  availabilityEnabled: config.enableAvailability,
};

const { bool, func, shape, string } = PropTypes;

ManageListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  hasClosingError: bool.isRequired,
  hasOpeningError: bool.isRequired,
  intl: intlShape.isRequired,
  listing: propTypes.ownListing.isRequired,
  isMenuOpen: bool.isRequired,
  actionsInProgressListingId: shape({ uuid: string.isRequired }),
  onCloseListing: func.isRequired,
  onOpenListing: func.isRequired,
  onToggleMenu: func.isRequired,
  availabilityEnabled: bool,

  // Responsive image sizes hint
  renderSizes: string,

  // from withRouter
  history: shape({
    sh: func.isRequired,
  }).isRequired,
};

export default compose(withRouter, injectIntl)(ManageListingCardComponent);
