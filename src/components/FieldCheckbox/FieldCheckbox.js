import React from 'react';
import { any, node, string, object, shape } from 'prop-types';
import classNames from 'classnames';
import { Field } from 'redux-form';
import { ValidationError } from '../../components';

import css from './FieldCheckbox.css';

const IconCheckbox = props => {
  return (
    <svg className={props.className} width="14" height="14" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <g transform="translate(2 2)">
          <path
            className={css.checked}
            d="M9.9992985 1.5048549l-.0194517 6.9993137C9.977549 9.3309651 9.3066522 10 8.4798526 10H1.5001008c-.8284271 0-1.5-.6715729-1.5-1.5l-.000121-7c0-.8284271.6715728-1.5 1.5-1.5h.000121l6.9993246.0006862c.8284272.000067 1.4999458.671694 1.499879 1.5001211a1.5002208 1.5002208 0 0 1-.0000059.0040476z"
          />
          <path
            className={css.box}
            strokeWidth="2"
            d="M10.9992947 1.507634l-.0194518 6.9993137C10.9760133 9.8849417 9.8578519 11 8.4798526 11H1.5001008c-1.3807119 0-2.5-1.1192881-2.5-2.4999827L-1.0000202 1.5c0-1.3807119 1.119288-2.5 2.500098-2.5l6.9994284.0006862c1.3807118.0001115 2.4999096 1.11949 2.4997981 2.5002019-.0000018.003373-.0000018.003373-.0000096.0067458z"
          />
        </g>
        <path
          d="M5.636621 10.7824771L3.3573694 8.6447948c-.4764924-.4739011-.4764924-1.2418639 0-1.7181952.4777142-.473901 1.251098-.473901 1.7288122 0l1.260291 1.1254782 2.8256927-4.5462307c.3934117-.5431636 1.1545778-.6695372 1.7055985-.278265.5473554.3912721.6731983 1.150729.2797866 1.6951077l-3.6650524 5.709111c-.2199195.306213-.5803433.5067097-.9920816.5067097-.3225487 0-.6328797-.1263736-.8637952-.3560334z"
          fill="#FFF"
        />
      </g>
    </svg>
  );
};

IconCheckbox.defaultProps = { className: null };

IconCheckbox.propTypes = { className: string };

const FieldCheckboxComponent = props => {
  const { rootClassName, className, svgClassName, id, label, input, meta, ...rest } = props;

  const classes = classNames(rootClassName || css.root, className);

  const { value, ...inputProps } = input;
  const checked = value === true;

  const checkboxProps = {
    id,
    className: css.input,
    type: 'checkbox',
    checked,
    ...inputProps,
    ...rest,
  };

  return (
    <span className={classes}>
      <input {...checkboxProps} />
      <label htmlFor={id} className={css.label}>
        <span className={css.checkboxWrapper}>
          <IconCheckbox className={svgClassName} />
        </span>
        <span className={css.text}>{label}</span>
      </label>
      <ValidationError fieldMeta={meta} />
    </span>
  );
};

FieldCheckboxComponent.defaultProps = {
  className: null,
  rootClassName: null,
  svgClassName: null,
  label: null,
};

FieldCheckboxComponent.propTypes = {
  className: string,
  rootClassName: string,
  svgClassName: string,
  id: string.isRequired,
  label: node,

  // redux-form Field params
  input: shape({ value: any }).isRequired,
  meta: object.isRequired,
};

const FieldCheckbox = props => {
  return <Field component={FieldCheckboxComponent} {...props} />;
};

export default FieldCheckbox;
