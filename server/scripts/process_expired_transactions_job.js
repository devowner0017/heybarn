const { fetchAndUpdateExpiredTransactions } = require('./cancel_expired_transactions');
// const cron = require('node-cron');

// Schedule the cron job to run every day at 00:00 (midnight)

// const cronTab = process.env.NODE_ENV === 'production' ? '0 0 * * *' : '*/5 * * * *';

// cron.schedule(cronTab, async () => {
//   console.log('Running fetchAndUpdateExpiredTransactions at', new Date().toISOString());
//   await fetchAndUpdateExpiredTransactions();
// });

fetchAndUpdateExpiredTransactions();
