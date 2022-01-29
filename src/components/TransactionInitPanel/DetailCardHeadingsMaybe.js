import React from 'react';
import { getPropByName } from '../../util/devHelpers';
import AddressLinkMaybe from './AddressLinkMaybe';

import css from './TransactionInitPanel.module.css';

// Functional component as a helper to build detail card headings
const DetailCardHeadingsMaybe = props => {
  const {
    showDetailCardHeadings,
    listingTitle,
    subTitle,
    location,
    geolocation,
    showAddress,
    listing,
  } = props;
  console.log('🚀 | file: DetailCardHeadingsMaybe.js | line 18 | listing', listing);
  const publicData = getPropByName(listing, 'publicData');
  console.log('🚀 | file: DetailCardHeadingsMaybe.js | line 19 | publicData', publicData);
  const { sizeOfSpace } = publicData || {};
  return showDetailCardHeadings ? (
    <div className={css.detailCardHeadings}>
      <h2 className={css.detailCardTitle}>{listingTitle}</h2>
      <AddressLinkMaybe location={location} geolocation={geolocation} showAddress={showAddress} />
      {sizeOfSpace && (
        <div className={css.detailRow}>
          <p>Size (m2):</p>
          <p>{sizeOfSpace}</p>
        </div>
      )}
      {subTitle && (
        <>
          <hr />
          <div className={css.detailRow}>
            <p>Weekly price</p>
            <p className={css.detailCardSubtitle}>{subTitle}</p>
          </div>
        </>
      )}
    </div>
  ) : null;
};

export default DetailCardHeadingsMaybe;
