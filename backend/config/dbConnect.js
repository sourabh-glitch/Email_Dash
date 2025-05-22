const mongoose = require('mongoose');
const createLogger = require('../config/logger'); // ✅ Import logger
const logger = createLogger('DB_CONNECT');        // ✅ Label logs for DB

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info('✅ Connected to MongoDB');

    } catch (error) {
        logger.error(`❌ MongoDB connection error: ${error.message}`);
    }
};

module.exports = dbconnect;
