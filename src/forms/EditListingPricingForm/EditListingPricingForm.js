import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import { Button, Form, FieldCurrencyInput } from '../../components';
import css from './EditListingPricingForm.module.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const { Money } = sdkTypes;

export const EditListingPricingFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
      } = formRenderProps;

      const unitType = config.bookingUnitType;
      const isNightly = unitType === LINE_ITEM_NIGHT;
      const isDaily = unitType === LINE_ITEM_DAY;

      const translationKey = isNightly
        ? 'EditListingPricingForm.pricePerNight'
        : isDaily
        ? 'EditListingPricingForm.pricePerDay'
        : 'EditListingPricingForm.pricePerUnit';

      const pricePerUnitMessage = intl.formatMessage({
        id: translationKey,
      });

      const pricePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.priceInputPlaceholder',
      });

      const priceRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingPricingForm.priceRequired',
        })
      );
      const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
      const minPriceRequired = validators.moneySubUnitAmountAtLeast(
        intl.formatMessage(
          {
            id: 'EditListingPricingForm.priceTooLow',
          },
          {
            minPrice: formatMoney(intl, minPrice),
          }
        ),
        config.listingMinimumPriceSubUnits
      );
      const priceValidators = config.listingMinimumPriceSubUnits
        ? validators.composeValidators(priceRequired, minPriceRequired)
        : priceRequired;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const { updateListingError, showListingsError } = fetchErrors || {};
      const northIsland = [
        { region: 'Auckland', price: 79 },
        { region: 'Auckland', price: 79 },
        { region: 'Hamilton', price: 62 },
        { region: 'Manawatu-Wanganui', price: 54 },
        { region: 'Taranaki', price: 38 },
        { region: 'Taupo', price: 42 },
        { region: 'Tauranga', price: 55 },
        { region: 'Waikato', price: 66 },
        { region: 'Wellington', price: 60 },
      ];
      const southIsland = [
        { region: 'Canterbury', price: 60 },
        { region: 'Otago', price: 45 },
      ];
      const table = (
        <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#c35827' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 800 }}>Region</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 800 }} align="center">
                  $ per week per bay of space
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={'NORTH_ISLAND'}>
                <TableCell component="th" scope="row" colSpan={2} sx={{ fontWeight: 800 }}>
                  NORTH ISLAND
                </TableCell>
              </TableRow>
              {northIsland.map(r => {
                return (
                  <TableRow key={`${r.region}_north`}>
                    <TableCell component="th" scope="row">
                      {r.region}
                    </TableCell>
                    <TableCell align="center">${r.price}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow key={'BREAK'}></TableRow>
              <TableRow key={'SOUTH_ISLAND'}>
                <TableCell component="th" scope="row" colSpan={2} sx={{ fontWeight: 800 }}>
                  SOUTH ISLAND
                </TableCell>
              </TableRow>
              {southIsland.map(r => {
                return (
                  <TableRow key={r.region}>
                    <TableCell component="th" scope="row">
                      {r.region}
                    </TableCell>
                    <TableCell align="center">${r.price}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
      return (
        <Form onSubmit={handleSubmit} className={classes}>
          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.updateFailed" />
            </p>
          ) : null}
          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.showListingFailed" />
            </p>
          ) : null}
          <FieldCurrencyInput
            id="price"
            name="price"
            className={css.priceInput}
            autoFocus
            label={pricePerUnitMessage}
            placeholder={pricePlaceholderMessage}
            currencyConfig={config.currencyConfig}
            validate={priceValidators}
          />
          <p>
            To help you select an appropriate rental rate, this table gives the average weekly rates
            being charged for purpose-built, self storage bays (6m x 3m) in February 2022. Multiply
            this by the number of available bays you wish to rent and adjust it to reflect the
            quality of the space you think you are offering:
          </p>
          {table}
          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
          {props.backButton}
        </Form>
      );
    }}
  />
);

EditListingPricingFormComponent.defaultProps = { fetchErrors: null };

EditListingPricingFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingPricingFormComponent);
