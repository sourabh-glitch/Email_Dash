// backend/config/logger.js
const { createLogger, transports, format } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, label }) => {
      return label
        ? `[${timestamp}] [${label}] ${level.toUpperCase()}: ${message}`
        : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, '../logs/combined.log') }),
  ],
});

module.exports = (moduleName) => logger.child({ label: moduleName });
