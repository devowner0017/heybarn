import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import classNames from 'classnames';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FormattedMessage } from '../../util/reactIntl';
import { findConfigForSelectFilter, findOptionsForSelectFilter } from '../../util/search';
import { propTypes } from '../../util/types';
import config from '../../config';
import { Button, FieldCheckboxGroup, FieldNumberInput, Form } from '../../components';

import css from './EditListingFeaturesForm.module.css';
import { required } from '../../util/validators';

const EditListingFeaturesFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        disabled,
        ready,
        rootClassName,
        className,
        name,
        handleSubmit,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        filterConfig,
        listingType,
      } = formRenderProps;
      console.log("🚀 | file: EditListingFeaturesForm.js | line 35 | formRenderProps", formRenderProps);

      const classes = classNames(rootClassName || css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = disabled || submitInProgress;

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessage = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingFeaturesForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingFeaturesForm.showListingFailed" />
        </p>
      ) : null;

      const options = findOptionsForSelectFilter('amenities', filterConfig);
      const sizeOptions = findConfigForSelectFilter('sizeOfSpace', filterConfig);
      const ageOptions = findConfigForSelectFilter('ageOfSpace', filterConfig);
      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}
          <FieldCheckboxGroup className={css.features} id={name} name={name} options={options} />
          {listingType === 'listing' && (
            <>
              <FieldNumberInput
                className={classNames(css.features, css.numberInput)}
                label={<FormattedMessage id="EditListingFeaturesForm.sizeOfSpaceLabel" />}
                id={'sizeOfSpace'}
                placeholder={'m2'}
                name={'sizeOfSpace'}
                config={sizeOptions}
                validate={required('Required')}
              />
              <FieldNumberInput
                className={classNames(css.features, css.numberInput)}
                label={<FormattedMessage id="EditListingFeaturesForm.ageOfSpaceLabel" />}
                placeholder={'years'}
                id={'ageOfSpace'}
                name={'ageOfSpace'}
                config={ageOptions}
                validate={required('Required')}
              />
            </>
          )}
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

EditListingFeaturesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingFeaturesFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  name: string.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  filterConfig: propTypes.filterConfig,
};

const EditListingFeaturesForm = EditListingFeaturesFormComponent;

export default EditListingFeaturesForm;
