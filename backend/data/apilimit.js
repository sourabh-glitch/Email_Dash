import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const FRESHDESK_DOMAIN = 'https://versanetworks.freshdesk.com'
const API_KEY = process.env.FRESHDESK_API_KEY;

if (!FRESHDESK_DOMAIN || !API_KEY) {
  console.error("❌ Missing FRESHDESK_DOMAIN or FRESHDESK_API_KEY in .env");
  process.exit(1);
}

const url = `${FRESHDESK_DOMAIN}/api/v2/tickets`;

try {
  const response = await fetch(url, {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${API_KEY}:X`).toString('base64')
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }

  console.log("✅ API Rate Limit Info:");
  console.log("Total:", response.headers.get("x-ratelimit-total"));
  console.log("Remaining:", response.headers.get("x-ratelimit-remaining"));
  console.log("Reset Time:", response.headers.get("x-ratelimit-reset"));

} catch (error) {
  console.error("❌ Fetch failed:", error.message);
}
