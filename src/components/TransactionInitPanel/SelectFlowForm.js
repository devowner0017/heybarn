import React from 'react';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import Form from '../Form/Form';
import { FieldRadioButton } from '..';

export const DIRECT_FLOW = 'direct';
export const PUBLIC_FLOW = 'public';
export const SELECT_FLOW = 'select';

const SelectFlowFormComponent = ({ onChange, intl, providerName, ...rest }) => {
  return (
    <FinalForm
      {...rest}
      onSubmit={onChange}
      initialValuesEqual={false}
      render={({ handleSubmit, listingType }) => {
        const directFlowLabel = intl.formatMessage(
          { id: `SelectFlowForm.${listingType}.directFlowLabel` },
          { providerName }
        );
        const publicFlowLabel = intl.formatMessage(
          { id: `SelectFlowForm.${listingType}.publicFlowLabel` },
          { providerName }
        );
        const selectFlowLabel = intl.formatMessage(
          { id: `SelectFlowForm.${listingType}.selectFlowLabel` },
          { providerName }
        );

        const isListing = listingType === 'listing';

        return (
          <Form onSubmit={handleSubmit}>
            <FormSpy
              subscription={{ values: true }}
              onChange={props => {
                onChange(props.values);
              }}
            />
            <div>
              <h3>
                <FormattedMessage id="SelectFlowForm.heading" />
              </h3>

              {isListing && (
                <FieldRadioButton
                  id={DIRECT_FLOW}
                  name="flow"
                  value={DIRECT_FLOW}
                  label={directFlowLabel}
                  showAsRequired
                />
              )}
              <FieldRadioButton
                id={PUBLIC_FLOW}
                name="flow"
                value={PUBLIC_FLOW}
                label={publicFlowLabel}
                showAsRequired
              />
              <FieldRadioButton
                id={SELECT_FLOW}
                name="flow"
                value={SELECT_FLOW}
                label={selectFlowLabel}
                showAsRequired
              />
            </div>
          </Form>
        );
      }}
    />
  );
};

export default injectIntl(SelectFlowFormComponent);
