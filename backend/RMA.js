require('dotenv').config();
const axios = require('axios');

const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN;
const API_KEY = process.env.FRESHDESK_API_KEY;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const requesterCache = {};

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

async function getRequesterDetails(requesterId) {
  if (requesterCache[requesterId]) return requesterCache[requesterId];

  try {
    const response = await safeAxiosGet(
      `https://${FRESHDESK_DOMAIN}/api/v2/requesters/${requesterId}`,
      {
        auth: {
          username: API_KEY,
          password: 'X',
        },
      }
    );
    const email = response.data.email || `ID: ${requesterId}`;
    requesterCache[requesterId] = email;
    await delay(300); // Slow down requester lookups
    return email;
  } catch (error) {
    console.error(`Failed to fetch requester ${requesterId}:`, error.response?.data || error.message);
    return `ID: ${requesterId}`;
  }
}

async function getFilteredRmaTickets() {
  let allTickets = [];
  let url = `https://${FRESHDESK_DOMAIN}/api/v2/tickets?per_page=30`; // limit to 30 for now

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  while (url) {
    try {
      const response = await safeAxiosGet(url, {
        auth: {
          username: API_KEY,
          password: 'X',
        },
      });

      const tickets = response.data;
      const filtered = tickets.filter(ticket => {
        const createdAt = new Date(ticket.created_at);
        return createdAt >= oneMonthAgo && ticket.tags?.includes('RMA');
      });

      allTickets = allTickets.concat(filtered);

      console.log(`📥 Fetched ${filtered.length} RMA ticket(s)`);

      await delay(500); // delay before next page

      const linkHeader = response.headers.link;
      url = linkHeader?.match(/<([^>]+)>;\s*rel="next"/)?.[1] || null;
    } catch (error) {
      console.error('Error fetching tickets:', error.response?.data || error.message);
      break;
    }
  }

  // Enrich with requester emails (cached + delayed)
  for (const ticket of allTickets) {
    ticket.requester_email = await getRequesterDetails(ticket.requester_id);
  }

  return allTickets;
}

module.exports = { getFilteredRmaTickets };
