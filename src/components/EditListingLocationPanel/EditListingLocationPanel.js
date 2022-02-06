import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '../../components';
import { EditListingLocationForm } from '../../forms';
import config from '../../config';
import css from './EditListingLocationPanel.module.css';
import { findOptionsForSelectFilter } from '../../util/search';

class EditListingLocationPanel extends Component {
  constructor(props) {
    super(props);

    this.getInitialValues = this.getInitialValues.bind(this);

    this.state = {
      initialValues: this.getInitialValues(),
    };
  }

  getInitialValues() {
    const { listing } = this.props;
    const currentListing = ensureOwnListing(listing);
    const { geolocation, publicData } = currentListing.attributes;
    const { locRegion, locIsland, locDistrict } = publicData;
    // Only render current search if full place object is available in the URL params
    // TODO bounds are missing - those need to be queried directly from Google Places
    const locationFieldsPresent = publicData?.location?.address && geolocation;
    const location = publicData && publicData.location ? publicData.location : {};
    const { address } = location;

    return {
      locIsland,
      locDistrict,
      locRegion,
      location: locationFieldsPresent
        ? {
            search: address,
            selectedPlace: { address, origin: geolocation },
          }
        : null,
    };
  }

  render() {
    const {
      className,
      rootClassName,
      listing,
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
    } = this.props;

    const classes = classNames(rootClassName || css.root, className);
    const currentListing = ensureOwnListing(listing);

    // const isPublished =
    //   currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
    const panelTitle = (
      <FormattedMessage
        id={`EditListingLocationPanel.${listingType}Title`}
        values={{ listingTitle: <ListingLink listing={listing} /> }}
      />
    );
    const locRegionOptions = findOptionsForSelectFilter('locRegion', config.custom.filters);

    return (
      <div className={classes}>
        <h1 className={css.title}>{panelTitle}</h1>
        <EditListingLocationForm
          className={css.form}
          initialValues={this.state.initialValues}
          onSubmit={values => {
            console.log(
              '🚀 | file: EditListingLocationPanel.js | line 105 | EditListingLocationPanel | render | values',
              values
            );
            const { location, locRegion, locIsland, locDistrict } = values;
            const {
              selectedPlace: { address, origin },
            } = location;
            const updateValues = {
              geolocation: origin,
              publicData: {
                location: { address },
                locRegion,
                locIsland,
                locDistrict,
              },
            };
            this.setState({
              initialValues: {
                location: { search: address, selectedPlace: { address, origin } },
                locRegion,
                locIsland,
                locDistrict,
              },
            });
            onSubmit(updateValues);
          }}
          onChange={onChange}
          saveActionMsg={submitButtonText}
          disabled={disabled}
          ready={ready}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          fetchErrors={errors}
          locRegionOptions={locRegionOptions}
          backButton={backButton}
        />
      </div>
    );
  }
}

const { func, object, string, bool } = PropTypes;

EditListingLocationPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingLocationPanel.propTypes = {
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
};

export default EditListingLocationPanel;
