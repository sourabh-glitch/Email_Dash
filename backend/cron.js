// cron.js

require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const Ticket = require('./modals/ticket'); // Ensure the correct model name
const { getFilteredRmaTickets } = require('./RMA');

console.log('🚀 Cron script started');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rmatracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
}).on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Function to sync Freshdesk tickets to MongoDB
async function syncTicketsToDb() {
  console.log('🕒 Syncing RMA tickets to DB...');

  try {
    const tickets = await getFilteredRmaTickets();

    if (!tickets.length) {
      console.log('⚠️ No RMA tickets found to sync.');
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
          requester_email: ticket.requester_email,
          tags: ticket.tags || [],
          created_at: ticket.created_at,
          updated_at: ticket.updated_at,
        },
        { upsert: true, new: true }
      );
    }

    console.log(`✅ Synced ${tickets.length} ticket(s) to MongoDB`);
  } catch (error) {
    console.error('❌ Error syncing tickets:', error.message);
  }
}

// Run once on startup
// syncTicketsToDb();

// Schedule to run every 60 minutes
// cron.schedule('0 * * * *', () => {
//   console.log('🕒 Running scheduled ticket sync...');
//   syncTicketsToDb();
// });
