'use strict';

const { google } = require('googleapis');

let _client = null;

/**
 * Lazy-init the Search Console client using service account credentials
 * from GSC_SERVICE_ACCOUNT_JSON (base64-encoded JSON or raw JSON).
 */
function getClient() {
  if (_client) return _client;

  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error('GSC_SERVICE_ACCOUNT_JSON env var is not set');
  }

  // Accept either base64-encoded JSON (no newline issues in .env) or raw JSON
  let jsonStr = raw;
  if (!raw.trim().startsWith('{')) {
    try {
      jsonStr = Buffer.from(raw, 'base64').toString('utf8');
    } catch (err) {
      throw new Error(`GSC_SERVICE_ACCOUNT_JSON is not valid base64: ${err.message}`);
    }
  }

  let credentials;
  try {
    credentials = JSON.parse(jsonStr);
  } catch (err) {
    throw new Error(`GSC_SERVICE_ACCOUNT_JSON is not valid JSON: ${err.message}`);
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  _client = google.searchconsole({ version: 'v1', auth });
  return _client;
}

/**
 * Query Search Console searchAnalytics.
 * @param {object} args
 * @param {string} args.siteUrl  e.g. 'https://hqaviation.co.uk/' or 'sc-domain:hqaviation.co.uk'
 * @param {string} args.startDate  YYYY-MM-DD
 * @param {string} args.endDate    YYYY-MM-DD
 * @param {string[]} [args.dimensions=['query','page','date']]
 * @param {number} [args.rowLimit=25000]  GSC max is 25000
 * @param {number} [args.startRow=0]
 * @returns {Promise<Array<{keys:string[], clicks:number, impressions:number, ctr:number, position:number}>>}
 */
async function gscQuery({ siteUrl, startDate, endDate, dimensions = ['query', 'page', 'date'], rowLimit = 25000, startRow = 0 }) {
  if (!siteUrl) throw new Error('gscQuery: siteUrl is required');
  if (!startDate || !endDate) throw new Error('gscQuery: startDate and endDate are required');

  const client = getClient();
  const res = await client.searchanalytics.query({
    siteUrl,
    requestBody: { startDate, endDate, dimensions, rowLimit, startRow },
  });
  return res.data.rows || [];
}

module.exports = { gscQuery };
