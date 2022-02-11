import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';
import { required } from '../../util/validators';
import arrayMutators from 'final-form-arrays';
import * as validators from '../../util/validators';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  Form,
  PrimaryButton,
  FieldTextInput,
  FieldNumberInput,
  FieldDate,
  FieldCheckbox,
  FieldCheckboxGroup,
  FieldCurrencyInput,
  OutsideClickHandler,
} from '../../components';
import config from '../../config';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY } from '../../util/types';
import { TransitionGroup } from 'react-transition-group';
import { Collapse } from '@mui/material';

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
      const [confirmAgreementOpen, setConfirmAgreementOpen] = useState(false);
      // Function that can be passed to nested components
      // so that they can notify this component when the
      // focused input changes.
      const onFocusedInputChange = focusedInput => {
        setFocusedInput(focusedInput);
      };
      const errorArea = false ? errorMessage : <p className={css.errorPlaceholder} />;

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
      const submitMessage = intl.formatMessage({
        id: 'RentalAgreementSetupForm.submit',
      });

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = false;
      const submitDisabled = invalid || disabled || submitInProgress || !values.startDate;

      // When the values of the form are updated we need to fetch
      // lineItems from FTW backend for the EstimatedTransactionMaybe
      // In case you add more fields to the form, make sure you add
      // the values here to the bookingData object.
      const handleOnChange = formValues => {
        const { lengthOfContract, startDate, endDate } = formValues.values;

        if (!startDate) {
          return null;
        }

        const endDateMaybe = moment(startDate?.date).add(lengthOfContract, 'weeks');
        if (startDate && lengthOfContract && !moment(endDateMaybe).isSame(moment(endDate))) {
          form.change(`endDate`, endDateMaybe);
        }
      };

      const toggleConfirmAgreement = val => {
        setConfirmAgreementOpen(old => (val === undefined ? !old : val));
      };
      useEffect(() => {
        if (!!values?.ongoingContract?.[0]) {
          form.change(`lengthOfContract`, null);
          form.change(`endDate`, null);
        }
      }, [values.ongoingContract]);

      const groundRulesOptions = findOptionsForSelectFilter(`groundRules`, filterConfig);
      const breakdown = (
        <>
          {listing && (
            <div className={classNames(css.detailRow, { [css.bold]: confirmAgreementOpen })}>
              <p>Rent</p>
              <p>{!!values?.price && formatMoney(intl, values.price)}</p>
            </div>
          )}
          {startDate && (
            <div className={css.detailRow}>
              <p>Frequency</p>
              <p>Weekly</p>
            </div>
          )}
          {startDate && (
            <>
              <div className={css.detailRow}>
                <p>Start Date</p>
                <p>{moment(startDate.date).format('ddd, DD MMM YYYY')}</p>
              </div>
              <div className={css.detailRow}>
                <p>End Date</p>
                <p>{endDate ? moment(endDate).format('ddd, DD MMM YYYY') : 'Ongoing'}</p>
              </div>
            </>
          )}
        </>
      );
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
          <h2 className={css.title}>The Renters details</h2>
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
          <FieldDate
            pickerClassname={css.dateField}
            label={'Start Date'}
            name="startDate"
            minDate={moment()}
            id={`startDate`}
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
          <TransitionGroup>
            {!confirmAgreementOpen && (
              <Collapse id={'breakdown'} timeout={1000}>
                {breakdown}
              </Collapse>
            )}
          </TransitionGroup>
          <TransitionGroup>
            {confirmAgreementOpen && (
              <Collapse timeout={1000} id={'confirm'}>
                <OutsideClickHandler onOutsideClick={_ => toggleConfirmAgreement(false)}>
                  <h2>Please confirm the details</h2>
                  <p>
                    Before sending the agreement, please confirm that the price and dates are all
                    correct.
                  </p>
                  {breakdown}
                  <PrimaryButton
                    className={css.submitButton}
                    type="submit"
                    inProgress={submitInProgress}
                    disabled={submitDisabled}
                  >
                    FINAL CONFIRM
                    {submitMessage}
                  </PrimaryButton>
                </OutsideClickHandler>
              </Collapse>
            )}
          </TransitionGroup>
          {!confirmAgreementOpen && (
            <PrimaryButton
              className={css.submitButton}
              type="submit"
              inProgress={submitInProgress}
              disabled={submitDisabled}
              onClick={toggleConfirmAgreement}
            >
              INIT
              {submitMessage}
            </PrimaryButton>
          )}
        </Form>
      );
    }}
  />
);

RentalAgreementSetupFormComponent.defaultProps = {
  className: null,
  rootClassName: null,
  filterConfig: config.custom.filters,
};

const { bool, func, string } = PropTypes;

RentalAgreementSetupFormComponent.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
};

const RentalAgreementSetupForm = compose(injectIntl)(RentalAgreementSetupFormComponent);
RentalAgreementSetupForm.displayName = 'RentalAgreementSetupForm';

export default RentalAgreementSetupForm;
