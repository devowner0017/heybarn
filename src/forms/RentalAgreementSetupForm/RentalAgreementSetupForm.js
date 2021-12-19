import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';
import { isTransactionsTransitionAlreadyReviewed } from '../../util/errors';
import { propTypes } from '../../util/types';
import { required } from '../../util/validators';
import {
  FieldReviewRating,
  Form,
  PrimaryButton,
  FieldTextInput,
  FieldNumberInput,
  FieldDateInput,
  FieldCheckbox,
  FieldDateRangeInput,
} from '../../components';

import css from './RentalAgreementSetupForm.module.css';
import moment from 'moment';
import { dateFromLocalToAPI } from '../../util/dates';
const identity = v => v;

const RentalAgreementSetupFormComponent = props => (
  <FinalForm
    {...props}
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
        const { lengthOfContract, startDate, endDate } = formValues.values;
        if (!startDate) return null;
        const endDateMaybe = moment(startDate?.date).add(lengthOfContract, 'weeks');
        if (startDate && lengthOfContract && !moment(endDateMaybe).isSame(moment(endDate))) {
          form.change(`endDate`, endDateMaybe);
        }
      };
      return (
        <Form className={classes} onSubmit={handleSubmit}>
          <FieldCheckbox
            id={'ongoingContract'}
            name={'ongoingContract'}
            label={'On Going'}
            value={true}
          />
          {!values.ongoingContract && (
            <FieldNumberInput
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
            className={css.bookingDates}
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
          />
          {errorArea}
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
