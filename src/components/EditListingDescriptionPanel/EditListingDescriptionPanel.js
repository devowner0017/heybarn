import React , {useState} from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_LIVE, LISTING_STATE_DRAFT } from '../../util/types';
import { getPropByName, ensureArray } from '../../util/devHelpers';
import { ListingLink } from '../../components';
import { EditListingDescriptionForm } from '../../forms';
import { propTypes } from '../../util/types';
import config from '../../config';
import _ from 'lodash';
import { types as sdkTypes } from '../../util/sdkLoader';

import css from './EditListingDescriptionPanel.module.css';
import { setInitialValues } from '../../containers/CheckoutPage/CheckoutPage.duck'

const { Money } = sdkTypes;

const EditListingDescriptionPanel = props => {
  const {
    className,
    rootClassName,
    currentUser,
    listing,
    listingType,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);

  const { description, title, publicData } = currentListing.attributes;

  const {
    preferredUse,
    listingState: currentListingState,
    sizeOfSpace,
    ageOfSpace,
    amenities,
  } = publicData;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;

  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingDescriptionPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <>
      <FormattedMessage
        id={`EditListingDescriptionPanel.create${listingType}Title`}
        values={{ name: getPropByName(currentUser, 'firstName') }}
      />
    </>
  );
  const categoryOptions = findOptionsForSelectFilter('category', config.custom.filters);
  const preferredUseOptions = findOptionsForSelectFilter('preferredUse', config.custom.filters);
  const [initValues, setInitValues] = useState({
    title,
    description,
    preferredUse: ensureArray(preferredUse).map(p =>
      preferredUseOptions.find(o => o.key === p)
      ),
      sizeOfSpace,
      ageOfSpace,
      amenities,
    })
    console.log("🚀 | file: EditListingDescriptionPanel.js | line 68 | initValues", initValues);
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingDescriptionForm
        className={css.form}
        initialValues={initValues}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const {
            title,
            description,
            category,
            preferredUse,
            sizeOfSpace,
            ageOfSpace,
            amenities,
          } = values;
          const listingState = !currentListingState || !isPublished ? LISTING_LIVE : null;
          const notDeleted = true;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: {
              listingType,
              listingState,
              notDeleted,
              category,
              preferredUse: ensureArray(preferredUse).map(p => p?.key),
              sizeOfSpace,
              ageOfSpace,
              amenities,
            },
          };
          const defaultPrice = new Money(0, config.currency);
          const updateValuesWithPrice =
            listingType === 'listing' ? updateValues : { ...updateValues, price: defaultPrice };
            setInitValues(updateValues)
          onSubmit(updateValuesWithPrice);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        categories={categoryOptions}
        preferredUse={preferredUseOptions}
        listingType={listingType}
      />
    </div>
  );
};

EditListingDescriptionPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingDescriptionPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,

  isAdvert: bool.isRequired,
  currentUser: propTypes.currentUser.isRequired,
};

export default EditListingDescriptionPanel;
