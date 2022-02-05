import React from 'react';
import { bool, oneOfType, object } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import {
  LISTING_STATE_PENDING_APPROVAL,
  LISTING_STATE_CLOSED,
  LISTING_STATE_DRAFT,
  propTypes,
} from '../../util/types';
import { NamedLink } from '../../components';
import EditIcon from './EditIcon';

import css from './ListingPage.module.css';
import { capitalize } from 'lodash';

export const ActionBarMaybe = props => {
  const {
    isOwnListing,
    listingUnderEnquiry,
    listing,
    editParams,
    currentUserInTransaction,
    typeOfListing,
  } = props;
  console.log(
    '🚀 | file: ActionBarMaybe.js | line 24 | currentUserInTransaction',
    currentUserInTransaction
  );
  const state = listing.attributes.state;
  const isPendingApproval = state === LISTING_STATE_PENDING_APPROVAL;
  const isClosed = state === LISTING_STATE_CLOSED;
  const isDraft = state === LISTING_STATE_DRAFT;
  const isHidden = listing.attributes.publicData.notHidden === false;
  if (isOwnListing) {
    let ownListingTextTranslationId = 'ListingPage.ownListing';
    if (isPendingApproval) {
      ownListingTextTranslationId = 'ListingPage.ownListingPendingApproval';
    } else if (isClosed) {
      ownListingTextTranslationId = 'ListingPage.ownClosedListing';
    } else if (isDraft) {
      ownListingTextTranslationId = 'ListingPage.ownListingDraft';
    }
    let ownListingAdditionalText = null;
    if (isHidden) {
      ownListingAdditionalText = 'ListingPage.hiddenListing';
    }

    const message = isDraft ? 'ListingPage.finishListing' : 'ListingPage.editListing';

    const ownListingTextClasses = classNames(css.ownListingText, {
      [css.ownListingTextPendingApproval]: isPendingApproval,
    });
    console.log(capitalize(typeOfListing));
    return (
      <div className={css.actionBar}>
        <p className={ownListingTextClasses}>
          <FormattedMessage id={ownListingTextTranslationId} values={{ typeOfListing }} />
          {ownListingAdditionalText && (
            <FormattedMessage id={ownListingAdditionalText} values={{ typeOfListing }} />
          )}
        </p>
        <NamedLink
          className={css.editListingLink}
          name={`Edit${capitalize(typeOfListing)}Page`}
          params={editParams}
        >
          <EditIcon className={css.editIcon} />
          <FormattedMessage id={message} values={{ typeOfListing }} />
        </NamedLink>
      </div>
    );
  } else if (!!currentUserInTransaction) {
    return (
      <div className={css.actionBar}>
        <p className={css.closedListingText}>
          <FormattedMessage id="ListingPage.currentUserInTransaction" values={{ typeOfListing }} />
        </p>
      </div>
    );
  } else if (isClosed) {
    return (
      <div className={css.actionBar}>
        <p className={css.closedListingText}>
          <FormattedMessage id="ListingPage.closedListing" values={{ typeOfListing }} />
        </p>
      </div>
    );
  } else if (listingUnderEnquiry) {
    return (
      <div className={css.actionBar}>
        <p className={css.closedListingText}>
          <FormattedMessage id="ListingPage.listingUnderEnquiry" values={{ typeOfListing }} />
        </p>
      </div>
    );
  }
  return null;
};

ActionBarMaybe.propTypes = {
  isOwnListing: bool.isRequired,
  listing: oneOfType([propTypes.listing, propTypes.ownListing]).isRequired,
  editParams: object.isRequired,
};

ActionBarMaybe.displayName = 'ActionBarMaybe';

export default ActionBarMaybe;
