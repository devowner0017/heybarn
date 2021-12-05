import React from 'react';
import { bool } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import css from './BookingBreakdown.module.css';
import { getPropByName } from '../../util/userHelpers';

const LineItemLengthOfContract = props => {
  const { transaction } = props;

  const protectedData = getPropByName(transaction, 'protectedData');
  const { lengthOfContract } = protectedData;

  const totalLabel = <FormattedMessage id="BookingBreakdown.lengthOfContract" />;

  return (
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
