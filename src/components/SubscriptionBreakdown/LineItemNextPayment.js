import React from 'react';
import { FormattedMessage, FormattedDate } from '../../util/reactIntl';
import moment from 'moment';
import { LINE_ITEM_NIGHT, DATE_TYPE_DATE, propTypes } from '../../util/types';
import { dateFromAPIToLocalNoon } from '../../util/dates';

import css from './SubscriptionBreakdown.module.css';

const BookingPeriod = props => {
  const { startDate, endDate, ongoingContract } = props;

  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  return (
    <>
      <div className={css.bookingPeriod}>
        <div className={css.bookingPeriodSection}>
          <div className={css.dayLabel}>
            <FormattedMessage id="SubscriptionBreakdown.nextPayment" />
          </div>
          <div className={css.itemLabel}>
            <FormattedDate value={startDate} {...dateFormatOptions} />
          </div>
        </div>

        {!ongoingContract && (
          <div className={css.bookingPeriodSectionRigth}>
            <div className={css.dayLabel}>
              <FormattedMessage id="SubscriptionBreakdown.finalPayment" />
            </div>
            <div className={css.itemLabel}>
              <FormattedDate value={endDate} {...dateFormatOptions} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const LineItemNextPayment = props => {
  const { booking, unitType, dateType, nextPaymentDate, lastPaymentDate,ongoingContract } = props;

  // Attributes: displayStart and displayEnd can be used to differentiate shown time range
  // from actual start and end times used for availability reservation. It can help in situations
  // where there are preparation time needed between bookings.
  // Read more: https://www.sharetribe.com/api-reference/marketplace.html#bookings
  const localStartDate = dateFromAPIToLocalNoon(moment(nextPaymentDate));
  const localEndDateRaw = dateFromAPIToLocalNoon(moment(lastPaymentDate));

  const isNightly = unitType === LINE_ITEM_NIGHT;
  const endDay = isNightly ? localEndDateRaw : moment(localEndDateRaw);

  return (
    <>
      <div className={css.lineItem}>
        <BookingPeriod startDate={localStartDate} endDate={endDay}
        ongoingContract={ongoingContract} />
      </div>
      <hr className={css.totalDivider} />
    </>
  );
};
LineItemNextPayment.defaultProps = { dateType: null };

LineItemNextPayment.propTypes = {
  booking: propTypes.booking.isRequired,
  dateType: propTypes.dateType,
};

export default LineItemNextPayment;
