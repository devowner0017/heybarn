/**
 * This component will show the booking info and calculated total price.
 * I.e. dates and other details related to payment decision in receipt format.
 */
import React from 'react';
import { oneOf, string } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import {
  propTypes,
  LINE_ITEM_CUSTOMER_COMMISSION,
  LINE_ITEM_PROVIDER_COMMISSION,
} from '../../util/types';

import LineItemBookingPeriod from './LineItemBookingPeriod';
import LineItemBasePriceMaybe from './LineItemBasePriceMaybe';
import LineItemUnitsMaybe from './LineItemUnitsMaybe';
import LineItemSubTotalMaybe from './LineItemSubTotalMaybe';
import LineItemCustomerCommissionMaybe from './LineItemCustomerCommissionMaybe';
import LineItemCustomerCommissionRefundMaybe from './LineItemCustomerCommissionRefundMaybe';
import LineItemProviderCommissionMaybe from './LineItemProviderCommissionMaybe';
import LineItemProviderCommissionRefundMaybe from './LineItemProviderCommissionRefundMaybe';
import LineItemRefundMaybe from './LineItemRefundMaybe';
import LineItemTotalPrice from './LineItemTotalPrice';
import LineItemUnknownItemsMaybe from './LineItemUnknownItemsMaybe';
import LineItemWeeksRemaining from './LineItemWeeksRemaining';
import LineItemNextPayment from './LineItemNextPayment';

import css from './SubscriptionBreakdown.module.css';
import LineItemLengthOfContract from './LineItemLengthOfContract';
import moment from 'moment';

export const SubscriptionBreakdownComponent = props => {
  const {
    rootClassName,
    className,
    userRole,
    unitType,
    transaction,
    intl,
    dateType,
    subscription,
  } = props;
  if (!subscription) return null;
  console.log('🚀 | file: SubscriptionBreakdown.js | line 41 | props', props);
  const { booking } = transaction;
  console.log('🚀 | file: SubscriptionBreakdown.js | line 44 | transaction', transaction);
  const {
    current_period_end: nextPeriodBegins,
    trial_end: trialEnd,
    cancel_at: contractEnd,
  } = subscription;
  console.log('🚀 | file: SubscriptionBreakdown.js | line 34 | protectedData', subscription);
  const isCustomer = userRole === 'customer';
  const isProvider = userRole === 'provider';
  const hasCommissionLineItem = transaction.attributes.lineItems.find(item => {
    const hasCustomerCommission = isCustomer && item.code === LINE_ITEM_CUSTOMER_COMMISSION;
    const hasProviderCommission = isProvider && item.code === LINE_ITEM_PROVIDER_COMMISSION;
    return (hasCustomerCommission || hasProviderCommission) && !item.reversal;
  });
  const contractHasStarted = trialEnd < moment().unix();
  console.log('🚀 | file: SubscriptionBreakdown.js | line 54 | contractEnd', contractEnd);
  console.log('🚀 | file: SubscriptionBreakdown.js | line 54 | trialEnd', trialEnd);
  console.log('🚀 | file: SubscriptionBreakdown.js | line 54 | nextPeriodBegins', nextPeriodBegins);
  console.log(
    '🚀 | file: SubscriptionBreakdown.js | line 53 |  subscription.trial_end',
    subscription.trial_end
  );
  console.log('🚀 | file: SubscriptionBreakdown.js | line 53 |  moment().unix()', moment().unix());
  console.log(
    '🚀 | file: SubscriptionBreakdown.js | line 53 | contractHasStarted',
    contractHasStarted
  );
  const { start, end } = booking?.attributes;
  console.log('🚀 | file: SubscriptionBreakdown.js | line 71 | endDate', end);
  console.log('🚀 | file: SubscriptionBreakdown.js | line 71 | startDate', start);
  const weeksRemaining = moment(start).diff(moment(end), 'weeks');
  console.log('🚀 | file: SubscriptionBreakdown.js | line 72 | weeksRemaining', weeksRemaining);
  console.log('🚀 | file: SubscriptionBreakdown.js | line 71 | startDate', start);
  const startDateTS = moment(start).unix();
  console.log('🚀 | file: SubscriptionBreakdown.js | line 72 | startDateTS', startDateTS);
  const nextPaymentDate = moment.unix(nextPeriodBegins);
  const lastPaymentPayment = moment.unix(contractEnd);

  const classes = classNames(rootClassName || css.root, className);

  /**
   * SubscriptionBreakdown contains different line items:
   *
   * LineItemBookingPeriod: prints booking start and booking end types. Prop dateType
   * determines if the date and time or only the date is shown
   *
   * LineItemUnitsMaybe: if he unitType is line-item/unit print the name and
   * quantity of the unit
   *
   * LineItemBasePriceMaybe: prints the base price calculation for the listing, e.g.
   * "$150.00 * 2 nights $300"
   *
   * LineItemUnitPriceMaybe: prints just the unit price, e.g. "Price per night $32.00".
   * This line item is not used by default in the SubscriptionBreakdown.
   *
   * LineItemUnknownItemsMaybe: prints the line items that are unknown. In ideal case there
   * should not be unknown line items. If you are using custom pricing, you should create
   * new custom line items if you need them.
   *
   * LineItemSubTotalMaybe: prints subtotal of line items before possible
   * commission or refunds
   *
   * LineItemRefundMaybe: prints the amount of refund
   *
   * LineItemCustomerCommissionMaybe: prints the amount of customer commission
   * The default transaction process used by FTW doesn't include the customer commission.
   *
   * LineItemCustomerCommissionRefundMaybe: prints the amount of refunded customer commission
   *
   * LineItemProviderCommissionMaybe: prints the amount of provider commission
   *
   * LineItemProviderCommissionRefundMaybe: prints the amount of refunded provider commission
   *
   * LineItemTotalPrice: prints total price of the transaction
   *
   */

  return (
    <div className={classes}>
      <LineItemBookingPeriod
        booking={booking}
        unitType={unitType}
        dateType={dateType}
        subscription={subscription}
      />
      <LineItemLengthOfContract transaction={transaction} isProvider={isProvider} intl={intl} />

      <LineItemWeeksRemaining
        transaction={transaction}
        unitType={unitType}
        weeksRemaining={Math.abs(weeksRemaining)}
      />
      <LineItemNextPayment
        booking={booking}
        unitType={unitType}
        dateType={dateType}
        subscription={subscription}
        nextPaymentDate={nextPaymentDate}
        lastPaymentDate={lastPaymentPayment}
      />
      <LineItemUnitsMaybe
        transaction={transaction}
        unitType={unitType}
        subscription={subscription}
      />
      <LineItemBasePriceMaybe
        transaction={transaction}
        unitType={unitType}
        intl={intl}
        subscription={subscription}
      />
      <LineItemUnknownItemsMaybe
        transaction={transaction}
        isProvider={isProvider}
        intl={intl}
        subscription={subscription}
      />
      <LineItemSubTotalMaybe
        transaction={transaction}
        unitType={unitType}
        userRole={userRole}
        intl={intl}
        subscription={subscription}
      />
      <LineItemRefundMaybe transaction={transaction} intl={intl} />
      <LineItemCustomerCommissionMaybe
        transaction={transaction}
        isCustomer={isCustomer}
        intl={intl}
      />
      <LineItemCustomerCommissionRefundMaybe
        transaction={transaction}
        isCustomer={isCustomer}
        intl={intl}
      />
      <LineItemProviderCommissionMaybe
        transaction={transaction}
        isProvider={isProvider}
        intl={intl}
      />
      <LineItemProviderCommissionRefundMaybe
        transaction={transaction}
        isProvider={isProvider}
        intl={intl}
      />
      <LineItemTotalPrice transaction={transaction} isProvider={isProvider} intl={intl} />
      {hasCommissionLineItem ? (
        <span className={css.feeInfo}>
          <FormattedMessage id="SubscriptionBreakdown.commissionFeeNote" />
        </span>
      ) : null}
    </div>
  );
};

SubscriptionBreakdownComponent.defaultProps = {
  rootClassName: null,
  className: null,
  dateType: null,
  subscription: {},
};

SubscriptionBreakdownComponent.propTypes = {
  rootClassName: string,
  className: string,

  userRole: oneOf(['customer', 'provider']).isRequired,
  unitType: propTypes.bookingUnitType.isRequired,
  transaction: propTypes.transaction.isRequired,
  booking: propTypes.booking.isRequired,
  dateType: propTypes.dateType,

  // from injectIntl
  intl: intlShape.isRequired,
};

const SubscriptionBreakdown = injectIntl(SubscriptionBreakdownComponent);

SubscriptionBreakdown.displayName = 'SubscriptionBreakdown';

export default SubscriptionBreakdown;
