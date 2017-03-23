import React from 'react';
import { fakeIntl, renderShallow } from '../../util/test-helpers';
import { createUser, createListing, currencyConfig } from '../../util/test-data';
import { ListingCardSmallComponent } from './ListingCardSmall';

describe('ListingCardSmall', () => {
  it('matches snapshot', () => {
    const author = createUser('user1');
    const listing = { ...createListing('listing1'), author };
    const tree = renderShallow(
      <ListingCardSmallComponent
        listing={listing}
        intl={fakeIntl}
        currencyConfig={currencyConfig}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
