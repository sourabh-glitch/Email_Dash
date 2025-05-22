const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const Ticket = require('./models/ticket');
const dbconnect = require('./config/dbConnect');
const authRoutes = require('./routes/authroutes');
const createLogger = require('./config/logger'); // ✅ Import logger
const logger = createLogger('SERVER');           // ✅ Label this file's logs

const app = express();
const PORT = process.env.PORT || 5000;

// === Create logs directory if not exists ===
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// === Morgan logging ===
app.use(morgan('dev')); // Console
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Email endpoint ===
app.post('/send-email', (req, res) => {
  const { subject, body, recipient, cc, bcc } = req.body;
  logger.info(`📧 Email request received: ${JSON.stringify({ subject, recipient })}`);
  res.status(200).json({ message: 'Email received by server.' });
});

// === Ticket endpoint ===
app.get('/api/tickets/:tag', async (req, res) => {
  const tag = req.params.tag;
  logger.info(`🔍 Tag requested: ${tag}`);

  try {
    const tickets = await Ticket.find({
      tags: { $regex: new RegExp(`^${tag}$`, 'i') }
    }).sort({ updated_at: -1 });

    if (!tickets.length) {
      logger.warn(`⚠️ No tickets found for tag: ${tag}`);
    } else {
      logger.info(`✅ Found ${tickets.length} ticket(s) for tag: ${tag}`);
    }

    res.json(tickets);
  } catch (err) {
    logger.error(`❌ Error fetching tickets for tag "${tag}": ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// === Routes ===
app.use("/api/auth", authRoutes);

// === DB connect ===
dbconnect();

// === Start server ===
app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});
