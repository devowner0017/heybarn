import React from 'react';
import {
  BookingDateRangeFilter,
  PriceFilter,
  KeywordFilter,
  SelectSingleFilter,
  SelectMultipleFilter,
  SelectRegionFilter,
} from '../../components';

/**
 * FilterComponent is used to map configured filter types
 * to actual filter components
 */
const FilterComponent = props => {
  const {
    idPrefix,
    filterConfig,
    urlQueryParams,
    initialValues,
    getHandleChangedValueFn,
    searchType,
    ...rest
  } = props;
    console.log("🚀 | file: FilterComponent.js | line 24 | initialValues", initialValues);
  console.log('🚀 | file: FilterComponent.js | line 24 | urlQueryParams', urlQueryParams);
  console.log('🚀 | file: FilterComponent.js | line 26 | searchType', searchType);
  const { id, type, queryParamNames, label, config, listingType } = filterConfig;
  console.log('🚀 | file: FilterComponent.js | line 25 | filterConfig', filterConfig);
  const { liveEdit, showAsPopup } = rest;

  const useHistoryPush = liveEdit || showAsPopup;
  const prefix = idPrefix || 'SearchPage';
  const componentId = `${prefix}.${id.toLowerCase()}`;
  const name = id.replace(/\s+/g, '-').toLowerCase();
  if (!listingType || !listingType.includes(searchType)) return null;
  switch (type) {
    case 'SelectSingleFilter': {
      return (
        <SelectSingleFilter
          id={componentId}
          label={label}
          queryParamNames={queryParamNames}
          initialValues={initialValues(queryParamNames)}
          onSelect={getHandleChangedValueFn(useHistoryPush)}
          {...config}
          {...rest}
        />
      );
    }
    case 'SelectRegionFilter': {
      return (
        <SelectRegionFilter
          id={componentId}
          label={label}
          name={name}
          queryParamNames={queryParamNames}
          initialValues={initialValues(queryParamNames)}
          onSubmit={getHandleChangedValueFn(useHistoryPush)}
          {...config}
          {...rest}
        />
      );
    }
    case 'SelectMultipleFilter': {
      return (
        <SelectMultipleFilter
          id={componentId}
          label={label}
          name={name}
          queryParamNames={queryParamNames}
          initialValues={initialValues(queryParamNames)}
          onSubmit={getHandleChangedValueFn(useHistoryPush)}
          {...config}
          {...rest}
        />
      );
    }
    case 'BookingDateRangeFilter': {
      return (
        <BookingDateRangeFilter
          id={componentId}
          label={label}
          queryParamNames={queryParamNames}
          initialValues={initialValues(queryParamNames)}
          onSubmit={getHandleChangedValueFn(useHistoryPush)}
          {...config}
          {...rest}
        />
      );
    }
    case 'PriceFilter': {
      return (
        <PriceFilter
          id={componentId}
          label={label}
          queryParamNames={queryParamNames}
          initialValues={initialValues(queryParamNames)}
          onSubmit={getHandleChangedValueFn(useHistoryPush)}
          {...config}
          {...rest}
        />
      );
    }
    case 'KeywordFilter':
      return (
        <KeywordFilter
          id={componentId}
          label={label}
          name={name}
          queryParamNames={queryParamNames}
          initialValues={initialValues(queryParamNames)}
          onSubmit={getHandleChangedValueFn(useHistoryPush)}
          {...config}
          {...rest}
        />
      );
    default:
      return null;
  }
};

export default FilterComponent;
