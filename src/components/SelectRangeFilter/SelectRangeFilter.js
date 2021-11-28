import { bool } from 'prop-types';
import React from 'react';
import SelectRangeFilterPlain from './SelectRangeFilterPlain';
import SelectRangeFilterPopup from './SelectRangeFilterPopup';

const SelectRangeFilter = props => {
  const { showAsPopup, ...rest } = props;
  return showAsPopup ? <SelectRangeFilterPopup {...rest} /> : <SelectRangeFilterPlain {...rest} />;
};

SelectRangeFilter.defaultProps = {
  showAsPopup: false,
};

SelectRangeFilter.propTypes = {
  showAsPopup: bool,
};

export default SelectRangeFilter;
