import React from 'react';
import { bool } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import css from './SubscriptionBreakdown.module.css';
import { getPropByName } from '../../util/userHelpers';

const LineItemLengthOfContract = props => {
  const { transaction } = props;

  const protectedData = getPropByName(transaction, 'protectedData');

  const totalLabel = <FormattedMessage id="SubscriptionBreakdown.lengthOfContract" />;
  const { lengthOfContract } = protectedData;

  return (
    <>
      <div className={css.lineItemTotal}>
        <div className={css.totalLabel}>{totalLabel}</div>
        <div className={css.totalPrice}>{lengthOfContract} Weeks</div>
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
