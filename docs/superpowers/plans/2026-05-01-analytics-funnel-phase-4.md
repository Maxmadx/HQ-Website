# Analytics Funnel — Phase 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pull search keyword data (clicks, impressions, CTR, average position) from Google Search Console nightly into Firestore, and render the Squarespace-style Search Keywords tile on `/admin/analytics`.

**Architecture:** Daily cron (03:00 London) calls Google Search Console API via service account, writes one Firestore doc per (date, query, page) combo into `gsc_daily/{sha1Hash}`. Admin endpoint reads back last N days. Pure aggregation functions compute top-line stats + by-keyword/by-page tables + monthly chart series. Dashboard tile renders the result. Whole sync gated by `GSC_SYNC_AUTO=false` env flag for safe rollout (same discipline as Phase 3 cart recovery).

**Tech Stack:** Existing Node/Express/Firebase, vitest, node-cron (from Phase 3). New dep: `googleapis`. No new infra.

**Spec:** `docs/superpowers/specs/2026-04-29-squarespace-analytics-parity-design.md` — subsystem D.

**Phase 4 explicitly DOES NOT include** (out of scope): Bing Webmaster Tools data, AI-attribution data, page-speed Core Web Vitals from PageSpeed Insights — Phase 5+ if ever desired.

---

## File Structure

**New files:**
- `api/lib/gscClient.js` — googleapis Search Console wrapper. Lazy-init via service account. Single export: `gscQuery({ siteUrl, startDate, endDate, dimensions, rowLimit, startRow })`.
- `api/lib/gscTransforms.js` — pure functions: `gscRowToDocId(row)` and `gscRowToDoc(row, syncedAt)`. No SDK imports, no Firestore.
- `api/lib/gscTransforms.test.js`
- `api/gsc-sync.js` — impure runner. Exports `runGscSync({ days, siteUrl })` for cron + manual triggers.
- `api/gsc-api.js` — Express router. `GET /api/gsc/daily?days=30` (admin). Returns flat array of doc-shaped rows.
- `src/components/admin/analytics/searchKeywordsAggregations.js` — pure: topLineStats, byKeyword, byPage, monthlySeries.
- `src/components/admin/analytics/searchKeywordsAggregations.test.js`
- `src/components/admin/analytics/SearchKeywords.jsx` — dashboard tile.
- `src/components/admin/analytics/SearchKeywords.test.jsx`

**Modified files:**
- `server.js` — register `node-cron` daily at 03:00 (Europe/London cron syntax) gated by `GSC_SYNC_AUTO`. Mount `/api/gsc` router.
- `firestore.rules` — deny client read/write on `gsc_daily`.
- `firestore.indexes.json` — composite index `(date DESC, clicks DESC)` for keyword/page top-N queries.
- `src/pages/admin/AdminAnalytics.jsx` — mount the SearchKeywords tile.
- `package.json` — add `googleapis`.
- `.env.example` — document `GSC_SERVICE_ACCOUNT_JSON`, `GSC_SITE_URL`, `GSC_SYNC_AUTO`.

**Test runner:** `npm test` (vitest). Tests next to file under test.

---

## GSC document shape (lock this first)

```
gsc_daily/{sha1Hash}: {
  date: 'YYYY-MM-DD',
  query: string,           // search keyword (e.g. 'hq aviation')
  page: string,            // landing page path (e.g. '/' or '/training')
  clicks: number,          // integer
  impressions: number,     // integer
  ctr: number,             // 0..1, e.g. 0.2344 = 23.44%
  position: number,        // average position, e.g. 2.034
  syncedAt: timestamp      // server timestamp at write time
}

// docId = sha1(`${date}|${query}|${page}`).slice(0, 32)
// Stable so re-syncs of the same day overwrite cleanly.
```

---

## Task 1: Install googleapis + create GSC client wrapper

**Files:**
- Modify: `package.json`
- Create: `api/lib/gscClient.js`

The wrapper hides the googleapis details and exposes one async function the runner uses.

- [ ] **Step 1: Install googleapis**

```bash
npm install googleapis
```

Verify it appears in `dependencies` (not `devDependencies`).

- [ ] **Step 2: Create the client wrapper**

Create `api/lib/gscClient.js`:

```javascript
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
```

- [ ] **Step 3: Verify the module loads**

```bash
node -e "require('./api/lib/gscClient')"
```

Expected: loads without throwing (no env var set yet — only `getClient()` would throw, but we only export `gscQuery` which is lazy).

- [ ] **Step 4: Commit**

```bash
git add api/lib/gscClient.js package.json
git commit -m "feat(gsc): googleapis client wrapper — service-account auth + searchanalytics.query"
```

---

## Task 2: Pure transforms — row → docId + doc shape

**Files:**
- Create: `api/lib/gscTransforms.js`
- Test: `api/lib/gscTransforms.test.js`

Pure module. Used by both the sync runner and any future migration scripts.

- [ ] **Step 1: Write failing tests**

Create `api/lib/gscTransforms.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { gscRowToDocId, gscRowToDoc } from './gscTransforms.js';

describe('gscRowToDocId', () => {
  it('produces a stable hex hash from (date, query, page)', () => {
    const row = { keys: ['hq aviation', '/', '2026-04-30'], clicks: 1, impressions: 2, ctr: 0.5, position: 1.5 };
    const id = gscRowToDocId(row);
    expect(id).toMatch(/^[0-9a-f]{32}$/);
  });

  it('produces the same id for the same input', () => {
    const row = { keys: ['hq aviation', '/', '2026-04-30'], clicks: 1, impressions: 2, ctr: 0.5, position: 1.5 };
    expect(gscRowToDocId(row)).toBe(gscRowToDocId(row));
  });

  it('produces different ids for different (date, query, page) tuples', () => {
    const a = { keys: ['hq aviation', '/', '2026-04-30'], clicks: 1, impressions: 2, ctr: 0.5, position: 1.5 };
    const b = { keys: ['hq aviation', '/', '2026-05-01'], clicks: 1, impressions: 2, ctr: 0.5, position: 1.5 };
    const c = { keys: ['hq aviation ltd', '/', '2026-04-30'], clicks: 1, impressions: 2, ctr: 0.5, position: 1.5 };
    const d = { keys: ['hq aviation', '/contact', '2026-04-30'], clicks: 1, impressions: 2, ctr: 0.5, position: 1.5 };
    expect(new Set([gscRowToDocId(a), gscRowToDocId(b), gscRowToDocId(c), gscRowToDocId(d)]).size).toBe(4);
  });
});

describe('gscRowToDoc', () => {
  const sampleRow = {
    keys: ['hq aviation', '/training', '2026-04-30'],
    clicks: 12,
    impressions: 340,
    ctr: 0.0353,
    position: 2.5,
  };

  it('extracts query / page / date from keys', () => {
    const doc = gscRowToDoc(sampleRow, '2026-05-01T03:00:00Z');
    expect(doc.query).toBe('hq aviation');
    expect(doc.page).toBe('/training');
    expect(doc.date).toBe('2026-04-30');
  });

  it('passes through metrics as numbers', () => {
    const doc = gscRowToDoc(sampleRow, '2026-05-01T03:00:00Z');
    expect(doc.clicks).toBe(12);
    expect(doc.impressions).toBe(340);
    expect(doc.ctr).toBeCloseTo(0.0353, 4);
    expect(doc.position).toBeCloseTo(2.5, 2);
  });

  it('coerces non-numeric metrics to 0', () => {
    const bad = { keys: ['x', '/', '2026-04-30'], clicks: null, impressions: undefined, ctr: 'bad', position: NaN };
    const doc = gscRowToDoc(bad, '2026-05-01T03:00:00Z');
    expect(doc.clicks).toBe(0);
    expect(doc.impressions).toBe(0);
    expect(doc.ctr).toBe(0);
    expect(doc.position).toBe(0);
  });

  it('attaches syncedAt as the provided value', () => {
    const doc = gscRowToDoc(sampleRow, '2026-05-01T03:00:00Z');
    expect(doc.syncedAt).toBe('2026-05-01T03:00:00Z');
  });

  it('throws if keys is missing or not a 3-tuple', () => {
    expect(() => gscRowToDoc({ keys: ['only one'], clicks: 0, impressions: 0, ctr: 0, position: 0 }, 't')).toThrow();
    expect(() => gscRowToDoc({ clicks: 0, impressions: 0, ctr: 0, position: 0 }, 't')).toThrow();
  });
});
```

- [ ] **Step 2: Run tests, expect FAIL**

Run: `npm test -- gscTransforms.test.js`

- [ ] **Step 3: Implement `api/lib/gscTransforms.js`**

```javascript
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
```

- [ ] **Step 4: Run tests, expect PASS**

Run: `npm test -- gscTransforms.test.js`
Expected: PASS — all 9 tests.

- [ ] **Step 5: Commit**

```bash
git add api/lib/gscTransforms.js api/lib/gscTransforms.test.js
git commit -m "feat(gsc): pure row→doc transforms — gscRowToDocId + gscRowToDoc"
```

---

## Task 3: Sync runner

**Files:**
- Create: `api/gsc-sync.js`

Impure runner. Fetches paginated rows from GSC, transforms each, writes to Firestore in batches.

- [ ] **Step 1: Create the runner**

Create `api/gsc-sync.js`:

```javascript
'use strict';

const admin = require('./firebase-admin');
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
    console.error('[gsc-sync]', JSON.stringify(log));
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
      for (const row of chunk) {
        try {
          const id = gscRowToDocId(row);
          const doc = gscRowToDoc(row, syncedAt);
          batch.set(db.collection('gsc_daily').doc(id), doc);
          log.rowsWritten += 1;
        } catch (transformErr) {
          log.errors.push(`transform: ${transformErr.message}`);
        }
      }
      try {
        await batch.commit();
      } catch (writeErr) {
        log.errors.push(`batch[startRow=${startRow + i}]: ${writeErr.message}`);
      }
    }

    if (rows.length < PAGE_SIZE) break; // last page
    startRow += rows.length;
  }

  log.durationMs = Date.now() - startedAt;
  console.log('[gsc-sync]', JSON.stringify(log));
  return log;
}

module.exports = { runGscSync };
```

- [ ] **Step 2: Verify the module loads**

```bash
node -e "require('./api/gsc-sync')"
```

Expected: loads without throwing.

- [ ] **Step 3: Run all tests**

`npm test` — confirm 200 still pass + the 9 new gscTransforms tests = 209 total.

- [ ] **Step 4: Commit**

```bash
git add api/gsc-sync.js
git commit -m "feat(gsc): sync runner — paginates GSC rows + batch-writes to Firestore"
```

---

## Task 4: Wire daily cron in server.js behind GSC_SYNC_AUTO

**Files:**
- Modify: `server.js`

The cron runs at 03:00 Europe/London daily. Same flag-gating discipline as Phase 3's cart recovery.

- [ ] **Step 1: Register the cron**

In `server.js`, find the cart-recovery cron section added in Phase 3 (search `CART_RECOVERY_AUTO`). Below that block (or in its own section), add:

```javascript
// ============================================
// GSC SYNC CRON (Phase 4)
// ============================================
if (process.env.GSC_SYNC_AUTO === 'true') {
  const cron = require('node-cron');
  const { runGscSync } = require('./api/gsc-sync');

  console.log('[gsc-sync] auto mode ENABLED — scheduling daily at 03:00 Europe/London');
  cron.schedule('0 3 * * *', () => {
    runGscSync({}).catch((err) => {
      console.error('[gsc-sync] tick threw:', err.message);
    });
  }, { timezone: 'Europe/London' });
} else {
  console.log('[gsc-sync] auto mode DISABLED (set GSC_SYNC_AUTO=true to enable)');
}
```

The `{ timezone: 'Europe/London' }` option tells node-cron to interpret the cron expression in London time (handles BST/GMT automatically).

- [ ] **Step 2: Verify both flag states**

```bash
NODE_ENV=development node -e "require('./server')" 2>&1 | head -10
```

Expected: prints `[gsc-sync] auto mode DISABLED (set GSC_SYNC_AUTO=true to enable)` (alongside the existing cart-recovery line).

```bash
GSC_SYNC_AUTO=true NODE_ENV=development node -e "require('./server')" 2>&1 | head -10
```

Expected: prints `[gsc-sync] auto mode ENABLED — scheduling daily at 03:00 Europe/London`.

- [ ] **Step 3: Commit**

```bash
git add server.js
git commit -m "feat(gsc): daily 03:00 London cron — gated by GSC_SYNC_AUTO env flag"
```

---

## Task 5: Admin endpoint `/api/gsc/daily`

**Files:**
- Create: `api/gsc-api.js`
- Modify: `server.js`

Returns the rows from `gsc_daily` for the last N days. Auth required (admin only).

- [ ] **Step 1: Create the router**

Create `api/gsc-api.js`:

```javascript
'use strict';

const express = require('express');
const admin = require('./firebase-admin');

const router = express.Router();

async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.adminUid = decoded.uid;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function dateNDaysAgo(n) {
  const d = new Date(Date.now() - n * 24 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

// GET /api/gsc/daily?days=30
router.get('/daily', requireAdmin, async (req, res) => {
  const days = Math.max(1, Math.min(365, parseInt(req.query.days, 10) || 30));
  const since = dateNDaysAgo(days);
  try {
    const snap = await admin.firestore()
      .collection('gsc_daily')
      .where('date', '>=', since)
      .orderBy('date', 'desc')
      .orderBy('clicks', 'desc')
      .limit(20000)
      .get();
    const rows = snap.docs.map((d) => d.data());
    return res.json({ rows, sinceDate: since });
  } catch (err) {
    console.error('[gsc-api] daily error:', err.message);
    return res.status(500).json({ error: 'Failed to load GSC data' });
  }
});

module.exports = router;
```

- [ ] **Step 2: Mount in server.js**

In `server.js`, find where other API routers are mounted (e.g. `/api/carts`). Add alongside:

```javascript
const gscRouter = require('./api/gsc-api');
// ...
app.use('/api/gsc', express.json(), gscRouter);
```

- [ ] **Step 3: Verify the server boots**

```bash
NODE_ENV=development node -e "require('./server')" 2>&1 | head -3
```

Expected: no errors related to `gsc-api` or `gscRouter`.

- [ ] **Step 4: Commit**

```bash
git add api/gsc-api.js server.js
git commit -m "feat(gsc): GET /api/gsc/daily admin endpoint — returns rows for last N days"
```

---

## Task 6: Pure aggregation functions

**Files:**
- Create: `src/components/admin/analytics/searchKeywordsAggregations.js`
- Test: `src/components/admin/analytics/searchKeywordsAggregations.test.js`

Pure functions over the array of doc-shaped rows. Used by the dashboard tile.

- [ ] **Step 1: Write failing tests**

Create `src/components/admin/analytics/searchKeywordsAggregations.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import {
  topLineStats,
  byKeyword,
  byPage,
  monthlySeries,
} from './searchKeywordsAggregations.js';

const fixture = [
  // 2026-04-15
  { date: '2026-04-15', query: 'hq aviation',     page: '/',         clicks: 30, impressions: 100, ctr: 0.30, position: 2.0 },
  { date: '2026-04-15', query: 'hq helicopters',  page: '/',         clicks:  5, impressions:  20, ctr: 0.25, position: 1.5 },
  { date: '2026-04-15', query: 'hq aviation',     page: '/contact',  clicks:  2, impressions:  50, ctr: 0.04, position: 4.0 },
  // 2026-04-16
  { date: '2026-04-16', query: 'hq aviation',     page: '/',         clicks: 20, impressions:  80, ctr: 0.25, position: 2.5 },
  { date: '2026-04-16', query: 'hq helicopters',  page: '/',         clicks: 10, impressions:  30, ctr: 0.33, position: 1.0 },
  // 2026-05-01 (different month)
  { date: '2026-05-01', query: 'hq aviation',     page: '/',         clicks:  8, impressions:  40, ctr: 0.20, position: 3.0 },
];

describe('topLineStats', () => {
  it('aggregates clicks + impressions, computes overall CTR + weighted-avg position', () => {
    const out = topLineStats(fixture);
    expect(out.clicks).toBe(75);          // 30+5+2+20+10+8
    expect(out.impressions).toBe(320);    // 100+20+50+80+30+40
    expect(out.ctr).toBeCloseTo(75 / 320, 4);
    // weighted avg position by impressions:
    // (2*100 + 1.5*20 + 4*50 + 2.5*80 + 1*30 + 3*40) / 320
    // = (200 + 30 + 200 + 200 + 30 + 120) / 320 = 780/320 = 2.4375
    expect(out.avgPosition).toBeCloseTo(2.4375, 4);
  });

  it('returns zeros for an empty list', () => {
    expect(topLineStats([])).toEqual({ clicks: 0, impressions: 0, ctr: 0, avgPosition: 0 });
  });
});

describe('byKeyword', () => {
  it('groups by query, sums clicks/impressions, weighted-avg position', () => {
    const rows = byKeyword(fixture);
    const ha = rows.find((r) => r.query === 'hq aviation');
    expect(ha.clicks).toBe(60);                       // 30+2+20+8
    expect(ha.impressions).toBe(270);                 // 100+50+80+40
    expect(ha.ctr).toBeCloseTo(60 / 270, 4);
    // weighted: (2*100 + 4*50 + 2.5*80 + 3*40) / 270 = (200+200+200+120)/270 = 720/270 = 2.667
    expect(ha.avgPosition).toBeCloseTo(720 / 270, 4);
  });

  it('sorts by clicks descending', () => {
    const rows = byKeyword(fixture);
    expect(rows[0].query).toBe('hq aviation');        // 60 clicks
    expect(rows[1].query).toBe('hq helicopters');     // 15 clicks
  });
});

describe('byPage', () => {
  it('groups by page, sums clicks/impressions, weighted-avg position', () => {
    const rows = byPage(fixture);
    const root = rows.find((r) => r.page === '/');
    expect(root.clicks).toBe(73);                     // 30+5+20+10+8
    expect(root.impressions).toBe(270);               // 100+20+80+30+40
  });

  it('sorts by clicks descending', () => {
    const rows = byPage(fixture);
    expect(rows[0].page).toBe('/');
    expect(rows[1].page).toBe('/contact');
  });
});

describe('monthlySeries', () => {
  it('returns one entry per (month, query) combo with summed clicks + summed impressions', () => {
    const series = monthlySeries(fixture);
    const aprHA = series.find((s) => s.month === '2026-04' && s.query === 'hq aviation');
    expect(aprHA).toBeDefined();
    expect(aprHA.clicks).toBe(52);                    // 30+2+20
    expect(aprHA.impressions).toBe(230);              // 100+50+80
    expect(aprHA.ctr).toBeCloseTo(52 / 230, 4);

    const mayHA = series.find((s) => s.month === '2026-05' && s.query === 'hq aviation');
    expect(mayHA.clicks).toBe(8);
  });

  it('returns empty for empty input', () => {
    expect(monthlySeries([])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests, expect FAIL**

Run: `npm test -- searchKeywordsAggregations.test.js`

- [ ] **Step 3: Implement `src/components/admin/analytics/searchKeywordsAggregations.js`**

```javascript
/**
 * Pure aggregations over GSC daily rows.
 * Each row: { date: 'YYYY-MM-DD', query, page, clicks, impressions, ctr, position }
 */

function weightedAvg(rows, valueKey, weightKey) {
  let totalWeight = 0;
  let weightedSum = 0;
  for (const r of rows) {
    const w = Number(r[weightKey]) || 0;
    const v = Number(r[valueKey]) || 0;
    totalWeight += w;
    weightedSum += v * w;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export function topLineStats(rows) {
  let clicks = 0, impressions = 0;
  for (const r of rows) {
    clicks += Number(r.clicks) || 0;
    impressions += Number(r.impressions) || 0;
  }
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const avgPosition = weightedAvg(rows, 'position', 'impressions');
  return { clicks, impressions, ctr, avgPosition };
}

function groupBy(rows, key) {
  const grouped = new Map();
  for (const r of rows) {
    const k = r[key];
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k).push(r);
  }
  return grouped;
}

export function byKeyword(rows) {
  const grouped = groupBy(rows, 'query');
  const out = [];
  for (const [query, group] of grouped) {
    let clicks = 0, impressions = 0;
    for (const r of group) {
      clicks += Number(r.clicks) || 0;
      impressions += Number(r.impressions) || 0;
    }
    out.push({
      query,
      clicks,
      impressions,
      ctr: impressions > 0 ? clicks / impressions : 0,
      avgPosition: weightedAvg(group, 'position', 'impressions'),
    });
  }
  return out.sort((a, b) => b.clicks - a.clicks);
}

export function byPage(rows) {
  const grouped = groupBy(rows, 'page');
  const out = [];
  for (const [page, group] of grouped) {
    let clicks = 0, impressions = 0;
    for (const r of group) {
      clicks += Number(r.clicks) || 0;
      impressions += Number(r.impressions) || 0;
    }
    out.push({
      page,
      clicks,
      impressions,
      ctr: impressions > 0 ? clicks / impressions : 0,
      avgPosition: weightedAvg(group, 'position', 'impressions'),
    });
  }
  return out.sort((a, b) => b.clicks - a.clicks);
}

export function monthlySeries(rows) {
  // Group by (month, query) → totals
  const grouped = new Map();
  for (const r of rows) {
    const month = (r.date || '').slice(0, 7); // YYYY-MM
    if (!month) continue;
    const key = `${month}|${r.query}`;
    if (!grouped.has(key)) {
      grouped.set(key, { month, query: r.query, clicks: 0, impressions: 0 });
    }
    const entry = grouped.get(key);
    entry.clicks += Number(r.clicks) || 0;
    entry.impressions += Number(r.impressions) || 0;
  }
  return Array.from(grouped.values()).map((e) => ({
    ...e,
    ctr: e.impressions > 0 ? e.clicks / e.impressions : 0,
  }));
}
```

- [ ] **Step 4: Run tests, expect PASS**

Run: `npm test -- searchKeywordsAggregations.test.js`
Expected: PASS — all 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/analytics/searchKeywordsAggregations.js src/components/admin/analytics/searchKeywordsAggregations.test.js
git commit -m "feat(admin-analytics): pure search-keyword aggregations (top-line, by-keyword, by-page, monthly)"
```

---

## Task 7: SearchKeywords dashboard tile

**Files:**
- Create: `src/components/admin/analytics/SearchKeywords.jsx`
- Test: `src/components/admin/analytics/SearchKeywords.test.jsx`

The tile renders top-line stats + by-keyword/by-page tabs with a sortable table. No chart in this phase — that's a polish item for a future iteration. Keeps the tile shippable.

- [ ] **Step 1: Write failing tests**

Create `src/components/admin/analytics/SearchKeywords.test.jsx`:

```javascript
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchKeywords from './SearchKeywords';

const rows = [
  { date: '2026-04-15', query: 'hq aviation',    page: '/',        clicks: 30, impressions: 100, ctr: 0.30, position: 2.0 },
  { date: '2026-04-15', query: 'hq helicopters', page: '/',        clicks:  5, impressions:  20, ctr: 0.25, position: 1.5 },
  { date: '2026-04-15', query: 'hq aviation',    page: '/contact', clicks:  2, impressions:  50, ctr: 0.04, position: 4.0 },
];

describe('SearchKeywords', () => {
  it('renders top-line stats: Clicks, Impressions, CTR, Avg. Position', () => {
    render(<SearchKeywords rows={rows} />);
    expect(screen.getByText(/Clicks/i)).toBeInTheDocument();
    expect(screen.getByText(/Impressions/i)).toBeInTheDocument();
    expect(screen.getByText(/CTR/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg. Position/i)).toBeInTheDocument();
  });

  it('shows the sum of clicks (37) in the top-line', () => {
    render(<SearchKeywords rows={rows} />);
    expect(screen.getByText('37')).toBeInTheDocument();
  });

  it('renders the By Keyword table by default with the top keyword first', () => {
    render(<SearchKeywords rows={rows} />);
    expect(screen.getByText('hq aviation')).toBeInTheDocument();
    expect(screen.getByText('hq helicopters')).toBeInTheDocument();
  });

  it('switches to the By Page table when the Pages tab is clicked', () => {
    render(<SearchKeywords rows={rows} />);
    const pagesTab = screen.getByRole('button', { name: /by page/i });
    fireEvent.click(pagesTab);
    expect(screen.getByText('/contact')).toBeInTheDocument();
  });

  it('shows an empty state when no rows', () => {
    render(<SearchKeywords rows={[]} />);
    expect(screen.getByText(/no search data/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests, expect FAIL**

Run: `npm test -- SearchKeywords.test.jsx`

- [ ] **Step 3: Implement `src/components/admin/analytics/SearchKeywords.jsx`**

```javascript
import { useMemo, useState } from 'react';
import { topLineStats, byKeyword, byPage } from './searchKeywordsAggregations';

function fmtNum(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '0';
  return Math.round(n).toLocaleString('en-GB');
}

function fmtPct(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '0%';
  return `${(n * 100).toFixed(2)}%`;
}

function fmtPos(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || n === 0) return '—';
  return n.toFixed(2);
}

function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default function SearchKeywords({ rows = [], dateLabel = '' }) {
  const [tab, setTab] = useState('keyword');

  const stats = useMemo(() => topLineStats(rows), [rows]);
  const keywordRows = useMemo(() => byKeyword(rows), [rows]);
  const pageRows = useMemo(() => byPage(rows), [rows]);

  const tableRows = tab === 'keyword' ? keywordRows : pageRows;
  const isEmpty = rows.length === 0;

  return (
    <section style={{ background: '#1a1a1a', borderRadius: 12, padding: 24, color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Search Keywords (Google)</h2>
        {dateLabel && <span style={{ opacity: 0.7, fontSize: 13 }}>{dateLabel}</span>}
      </header>

      <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
        <Stat label="Clicks" value={fmtNum(stats.clicks)} />
        <Stat label="Impressions" value={fmtNum(stats.impressions)} />
        <Stat label="CTR" value={fmtPct(stats.ctr)} />
        <Stat label="Avg. Position" value={fmtPos(stats.avgPosition)} />
      </div>

      {isEmpty ? (
        <p style={{ opacity: 0.7, fontStyle: 'italic', margin: 0 }}>No search data yet — give the GSC sync a day to populate.</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => setTab('keyword')}
              style={{
                padding: '6px 12px', fontSize: 13, fontWeight: 600,
                background: tab === 'keyword' ? '#a855f7' : 'transparent',
                color: '#fff', border: '1px solid ' + (tab === 'keyword' ? '#a855f7' : '#334155'),
                borderRadius: 6, cursor: 'pointer',
              }}
            >
              By Keyword
            </button>
            <button
              type="button"
              onClick={() => setTab('page')}
              style={{
                padding: '6px 12px', fontSize: 13, fontWeight: 600,
                background: tab === 'page' ? '#a855f7' : 'transparent',
                color: '#fff', border: '1px solid ' + (tab === 'page' ? '#a855f7' : '#334155'),
                borderRadius: 6, cursor: 'pointer',
              }}
            >
              By Page
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a', textAlign: 'left' }}>
                <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>{tab === 'keyword' ? 'Keyword' : 'Page'}</th>
                <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500, textAlign: 'right' }}>Clicks</th>
                <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500, textAlign: 'right' }}>Impressions</th>
                <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500, textAlign: 'right' }}>CTR</th>
                <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500, textAlign: 'right' }}>Avg. Position</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(0, 50).map((row) => (
                <tr key={tab === 'keyword' ? row.query : row.page} style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <td style={{ padding: '8px 4px' }}>{tab === 'keyword' ? row.query : row.page}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>{fmtNum(row.clicks)}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', color: '#94a3b8' }}>{fmtNum(row.impressions)}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>{fmtPct(row.ctr)}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', color: '#94a3b8' }}>{fmtPos(row.avgPosition)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Run tests, expect PASS**

Run: `npm test -- SearchKeywords.test.jsx`
Expected: PASS — all 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/analytics/SearchKeywords.jsx src/components/admin/analytics/SearchKeywords.test.jsx
git commit -m "feat(admin-analytics): SearchKeywords tile — top-line stats + By Keyword/By Page tabs"
```

---

## Task 8: Wire SearchKeywords into AdminAnalytics.jsx

**Files:**
- Modify: `src/pages/admin/AdminAnalytics.jsx`

Fetch `/api/gsc/daily?days=30`, pass into `<SearchKeywords rows={...} />` mounted below the existing tiles.

- [ ] **Step 1: Add the fetch state + effect**

In `src/pages/admin/AdminAnalytics.jsx`, near the existing `carts` state (added in Phase 2 Task 14), add:

```javascript
  const [gscRows, setGscRows] = useState([]);
  const [gscLoading, setGscLoading] = useState(true);
```

After the existing `loadCarts()` effect, add:

```javascript
  useEffect(() => {
    let cancelled = false;
    async function loadGsc() {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        const res = await fetch(`/api/gsc/daily?days=${days}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to load GSC data');
        const data = await res.json();
        if (!cancelled) {
          setGscRows(data.rows || []);
          setGscLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setGscLoading(false);
      }
    }
    loadGsc();
    return () => { cancelled = true; };
  }, [days]);
```

- [ ] **Step 2: Mount the tile**

Find the spot just below the AbandonedCartTile mount (Phase 2 Task 14 — search `<AbandonedCartTile`). Add:

```javascript
{import.meta.env.VITE_FUNNEL_ENABLED !== 'false' && !gscLoading && (
  <div style={{ marginBottom: 24 }}>
    <SearchKeywords rows={gscRows} dateLabel={`Last ${days} days`} />
  </div>
)}
```

Add the import at the top alongside the other tile imports:

```javascript
import SearchKeywords from '../../components/admin/analytics/SearchKeywords';
```

- [ ] **Step 3: Run tests, expect no regression**

Run: `npm test`. The 209+ tests from prior tasks should all pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminAnalytics.jsx
git commit -m "feat(admin-analytics): mount SearchKeywords tile + fetch /api/gsc/daily"
```

---

## Task 9: Firestore rules + indexes for `gsc_daily`

**Files:**
- Modify: `firestore.rules`
- Modify: `firestore.indexes.json`

- [ ] **Step 1: Update firestore.rules**

In `firestore.rules`, inside `match /databases/{database}/documents { ... }`, near the existing `match /carts/{cartId}` block, add:

```
    // GSC daily — server-only via Admin SDK. No client read or write.
    match /gsc_daily/{docId} {
      allow read, write: if false;
    }
```

- [ ] **Step 2: Update firestore.indexes.json**

In `firestore.indexes.json`, inside the `indexes` array, add:

```json
    {
      "collectionGroup": "gsc_daily",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "date", "order": "DESCENDING" },
        { "fieldPath": "clicks", "order": "DESCENDING" }
      ]
    }
```

The `/api/gsc/daily` endpoint queries `where date >= X orderBy date DESC orderBy clicks DESC`, so this composite index covers it.

- [ ] **Step 3: Commit**

```bash
git add firestore.rules firestore.indexes.json
git commit -m "feat(gsc): firestore rules deny client + composite index (date DESC, clicks DESC)"
```

- [ ] **Step 4: Note for deploy**

After merge, the user will need to deploy:
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

## Task 10: Document env vars + service-account setup

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Append the GSC env vars**

In `.env.example`, append:

```
# Phase 4 — Google Search Console sync
# Daily 03:00 London cron pulls keyword data from GSC into Firestore.
# Default OFF; flip to true after the service account is set up and verified.
GSC_SYNC_AUTO=false

# GSC site URL (must match exactly what's verified in Search Console).
# For domain properties use 'sc-domain:hqaviation.co.uk'.
# For URL-prefix properties use the full URL with trailing slash, e.g. 'https://hqaviation.co.uk/'.
GSC_SITE_URL=sc-domain:hqaviation.co.uk

# Service account credentials (JSON). One-time setup:
#   1. GCP Console → IAM & Admin → Service Accounts → Create
#      • Name: gsc-reader
#      • Grant: no project roles needed (read-only is granted via GSC permissions)
#   2. Create a JSON key for the service account, download.
#   3. Search Console → Settings → Users and permissions → Add user
#      • Email: <the service account's email, e.g. gsc-reader@<project>.iam.gserviceaccount.com>
#      • Permission: Restricted (read-only)
#   4. Base64-encode the JSON to avoid newline issues in .env:
#        cat key.json | base64 | tr -d '\n'
#   5. Paste the base64 string here (or paste raw JSON if you trust your shell).
GSC_SERVICE_ACCOUNT_JSON=
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs(env): document GSC_SYNC_AUTO + GSC_SITE_URL + GSC_SERVICE_ACCOUNT_JSON setup"
```

---

## Task 11: Final integration smoke test (manual)

This is the verification gate. Real GSC traffic is required for end-to-end test, so this is partly manual.

- [ ] **Step 1: Restart dev server**

```bash
npm run dev
```

Confirm console prints `[gsc-sync] auto mode DISABLED` (the safe default).

- [ ] **Step 2: Manual sync trigger**

With service account credentials configured in `.env` (see Task 10's instructions), trigger one sync from the CLI:

```bash
node -e "(async () => {
  const { runGscSync } = require('./api/gsc-sync');
  const log = await runGscSync({ days: 7 });
  console.log(JSON.stringify(log, null, 2));
})();"
```

Inspect the output:
- `rowsFetched`: number of rows GSC returned (depends on traffic)
- `rowsWritten`: should equal rowsFetched
- `errors`: should be empty
- `startDate` / `endDate`: 2-day-lagged window
- `durationMs`: how long the sync took

If `rowsFetched === 0`, double-check `GSC_SITE_URL` matches the verified property exactly.

- [ ] **Step 3: Verify Firestore writes**

In Firebase Console → Firestore → `gsc_daily` collection. You should see ~rowsFetched docs, each with `date`, `query`, `page`, `clicks`, `impressions`, `ctr`, `position`, `syncedAt`.

- [ ] **Step 4: Dashboard load**

Sign in as admin → `/admin/analytics`. Scroll past the existing tiles. The Search Keywords tile should appear with:
- Top-line: Clicks / Impressions / CTR / Avg. Position
- Tabs: By Keyword (default) and By Page
- Up to 50 rows in the table sorted by clicks descending

- [ ] **Step 5: Verify the endpoint requires admin**

```bash
curl -X GET http://localhost:3000/api/gsc/daily
```
Expected: `401 {"error":"Unauthorized"}`.

```bash
curl -X GET http://localhost:3000/api/gsc/daily -H 'Authorization: Bearer bogus'
```
Expected: `401 {"error":"Unauthorized"}`.

- [ ] **Step 6: Enable auto mode**

Once Step 2 succeeds reliably, set `GSC_SYNC_AUTO=true` in `.env`. Restart server. Console prints `[gsc-sync] auto mode ENABLED — scheduling daily at 03:00 Europe/London`. The cron is registered; the first auto-tick will run at the next 03:00 London.

- [ ] **Step 7: Final commit (if any docs/lint touch-ups)**

```bash
git status
# If anything outstanding, commit it. Otherwise nothing to do.
```

---

## Acceptance criteria for Phase 4

- All 11 tasks complete with green tests where applicable.
- `runGscSync({ days: 7 })` fetches GSC data, transforms each row, writes to `gsc_daily/{stableHash}`, returns a structured log.
- Re-running the same sync overwrites cleanly (idempotent via stable doc ids).
- `GET /api/gsc/daily?days=30` returns the rows for the last 30 days, admin-auth required, 401 for unauth.
- `/admin/analytics` shows the Search Keywords tile with top-line stats + By Keyword / By Page tabs.
- `GSC_SYNC_AUTO=false` (default) skips cron registration; `true` enables daily 03:00 London.
- Firestore rules deny client read/write on `gsc_daily`.
- All Phase 1–3 tests still pass; no regression.

## Out of scope for Phase 4 (future iterations)

- Monthly trend chart with top-4 keyword overlay (we ship the data via `monthlySeries` but don't render a chart yet — Tile is a polish item).
- Bing Webmaster Tools integration.
- Multi-property aggregation (one site only for v1).
- Backfill beyond 90 days. Owner can run `runGscSync({ days: 480 })` manually for a one-off historical pull.
