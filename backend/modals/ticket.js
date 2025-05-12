const mongoose = require('mongoose');

const Ticketsschema = new mongoose.Schema({
  ticket_id: { type: Number, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  requester_id: { type: Number, required: true },
  noc: { type: String, required: true },
}, {
  timestamps: true,
});

const Tickets = mongoose.model('Tickets', Ticketsschema);

// ✅ Export it here
module.exports = Tickets;
