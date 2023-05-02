// Configure process.env with .env.* files
require('../env').configureEnv();

const { createInstance } = require('sharetribe-flex-integration-sdk');
const Bottleneck = require('bottleneck');
const moment = require('moment');

const integrationSdk = createInstance({
  clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET,
});

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

async function processTransactions(transactions = []) {
  if (transactions.length === 0) {
    console.log('No transactions to process');
    return;
  }

  const updatePromises = transactions.map(async transaction => {
    const lastTransition = transaction.attributes.lastTransition;
    const lastTransitionedAt = new Date(transaction.attributes.lastTransitionedAt);
    const transactionAge = moment
      .duration(moment().diff(moment(lastTransitionedAt)))
      .asMilliseconds();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    if (
      ['transition/expire-host-enquiry', 'transition/expire-renter-enquiry'].includes(
        lastTransition
      ) &&
      transactionAge <= oneDayInMilliseconds
    ) {
      const listingId = transaction?.relationships?.listing?.data?.id?.uuid;

      const publicData = {
        listingState: 'live',
      };

      await limiter.schedule(() =>
        integrationSdk.listings.update({
          id: listingId,
          publicData,
        })
      );

      console.log(`Listing state updated for listing ID: ${listingId}`);
    }
  });

  return Promise.all(updatePromises);
}

async function fetchAndUpdateExpiredTransactions() {
  let currentPage = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    try {
      const result = await limiter.schedule(() =>
        integrationSdk.transactions.query({
          createdAtStart: moment()
            .subtract(5, 'days')
            .toISOString(),
          perPage: 100,
          page: currentPage,
          include: ['listing'],
        })
      );

      if (result?.data?.data?.length === 0) {
        hasMoreData = false;
      } else {
        await processTransactions(result.data.data);
        currentPage++;
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      hasMoreData = false;
    }
  }
}

module.exports = {
  fetchAndUpdateExpiredTransactions,
};
