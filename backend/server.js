const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Ticket = require('./modals/ticket'); // ✅ Use your MongoDB model

dotenv.config();




const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Email endpoint (unchanged)
app.post('/send-email', (req, res) => {
  const { subject, body, recipient, cc, bcc } = req.body;
  console.log('Received email data:', { subject, body, recipient, cc, bcc });
  res.status(200).json({ message: 'Email received by server.' });
});

// ✅ Updated RMA ticket API to fetch from MongoDB
app.get('/api/rma-tickets/', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ updated_at: -1 });
    res.json(tickets);
  } catch (err) {
    console.error('Failed to fetch RMA tickets from DB:', err.message);
    res.status(500).json({ error: 'Failed to fetch RMA tickets from DB' });
  }
});



// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

//Start cron job

// require('./cron');

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
