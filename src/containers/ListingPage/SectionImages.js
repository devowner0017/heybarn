import React from 'react';
import { useHistory } from 'react-router-dom';

import { FormattedMessage } from '../../util/reactIntl';
import { ResponsiveImage, Modal, ImageCarousel, InlineTextButton } from '../../components';
import ActionBarMaybe from './ActionBarMaybe';

import css from './ListingPage.module.css';

import creativeImage from './../../assets/creative.png';
import eventImage from './../../assets/event.png';
import storageImage from './../../assets/storage.png';
import workImage from './../../assets/work.png';

const SectionImages = props => {
  const {
    title,
    listing,
    isOwnListing,
    listingUnderEnquiry,
    handleViewPhotosClick,
    imageCarouselOpen,
    onImageCarouselClose,
    onManageDisableScrolling,
    currentUserInTransaction,
    typeOfListing,
    fromPage,
    need,
  } = props;
  const history = useHistory();

  const hasImages = listing.images && listing.images.length > 0;
  const firstImage = hasImages ? listing.images[0] : null;
  const defaultImage = () => {
    if (need && need.length > 0) {
      if (need[0] === 'creative') {
        return creativeImage;
      } else if (need[0] === 'event') {
        return eventImage;
      } else if (need[0] === 'storage') {
        return storageImage;
      } else if (need[0] === 'work') {
        return workImage;
      }
    }
  }

  // Action bar is wrapped with a div that prevents the click events
  // to the parent that would otherwise open the image carousel
  const actionBar = listing.id ? (
    <div onClick={e => e.stopPropagation()}>
      <ActionBarMaybe isOwnListing={isOwnListing} listing={listing} typeOfListing={typeOfListing} />
    </div>
  ) : null;
  const listingStateBar = listing.id ? (
    <div onClick={e => e.stopPropagation()}>
      <ActionBarMaybe
        listingUnderEnquiry={listingUnderEnquiry}
        isOwnListing={isOwnListing}
        currentUserInTransaction={currentUserInTransaction}
        listing={listing}
        typeOfListing={typeOfListing}
      />
    </div>
  ) : null;
  const viewPhotosButton = hasImages ? (
    <button className={css.viewPhotos} onClick={handleViewPhotosClick}>
      <FormattedMessage
        id="ListingPage.viewImagesButton"
        values={{ count: listing.images.length }}
      />
    </button>
  ) : null;

  return (
    <div className={css.sectionImages}>
      <InlineTextButton
        className={css.backButton}
        onClick={e => {
          e.preventDefault();
          if (fromPage) {
            history.push(fromPage);
          } else {
            history.goBack();
          }
        }}
      >
        Back{!fromPage && ' to search'}
      </InlineTextButton>

      <div className={css.threeToTwoWrapper}>
        <div className={css.aspectWrapper} onClick={handleViewPhotosClick}>
          {actionBar}
          {listingStateBar}
          {firstImage ? (
            <ResponsiveImage
              rootClassName={css.rootForImage}
              alt={title}
              image={firstImage}
              variants={[
                'landscape-crop',
                'landscape-crop2x',
                'landscape-crop4x',
                'landscape-crop6x',
              ]}
            />
          ) : (
            <img
              className={css.rootForImageAlt}
              alt={title}
              src={defaultImage()}
            />
          )}
          {viewPhotosButton}
        </div>
      </div>
      <Modal
        id="ListingPage.imageCarousel"
        scrollLayerClassName={css.carouselModalScrollLayer}
        containerClassName={css.carouselModalContainer}
        lightCloseButton
        isOpen={imageCarouselOpen}
        onClose={onImageCarouselClose}
        usePortal
        onManageDisableScrolling={onManageDisableScrolling}
      >
        <ImageCarousel images={listing.images} />
      </Modal>
    </div>
  );
};

export default SectionImages;
