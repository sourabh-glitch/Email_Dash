const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const DOMAIN = process.env.FRESHDESK_DOMAIN;
const API_KEY = process.env.FRESHDESK_API_KEY;
if (!DOMAIN || !API_KEY) {      
    console.error('Please set FRESHDESK_DOMAIN and FRESHDESK_API_KEY in your environment variables.');
    process.exit(1);
    }
const BASE_URL = `https://${DOMAIN}.freshdesk.com/api/v2/tickets`;

const auth = {
  headers: {
    'Authorization': 'Basic ' + Buffer.from(API_KEY + ':X').toString('base64')
  }
};

// Function to fetch tickets with date range (last 30 days)
async function fetchTickets(page = 1) {
  const now = new Date();
  const past30Days = new Date(now.setDate(now.getDate() - 30));

  const past30DaysISO = past30Days.toISOString(); // Convert to ISO format for comparison

  try {
    const response = await axios.get(`${BASE_URL}?page=${page}&per_page=100&created_since=${past30DaysISO}`, auth);
    
    // Check for rate-limiting
    const remainingRequests = response.headers['x-rate-limit-remaining'];
    if (remainingRequests === '0') {
      const resetTime = response.headers['x-rate-limit-reset'];
      const waitTime = (new Date(resetTime * 1000) - new Date()) / 1000; // Time to wait in seconds
      console.log(`Rate limit exceeded. Waiting for ${waitTime} seconds.`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      return fetchTickets(page); // Retry the same page after waiting
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error.message);
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - check your API_KEY');
    }
    return [];
  }
}

// Group tickets by NOC and priority
function groupTicketsByNOC(tickets) {
  const now = new Date();
  const groupedByNOC = {};

  tickets.forEach(ticket => {
    const createdDate = new Date(ticket.created_at);
    const isInLast30Days = createdDate >= new Date(now.setDate(now.getDate() - 30));
    
    if (!isInLast30Days) return; // Skip tickets not created in the last 30 days

    const noc = ticket.custom_fields.find(field => field.name === 'noc')?.value || 'Unknown';

    if (!groupedByNOC[noc]) {
      groupedByNOC[noc] = { total: 0, high: 0, urgent: 0, medium: 0, low: 0 };
    }

    // Update the counts for the group
    const priorityMap = {
      1: 'low',
      2: 'medium',
      3: 'high',
      4: 'urgent'
    };
    
    const priorityLabel = priorityMap[ticket.priority] || 'Unknown';
    groupedByNOC[noc][priorityLabel]++;
    groupedByNOC[noc].total++;
  });

  return groupedByNOC;
}

async function run() {
  let allTickets = [];
  let page = 1;
  let more = true;

  while (more) {
    const tickets = await fetchTickets(page);
    allTickets = allTickets.concat(tickets);
    if (tickets.length < 100) more = false;
    else page++;
  }

  const groupedByNOC = groupTicketsByNOC(allTickets);
  console.log('Grouped Tickets by NOC:', groupedByNOC);
}

run();
