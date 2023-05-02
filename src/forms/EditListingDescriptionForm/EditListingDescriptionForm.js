import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
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
} from '../../components';
import css from './EditListingDescriptionForm.module.css';
import { ensureArray } from '../../util/devHelpers';

const TITLE_MAX_LENGTH = 60;

const EditListingDescriptionFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        form,
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
        existingListings,
        onSetBaseListing,
        isPublished,
        values,
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
        <FormattedMessage id="EditListingDescriptionForm.moreInfo" values={{ listingType }} />
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

      const { lengthOfSpace, widthOfSpace, heightOfSpace } = values || {};

      const isVolume = lengthOfSpace && widthOfSpace && heightOfSpace;
      const isArea = lengthOfSpace && widthOfSpace;

      const sizeOfSpace = isVolume
        ? lengthOfSpace * widthOfSpace * heightOfSpace
        : isArea
        ? lengthOfSpace * widthOfSpace
        : undefined;

      const sizeOfLabel = isVolume
        ? intl.formatMessage({ id: 'EditListingFeaturesForm.sizeOfSpaceVolumeLabel' })
        : isArea
        ? intl.formatMessage({ id: 'EditListingFeaturesForm.sizeOfSpaceAreaLabel' })
        : '';

      const preferredUseOptions = findOptionsForSelectFilter('preferredUse', config.custom.filters);

      const selectListing =
        !isPublished && existingListings?.length > 0 ? (
          <div className={css.selectListing}>
            <label className={css.selectListingHeading}>
              Copy listing details from existing listing
            </label>
            <select
              onChange={e => {
                const listingId = e.target.value;
                const currentListing = existingListings.find(l => l.id.uuid === listingId);

                onSetBaseListing(currentListing);

                const { description, title, publicData } = currentListing.attributes;

                const {
                  preferredUse,
                  listingState: currentListingState,
                  sizeOfSpace,
                  ageOfSpace,
                  amenities,
                  lengthOfSpace,
                  widthOfSpace,
                  heightOfSpace,
                } = publicData;

                const initialValues = {
                  title,
                  description,
                  preferredUse: ensureArray(preferredUse).map(p =>
                    preferredUseOptions.find(o => o.key === p)
                  ),
                  sizeOfSpace,
                  ageOfSpace,
                  amenities,
                  lengthOfSpace,
                  widthOfSpace,
                  heightOfSpace,
                };

                const initialValuesWithListingId = {
                  description: initialValues.description,
                  preferredUse: initialValues.preferredUse,
                  sizeOfSpace: initialValues.sizeOfSpace,
                  ageOfSpace: initialValues.ageOfSpace,
                  amenities: initialValues.amenities,
                  lengthOfSpace: initialValues.lengthOfSpace,
                  widthOfSpace: initialValues.widthOfSpace,
                  heightOfSpace: initialValues.heightOfSpace,
                }
                form.restart(initialValuesWithListingId)
              }}
              defaultValue=""
            >
              <option disabled value="">
                Select listing
              </option>
              {existingListings?.map(l => {
                if (l.attributes.state !== 'published') return null;
                return (
                  <option key={l.id.uuid} value={l.id.uuid}>
                    {l.attributes.title}
                  </option>
                );
              })}
            </select>
          </div>
        ) : null;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}

          {selectListing}

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
                ? () => null
                : composeValidators(required(titleRequiredMessage), maxLength60Message)
            }
            autoFocus
          />

          <FieldTextInput
            id="description"
            name="description"
            className={css.description}
            type="textarea"
            label={descriptionMessage}
            placeholder={descriptionPlaceholderMessage}
            validate={
              submitInProgress
                ? () => null
                : composeValidators(required(descriptionRequiredMessage))
            }
          />

          {listingType === 'listing' && (
            <>
              <label className={css.spaceLabel}>
                <FormattedMessage id="EditListingFeaturesForm.sizeOfSpaceLabel" />{' '}
                {sizeOfSpace && (
                  <span className={css.calculatedSize}>
                    <span>
                      {sizeOfSpace}
                      {sizeOfLabel}
                    </span>
                  </span>
                )}
              </label>

              <FieldNumberInput
                type="number"
                className={css.title}
                label={<FormattedMessage id="EditListingFeaturesForm.lengthOfSpaceLabel" />}
                id="lengthOfSpace"
                name="lengthOfSpace"
                validate={submitInProgress ? () => null : required('Required')}
              />

              <FieldNumberInput
                type="number"
                className={css.title}
                label={<FormattedMessage id="EditListingFeaturesForm.widthOfSpaceLabel" />}
                id="widthOfSpace"
                name="widthOfSpace"
                validate={submitInProgress ? () => null : required('Required')}
              />

              <FieldNumberInput
                type="number"
                className={css.title}
                label={<FormattedMessage id="EditListingFeaturesForm.heightOfSpaceLabel" />}
                id={'heightOfSpace'}
                name={'heightOfSpace'}
              />

              <FieldNumberInput
                type="number"
                className={css.title}
                label={<FormattedMessage id="EditListingFeaturesForm.ageOfSpaceLabel" />}
                placeholder={'years'}
                id={'ageOfSpace'}
                name={'ageOfSpace'}
                config={ageOptions}
              />
            </>
          )}

          <div>
            <label className={css.amenitiesLabel}>
              {listingType === 'listing'
                ? 'Click on any icons that describe available facilities in your space.'
                : 'Click on any icons that you will need'}
            </label>
            <FieldCheckboxGroup
              className={css.title}
              id={'amenities'}
              name={'amenities'}
              options={options}
            />
          </div>

          <CustomSelect
            id="preferredUse"
            name="preferredUse"
            className={css.idealUses}
            options={preferredUse}
            label={preferredUseLabel}
            isMulti={listingType === 'listing'}
            validate={
              submitInProgress
                ? () => null
                : listingType === 'listing'
                ? nonEmptyArray(preferredUseRequiredMessage)
                : requiredObject(preferredUseRequiredMessage)
            }
          />
          {listingType === 'advert' && (
            <div className={css.useText}>
              Storage space: suggests infrequent visits.
              <br />
              Creative space: suggests infrequent and/or irregular visits
              <br />
              Work space: suggests visits are typically frequent and regular
              <br />
              Event space: suggests a short period of use
            </div>
          )}

          {listingType === 'listing' && (
            <div className={css.useText}>
              Selecting one or more ideal use(s) for your space helps renters understand how often
              you'd prefer access to your space.
              <br />
              Storage space suggests infrequent visits.
              <br />
              Creative space suggests infrequent and irregular visits.
              <br />
              Work space suggests more frequent and regular visits.
              <br />
              Event space suggests a short period of use.
            </div>
          )}

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
