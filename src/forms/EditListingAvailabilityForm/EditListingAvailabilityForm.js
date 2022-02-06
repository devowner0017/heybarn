import React, { Component } from 'react';
import { bool, func, object, string } from 'prop-types';
import { compose } from 'redux';
import { FormSpy, Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button, FieldDateInput, FieldCheckbox } from '../../components';
import { TransitionGroup } from 'react-transition-group';

// import ManageAvailabilityCalendar from './ManageAvailabilityCalendar';
import css from './EditListingAvailabilityForm.module.css';
import { Collapse } from '@mui/material';
const identity = v => v;

export class EditListingAvailabilityFormComponent extends Component {
  render() {
    return (
      <FinalForm
        {...this.props}
        render={formRenderProps => {
          const {
            form,
            className,
            rootClassName,
            disabled,
            ready,
            handleSubmit,
            //intl,
            invalid,
            pristine,
            saveActionMsg,
            updated,
            updateError,
            updateInProgress,
            availability,
            availabilityPlan,
            listingId,
            initialValues,
            values,
          } = formRenderProps;
            console.log("🚀 | file: EditListingAvailabilityForm.js | line 42 | EditListingAvailabilityFormComponent | render | initialValues", initialValues);
            console.log("🚀 | file: EditListingAvailabilityForm.js | line 41 | EditListingAvailabilityFormComponent | render | values", values);

          const errorMessage = updateError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingAvailabilityForm.updateFailed" />
            </p>
          ) : null;

          const classes = classNames(rootClassName || css.root, className);
          const submitReady = (updated && pristine) || ready;
          const submitInProgress = updateInProgress;
          const submitDisabled = invalid || disabled || submitInProgress;

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {errorMessage}
              <FieldCheckbox
                className={css.field}
                id={'perpetual'}
                name={'perpetual'}
                label={'Ongoing rental (no specific end date)?'}
                value={true}
              />
              <FormSpy
                subscription={{ values: true }}
                onChange={({ values }) => {
                  const { perpetual, endDate } = values;
                  if (!!perpetual?.[0] && !!endDate) {
                    form.change(`endDate`, null);
                  }
                }}
              />
              <div className={css.calendarWrapper}>
                {/* <ManageAvailabilityCalendar
                  availability={availability}
                  availabilityPlan={availabilityPlan}
                  listingId={listingId}
                /> */}
                <div className={css.fieldWrapper}>
                  <FieldDateInput
                    className={css.field}
                    label={'Start Date'}
                    name="startDate"
                    id={`startDate`}
                    unitType={'units'}
                    startDateId={`startDate`}
                    startDateLabel={'Start Date'}
                    placeholderText={'Select...'}
                    endDateId={`endDate`}
                    endDateLabel={'EndLabel'}
                    endDatePlaceholderText={'endDatePlaceholderText'}
                    endDateReadOnly
                    // focusedInput={focusedInput}
                    // onFocusedInputChange={onFocusedInputChange}
                    format={identity}
                    // timeSlots={timeSlots}
                    customIsDayBlocked={date => {
                      return false;
                    }}
                    customIsDayOutsideRange={date => {
                      return false;
                    }}
                  />
                </div>

                <TransitionGroup className={css.field}>
                  {!values?.perpetual?.[0] && (
                    <Collapse timeout={300} orientation='horizontal'>
                      <FieldDateInput
                        label={'End Date'}
                        name="endDate"
                        id={`endDate`}
                        unitType={'units'}
                        endDateId={`endDate`}
                        endDateLabel={'End Date'}
                        placeholderText={'Select...'}
                        endDateId={`endDate`}
                        endDateLabel={'EndLabel'}
                        endDatePlaceholderText={'endDatePlaceholderText'}
                        endDateReadOnly
                        format={identity}
                        required
                        customIsDayBlocked={date => {
                          return false;
                        }}
                        customIsDayOutsideRange={date => {
                          return false;
                        }}
                      />
                    </Collapse>
                  )}
                </TransitionGroup>
              </div>

              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={submitReady}
              >
                {saveActionMsg}
              </Button>
              {this.props.backButton}
            </Form>
          );
        }}
      />
    );
  }
}

EditListingAvailabilityFormComponent.defaultProps = {
  updateError: null,
};

EditListingAvailabilityFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  availability: object.isRequired,
  availabilityPlan: propTypes.availabilityPlan.isRequired,
};

export default compose(injectIntl)(EditListingAvailabilityFormComponent);
