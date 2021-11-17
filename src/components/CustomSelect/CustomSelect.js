import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { IconReviewUser, Modal } from '..';
import { ReviewForm } from '../../forms';

import css from './CustomSelect.module.css';
const { default: Select } = require('react-select'); // eslint-disable-line global-require

const CustomSelect = props => {
  const {
    className,
    rootClassName,
    id,
    intl,
    isOpen,
    onCloseModal,
    onManageDisableScrolling,
    onSubmitReview,
    revieweeName,
    reviewSent,
    sendReviewInProgress,
    sendReviewError,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const closeButtonMessage = intl.formatMessage({ id: 'CustomSelect.later' });
  const reviewee = <span className={css.reviewee}>{revieweeName}</span>;

  return (
    <>
      {/* <Select
        closeMenuOnSelect={!isMulti}
        hideSelectedOptions={false}
        isMulti={isMulti}
        components={animatedComponents}
        options={options}
        styles={customStyles}
        selected={selectedOptions}
        placeholder={''}
        getOptionValue={value => {
          return value.key;
        }}
        {...rest}
        onChange={item => {
          customOnChange && customOnChange(item);
          setSelectedOptions(item);
          input.onChange(item);
        }}
        theme={theme => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: '#f4f4f4',
            primary: 'black',
          },
        })}
        onFocus={item => {
          setIsFocused(true);
          input.onFocus && input.onFocus(item);
        }}
        onBlur={item => {
          setIsFocused(false);
          input.onBlur && input.onBlur(item);
        }}
      /> */}
    </>
  );
};

const { bool, string } = PropTypes;

CustomSelect.defaultProps = {
  className: null,
  rootClassName: null,
  reviewSent: false,
  sendReviewInProgress: false,
  sendReviewError: null,
};

CustomSelect.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  reviewSent: bool,
  sendReviewInProgress: bool,
  sendReviewError: propTypes.error,
};

export default injectIntl(CustomSelect);
