import React, { useEffect } from 'react';
import { bool, func, shape, string } from 'prop-types';
import config from '../../config';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import {
  autocompleteSearchRequired,
  autocompletePlaceSelected,
  composeValidators,
  required,
} from '../../util/validators';
import { Form, LocationAutocompleteInputField, Button, FieldSelect } from '../../components';

import css from './EditListingLocationForm.module.css';
import { getPropByName } from '../../util/devHelpers';

const identity = v => v;

export const EditListingLocationFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        form,
        handleSubmit,
        intl,
        initialValues,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        values,
        listingType,
      } = formRenderProps;
      const region = getPropByName(values, 'locRegion');

      const titleRequiredMessage = intl.formatMessage({ id: 'EditListingLocationForm.address' });
      const addressPlaceholderMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressPlaceholder',
      });
      const addressRequiredMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressRequired',
      });
      const addressNotRecognizedMessage = intl.formatMessage({
        id: 'EditListingLocationForm.addressNotRecognized',
      });

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessage = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingLocationForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingLocationForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const filterConfig = config.custom.filters;
      const islandConfig = filterConfig.find(f => f.id === 'locIsland');
      const islands = islandConfig?.config.options;
      const regionConfig = filterConfig.find(f => f.id === 'locRegion');
      const regions = regionConfig?.config.options;
      const districtConfig = filterConfig.find(f => f.id === 'locDistrict');
      const districts = districtConfig.config.options;
      const filteredRegions = regions?.filter(r => r.parent === values?.locIsland);
      const filteredDistricts = districts?.filter(r => r.parent === values?.locRegion);

      useEffect(() => {
        const regionValue = regions.find(r => r.key === region);
        console.log(
          '🚀 | file: EditListingLocationForm.js | line 85 | useEffect | regionValue',
          regionValue
        );
        if (!!regionValue) {
          form.change('locIsland', regionValue.parent);
        }
      }, [region]);
      console.log('🚀 | file: EditListingLocationForm.js | line 90 | region', region);
      useEffect(() => {
        const regionValue = regions.find(r => r.key === region);
        if (!!regionValue) {
          form.change('locRegion', region);
        }
      }, [values.locIsland]);

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}
          <FormSpy
            subscription={{ values: true }}
            onChange={val => {
              // if (val?.values?.locIsland !== values?.locIsland) {
              //   form.change('locRegion', null);
              //   form.change('locDistrict', null);
              // }
              if (val?.values?.locRegion !== values?.locRegion) {
                form.change('locDistrict', null);
              }
            }}
          />

          <div className={css.regionWrapper}>
            {listingType === 'listing' && (
              <h2 className={css.title}>Where is this listing located?</h2>
            )}
          <p >
              To help renters search for local listings, please select a region and district in
              which your space is located. To help the maps work to locate the area the listing is
              in, please provide an address. For those with security concerns, only enter its suburb
              or nearest town.
            </p>
            <FieldSelect
              className={css.category}
              name={'locRegion'}
              id={'locRegion'}
              autoFocus
              label={'Region'}
              validate={required('Required')}
            >
              <option disabled value="">
                {'Select Region'}
              </option>
              {regions.map(c => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </FieldSelect>
            <FieldSelect
              name={'locDistrict'}
              id={'locDistrict'}
              label={'District'}
              validate={required('Required')}
            >
              <option disabled value="">
                {'Select District'}
              </option>
              {filteredDistricts.map(c => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </FieldSelect>
          </div>

          <LocationAutocompleteInputField
            className={css.locationAddress}
            inputClassName={css.locationAutocompleteInput}
            iconClassName={css.locationAutocompleteInputIcon}
            predictionsClassName={css.predictionsRoot}
            validClassName={css.validLocation}
            name="location"
            label={titleRequiredMessage}
            placeholder={addressPlaceholderMessage}
            useDefaultPredictions={false}
            format={identity}
            valueFromForm={values.location}
            validate={composeValidators(
              autocompleteSearchRequired(addressRequiredMessage),
              autocompletePlaceSelected(addressNotRecognizedMessage)
            )}
          />
          <p className={css.disclaimerText}>
            Your data security is our highest concern and your address will not be made available to
            any other user. Your location will be contained in a 2km circle on our location map and
            this address will only be used to populate search queries.
          </p>
          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
          {props.backButton}
        </Form>
      );
    }}
  />
);

EditListingLocationFormComponent.defaultProps = {
  selectedPlace: null,
  fetchErrors: null,
};

EditListingLocationFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  selectedPlace: propTypes.place,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingLocationFormComponent);
