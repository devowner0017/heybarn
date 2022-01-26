import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Field } from 'react-final-form';
import { ValidationError } from '../../components';

import css from './CustomSelect.module.css';
const { default: Select } = require('react-select'); // eslint-disable-line global-require

const CustomSelect = props => {
  const {
    className,
    rootClassName,
    labelClassName,
    customErrorText,
    id,
    name,
    label,
    placeholder,
    multi,
    meta,
    input,
    ...rest
  } = props;

  const { valid, invalid, touched, error } = meta || {};
  const hasError = !!customErrorText || !!(touched && invalid && error);

  const classes = classNames(rootClassName || css.root, className);

  const selectClasses = classNames(css.select, {
    [css.selectSuccess]: valid,
    [css.selectError]: hasError,
  });

  const errorText = customErrorText || error;

  // Error message and input error styles are only shown if the
  // field has been touched and the validation has failed.

  const fieldMeta = { touched: hasError, error: errorText };
  const selectProps = { className: selectClasses, id, ...input, ...rest };
  return (
    <div className={classes}>
      {label ? (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      ) : null}
      <Select
        {...selectProps}
        getOptionValue={value => {
          return value.key;
        }}
      />
      <ValidationError fieldMeta={fieldMeta} />
    </div>
  );
};

const { bool, string } = PropTypes;

CustomSelect.defaultProps = {
  className: null,
  rootClassName: null,
};

CustomSelect.propTypes = {
  className: string,
  rootClassName: string,
};

class FieldCustomSelectInput extends Component {
  componentWillUnmount() {
    // Unmounting happens too late if it is done inside Field component
    // (Then Form has already registered its (new) fields and
    // changing the value without corresponding field is prohibited in Final Form
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  render() {
    return <Field component={CustomSelect} {...this.props} />;
  }
}
export default FieldCustomSelectInput;
