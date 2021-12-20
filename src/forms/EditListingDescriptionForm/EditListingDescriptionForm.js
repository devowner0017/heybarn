import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import {
  maxLength,
  required,
  composeValidators,
  nonEmptyArray,
  requiredObject,
} from '../../util/validators';
import { Form, Button, FieldTextInput, CustomSelect } from '../../components';
import css from './EditListingDescriptionForm.module.css';

const TITLE_MAX_LENGTH = 60;

const EditListingDescriptionFormComponent = props => (
  <FinalForm
    {...props}
    // validate={validate}
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
      } = formRenderProps;
        console.log("🚀 | file: EditListingDescriptionForm.js | line 40 | listingType", listingType);

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
            validate={submitInProgress ? _ => null :  composeValidators(required(titleRequiredMessage), maxLength60Message)}
            autoFocus
          />

          <FieldTextInput
            id="description"
            name="description"
            className={css.description}
            type="textarea"
            label={descriptionMessage}
            placeholder={descriptionPlaceholderMessage}
            validate={submitInProgress ? _ => null :  composeValidators(required(descriptionRequiredMessage))}
          />
          <CustomSelect
            id="preferredUse"
            name="preferredUse"
            className={css.description}
            options={preferredUse}
            label={preferredUseLabel}
            isMulti={listingType === 'listing'}
            validate={
              listingType === 'listing'
                ? nonEmptyArray(preferredUseRequiredMessage)
                : requiredObject(preferredUseRequiredMessage)
            }
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

EditListingDescriptionFormComponent.defaultProps = { className: null, fetchErrors: null };

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
