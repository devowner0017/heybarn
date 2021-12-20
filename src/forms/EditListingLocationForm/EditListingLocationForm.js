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
} from '../../util/validators';
import { Form, LocationAutocompleteInputField, Button, FieldSelect } from '../../components';

import css from './EditListingLocationForm.module.css';
import { getPropByName } from '../../util/userHelpers';

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
      console.log("🚀 | file: EditListingLocationForm.js | line 42 | formRenderProps", formRenderProps);
      const region = getPropByName(values, 'region');
      console.log('🚀 | file: EditListingLocationForm.js | line 42 | region', region);

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
      console.log('🚀 | file: EditListingLocationForm.js | line 75 | islandConfig', islandConfig);
      const islands = islandConfig?.config.options;
      console.log('🚀 | file: EditListingLocationForm.js | line 76 | islands', islands);
      const regionConfig = filterConfig.find(f => f.id === 'locRegion');
      console.log('🚀 | file: EditListingLocationForm.js | line 79 | regionConfig', regionConfig);
      const regions = regionConfig?.config.options;
      console.log('🚀 | file: EditListingLocationForm.js | line 81 | regions', regions);
      const districtConfig = filterConfig.find(f => f.id === 'locDistrict');
      const districts = districtConfig.config.options;
      const filteredRegions = regions?.filter(r => r.parent === values?.locIsland);
      console.log("🚀 | file: EditListingLocationForm.js | line 85 | filteredRegions", filteredRegions);
      const filteredDistricts = districts?.filter(r => r.parent === values?.locRegion);
      console.log("🚀 | file: EditListingLocationForm.js | line 87 | filteredDistricts", filteredDistricts);

      useEffect(() => {
        console.log('🚀 | file: EditListingLocationForm.js | line 46 | useEffect | region', region);
        const regionValue = regions.find(r => r.key === region);
        if (!!regionValue) {
          console.log("🚀 | file: EditListingLocationForm.js | line 91 | useEffect | regionValue", regionValue);
          form.change('locIsland', regionValue.parent);
        }
      }, [region]);
      useEffect(() => {
        console.log('🚀 | file: EditListingLocationForm.js | line 46 | useEffect | region', region);
        const regionValue = regions.find(r => r.key === region);
        if (!!regionValue) {
          console.log("🚀 | file: EditListingLocationForm.js | line 91 | useEffect | regionValue", regionValue);
          form.change('locRegion', region);
        }
      }, [values.locIsland]);
      console.log(values);
      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}
          <FormSpy
            subscription={{ values: true }}
            onChange={val => {
              if (val?.values?.locIsland !== values?.locIsland) {
                form.change('locRegion', null);
                form.change('locDistrict', null);
              }
              if (val?.values?.locRegion !== values?.locRegion) {
                form.change('locDistrict', null);
              }
            }}
          />

          <div className={css.regionWrapper}>
            {listingType === 'listing' && (
              <h2 className={css.title}>Where is this listing located?</h2>
            )}

            <FieldSelect
              className={css.category}
              name={'locIsland'}
              id={'locIsland'}
              label={'Island'}
            >
              <option disabled value="">
                {'Select Island'}
              </option>
              {islands.map(c => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </FieldSelect>
            <FieldSelect
              className={css.category}
              name={'locRegion'}
              id={'locRegion'}
              label={'Region'}
            >
              <option disabled value="">
                {'Select Region'}
              </option>
              {filteredRegions.map(c => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </FieldSelect>
            <FieldSelect
              className={css.category}
              name={'locDistrict'}
              id={'locDistrict'}
              label={'District'}
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
            autoFocus
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

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
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
