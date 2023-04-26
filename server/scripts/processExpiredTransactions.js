const { fetchAndUpdateExpiredTransactions } = require('../cancelExpiredTransactions');
const cron = require('node-cron');

// Schedule the cron job to run every day at 00:00 (midnight)
cron.schedule('0 0 * * *', async () => {
  console.log('Running fetchAndUpdateExpiredTransactions at', new Date().toISOString());
  await fetchAndUpdateExpiredTransactions();
});
