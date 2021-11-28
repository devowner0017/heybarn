import classNames from 'classnames';
import { arrayOf, func, node, number, shape, string } from 'prop-types';
import React, { Component } from 'react';
// import { formatCurrencyMajorUnit } from '../../util/currency';
import config from '../../config';
import { SelectRangeFilterForm } from '../../forms';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import css from './SelectRangeFilterPlain.module.css';



const RADIX = 10;

const getNumberQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames)
    ? queryParamNames[0]
    : typeof queryParamNames === 'string'
    ? queryParamNames
    : 'number';
};

// Parse value, which should look like "0,1000"
const parse = numberRange => {
  const [minNumber, maxNumber] = !!numberRange
    ? numberRange.split(',').map(v => Number.parseInt(v, RADIX))
    : [];
  // Note: we compare to null, because 0 as minNumber is falsy in comparisons.
  return !!numberRange && minNumber != null && maxNumber != null ? { minNumber, maxNumber } : null;
};

// Format value, which should look like { minNumber, maxNumber }
const format = (range, queryParamName) => {
  const { minNumber, maxNumber } = range || {};
  // Note: we compare to null, because 0 as minNumber is falsy in comparisons.
  const value = minNumber != null && maxNumber != null ? `${minNumber},${maxNumber}` : null;
  return { [queryParamName]: value };
};

class SelectRangeFilterPlainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true };

    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
  }

  handleChange(values) {
    const { onSubmit, queryParamNames } = this.props;
    const numberQueryParamName = getNumberQueryParamName(queryParamNames);
    onSubmit(format(values, numberQueryParamName));
  }

  handleClear() {
    const { onSubmit, queryParamNames } = this.props;
    const numberQueryParamName = getNumberQueryParamName(queryParamNames);
    onSubmit(format(null, numberQueryParamName));
  }

  toggleIsOpen() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const {
      rootClassName,
      className,
      id,
      label,
      queryParamNames,
      initialValues,
      min,
      max,
      step,
      intl,
      customDisplaySymbol,
    } = this.props;

    const classes = classNames(rootClassName || css.root, className);

    const numberQueryParam = getNumberQueryParamName(queryParamNames);
    const initialNumber = initialValues ? parse(initialValues[numberQueryParam]) : {};
    const { minNumber, maxNumber } = initialNumber || {};

    const hasValue = value => value != null;
    const hasInitialValues = initialValues && hasValue(minNumber) && hasValue(maxNumber);

    const labelClass = hasInitialValues ? css.filterLabelSelected : css.filterLabel;

    return (
      <div className={classes}>
        <div className={labelClass}>
          <button type="button" className={css.labelButton} onClick={this.toggleIsOpen}>
            <span className={labelClass}>{label}</span>
          </button>
          <button type="button" className={css.clearButton} onClick={this.handleClear}>
            {/* <IconBase iconName={'Reset'} f5 small /> */}X
          </button>
        </div>
        <div className={css.formWrapper}>
          <SelectRangeFilterForm
            id={id}
            initialValues={hasInitialValues ? initialNumber : { minNumber: min, maxNumber: max }}
            onChange={this.handleChange}
            intl={intl}
            contentRef={node => {
              this.filterContent = node;
            }}
            min={min}
            max={max}
            step={step}
            liveEdit
            isOpen={this.state.isOpen}
            customDisplaySymbol={customDisplaySymbol}
          />
        </div>
      </div>
    );
  }
}

SelectRangeFilterPlainComponent.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  step: number,
  currencyConfig: config.currencyConfig,
};

SelectRangeFilterPlainComponent.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  label: node,
  queryParamNames: arrayOf(string).isRequired,
  onSubmit: func.isRequired,
  initialValues: shape({
    number: string,
  }),
  min: number.isRequired,
  max: number.isRequired,
  step: number,
  currencyConfig: propTypes.currencyConfig,

  // form injectIntl
  intl: intlShape.isRequired,
};

const SelectRangeFilterPlain = injectIntl(SelectRangeFilterPlainComponent);

export default SelectRangeFilterPlain;
