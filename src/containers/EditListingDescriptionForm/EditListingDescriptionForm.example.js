/* eslint-disable no-console */
import EditListingDescriptionForm from './EditListingDescriptionForm';

export const Empty = {
  component: EditListingDescriptionForm,
  props: {
    onSubmit: values => {
      console.log('Submit EditListingDescriptionForm with (unformatted) values:', values);
    },
  },
};
