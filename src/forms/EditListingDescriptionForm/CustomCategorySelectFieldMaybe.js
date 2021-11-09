import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './EditListingDescriptionForm.module.css';

const CustomCategorySelectFieldMaybe = props => {
  const { name, id, options, label, placeholder, showRequired, requiredMessage, intl } = props;

  const requiredValidation = required(
    intl.formatMessage({
      id: requiredMessage || 'SelectField.required',
    })
  );
  return options ? (
    <FieldSelect
      className={css.category}
      name={name}
      id={id}
      label={label}
      validate={showRequired && requiredValidation}
    >
      <option disabled value="">
        {placeholder}
      </option>
      {options.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default CustomCategorySelectFieldMaybe;
