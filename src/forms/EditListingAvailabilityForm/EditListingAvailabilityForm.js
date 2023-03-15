import React, { Component } from 'react';
import { bool, func, object, string } from 'prop-types';
import { compose } from 'redux';
import { FormSpy, Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button, FieldCheckbox, FieldDate } from '../../components';
import { TransitionGroup } from 'react-transition-group';

// import ManageAvailabilityCalendar from './ManageAvailabilityCalendar';
import css from './EditListingAvailabilityForm.module.css';
import { Collapse } from '@mui/material';
import moment from 'moment';
import { required } from '../../util/validators';

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
            invalid,
            pristine,
            saveActionMsg,
            updated,
            updateError,
            updateInProgress,
            values,
          } = formRenderProps;

          const errorMessage = updateError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingAvailabilityForm.updateFailed" />
            </p>
          ) : null;

          const classes = classNames(rootClassName || css.root, className);
          const submitReady = (updated && pristine) || ready;
          const submitInProgress = updateInProgress;
          const submitDisabled =
            invalid ||
            disabled ||
            submitInProgress ||
            !values.startDate ||
            (values.endDate && values.endDate.isBefore(values.startDate));

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {errorMessage}

              <FormSpy
                subscription={{ values: true }}
                onChange={({ values }) => {
                  const { perpetual, endDate } = values;
                  if (!!perpetual?.[0] && !!endDate) {
                    form.change(`endDate`, null);
                  }
                }}
              />
              <div>
                <div className={css.calendarWrapper}>
                  <div className={css.fieldWrapper}>
                    <FieldDate
                      pickerClassname={css.dateField}
                      label={'Start Date'}
                      name="startDate"
                      minDate={moment()}
                      id={`startDate`}
                      validators={required('Required')}
                      required
                    />
                  </div>

                  <TransitionGroup className={css.fieldWrapper}>
                    {!values?.perpetual?.[0] && (
                      <Collapse timeout={300} orientation="horizontal">
                        <FieldDate
                          pickerClassname={css.dateField}
                          label={'End Date'}
                          name="endDate"
                          minDate={values?.startDate}
                          id={`endDate`}
                        />
                      </Collapse>
                    )}
                  </TransitionGroup>
                </div>
                <FieldCheckbox
                  className={css.field}
                  id={'perpetual'}
                  name={'perpetual'}
                  label={'Ongoing rental (no specific end date)?'}
                  value={true}
                />
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
