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
  console.log('🚀 | file: SubscriptionBreakdown.js | line 44 | transaction', transaction);
  if (!subscription) return null;
  const { booking } = transaction;
  const {
    current_period_end: nextPeriodBegins,
    trial_end: trialEnd,
    cancel_at: contractEnd,
  } = subscription;
  const isCustomer = userRole === 'customer';
  const isProvider = userRole === 'provider';
  const hasCommissionLineItem = transaction.attributes.lineItems.find(item => {
    const hasCustomerCommission = isCustomer && item.code === LINE_ITEM_CUSTOMER_COMMISSION;
    const hasProviderCommission = isProvider && item.code === LINE_ITEM_PROVIDER_COMMISSION;
    return (hasCustomerCommission || hasProviderCommission) && !item.reversal;
  });

  const { ongoingContract } = transaction?.attributes?.protectedData || {};
  console.log('🚀 | file: LineItemBookingPeriod.js | line 13 | ongoingContract', ongoingContract);
  const contractHasStarted = trialEnd < moment().unix();
  const { start, end } = booking?.attributes;
  const weeksRemaining = moment(start).diff(moment(end), 'weeks');
  const startDateTS = moment(start).unix();
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

  console.log('🚀 | file: SubscriptionBreakdown.js | line 113 | transaction', transaction);
  console.log("🚀 | file: SubscriptionBreakdown.js | line 135 | ongoingContract", ongoingContract);
  return (
    <div className={classes}>
      <LineItemBookingPeriod
        booking={booking}
        unitType={unitType}
        subscription={subscription}
        ongoingContract={ongoingContract}
      />
      <LineItemLengthOfContract transaction={transaction} isProvider={isProvider} intl={intl}
        ongoingContract={ongoingContract}

      />

      <LineItemWeeksRemaining
        transaction={transaction}
        unitType={unitType}
        weeksRemaining={Math.abs(weeksRemaining)}
      />
      <LineItemNextPayment
        booking={booking}
        unitType={unitType}
        subscription={subscription}
        nextPaymentDate={nextPaymentDate}
        lastPaymentDate={lastPaymentPayment}
        ongoingContract={ongoingContract}

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
