import React from 'react';
import { bool } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import css from './BookingBreakdown.module.css';
import { getPropByName } from '../../util/devHelpers';

const LineItemLengthOfContract = props => {
  const { transaction } = props;

  const protectedData = getPropByName(transaction, 'protectedData');
  const { lengthOfContract, ongoingContract } = protectedData;

  const totalLabel = <FormattedMessage id="BookingBreakdown.lengthOfContract" />;

  return !ongoingContract && (
    <>
      <hr className={css.totalDivider} />
      <div className={css.lineItemTotal}>
        <div className={css.totalLabel}>{totalLabel}</div>
        <div className={css.totalPrice}>{lengthOfContract}</div>
      </div>
    </>
  );
};

LineItemLengthOfContract.propTypes = {
  transaction: propTypes.transaction.isRequired,
  isProvider: bool.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemLengthOfContract;
