import React from 'react';
import { renderShallow } from '../../util/test-helpers';
import { createUser, createCurrentUser, createListing, fakeIntl } from '../../util/test-data';
import { CheckoutPageComponent } from './CheckoutPage';
import checkoutPageReducer, { SET_INITAL_VALUES, setInitialValues } from './CheckoutPage.duck';

const noop = () => null;

describe('CheckoutPage', () => {
  it('matches snapshot', () => {
    const listing = createListing('listing1', {}, { author: createUser('author') });
    const props = {
      bookingDates: {
        bookingStart: new Date(Date.UTC(2017, 3, 14)),
        bookingEnd: new Date(Date.UTC(2017, 3, 16)),
      },
      dispatch: noop,
      history: { push: noop },
      intl: fakeIntl,
      listing,
      currentUser: createCurrentUser('currentUser'),
      params: { id: 'listing1', slug: 'listing1' },
      sendOrderRequest: noop,
      fetchSpeculatedTransaction: noop,
      speculateTransactionInProgress: false,
      scrollingDisabled: false,
    };
    const tree = renderShallow(<CheckoutPageComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });

  describe('Duck', () => {
    it('ActionCreator: setInitialValues(initialValues)', () => {
      const listing = createListing(
        '00000000-0000-0000-0000-000000000000',
        {},
        {
          author: createUser('author1'),
        }
      );
      const bookingDates = {
        bookingStart: new Date(Date.UTC(2017, 3, 14)),
        bookingEnd: new Date(Date.UTC(2017, 3, 16)),
      };
      const expectedAction = {
        type: SET_INITAL_VALUES,
        payload: { listing, bookingDates },
      };

      expect(setInitialValues({ listing, bookingDates })).toEqual(expectedAction);
    });

    describe('Reducer', () => {
      const initialValues = {
        initiateOrderError: null,
        listing: null,
        bookingDates: null,
        speculateTransactionError: null,
        speculateTransactionInProgress: false,
        speculatedTransaction: null,
      };

      it('should return the initial state', () => {
        expect(checkoutPageReducer(undefined, {})).toEqual(initialValues);
      });

      it('should handle SET_INITAL_VALUES', () => {
        const listing = createListing(
          '00000000-0000-0000-0000-000000000000',
          {},
          {
            author: createUser('author1'),
          }
        );
        const bookingDates = {
          bookingStart: new Date(Date.UTC(2017, 3, 14)),
          bookingEnd: new Date(Date.UTC(2017, 3, 16)),
        };
        const payload = { listing, bookingDates };
        const expected = { ...initialValues, ...payload };
        expect(checkoutPageReducer({}, { type: SET_INITAL_VALUES, payload })).toEqual(expected);
      });
    });
  });
});
