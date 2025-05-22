const dotenv = require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const createLogger = require('../config/logger'); // ✅ Import logger
const logger = createLogger('FRESHDESK_FETCHER'); // ✅ Label for this module

const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN;
const FRESHDESK_API_KEY = process.env.FRESHDESK_API_KEY;

if (!FRESHDESK_DOMAIN || !FRESHDESK_API_KEY) {
  logger.error('❌ Missing environment variables: FRESHDESK_DOMAIN or FRESHDESK_API_KEY');
  process.exit(1);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function safeAxiosGet(url, config) {
  try {
    return await axios.get(url, config);
  } catch (error) {
    if (error.response?.status === 429) {
      const wait = parseInt(error.response.headers['retry-after'] || '10');
      logger.warn(`⚠️ Rate limited. Retrying after ${wait} seconds...`);
      await delay(wait * 1000);
      return await safeAxiosGet(url, config); // Retry once after delay
    }
    throw error;
  }
}

/**
 * Fetch Freshdesk tickets by tag for the past N days.
 * @param {string} tag - The tag to filter (e.g. 'RMA', 'Internal-Alert')
 * @param {number} sinceDays - Number of days in the past to include (default: 30)
 */
async function getTicketsByTag(tag, sinceDays = 30) {
  let allTickets = [];
  let url = `https://${FRESHDESK_DOMAIN}/api/v2/tickets?per_page=30`;

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - sinceDays);

  while (url) {
    try {
      const response = await safeAxiosGet(url, {
        auth: {
          username: FRESHDESK_API_KEY,
          password: 'X',
        },
      });

      const tickets = response.data;
      const filtered = tickets.filter(ticket => {
        const createdAt = new Date(ticket.created_at);
        return createdAt >= sinceDate && ticket.tags?.includes(tag);
      });

      allTickets = allTickets.concat(filtered);

      logger.info(`📥 Fetched ${filtered.length} ticket(s) with tag "${tag}" from current page`);

      await delay(500); // throttle

      const linkHeader = response.headers.link;
      url = linkHeader?.match(/<([^>]+)>;\s*rel="next"/)?.[1] || null;
    } catch (error) {
      logger.error(`❌ Error fetching "${tag}" tickets: ${error.response?.data?.message || error.message}`);
      break;
    }
  }

  logger.info(`✅ Total tickets fetched for "${tag}": ${allTickets.length}`);
  return allTickets;
}

module.exports = { getTicketsByTag };
