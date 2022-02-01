import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';
import { isTransactionsTransitionAlreadyReviewed } from '../../util/errors';
import { required } from '../../util/validators';
import arrayMutators from 'final-form-arrays';
import * as validators from '../../util/validators';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  FieldReviewRating,
  Form,
  PrimaryButton,
  FieldTextInput,
  FieldNumberInput,
  FieldDateInput,
  FieldCheckbox,
  FieldDateRangeInput,
  FieldCheckboxGroup,
  FieldCurrencyInput,
} from '../../components';
import config from '../../config';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';

import css from './RentalAgreementSetupForm.module.css';
import moment from 'moment';
import { dateFromLocalToAPI } from '../../util/dates';
import { formatMoney } from '../../util/currency';
import { getPropByName } from '../../util/devHelpers';
import { findOptionsForSelectFilter } from '../../util/search';
const identity = v => v;
const { Money } = sdkTypes;

const RentalAgreementSetupFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={fieldRenderProps => {
      const {
        className,
        rootClassName,
        disabled,
        handleSubmit,
        intl,
        form,
        formId,
        invalid,
        reviewSent,
        sendReviewError,
        sendReviewInProgress,
        values,
        listing,
        filterConfig,
      } = fieldRenderProps;

      const {
        startDate,
        endDate,
        lengthOfContract,
        ongoingContract: [ongoingContract] = [],
      } = values;
      const [focusedInput, setFocusedInput] = useState();
      // Function that can be passed to nested components
      // so that they can notify this component when the
      // focused input changes.
      const onFocusedInputChange = focusedInput => {
        setFocusedInput(focusedInput);
      };
      const errorMessage = isTransactionsTransitionAlreadyReviewed(sendReviewError) ? (
        <p className={css.error}>
          <FormattedMessage id="RentalAgreementSetupForm.reviewSubmitAlreadySent" />
        </p>
      ) : (
        <p className={css.error}>
          <FormattedMessage id="RentalAgreementSetupForm.reviewSubmitFailed" />
        </p>
      );
      const errorArea = sendReviewError ? errorMessage : <p className={css.errorPlaceholder} />;

      const unitType = config.bookingUnitType;
      const isNightly = unitType === LINE_ITEM_NIGHT;
      const isDaily = unitType === LINE_ITEM_DAY;

      const translationKey = isNightly
        ? 'EditListingPricingForm.pricePerNight'
        : isDaily
        ? 'EditListingPricingForm.pricePerDay'
        : 'EditListingPricingForm.pricePerUnit';

      const pricePerUnitMessage = intl.formatMessage({
        id: translationKey,
      });

      const pricePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.priceInputPlaceholder',
      });

      const priceRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingPricingForm.priceRequired',
        })
      );
      const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
      const minPriceRequired = validators.moneySubUnitAmountAtLeast(
        intl.formatMessage(
          {
            id: 'EditListingPricingForm.priceTooLow',
          },
          {
            minPrice: formatMoney(intl, minPrice),
          }
        ),
        config.listingMinimumPriceSubUnits
      );
      const priceValidators = config.listingMinimumPriceSubUnits
        ? validators.composeValidators(priceRequired, minPriceRequired)
        : priceRequired;

      const emailRequiredMessage = intl.formatMessage({
        id: 'SignupForm.emailRequired',
      });
      const emailInvalidMessage = intl.formatMessage({
        id: 'SignupForm.emailInvalid',
      });
      const emailRequired = validators.required(emailRequiredMessage);
      const emailValid = validators.emailFormatValid(emailInvalidMessage);
      const reviewSubmitMessage = intl.formatMessage({
        id: 'RentalAgreementSetupForm.submit',
      });

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = sendReviewInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      // When the values of the form are updated we need to fetch
      // lineItems from FTW backend for the EstimatedTransactionMaybe
      // In case you add more fields to the form, make sure you add
      // the values here to the bookingData object.
      const handleOnChange = formValues => {
        const {
          ongoingContract: [ongoingContract] = [],
          lengthOfContract,
          startDate,
          endDate,
        } = formValues.values;

        if (!startDate) {
          return null;
        }

        const endDateMaybe = moment(startDate?.date).add(lengthOfContract, 'weeks');
        if (startDate && lengthOfContract && !moment(endDateMaybe).isSame(moment(endDate))) {
          form.change(`endDate`, endDateMaybe);
        }
      };
      useEffect(() => {
        if (!!values?.ongoingContract?.[0]) {
          form.change(`lengthOfContract`, null);
          form.change(`endDate`, null);
        }
      }, [values.ongoingContract]);

      const groundRulesOptions = findOptionsForSelectFilter(`groundRules`, filterConfig);

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <h2 className={css.title}>Agreed rental price</h2>
          <FieldCurrencyInput
            id="price"
            name="price"
            className={css.priceInput}
            autoFocus
            label={pricePerUnitMessage}
            placeholder={pricePlaceholderMessage}
            currencyConfig={config.currencyConfig}
            validate={priceValidators}
          />
          <h2 className={css.title}>The Hosts details</h2>
          <div className={css.fieldGroup}>
            <FieldTextInput
              className={css.field}
              id="hostsFirstName"
              name="hostsFirstName"
              type="text"
              label={'First name*'}
              required
            />{' '}
            <FieldTextInput
              className={css.field}
              id="hostsLastName"
              name="hostsLastName"
              type="text"
              label={'Last name*'}
              required
            />
          </div>
          <FieldTextInput
            type="email"
            id={'email'}
            className={css.field}
            name="hostsEmail"
            autoComplete="email"
            label={'Email*'}
            validate={validators.composeValidators(emailRequired, emailValid)}
            required
          />
          <h2 className={css.title}>The Renter preferred name</h2>
          <div className={css.fieldGroup}>
            <FieldTextInput
              className={css.field}
              id="rentersFirstName"
              name="rentersFirstName"
              type="text"
              label={'First name*'}
              required
            />{' '}
            <FieldTextInput
              className={css.field}
              id="rentersLastName"
              name="rentersLastName"
              type="text"
              label={'Last name*'}
              required
            />
          </div>
          <FieldTextInput
            type="email"
            className={css.field}
            id={'email'}
            name="rentersEmail"
            autoComplete="email"
            label={'Email*'}
            validate={validators.composeValidators(emailRequired, emailValid)}
            required
          />
          <h2 className={css.title}>Contract Length</h2>
          <FieldCheckbox
            className={css.field}
            id={'ongoingContract'}
            name={'ongoingContract'}
            label={'On Going'}
            value={true}
          />
          {!values.ongoingContract?.[0] && (
            <FieldNumberInput
              className={css.field}
              label={<FormattedMessage id="RentalAgreementModal.lengthOfContractLabel" />}
              id={'lengthOfContract'}
              name={'lengthOfContract'}
              disabled={ongoingContract}
              config={{
                min: 1,
                max: 102,
              }}
              validate={!ongoingContract ? required('Required') : _ => null}
            />
          )}
          <FormSpy
            subscription={{ values: true }}
            onChange={values => {
              handleOnChange(values);
            }}
          />
          <FieldDateInput
            className={css.dateField}
            label={'Start'}
            name="startDate"
            id={`startDate`}
            unitType={'units'}
            startDateId={`startDate`}
            startDateLabel={'Start'}
            startDatePlaceholderText={'StartPlace'}
            endDateId={`endDate`}
            endDateLabel={'EndLabel'}
            endDatePlaceholderText={'endDatePlaceholderText'}
            endDateReadOnly
            focusedInput={focusedInput}
            onFocusedInputChange={onFocusedInputChange}
            format={identity}
            // timeSlots={timeSlots}
            disabled={!lengthOfContract && !ongoingContract}
            customIsDayBlocked={date => {
              return false;
            }}
            customIsDayOutsideRange={date => {
              return false;
            }}
            validate={required('Required')}
          />
          <FieldTextInput
            className={css.field}
            id="intendedUse"
            name="intendedUse"
            type="text"
            label={'Intended Use'}
          />
          <h2 className={css.title}>Other common ground rules</h2>
          <FieldCheckboxGroup
            className={css.features}
            id={'groundRules'}
            name={'groundRules'}
            options={groundRulesOptions}
          />
          <h2 className={css.title}>Additional Information</h2>
          <FieldTextInput
            className={css.field}
            id="additionalInformation"
            name="additionalInformation"
            type="textarea"
          />
          {errorArea}
          {listing && (
            <div className={css.detailRow}>
              <p>Rent</p>
              <p>{formatMoney(intl, values.price)}</p>
            </div>
          )}
          {startDate && (
            <div className={css.detailRow}>
              <p>Frequency</p>
              <p>Weekly</p>
            </div>
          )}
          {startDate && (
            <div className={css.detailRow}>
              <p>Start Date</p>
              <p>{moment(startDate.date).format('ddd, DD MMM YYYY')}</p>
            </div>
          )}
          {endDate && (
            <div className={css.detailRow}>
              <p>End Date</p>
              <p>{moment(endDate).format('ddd, DD MMM YYYY')}</p>
            </div>
          )}
          <PrimaryButton
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={reviewSent}
          >
            {reviewSubmitMessage}
          </PrimaryButton>
        </Form>
      );
    }}
  />
);

RentalAgreementSetupFormComponent.defaultProps = {
  className: null,
  rootClassName: null,
  sendReviewError: null,
  filterConfig: config.custom.filters,
};

const { bool, func, string } = PropTypes;

RentalAgreementSetupFormComponent.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  reviewSent: bool.isRequired,
  sendReviewError: propTypes.error,
  sendReviewInProgress: bool.isRequired,
};

const RentalAgreementSetupForm = compose(injectIntl)(RentalAgreementSetupFormComponent);
RentalAgreementSetupForm.displayName = 'RentalAgreementSetupForm';

export default RentalAgreementSetupForm;
