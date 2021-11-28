import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button, FieldTextInput, FieldCheckboxGroup } from '../../components';
import { findConfigForSelectFilter, findOptionsForSelectFilter } from '../../util/search';
import config from '../../config';
import css from './EditListingPoliciesForm.module.css';

export const EditListingPoliciesFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        filterConfig,
        listingType,
      } = formRenderProps;

      const rulesLabelMessage = intl.formatMessage({
        id: 'EditListingPoliciesForm.rulesLabel',
      });
      const rulesPlaceholderMessage = intl.formatMessage({
        id: 'EditListingPoliciesForm.rulesPlaceholder',
      });

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessage = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingPoliciesForm.updateFailed" />
        </p>
      ) : null;
      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingPoliciesForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      const options = findOptionsForSelectFilter(`${listingType}AccessFrequency`, filterConfig);
      const groundRulesOptions = findOptionsForSelectFilter(`groundRules`, filterConfig);
      console.log(
        '🚀 | file: EditListingPoliciesForm.js | line 62 | groundRulesOptions',
        groundRulesOptions
      );

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}
          {listingType === 'listing' && (
            <h2 className={css.title}>How much access would you permit?</h2>
          )}
          <FieldCheckboxGroup
            className={css.features}
            id={'accessFrequency'}
            name={'accessFrequency'}
            options={options}
          />
          {listingType === 'listing' && (
            <>
              <h2 className={css.title}>Other common ground rules</h2>
              <FieldCheckboxGroup
                className={css.features}
                id={'groundRules'}
                name={'groundRules'}
                options={groundRulesOptions}
              />
              <FieldTextInput
                id="rules"
                name="rules"
                className={css.policy}
                type="textarea"
                label={rulesLabelMessage}
                placeholder={rulesPlaceholderMessage}
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

EditListingPoliciesFormComponent.defaultProps = {
  selectedPlace: null,
  updateError: null,
  filterConfig: config.custom.filters,
};

EditListingPoliciesFormComponent.propTypes = {
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

export default compose(injectIntl)(EditListingPoliciesFormComponent);
