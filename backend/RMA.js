require('dotenv').config();
const axios = require('axios');

const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN;
const FRESHDESK_API_KEY = process.env.FRESHDESK_API_KEY;

if (!FRESHDESK_DOMAIN || !FRESHDESK_API_KEY) {
  console.error('❌ Missing environment variables: FRESHDESK_DOMAIN or FRESHDESK_API_KEY');
  process.exit(1);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function safeAxiosGet(url, config) {
  try {
    return await axios.get(url, config);
  } catch (error) {
    if (error.response?.status === 429) {
      const wait = parseInt(error.response.headers['retry-after'] || '10');
      console.warn(`⚠️ Rate limited. Retrying after ${wait} seconds...`);
      await delay(wait * 1000);
      return await safeAxiosGet(url, config); // Retry once after delay
    }
    throw error;
  }
}

async function getTicketsByTag(tagName) {
  let allTickets = [];
  let url = `https://${FRESHDESK_DOMAIN}/api/v2/tickets?per_page=30`;

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

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
        return createdAt >= oneMonthAgo && ticket.tags?.includes(tagName);
      });

      allTickets = allTickets.concat(filtered);

      console.log(`📥 Fetched ${filtered.length} ticket(s) with tag "${tagName}"`);

      await delay(500);

      const linkHeader = response.headers.link;
      url = linkHeader?.match(/<([^>]+)>;\s*rel="next"/)?.[1] || null;
    } catch (error) {
      console.error(`Error fetching "${tagName}" tickets:`, error.response?.data || error.message);
      break;
    }
  }

  return allTickets;
}

module.exports = { getTicketsByTag };

