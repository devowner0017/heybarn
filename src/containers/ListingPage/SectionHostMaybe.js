import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { UserCard, Modal } from '../../components';
import { EnquiryForm } from '../../forms';

import css from './ListingPage.module.css';

const SectionHostMaybe = props => {
  const {
    listing,
    currentUser,
    listingType,
  } = props;

  if (!listing.author) {
    return null;
  }

  return (
    <div id="host" className={css.sectionHost}>
      <h2 className={css.yourHostHeading}>
        <FormattedMessage id={`ListingPage.${listingType}yourHostHeading`} />
      </h2>
      <UserCard user={listing.author} currentUser={currentUser}  />
    </div>
  );
};

export default SectionHostMaybe;
