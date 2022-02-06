import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import { findConfigForSelectFilter, findOptionsForSelectFilter } from '../../util/search';
import classNames from 'classnames';
import arrayMutators from 'final-form-arrays';
import { propTypes } from '../../util/types';
import {
  maxLength,
  required,
  composeValidators,
  nonEmptyArray,
  requiredObject,
} from '../../util/validators';
import config from '../../config';

import {
  Form,
  Button,
  FieldTextInput,
  CustomSelect,
  FieldCheckboxGroup,
  FieldNumberInput,
  InlineTextButton,
} from '../../components';
import css from './EditListingDescriptionForm.module.css';

const TITLE_MAX_LENGTH = 60;

const EditListingDescriptionFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        preferredUse,
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
        listingType,
        filterConfig,
      } = formRenderProps;

      const titleMessage = intl.formatMessage({
        id: `EditListingDescriptionForm.${listingType}_title`,
      });
      const titlePlaceholderMessage = intl.formatMessage({
        id: `EditListingDescriptionForm.${listingType}_titlePlaceholder`,
      });
      const titleRequiredMessage = intl.formatMessage({
        id: `EditListingDescriptionForm.titleRequired`,
      });
      const maxLengthMessage = intl.formatMessage(
        { id: `EditListingDescriptionForm.maxLength` },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );

      const preferredUseLabel = intl.formatMessage({
        id: `EditListingDescriptionForm.${listingType}_preferredUseLabel`,
      });
      const preferredUseRequiredMessage = intl.formatMessage({
        id: `EditListingDescriptionForm.preferredUseRequired`,
      });
      const descriptionMessage = intl.formatMessage({
        id: `EditListingDescriptionForm.${listingType}_description`,
      });
      const descriptionPlaceholderMessage = intl.formatMessage({
        id: `EditListingDescriptionForm.${listingType}_descriptionPlaceholder`,
      });
      const moreInfoText = (
        <FormattedMessage id="EditListingDescriptionForm.moreInfo" values={{listingType}} />
      );
      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
      const descriptionRequiredMessage = intl.formatMessage({
        id: `EditListingDescriptionForm.descriptionRequired`,
      });

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      const options = findOptionsForSelectFilter('amenities', filterConfig);
      const sizeOptions = findConfigForSelectFilter('sizeOfSpace', filterConfig);
      const ageOptions = findConfigForSelectFilter('ageOfSpace', filterConfig);

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <FieldTextInput
            id="title"
            name="title"
            className={css.title}
            type="text"
            label={titleMessage}
            placeholder={titlePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={
              submitInProgress
                ? _ => null
                : composeValidators(required(titleRequiredMessage), maxLength60Message)
            }
            autoFocus
          />

          {listingType === 'listing' && (
            <>
              <FieldNumberInput
                className={css.title}
                label={<FormattedMessage id="EditListingFeaturesForm.sizeOfSpaceLabel" />}
                id={'sizeOfSpace'}
                placeholder={'m2'}
                name={'sizeOfSpace'}
                config={sizeOptions}
                validate={submitInProgress ? _ => null : required('Required')}
              />
              <FieldNumberInput
                className={css.title}
                label={<FormattedMessage id="EditListingFeaturesForm.ageOfSpaceLabel" />}
                placeholder={'years'}
                id={'ageOfSpace'}
                name={'ageOfSpace'}
                config={ageOptions}
                validate={submitInProgress ? _ => null : required('Required')}
              />
            </>
          )}

          <FieldCheckboxGroup
            className={css.title}
            id={'amenities'}
            name={'amenities'}
            options={options}
          />

          <FieldTextInput
            id="description"
            name="description"
            className={css.description}
            type="textarea"
            label={descriptionMessage}
            placeholder={descriptionPlaceholderMessage}
            validate={
              submitInProgress ? _ => null : composeValidators(required(descriptionRequiredMessage))
            }
          />

          <CustomSelect
            id="preferredUse"
            name="preferredUse"
            className={css.description}
            options={preferredUse}
            label={preferredUseLabel}
            isMulti={listingType === 'listing'}
            validate={
              submitInProgress
                ? _ => null
                : listingType === 'listing'
                ? nonEmptyArray(preferredUseRequiredMessage)
                : requiredObject(preferredUseRequiredMessage)
            }
          />
<div className={css.moreInfoText}>{moreInfoText}</div>
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

EditListingDescriptionFormComponent.defaultProps = {
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingDescriptionFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  categories: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
};

export default compose(injectIntl)(EditListingDescriptionFormComponent);
