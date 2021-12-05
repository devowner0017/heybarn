import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import css from './SubscriptionBreakdown.module.css';

const LineItemWeeksRemaining = props => {
  const { weeksRemaining } = props;

  return (
    <>
      <div className={css.lineItem}>
        <span className={css.itemLabel}>
          <FormattedMessage id="SubscriptionBreakdown.timeRemaining" values={{ units: 'Weeks' }} />
        </span>
        <span className={css.totalPrice}>
          <FormattedMessage
            id="SubscriptionBreakdown.weeksRemaining"
            values={{ quantity: weeksRemaining }}
          />{' '}
          Weeks
        </span>
      </div>
      <hr className={css.totalDivider} />
    </>
  );
};

LineItemWeeksRemaining.propTypes = {
  weeksRemaining: propTypes.number,
};

export default LineItemWeeksRemaining;
