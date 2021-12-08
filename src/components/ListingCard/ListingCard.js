import React, { Component, useCallback } from 'react';
import { string, func } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { LINE_ITEM_DAY, LINE_ITEM_NIGHT, LISTING_UNDER_ENQUIRY, propTypes } from '../../util/types';
import { formatMoney, formatMoneyShort } from '../../util/currency';
import { ensureListing, ensureUser } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import config from '../../config';
import { NamedLink, ResponsiveImage, Avatar } from '../../components';
import Overlay from './Overlay';

import css from './ListingCard.module.css';
import { capitalize } from 'lodash';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price, 0, true);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: intl.formatMessage(
        { id: 'ListingCard.unsupportedPrice' },
        { currency: price.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'ListingCard.unsupportedPriceTitle' },
        { currency: price.currency }
      ),
    };
  }
  return {};
};

class ListingImage extends Component {
  render() {
    return <ResponsiveImage {...this.props} />;
  }
}
const LazyImage = lazyLoadWithDimensions(ListingImage, { loadAfterInitialRendering: 3000 });

export const ListingCardComponent = props => {
  const {
    className,
    rootClassName,
    intl,
    listing,
    renderSizes,
    setActiveListing,
    minInfo,
    showAvatar,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', price, publicData } = currentListing.attributes;
  const { listingType, locRegion: region, preferredUse: need, listingState } = publicData || {};
  const slug = createSlug(title);
  const author = ensureUser(listing.author);
  const authorName = author.attributes.profile.displayName;
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

  const { formattedPrice, priceTitle } = priceData(price, intl);

  const unitType = config.bookingUnitType;
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY;
  const isWeekly = true;
  const unitTranslationKey = isWeekly
    ? 'ListingCard.perWeek'
    : isNightly
    ? 'ListingCard.perNight'
    : isDaily
    ? 'ListingCard.perDay'
    : 'ListingCard.perUnit';
  const listingUnderEnquiry = listingState === LISTING_UNDER_ENQUIRY;
  const useLink = minInfo || !listingUnderEnquiry;
  console.log("🚀 | file: ListingCard.js | line 83 |  !minInfo",  !minInfo);
  console.log("🚀 | file: ListingCard.js | line 83 |  !listingUnderEnquiry",  !listingUnderEnquiry);
  console.log("🚀 | file: ListingCard.js | line 83 |  !minInfo || !listingUnderEnquiry",  !minInfo || !listingUnderEnquiry);
  const ConditionalWrapper = useCallback(
    ({ condition, wrapper, defaultWrapper, children }) => {
      return condition ? wrapper(children) : !!defaultWrapper ? defaultWrapper(children) : children;
    },
    [listingUnderEnquiry]
  );
  return (
    <ConditionalWrapper
      condition={useLink}
      wrapper={children => {
        return (
          <NamedLink
            className={classes}
            name={`${capitalize(listingType)}Page`}
            params={{ id, slug }}
          >
            {children}
          </NamedLink>
        );
      }}
      defaultWrapper={children => <div className={classes}>{children}</div>}
    >
      <div
        className={css.threeToTwoWrapper}
        onMouseEnter={() => setActiveListing(currentListing.id)}
        onMouseLeave={() => setActiveListing(null)}
        id="listingCard"
      >
        {listingUnderEnquiry && !minInfo && (
          <Overlay
            message={intl.formatMessage({ id: `ManageListingCard.${listingType}UnderEnquiry` })}
          ></Overlay>
        )}
        <div className={css.aspectWrapper}>
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
        </div>
        {showAvatar && <Avatar className={css.avatar} user={listing.author} />}
      </div>
      {minInfo ? (
        // TODO FIX THIS
        'TEST'
      ) : (
        <div className={css.info}>
          <div className={css.mainInfo}>
            <div className={css.title}>
              {richText(title, {
                longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
                longWordClass: css.longWord,
              })}
            </div>
            <div className={css.authorInfo}>
              <FormattedMessage
                id={`ListingCard.${listingType}By`}
                values={{ need: capitalize(need), region: capitalize(region), authorName }}
              />
            </div>
          </div>
          {listingType === 'listing' && (
            <>
              <div className={css.price}>
                <div className={css.priceValue} title={priceTitle}>
                  {formattedPrice}
                </div>
                <div className={css.perUnit}>
                  <FormattedMessage id={unitTranslationKey} />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </ConditionalWrapper>
  );
};

ListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  setActiveListing: () => null,
};

ListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(ListingCardComponent);
