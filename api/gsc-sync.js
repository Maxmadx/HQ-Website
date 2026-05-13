'use strict';

const admin = require('./firebase-admin');
const logger = require('./lib/logger.js');
const { gscQuery } = require('./lib/gscClient');
const { gscRowToDocId, gscRowToDoc } = require('./lib/gscTransforms');

const DEFAULT_DAYS = 90;
const PAGE_SIZE = 25000;
const BATCH_SIZE = 400;

function dateNDaysAgo(now, n) {
  const d = new Date(now.getTime() - n * 24 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

/**
 * Pulls Search Console data for the last `days` days and writes it into
 * Firestore `gsc_daily/{docId}`. Idempotent — re-runs of the same day
 * overwrite via stable doc ids.
 *
 * @param {object} args
 * @param {number} [args.days=90]
 * @param {string} [args.siteUrl=process.env.GSC_SITE_URL]
 * @param {Date} [args.now=new Date()]
 * @returns {Promise<{rowsFetched:number, rowsWritten:number, errors:string[], startDate:string, endDate:string, durationMs:number}>}
 */
async function runGscSync({ days = DEFAULT_DAYS, siteUrl = process.env.GSC_SITE_URL, now = new Date() } = {}) {
  const startedAt = Date.now();
  const log = { rowsFetched: 0, rowsWritten: 0, errors: [], startDate: '', endDate: '', durationMs: 0 };

  if (!siteUrl) {
    log.errors.push('GSC_SITE_URL not configured');
    log.durationMs = Date.now() - startedAt;
    logger.error(log, '[gsc-sync] completed with errors');
    return log;
  }

  // GSC data lags 2-3 days, so endDate = today - 2 days. startDate = endDate - days.
  const endDate = dateNDaysAgo(now, 2);
  const startDate = dateNDaysAgo(now, 2 + days);
  log.startDate = startDate;
  log.endDate = endDate;

  const db = admin.firestore();
  const syncedAt = admin.firestore.FieldValue.serverTimestamp();

  let startRow = 0;
  while (true) {
    let rows;
    try {
      rows = await gscQuery({ siteUrl, startDate, endDate, rowLimit: PAGE_SIZE, startRow });
    } catch (err) {
      log.errors.push(`fetch[startRow=${startRow}]: ${err.message}`);
      break;
    }
    log.rowsFetched += rows.length;

    if (rows.length === 0) break;

    // Write in chunks of BATCH_SIZE (Firestore batch cap is 500)
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const chunk = rows.slice(i, i + BATCH_SIZE);
      const batch = db.batch();
      let queuedInBatch = 0;
      for (const row of chunk) {
        try {
          const id = gscRowToDocId(row);
          const doc = gscRowToDoc(row, syncedAt);
          batch.set(db.collection('gsc_daily').doc(id), doc);
          queuedInBatch += 1;
        } catch (transformErr) {
          log.errors.push(`transform: ${transformErr.message}`);
        }
      }
      try {
        await batch.commit();
        log.rowsWritten += queuedInBatch;
      } catch (writeErr) {
        log.errors.push(`batch[startRow=${startRow + i}]: ${writeErr.message}`);
      }
    }

    if (rows.length < PAGE_SIZE) break; // last page
    startRow += rows.length;
  }

  log.durationMs = Date.now() - startedAt;
  logger.info(log, '[gsc-sync] completed');
  return log;
}

module.exports = { runGscSync };
