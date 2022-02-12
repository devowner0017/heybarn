const { types } = require('sharetribe-flex-sdk');
const { Money } = types;

const {
  calculateTotalPriceFromQuantity,
  calculateTotalPriceFromPercentage,
  calculateTotalPriceFromSeats,
  calculateQuantityFromDates,
  calculateLineTotal,
  calculateTotalFromLineItems,
  calculateTotalForProvider,
  calculateTotalForCustomer,
  constructValidLineItems,
} = require('./lineItemHelpers');

describe('calculateTotalPriceFromQuantity()', () => {
  it('should calculate price based on quantity', () => {
    const unitPrice = new Money(1000, 'EUR');
    const quantity = 3;
    expect(calculateTotalPriceFromQuantity(unitPrice, quantity)).toEqual(new Money(3000, 'EUR'));
  });
});

describe('calculateTotalPriceFromPercentage()', () => {
  it('should calculate price based on percentage', () => {
    const unitPrice = new Money(1000, 'EUR');
    const percentage = 10;
    expect(calculateTotalPriceFromPercentage(unitPrice, percentage)).toEqual(new Money(100, 'EUR'));
  });

  it('should return negative sum if percentage is negative', () => {
    const unitPrice = new Money(1000, 'EUR');
    const percentage = -10;
    expect(calculateTotalPriceFromPercentage(unitPrice, percentage)).toEqual(
      new Money(-100, 'EUR')
    );
  });
});

describe('calculateTotalPriceFromSeats()', () => {
  it('should calculate price based on seats and units', () => {
    const unitPrice = new Money(1000, 'EUR');
    const unitCount = 1;
    const seats = 3;
    expect(calculateTotalPriceFromSeats(unitPrice, unitCount, seats)).toEqual(
      new Money(3000, 'EUR')
    );
  });

  it('should throw error if value of seats is negative', () => {
    const unitPrice = new Money(1000, 'EUR');
    const unitCount = 1;
    const seats = -3;
    expect(() => calculateTotalPriceFromSeats(unitPrice, unitCount, seats)).toThrowError(
      "Value of seats can't be negative"
    );
  });
});

describe('calculateQuantityFromDates()', () => {
  it('should calculate quantity based on given dates with nightly bookings', () => {
    const start = new Date(2017, 0, 1);
    const end = new Date(2017, 0, 3);
    const type = 'line-item/night';
    expect(calculateQuantityFromDates(start, end, type)).toEqual(2);
  });

  it('should calculate quantity based on given dates with daily bookings', () => {
    const start = new Date(2017, 0, 1);
    const end = new Date(2017, 0, 3);
    const type = 'line-item/day';
    expect(calculateQuantityFromDates(start, end, type)).toEqual(2);
  });

  it('should throw error if unit type is not night or day', () => {
    const start = new Date(2017, 0, 1);
    const end = new Date(2017, 0, 3);
    const type = 'line-item/units';
    expect(() => calculateQuantityFromDates(start, end, type)).toThrowError(
      `Can't calculate quantity from dates to unit type: ${type}`
    );
  });
});

it('should throw error if lineItem code is not valid', () => {
  const code = 'nights';
  const lineItems = [
    {
      code,
      unitPrice: new Money(5000, 'USD'),
      quantity: 2,
      includeFor: ['customer', 'provider'],
    },
  ];

  expect(() => constructValidLineItems(lineItems)).toThrowError(`Invalid line item code: ${code}`);
});
