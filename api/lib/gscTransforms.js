'use strict';

const crypto = require('crypto');

/**
 * Stable 32-char hex doc id derived from (query, page, date) keys.
 * Order in the hash matches the order in the GSC `keys` tuple.
 */
function gscRowToDocId(row) {
  if (!row || !Array.isArray(row.keys) || row.keys.length !== 3) {
    throw new Error('gscRowToDocId: row.keys must be a 3-tuple [query, page, date]');
  }
  const [query, page, date] = row.keys;
  return crypto
    .createHash('sha1')
    .update(`${date}|${query}|${page}`)
    .digest('hex')
    .slice(0, 32);
}

function num(v) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * GSC API row → Firestore doc shape.
 * @param {object} row  { keys: [query, page, date], clicks, impressions, ctr, position }
 * @param {string|Date} syncedAt  ISO string or Date — caller decides
 * @returns {{date,query,page,clicks,impressions,ctr,position,syncedAt}}
 */
function gscRowToDoc(row, syncedAt) {
  if (!row || !Array.isArray(row.keys) || row.keys.length !== 3) {
    throw new Error('gscRowToDoc: row.keys must be a 3-tuple [query, page, date]');
  }
  const [query, page, date] = row.keys;
  return {
    date: String(date),
    query: String(query),
    page: String(page),
    clicks: num(row.clicks),
    impressions: num(row.impressions),
    ctr: num(row.ctr),
    position: num(row.position),
    syncedAt,
  };
}

module.exports = { gscRowToDocId, gscRowToDoc };
