import classNames from 'classnames';
import { arrayOf, func, node, number, shape, string } from 'prop-types';
import React, { Component } from 'react';
import config from '../../config';
import { SelectRangeFilterForm } from '../../forms';
import { formatCurrencyMajorUnit } from '../../util/currency';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import css from './SelectRangeFilterPopup.module.css';

const KEY_CODE_ESCAPE = 27;
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

class SelectRangeFilterPopup extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.filter = null;
    this.filterContent = null;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.positionStyleForContent = this.positionStyleForContent.bind(this);
  }

  handleSubmit(values) {
    const { onSubmit, queryParamNames } = this.props;
    this.setState({ isOpen: false });
    const numberQueryParamName = getNumberQueryParamName(queryParamNames);
    onSubmit(format(values, numberQueryParamName));
  }

  handleClear() {
    const { onSubmit, queryParamNames } = this.props;
    this.setState({ isOpen: false });
    const numberQueryParamName = getNumberQueryParamName(queryParamNames);
    onSubmit(format(null, numberQueryParamName));
  }

  handleCancel() {
    const { onSubmit, initialValues } = this.props;
    this.setState({ isOpen: false });
    onSubmit(initialValues);
  }

  handleBlur(event) {
    // FocusEvent is fired faster than the link elements native click handler
    // gets its own event. Therefore, we need to check the origin of this FocusEvent.
    if (!this.filter.contains(event.relatedTarget)) {
      this.setState({ isOpen: false });
    }
  }

  handleKeyDown(e) {
    // Gather all escape presses to close menu
    if (e.keyCode === KEY_CODE_ESCAPE) {
      this.toggleOpen(false);
    }
  }

  toggleOpen(enforcedState) {
    if (enforcedState) {
      this.setState({ isOpen: enforcedState });
    } else {
      this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    }
  }

  positionStyleForContent() {
    if (this.filter && this.filterContent) {
      // Render the filter content to the right from the menu
      // unless there's no space in which case it is rendered
      // to the left
      const distanceToRight = window.innerWidth - this.filter.getBoundingClientRect().right;
      const labelWidth = this.filter.offsetWidth;
      const contentWidth = this.filterContent.offsetWidth;
      const contentWidthBiggerThanLabel = contentWidth - labelWidth;
      const renderToRight = distanceToRight > contentWidthBiggerThanLabel;
      const contentPlacementOffset = this.props.contentPlacementOffset;

      const offset = renderToRight
        ? { left: contentPlacementOffset }
        : { right: contentPlacementOffset };
      // set a min-width if the content is narrower than the label
      const minWidth = contentWidth < labelWidth ? { minWidth: labelWidth } : null;

      return { ...offset, ...minWidth };
    }
    return {};
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
      customDisplaySymbol
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);
console.log(this.props)
    const numberQueryParam = getNumberQueryParamName(queryParamNames);
    const initialNumber =
      initialValues && initialValues[numberQueryParam]
        ? parse(initialValues[numberQueryParam])
        : {};
    const { minNumber, maxNumber } = initialNumber || {};

    const hasValue = value => value != null;
    const hasInitialValues = initialValues && hasValue(minNumber) && hasValue(maxNumber);

    const currentLabel = hasInitialValues
      ? intl.formatMessage(
          { id: 'SelectRangeFilter.labelSelectedButton' },
          {
            minNumber: minNumber,
            maxNumber: maxNumber,
          }
        )
      : label
      ? label
      : intl.formatMessage({ id: 'SelectRangeFilter.label' });

    const labelStyles = hasInitialValues ? css.labelSelected : css.label;
    const contentStyle = this.positionStyleForContent();

    return (
      <div
        className={classes}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
        ref={node => {
          this.filter = node;
        }}
      >
        <button className={labelStyles} onClick={() => this.toggleOpen()}>
          {currentLabel}
        </button>
        <SelectRangeFilterForm
          id={id}
          initialValues={hasInitialValues ? initialNumber : { minNumber: min, maxNumber: max }}
          onClear={this.handleClear}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmit}
          intl={intl}
          label={label}
          contentRef={node => {
            this.filterContent = node;
          }}
          style={contentStyle}
          min={min}
          max={max}
          step={step}
          showAsPopup
          isOpen={this.state.isOpen}
          customDisplaySymbol={customDisplaySymbol}
        />
      </div>
    );
  }
}

SelectRangeFilterPopup.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  contentPlacementOffset: 0,
  liveEdit: false,
  step: number,
  currencyConfig: config.currencyConfig,
};

SelectRangeFilterPopup.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  label: node,
  queryParamNames: arrayOf(string).isRequired,
  onSubmit: func.isRequired,
  initialValues: shape({
    number: string,
  }),
  contentPlacementOffset: number,
  min: number.isRequired,
  max: number.isRequired,
  step: number,
  currencyConfig: propTypes.currencyConfig,

  // form injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(SelectRangeFilterPopup);
