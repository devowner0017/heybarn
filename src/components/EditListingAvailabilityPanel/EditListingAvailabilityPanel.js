import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingAvailabilityForm } from '../../forms';

import css from './EditListingAvailabilityPanel.module.css';
import { getPropByName } from '../../util/devHelpers';
import moment from 'moment';

const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    availability,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    listingType,
    backButton,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const defaultAvailabilityPlan = {
    type: 'availability-plan/day',
    entries: [
      { dayOfWeek: 'mon', seats: 1 },
      { dayOfWeek: 'tue', seats: 1 },
      { dayOfWeek: 'wed', seats: 1 },
      { dayOfWeek: 'thu', seats: 1 },
      { dayOfWeek: 'fri', seats: 1 },
      { dayOfWeek: 'sat', seats: 1 },
      { dayOfWeek: 'sun', seats: 1 },
    ],
  };
  const availabilityPlan = currentListing.attributes.availabilityPlan || defaultAvailabilityPlan;
  const publicData = getPropByName(currentListing, 'publicData');
  const { perpetual: [perpetual] = [true], availableFrom, availableTo } = publicData;
  return (
    <div className={classes}>
      <h1 className={css.title}>
        {isPublished ? (
          <FormattedMessage
            id="EditListingAvailabilityPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} /> }}
          />
        ) : (
          <FormattedMessage id={`EditListingAvailabilityPanel.${listingType}createListingTitle`} />
        )}
      </h1>
      <EditListingAvailabilityForm
        className={css.form}
        listingId={currentListing.id}
        initialValues={{
          availabilityPlan,
          perpetual: perpetual === undefined ? [true] : perpetual ? [perpetual] : [],
          startDate: availableFrom ? moment(parseInt(availableFrom)) : null,
          endDate: availableTo ? moment(parseInt(availableTo)) : null,
        }}
        availability={availability}
        availabilityPlan={availabilityPlan}
        onSubmit={values => {
          const { startDate, endDate, perpetual } = values;
          const startMS = startDate && startDate.valueOf();
          const endMS = endDate && endDate.valueOf();
          // We save the default availability plan
          // I.e. this listing is available every night.
          // Exceptions are handled with live edit through a calendar,
          // which is visible on this panel.
          onSubmit({
            availabilityPlan,
            publicData: {
              availableFrom: startMS,
              availableTo: endMS,
              perpetual: [perpetual?.[0] || false],
            },
          });
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
        backButton={backButton}
      />
    </div>
  );
};

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  availability: shape({
    calendar: object.isRequired,
    onFetchAvailabilityExceptions: func.isRequired,
    onCreateAvailabilityException: func.isRequired,
    onDeleteAvailabilityException: func.isRequired,
  }).isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingAvailabilityPanel;
