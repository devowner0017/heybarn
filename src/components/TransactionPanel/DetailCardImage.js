import React from 'react';
import classNames from 'classnames';
import { AvatarMedium, ResponsiveImage } from '../../components';

import css from './TransactionPanel.module.css';

import creativeImage from './../../assets/creative.png';
import eventImage from './../../assets/event.png';
import storageImage from './../../assets/storage.png';
import workImage from './../../assets/work.png';

// Functional component as a helper to build AddressLinkMaybe
const DetailCardImage = props => {
  const {
    className,
    rootClassName,
    avatarWrapperClassName,
    listingTitle,
    image,
    provider,
    isCustomer,
    need,
  } = props;
  const classes = classNames(rootClassName || css.detailCardImageWrapper, className);

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
  };

  return (
    <React.Fragment>
      <div className={classes}>
        <div className={css.aspectWrapper}>
          {image || !defaultImage() ? (
            <ResponsiveImage
              rootClassName={css.rootForImage}
              alt={listingTitle}
              image={image}
              variants={['landscape-crop', 'landscape-crop2x']}
            />
          ) : (
            <img className={css.rootForImage} alt={listingTitle} src={defaultImage()} />
          )}
        </div>
      </div>
      {isCustomer ? (
        <div className={avatarWrapperClassName || css.avatarWrapper}>
          <AvatarMedium user={provider} />
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default DetailCardImage;
