import React, { useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { bool, func, number, object, string } from 'prop-types';
import { Field, Form as FinalForm, FormSpy } from 'react-final-form';
import { Form, RangeSlider } from '../../components';
import { injectIntl, intlShape } from '../../util/reactIntl';
import css from './SelectRangeFilterForm.module.css';

const DEBOUNCE_WAIT_TIME = 400;
const CustomInput = props => {
  const { input, setFocusedInput, ...rest } = props;
  return (
    <input
      {...input}
      className={''}
      {...rest}
      onBlur={() => {
        setFocusedInput(0);
      }}
      onFocus={e => {
        e.target.select();
      }}
      autoFocus
    />
  );
};

// Helper function to parse value for min handle
// Value needs to be between slider's minimum value and current maximum value
const parseValue = (min, max) => value => {
  const parsedValue = Number.parseInt(value, 10);
  if (isNaN(parsedValue)) {
    return '';
  }
  return parsedValue < min ? min : parsedValue > max ? max : parsedValue;
};

// SelectRangeFilterForm component
const SelectRangeFilterFormComponent = props => {
  const { liveEdit, onChange, onSubmit, onCancel, onClear, ...rest } = props;

  const [focusedInput, setFocusedInput] = useState(0);
  if (liveEdit && !onChange) {
    throw new Error(
      'SelectRangeFilterForm: if liveEdit is true you need to provide onChange function'
    );
  }

  if (!liveEdit && !(onCancel && onClear && onSubmit)) {
    throw new Error(
      'SelectRangeFilterForm: if liveEdit is false you need to provide onCancel, onClear, and onSubmit functions'
    );
  }

  const handleChange = debounce(
    formState => {
      if (formState.dirty) {
        const { minNumber, maxNumber, ...restValues } = formState.values;
        onChange({
          minNumber: minNumber === '' ? rest.min : minNumber > maxNumber ? maxNumber : minNumber,
          maxNumber: maxNumber === '' ? rest.max : minNumber > maxNumber ? minNumber : maxNumber,
          ...restValues,
        });
      }
    },
    DEBOUNCE_WAIT_TIME,
    { leading: false, trailing: true }
  );

  const handleSubmit = values => {
    const { minNumber, maxNumber, ...restValues } = values;

    return onSubmit({
      minNumber: minNumber === '' ? rest.min : minNumber > maxNumber ? maxNumber : minNumber,
      maxNumber: maxNumber === '' ? rest.max : minNumber > maxNumber ? minNumber : maxNumber,
      ...restValues,
    });
  };

  const formCallbacks = liveEdit
    ? { onSubmit: () => null }
    : { onSubmit: handleSubmit, onCancel, onClear };

  const shortenNumber = num => {
    return Math.abs(num) > 999999
      ? Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + 'M'
      : Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'K'
      : Math.sign(num) * Math.abs(num);
  };
  return (
    <FinalForm
      {...rest}
      {...formCallbacks}
      render={formRenderProps => {
        const {
          form,
          handleSubmit,
          id,
          showAsPopup,
          onClear,
          onCancel,
          isOpen,
          contentRef,
          style,
          intl,
          values,
          min,
          max,
          step,
          label,
          customDisplaySymbol,
        } = formRenderProps;
        const { minNumber: minNumberRaw, maxNumber: maxNumberRaw } = values;
        const minNumber = typeof minNumberRaw !== 'string' ? minNumberRaw : min;
        const maxNumber = typeof maxNumberRaw !== 'string' ? maxNumberRaw : max;
        const handleCancel = () => {
          form.reset();
          onCancel();
        };

        const clear = intl.formatMessage({ id: 'SelectRangeFilterForm.clear' });
        const cancel = intl.formatMessage({ id: 'SelectRangeFilterForm.cancel' });
        const submit = intl.formatMessage({ id: 'SelectRangeFilterForm.submit' });
        const classes = classNames(css.root, {
          [css.popup]: showAsPopup,
          [css.isOpenAsPopup]: showAsPopup && isOpen,
          [css.plain]: !showAsPopup,
          [css.isOpen]: !showAsPopup && isOpen,
        });
        return (
          <Form
            className={classes}
            onSubmit={handleSubmit}
            tabIndex="0"
            contentRef={contentRef}
            style={{ ...style }}
          >
            {label && <div className={css.label}>{label}</div>}
            <div className={css.sliderWrapper}>
              <RangeSlider
                min={min}
                max={max}
                step={step}
                handles={[minNumber, maxNumber]}
                onChange={handles => {
                  form.change('minNumber', handles[0]);
                  form.change('maxNumber', handles[1]);
                }}
              />
            </div>
            <div className={css.inputsWrapper}>
              <div className={css.col}>
                <span className={css.numberSeparator}>Min:</span>
                <Field
                  className={css.minNumber}
                  id={`${id}.minNumber`}
                  name="minNumber"
                  type="number"
                  placeholder={shortenNumber(minNumber)}
                  onFocus={e => {
                    e.target.select();
                  }}
                  min={min}
                  max={max}
                  step={step}
                  parse={parseValue(min, max, minNumber, maxNumber)}
                >
                  {props => {
                    return (
                      <>
                        <input
                          className={focusedInput === 1 ? css.hidden : 'css.hidden'}
                          value={shortenNumber(minNumber)}
                          onClick={() => {
                            setFocusedInput(1);
                          }}
                          readOnly
                        />
                        {focusedInput === 0 || focusedInput === 2 ? null : (
                          <CustomInput
                            {...props}
                            focusedInput={focusedInput}
                            setFocusedInput={setFocusedInput}
                          />
                        )}
                        {customDisplaySymbol &&
                          customDisplaySymbol !== ' in.' &&
                          customDisplaySymbol}
                      </>
                    );
                  }}
                </Field>
              </div>
              <div className={css.col}>
                <span className={css.numberSeparator}>Max:</span>

                <Field
                  // className={css.maxNumber}
                  id={`${id}.maxNumber`}
                  name="maxNumber"
                  // component="input"
                  type="number"
                  placeholder={shortenNumber(maxNumber)}
                  onFocus={e => {
                    e.target.select();
                  }}
                  min={min}
                  max={max}
                  step={step}
                  parse={parseValue(min, max, minNumber, maxNumber)}
                >
                  {props => {
                    return (
                      <>
                        <input
                          className={focusedInput === 2 ? css.hidden : 'css.hidden'}
                          value={shortenNumber(maxNumber)}
                          onClick={() => {
                            setFocusedInput(2);
                          }}
                          readOnly
                        />
                        {focusedInput === 0 || focusedInput === 1 ? null : (
                          <CustomInput
                            {...props}
                            focusedInput={focusedInput}
                            setFocusedInput={setFocusedInput}
                          />
                        )}
                        {customDisplaySymbol &&
                          customDisplaySymbol !== ' in.' &&
                          customDisplaySymbol}
                      </>
                    );
                  }}
                </Field>
              </div>
            </div>

            {liveEdit ? (
              <FormSpy onChange={handleChange} subscription={{ values: true, dirty: true }} />
            ) : (
              <div className={css.buttonsWrapper}>
                <button className={css.clearButton} type="button" onClick={onClear}>
                  {clear}
                </button>
                <button className={css.cancelButton} type="button" onClick={handleCancel}>
                  {cancel}
                </button>
                <button className={css.submitButton} type="submit">
                  {submit}
                </button>
              </div>
            )}
          </Form>
        );
      }}
    />
  );
};

SelectRangeFilterFormComponent.defaultProps = {
  liveEdit: false,
  showAsPopup: false,
  isOpen: false,
  contentRef: null,
  style: null,
  min: 0,
  step: 1,
  onCancel: null,
  onChange: null,
  onClear: null,
  onSubmit: null,
};

SelectRangeFilterFormComponent.propTypes = {
  id: string.isRequired,
  liveEdit: bool,
  showAsPopup: bool,
  onCancel: func,
  onChange: func,
  onClear: func,
  onSubmit: func,
  isOpen: bool,
  contentRef: func,
  style: object,
  min: number.isRequired,
  max: number.isRequired,
  step: number,

  // form injectIntl
  intl: intlShape.isRequired,
};

const SelectRangeFilterForm = injectIntl(SelectRangeFilterFormComponent);

export default SelectRangeFilterForm;
