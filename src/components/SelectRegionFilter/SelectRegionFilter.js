import React, { useState } from 'react';
import { array, arrayOf, func, node, number, object, string } from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { FieldSelect } from '..';
import config from '../../config';
import { FilterPopup, FilterPlain } from '..';
import css from './SelectRegionFilter.module.css';

const format = (selectedOptions, searchMode, clear) => {
  if (!selectedOptions) return;
  const selectedToArray = Object.entries(selectedOptions);
  const mode = searchMode ? `${searchMode}:` : '';
  const searchObject = {};
  selectedToArray.forEach(s => {
    const newVal = clear ? null : s[1] ? `${mode}${s[1]}` : null;
    searchObject[`${s[0]}`] = newVal;
  });
  return searchObject;
};

const SelectRegionFilter = props => {
  const [filter, setFilter] = useState(null);
  const [filterContent, setFilterContent] = useState(null);
  const positionStyleForContent = () => {
    if (filter && filterContent) {
      // Render the filter content to the right from the menu
      // unless there's no space in which case it is rendered
      // to the left
      const distanceToRight = window.innerWidth - filter.getBoundingClientRect().right;
      const labelWidth = filter.offsetWidth;
      const contentWidth = filterContent.offsetWidth;
      const contentWidthBiggerThanLabel = contentWidth - labelWidth;
      const renderToRight = distanceToRight > contentWidthBiggerThanLabel;
      const contentPlacementOffset = props.contentPlacementOffset;

      const offset = renderToRight
        ? { left: contentPlacementOffset }
        : { right: contentPlacementOffset };
      // set a min-width if the content is narrower than the label
      const minWidth = contentWidth < labelWidth ? { minWidth: labelWidth } : null;

      return { ...offset, ...minWidth };
    }
    return {};
  };

  const {
    rootClassName,
    className,
    id,
    name,
    label,
    options,
    initialValues,
    contentPlacementOffset,
    onSubmit,
    queryParamNames,
    searchMode,
    intl,
    showAsPopup,
    ...rest
  } = props;
  const [formValues, setFormValues] = useState(initialValues);

  const classes = classNames(rootClassName || css.root, className);
  const hasInitialValues = !!initialValues && Object.entries(initialValues).some(k => !!k[1]);

  const labelForPopup = hasInitialValues
    ? intl.formatMessage({ id: 'SelectRegionFilter.labelSelected' }, { labelText: 'Region' })
    : label;

  const labelForPlain = hasInitialValues
    ? intl.formatMessage(
        { id: 'SelectRegionFilterPlainForm.labelSelected' },
        { labelText: 'Region' }
      )
    : label;

  const contentStyle = positionStyleForContent();

  const handleSubmit = values => {
    onSubmit(format(values, searchMode));
  };
  const handleClear = () => {
    const blankForm = {
      pub_locIsland: null,
      pub_locRegion: null,
      pub_locDistrict: null,
    };
    onSubmit(blankForm);
  };
  const filterConfig = config.custom.filters;
  const regionConfig = filterConfig.find(f => f.id === 'locRegion');
  const regions = regionConfig?.config.options;
  const districtConfig = filterConfig.find(f => f.id === 'locDistrict');
  const districts = districtConfig.config.options;
  const filteredRegions = regions?.filter(r => r.parent === formValues?.pub_locIsland);
  const filteredDistricts = districts?.filter(r => r.parent === formValues?.pub_locRegion);
  return showAsPopup ? (
    <FilterPopup
      className={classes}
      rootClassName={rootClassName}
      popupClassName={css.popupSize}
      name={name}
      label={labelForPopup}
      isSelected={hasInitialValues}
      id={`${id}.popup`}
      showAsPopup
      contentPlacementOffset={contentPlacementOffset}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      keepDirtyOnReinitialize
      prevValues={formValues}
      setFormValues={setFormValues}
      onClear={handleClear}
      onFieldChanges={(val, form) => {
        if (val?.values?.pub_locIsland !== formValues?.pub_locIsland) {
          form.change('pub_locRegion', null);
          form.change('pub_locDistrict', null);
        }
        if (val?.values?.pub_locRegion !== formValues?.pub_locRegion) {
          form.change('pub_locDistrict', null);
        }
      }}
      {...rest}
    >
      <FieldSelect className={css.category} name={'pub_locIsland'} id={id} label={'Island'}>
        <option disabled value="">
          {'Select Island'}
        </option>
        {options.map(c => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </FieldSelect>
      <FieldSelect className={css.category} name={'pub_locRegion'} id={id} label={'Region'}>
        <option disabled value="">
          {'Select Region'}
        </option>
        {filteredRegions.map(c => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </FieldSelect>
      <FieldSelect className={css.category} name={'pub_locDistrict'} id={id} label={'District'}>
        <option disabled value="">
          {'Select District'}
        </option>
        {filteredDistricts.map(c => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </FieldSelect>
    </FilterPopup>
  ) : (
    <FilterPlain
      className={className}
      rootClassName={rootClassName}
      label={labelForPlain}
      isSelected={hasInitialValues}
      id={`${id}.plain`}
      liveEdit
      contentPlacementOffset={contentStyle}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      prevValues={formValues}
      setFormValues={setFormValues}
      onClear={handleClear}
      onFieldChanges={(val, form) => {
        if (val?.values?.pub_locIsland !== formValues?.pub_locIsland) {
          form.change('pub_locRegion', null);
          form.change('pub_locDistrict', null);
        }
        if (val?.values?.pub_locRegion !== formValues?.pub_locRegion) {
          form.change('pub_locDistrict', null);
        }
      }}
      {...rest}
    >
      <FieldSelect className={css.category} name={'pub_locIsland'} id={id} label={'Island'}>
        <option disabled value="">
          {'Select Island'}
        </option>
        {options.map(c => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </FieldSelect>
      <FieldSelect className={css.category} name={'pub_locRegion'} id={id} label={'Region'}>
        <option disabled value="">
          {'Select Region'}
        </option>
        {filteredRegions.map(c => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </FieldSelect>
      <FieldSelect className={css.category} name={'pub_locDistrict'} id={id} label={'District'}>
        <option disabled value="">
          {'Select District'}
        </option>
        {filteredDistricts.map(c => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </FieldSelect>
    </FilterPlain>
  );
};

SelectRegionFilter.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  contentPlacementOffset: 0,
};

SelectRegionFilter.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  name: string.isRequired,
  queryParamNames: arrayOf(string).isRequired,
  label: node.isRequired,
  onSubmit: func.isRequired,
  options: array.isRequired,
  initialValues: object,
  contentPlacementOffset: number,

  // form injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(SelectRegionFilter);
