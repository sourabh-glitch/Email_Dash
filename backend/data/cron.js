const dotenv = require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const cron = require('node-cron');
const Ticket = require('../models/ticket.js');
const { getTicketsByTag } = require('../data/RMA.js');
const createLogger = require('../config/logger'); // ✅ Winston logger
const logger = createLogger('CRON_JOBS');

logger.info('🚀 Cron script started');

// === Connect to MongoDB ===
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rmatracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  logger.info('✅ Connected to MongoDB');
}).on('error', (err) => {
  logger.error(`❌ MongoDB connection error: ${err.message}`);
});

// === Tags to sync ===
const tagsToSync = ['RMA', 'Internal-Alert'];

// === Generic sync function ===
async function syncTicketsByTag(tag) {
  logger.info(`🕒 Syncing tickets with tag "${tag}"...`);

  try {
    const tickets = await getTicketsByTag(tag);

    if (!tickets.length) {
      logger.warn(`⚠️ No tickets found for tag "${tag}".`);
      return;
    }

    for (const ticket of tickets) {
      await Ticket.findOneAndUpdate(
        { ticket_id: ticket.id },
        {
          subject: ticket.subject,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
          requester_id: ticket.requester_id,
          tags: ticket.tags || [],
          created_at: ticket.created_at,
          updated_at: ticket.updated_at,
        },
        { upsert: true, new: true }
      );
    }

    logger.info(`✅ Synced ${tickets.length} "${tag}" ticket(s) to MongoDB`);
  } catch (error) {
    logger.error(`❌ Error syncing "${tag}" tickets: ${error.message}`);
  }
}

// === Initial Run at Startup ===
(async () => {
  for (const tag of tagsToSync) {
    await syncTicketsByTag(tag);
  }
})();

// === Scheduled Every 60 Minutes ===
// cron.schedule('0 * * * *', async () => {
//   logger.info('🕒 Running scheduled ticket sync...');
//   for (const tag of tagsToSync) {
//     await syncTicketsByTag(tag);
//   }
// });
