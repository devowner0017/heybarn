const { calculateQuantityFromDates, calculateTotalFromLineItems } = require('./lineItemHelpers');
const { types } = require('sharetribe-flex-sdk');
const { Money } = types;

// This bookingUnitType needs to be one of the following:
// line-item/night, line-item/day or line-item/units
const bookingUnitType = 'line-item/units';
const PROVIDER_COMMISSION_PERCENTAGE = -3;

/** Returns collection of lineItems (max 50)
 *
 * Each line items has following fields:
 * - `code`: string, mandatory, indentifies line item type (e.g. \"line-item/cleaning-fee\"), maximum length 64 characters.
 * - `unitPrice`: money, mandatory
 * - `lineTotal`: money
 * - `quantity`: number
 * - `percentage`: number (e.g. 15.5 for 15.5%)
 * - `seats`: number
 * - `units`: number
 * - `includeFor`: array containing strings \"customer\" or \"provider\", default [\":customer\"  \":provider\" ]
 *
 * Line item must have either `quantity` or `percentage` or both `seats` and `units`.
 *
 * `includeFor` defines commissions. Customer commission is added by defining `includeFor` array `["customer"]` and provider commission by `["provider"]`.
 *
 * @param {Object} listing
 * @param {Object} bookingData
 * @returns {Array} lineItems
 */
exports.transactionLineItems = (listing, bookingData, newPrice) => {
  console.log('🚀 | file: lineItems.js | line 32 | newPrice', newPrice);
  const unitPrice =
    (newPrice && new Money(newPrice, listing.attributes.price.currency)) ||
    listing.attributes.price;
  const { startDate, endDate } = bookingData;

  /**
   * If you want to use pre-defined component and translations for printing the lineItems base price for booking,
   * you should use one of the codes:
   * line-item/night, line-item/day or line-item/units (translated to persons).
   *
   * Pre-definded commission components expects line item code to be one of the following:
   * 'line-item/provider-commission', 'line-item/customer-commission'
   *
   * By default BookingBreakdown prints line items inside LineItemUnknownItemsMaybe if the lineItem code is not recognized. */

  const first = {
    code: 'line-item/first-weeks-rent',
    unitPrice,
    quantity: 1,
    // quantity: calculateQuantityFromDates(startDate, endDate, bookingUnitType),
    includeFor: ['customer', 'provider'],
  };

  const last = {
    code: 'line-item/last-weeks-rent',
    unitPrice,
    quantity: 1,
    // quantity: calculateQuantityFromDates(startDate, endDate, bookingUnitType),
    includeFor: ['customer', 'provider'],
  };
  console.log(
    '🚀 | file: lineItems.js | line 62 | calculateTotalFromLineItems([first, last])',
    calculateTotalFromLineItems([first, last])
  );
  const providerCommission = {
    code: 'line-item/provider-commission',
    unitPrice: calculateTotalFromLineItems([first, last]),
    percentage: PROVIDER_COMMISSION_PERCENTAGE,
    includeFor: ['provider'],
  };

  const lineItems = [first, last, providerCommission];

  return lineItems;
};
