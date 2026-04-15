# Analytics Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the analytics system with IP-based admin filtering, geo enrichment, scroll depth / time-on-page tracking, UTM attribution, rate limiting, and a fully redesigned dark-mode dashboard with charts.

**Architecture:** All new event fields (ip, geo, UTM) are written server-side on ingest. The dashboard fetches an auth-protected config endpoint to get excluded IPs, filters the event set client-side, then computes all metrics from pure utility functions. Two reusable SVG chart components (AreaChart, DonutChart) handle the hero chart and donut visuals.

**Tech Stack:** Express.js (Node 18+), Firebase Firestore (admin + client SDK v12/13), React 19.2, Vite 8, Vitest 4, `express-rate-limit`, `ua-parser-js`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `package.json` | Add 2 new deps |
| Modify | `server.js` | Enable trust proxy |
| Modify | `api/analytics-api.js` | IP, geo, UTM, rate limit, new event types, config endpoint |
| Modify | `src/lib/analytics.js` | UTM param capture + forward |
| Modify | `src/lib/analytics.test.js` | UTM tests |
| Modify | `src/components/PageTracker.jsx` | Scroll depth + time on page |
| Create | `src/components/admin/analytics/analyticsUtils.js` | All aggregation / computation |
| Create | `src/components/admin/analytics/analyticsUtils.test.js` | Unit tests for utils |
| Create | `src/components/admin/analytics/AreaChart.jsx` | SVG hero area chart |
| Create | `src/components/admin/analytics/DonutChart.jsx` | Reusable SVG donut chart |
| Modify | `src/pages/admin/AdminAnalytics.jsx` | Full dashboard rewrite |
| Modify | `.gitignore` | Add `.superpowers/` |

> **Firestore indexes:** No new composite indexes needed. All filtering/grouping is client-side after a single `where('timestamp', '>=', since)` query. Firestore auto-indexes single fields.

---

## Task 1: Install packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime and dev packages**

```bash
cd /Users/maximussmith/Downloads/HQ-Website-main
npm install express-rate-limit ua-parser-js
```

Expected output ends with: `added N packages`

- [ ] **Step 2: Verify entries in package.json**

```bash
grep -E "express-rate-limit|ua-parser-js" package.json
```

Expected: both package names appear under `"dependencies"`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add express-rate-limit and ua-parser-js"
```

---

## Task 2: Enable trust proxy + rate limiting

**Files:**
- Modify: `server.js` (line 29, after `const app = express();`)
- Modify: `api/analytics-api.js`

- [ ] **Step 1: Add trust proxy to server.js**

In `server.js`, immediately after `const app = express();` (line 29), add one line:

```javascript
const app = express();
app.set('trust proxy', 1); // Read real IP from X-Forwarded-For (required for req.ip behind proxies)
```

- [ ] **Step 2: Run the server and verify it starts**

```bash
node server.js &
sleep 2 && curl -s http://localhost:7500/ | head -5
kill %1
```

Expected: HTML content returned, no crash.

- [ ] **Step 3: Add rate limiter to analytics-api.js**

Replace the entire contents of `api/analytics-api.js` with the version in Task 3 (which includes the rate limiter). Do **not** commit after this step — continue to Task 3.

---

## Task 3: Update analytics-api.js — IP, geo, UTM, new event types, config endpoint

**Files:**
- Modify: `api/analytics-api.js`

- [ ] **Step 1: Write the full updated analytics-api.js**

Replace the entire file with:

```javascript
'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const admin = require('./firebase-admin');

const router = express.Router();

const ALLOWED_TYPES = ['pageview', 'cta_click', 'form_submit', 'image_view', 'scroll_depth', 'page_exit'];

// Private / loopback IPs — skip geo lookup for these
const PRIVATE_IP_RE = /^(127\.|::1$|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

// Rate limiter: 60 requests per IP per minute on the ingest endpoint
const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
  handler: (_req, res) => res.status(429).json({ error: 'Too many requests' }),
});

// Resolve IP → country/city using ip-api.com (free, no key, HTTP only)
// Returns null fields on failure — never throws
async function geoLookup(ip) {
  if (!ip || PRIVATE_IP_RE.test(ip)) {
    return { country: null, countryCode: null, city: null };
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return { country: null, countryCode: null, city: null };
    const data = await res.json();
    if (data.status !== 'success') return { country: null, countryCode: null, city: null };
    return {
      country: data.country || null,
      countryCode: data.countryCode || null,
      city: data.city || null,
    };
  } catch {
    return { country: null, countryCode: null, city: null };
  }
}

// Auth middleware — same pattern as api/leads.js
async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// GET /api/analytics/config — returns admin-excluded IPs (auth required)
router.get('/config', requireAdmin, (req, res) => {
  const excludedIps = (process.env.ADMIN_IP || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  res.json({ excludedIps });
});

// POST /api/analytics — ingest a tracking event
router.post('/', analyticsLimiter, async (req, res) => {
  try {
    const {
      sessionId, page, eventType, elementId, referrer,
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
    } = req.body;

    if (!ALLOWED_TYPES.includes(eventType)) {
      return res.status(400).json({ error: 'Invalid eventType' });
    }

    const ip = req.ip || null;
    const geo = await geoLookup(ip || '');

    await admin.firestore().collection('page_events').add({
      sessionId: String(sessionId || '').slice(0, 64),
      page: String(page || '').slice(0, 300),
      eventType,
      elementId: elementId ? String(elementId).slice(0, 100) : null,
      referrer: String(referrer || '').slice(0, 300),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
      ip,
      country: geo.country,
      countryCode: geo.countryCode,
      city: geo.city,
      utmSource: utmSource ? String(utmSource).slice(0, 100) : null,
      utmMedium: utmMedium ? String(utmMedium).slice(0, 100) : null,
      utmCampaign: utmCampaign ? String(utmCampaign).slice(0, 100) : null,
      utmTerm: utmTerm ? String(utmTerm).slice(0, 100) : null,
      utmContent: utmContent ? String(utmContent).slice(0, 100) : null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('Analytics ingest error:', err);
    return res.status(500).json({ error: 'Failed to record event' });
  }
});

module.exports = router;
```

- [ ] **Step 2: Smoke-test the server starts cleanly**

```bash
node server.js &
sleep 2
curl -s -X POST http://localhost:7500/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","page":"/","eventType":"pageview","elementId":null,"referrer":""}'
kill %1
```

Expected: `{"ok":true}` (geo lookup runs against 127.0.0.1, returns null geo fields — that's correct).

- [ ] **Step 3: Verify rate limiter triggers**

```bash
node server.js &
sleep 2
for i in $(seq 1 62); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:7500/api/analytics \
    -H "Content-Type: application/json" \
    -d '{"sessionId":"x","page":"/","eventType":"pageview"}'
done | sort | uniq -c
kill %1
```

Expected: ~60 lines of `200`, ~2 lines of `429`.

- [ ] **Step 4: Add ADMIN_IP to .env**

Open `.env` and add:

```
ADMIN_IP=YOUR_IP_HERE
```

Replace `YOUR_IP_HERE` with your real IP. Find it by running:
```bash
curl -s https://api.ipify.org
```

- [ ] **Step 5: Commit**

```bash
git add server.js api/analytics-api.js .env.example
git commit -m "feat: IP capture, geo enrichment, UTM fields, rate limiting, config endpoint"
```

> **Note:** Do not commit `.env` itself — only `.env.example` if one exists.

---

## Task 4: Client — UTM capture in analytics.js

**Files:**
- Modify: `src/lib/analytics.js`
- Modify: `src/lib/analytics.test.js`

- [ ] **Step 1: Write the failing test first**

Add these tests to the bottom of `src/lib/analytics.test.js` (inside the existing `describe('analytics', ...)` block):

```javascript
  it('trackEvent includes UTM params from URL when present', async () => {
    // Simulate URL with UTM params
    delete window.location;
    window.location = { pathname: '/', search: '?utm_source=google&utm_campaign=spring_sale', href: '' };

    await trackEvent('pageview');

    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.utmSource).toBe('google');
    expect(body.utmCampaign).toBe('spring_sale');
    expect(body.utmMedium).toBeNull();
    expect(body.utmTerm).toBeNull();
    expect(body.utmContent).toBeNull();
  });

  it('trackEvent sends null UTM params when URL has no UTM params', async () => {
    delete window.location;
    window.location = { pathname: '/', search: '', href: '' };

    await trackEvent('pageview');

    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.utmSource).toBeNull();
    expect(body.utmCampaign).toBeNull();
  });
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --reporter=verbose 2>&1 | tail -20
```

Expected: 2 new tests fail with `expect(received).toBe(expected)` — `utmSource` is undefined.

- [ ] **Step 3: Update analytics.js to capture UTM params**

Replace the entire `src/lib/analytics.js` with:

```javascript
/**
 * Lightweight client-side analytics utility.
 * Session ID persists for the browser tab (sessionStorage).
 */

export function getSessionId() {
  const key = 'hq_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

/**
 * Read UTM params from the current URL.
 * Returns an object with utmSource/Medium/Campaign/Term/Content (null when absent).
 */
function getUtmParams() {
  if (typeof window === 'undefined') {
    return { utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
    utmTerm: params.get('utm_term'),
    utmContent: params.get('utm_content'),
  };
}

/**
 * Send a tracking event to the server. Fire-and-forget — never throws.
 * @param {string} eventType  pageview | cta_click | form_submit | image_view | scroll_depth | page_exit
 * @param {string|null} [elementId]  Optional element identifier
 * @param {string|null} [page]  Defaults to window.location.pathname
 */
export async function trackEvent(eventType, elementId = null, page = null) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: getSessionId(),
        page: page ?? (typeof window !== 'undefined' ? window.location.pathname : ''),
        eventType,
        elementId,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        ...getUtmParams(),
      }),
    });
  } catch {
    // Silently swallow — analytics must never break the site
  }
}
```

- [ ] **Step 4: Run all tests and confirm they pass**

```bash
npm test -- --reporter=verbose 2>&1 | tail -20
```

Expected: all tests pass including the 2 new UTM tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.js src/lib/analytics.test.js
git commit -m "feat: capture and forward UTM params on every tracking event"
```

---

## Task 5: PageTracker — scroll depth + time on page

**Files:**
- Modify: `src/components/PageTracker.jsx`

- [ ] **Step 1: Replace PageTracker.jsx with the new version**

```jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';

/** Returns scroll percentage 0–100 */
function getScrollPct() {
  const scrolled = window.scrollY + window.innerHeight;
  const total = document.documentElement.scrollHeight;
  return total > 0 ? Math.round((scrolled / total) * 100) : 0;
}

/**
 * Mount once inside <Router> to automatically track:
 *  - pageview on route change
 *  - scroll_depth at 25 / 50 / 75 / 100% thresholds (once per page visit)
 *  - page_exit with seconds spent, on route change or tab hide
 *
 * Renders nothing — side-effect only.
 */
export default function PageTracker() {
  const location = useLocation();
  const startTimeRef = useRef(null);
  const prevPathRef = useRef(null);
  const exitFiredRef = useRef(false);
  const thresholdsRef = useRef(new Set());

  function fireExit(path) {
    if (!startTimeRef.current || exitFiredRef.current || !path) return;
    exitFiredRef.current = true;
    const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    trackEvent('page_exit', String(seconds), path);
  }

  useEffect(() => {
    // Fire exit for the page we're leaving
    if (prevPathRef.current) {
      fireExit(prevPathRef.current);
    }

    // Reset for new page
    const currentPath = location.pathname;
    prevPathRef.current = currentPath;
    startTimeRef.current = Date.now();
    exitFiredRef.current = false;
    thresholdsRef.current = new Set();

    // Track pageview
    trackEvent('pageview', null, currentPath);

    // Scroll depth — throttled at 200ms
    let scrollTimer = null;
    function onScroll() {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        scrollTimer = null;
        const pct = getScrollPct();
        for (const threshold of [25, 50, 75, 100]) {
          if (pct >= threshold && !thresholdsRef.current.has(threshold)) {
            thresholdsRef.current.add(threshold);
            trackEvent('scroll_depth', String(threshold), currentPath);
          }
        }
      }, 200);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Tab hide / close (visibilitychange is more reliable than beforeunload on mobile)
    function onVisibility() {
      if (document.visibilityState === 'hidden') {
        fireExit(currentPath);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
```

- [ ] **Step 2: Verify existing tests still pass**

```bash
npm test -- --reporter=verbose 2>&1 | tail -10
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/PageTracker.jsx
git commit -m "feat: track scroll depth thresholds and time on page"
```

---

## Task 6: Analytics utility functions

**Files:**
- Create: `src/components/admin/analytics/analyticsUtils.js`
- Create: `src/components/admin/analytics/analyticsUtils.test.js`

- [ ] **Step 1: Write the failing tests first**

Create `src/components/admin/analytics/analyticsUtils.test.js`:

```javascript
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  countBy, topN, groupByDay, bounceRate, avgTimeOnPage, formatDuration,
  avgScrollDepth, scrollDepthByPage, topJourneys, categoriseSource,
  trafficSources, sessionsByHour, sparklineData, topCampaigns,
} from './analyticsUtils.js';

// Helper to make a mock event
function mkEvent(overrides = {}) {
  return {
    sessionId: 's1',
    page: '/',
    eventType: 'pageview',
    referrer: '',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ip: '1.2.3.4',
    country: 'United Kingdom',
    countryCode: 'GB',
    utmSource: null,
    utmCampaign: null,
    timestamp: { toDate: () => new Date('2026-04-10T12:00:00Z') },
    ...overrides,
  };
}

describe('countBy', () => {
  it('groups events by field and counts', () => {
    const events = [mkEvent({ page: '/a' }), mkEvent({ page: '/a' }), mkEvent({ page: '/b' })];
    expect(countBy(events, 'page')).toEqual({ '/a': 2, '/b': 1 });
  });

  it('uses "unknown" for missing field values', () => {
    const events = [mkEvent({ page: null })];
    expect(countBy(events, 'page')).toEqual({ unknown: 1 });
  });
});

describe('topN', () => {
  it('returns top N entries sorted by count descending', () => {
    const obj = { a: 3, b: 10, c: 1 };
    expect(topN(obj, 2)).toEqual([['b', 10], ['a', 3]]);
  });
});

describe('groupByDay', () => {
  it('fills all days with 0 for missing data', () => {
    const result = groupByDay([], 3);
    expect(result).toHaveLength(3);
    result.forEach(([, count]) => expect(count).toBe(0));
  });

  it('counts events on the correct day', () => {
    const events = [
      mkEvent({ timestamp: { toDate: () => new Date('2026-04-10T12:00:00Z') } }),
      mkEvent({ timestamp: { toDate: () => new Date('2026-04-10T18:00:00Z') } }),
    ];
    const result = groupByDay(events, 7);
    const day = result.find(([d]) => d === '2026-04-10');
    expect(day?.[1]).toBe(2);
  });
});

describe('bounceRate', () => {
  it('returns 100 when all sessions have 1 pageview', () => {
    const pvs = [mkEvent({ sessionId: 's1' }), mkEvent({ sessionId: 's2' })];
    expect(bounceRate(pvs)).toBe(100);
  });

  it('returns 0 when all sessions have >1 pageview', () => {
    const pvs = [
      mkEvent({ sessionId: 's1', page: '/' }),
      mkEvent({ sessionId: 's1', page: '/about' }),
    ];
    expect(bounceRate(pvs)).toBe(0);
  });

  it('returns 0 for empty array', () => {
    expect(bounceRate([])).toBe(0);
  });
});

describe('avgTimeOnPage', () => {
  it('returns mean of elementId values as seconds', () => {
    const exits = [
      mkEvent({ eventType: 'page_exit', elementId: '30' }),
      mkEvent({ eventType: 'page_exit', elementId: '90' }),
    ];
    expect(avgTimeOnPage(exits)).toBe(60);
  });

  it('returns 0 for empty array', () => {
    expect(avgTimeOnPage([])).toBe(0);
  });
});

describe('formatDuration', () => {
  it('formats seconds under 60 as Xs', () => {
    expect(formatDuration(45)).toBe('45s');
  });

  it('formats seconds over 60 as Xm Ys', () => {
    expect(formatDuration(134)).toBe('2m 14s');
  });

  it('formats exact minutes', () => {
    expect(formatDuration(120)).toBe('2m 0s');
  });
});

describe('avgScrollDepth', () => {
  it('returns mean max threshold per session+page', () => {
    const scrolls = [
      mkEvent({ eventType: 'scroll_depth', sessionId: 's1', page: '/', elementId: '25' }),
      mkEvent({ eventType: 'scroll_depth', sessionId: 's1', page: '/', elementId: '50' }),
      mkEvent({ eventType: 'scroll_depth', sessionId: 's2', page: '/', elementId: '25' }),
    ];
    // s1 max = 50, s2 max = 25, avg = 37 (rounded)
    expect(avgScrollDepth(scrolls)).toBe(38);
  });

  it('returns 0 for no scroll events', () => {
    expect(avgScrollDepth([])).toBe(0);
  });
});

describe('scrollDepthByPage', () => {
  it('computes threshold percentages per top page', () => {
    const pageviews = [
      mkEvent({ sessionId: 's1', page: '/a' }),
      mkEvent({ sessionId: 's2', page: '/a' }),
    ];
    const scrolls = [
      mkEvent({ eventType: 'scroll_depth', sessionId: 's1', page: '/a', elementId: '50' }),
    ];
    const result = scrollDepthByPage(pageviews, scrolls, 1);
    expect(result).toHaveLength(1);
    expect(result[0].page).toBe('/a');
    const t50 = result[0].thresholds.find(t => t.threshold === 50);
    // s1 reached 50%, s2 did not → 1/2 = 50%
    expect(t50.pct).toBe(50);
    const t75 = result[0].thresholds.find(t => t.threshold === 75);
    expect(t75.pct).toBe(0);
  });
});

describe('topJourneys', () => {
  it('extracts and counts multi-page session paths', () => {
    const pageviews = [
      mkEvent({ sessionId: 's1', page: '/', timestamp: { toDate: () => new Date('2026-04-10T10:00:00Z') } }),
      mkEvent({ sessionId: 's1', page: '/about', timestamp: { toDate: () => new Date('2026-04-10T10:01:00Z') } }),
      mkEvent({ sessionId: 's2', page: '/', timestamp: { toDate: () => new Date('2026-04-10T11:00:00Z') } }),
      mkEvent({ sessionId: 's2', page: '/about', timestamp: { toDate: () => new Date('2026-04-10T11:01:00Z') } }),
    ];
    const result = topJourneys(pageviews, 5);
    expect(result[0][0]).toBe('/ → /about');
    expect(result[0][1]).toBe(2);
  });

  it('excludes single-page sessions', () => {
    const pageviews = [mkEvent({ sessionId: 's1', page: '/' })];
    expect(topJourneys(pageviews, 5)).toHaveLength(0);
  });
});

describe('categoriseSource', () => {
  it('returns Direct for empty referrer', () => {
    expect(categoriseSource('')).toBe('Direct');
    expect(categoriseSource(null)).toBe('Direct');
  });

  it('returns Search for Google', () => {
    expect(categoriseSource('https://www.google.com/search?q=helicopter')).toBe('Search');
  });

  it('returns Social for Instagram', () => {
    expect(categoriseSource('https://www.instagram.com/')).toBe('Social');
  });

  it('returns Referral for other sites', () => {
    expect(categoriseSource('https://aviationweek.com/article/123')).toBe('Referral');
  });
});

describe('trafficSources', () => {
  it('groups and totals sources correctly', () => {
    const pvs = [
      mkEvent({ referrer: '' }),
      mkEvent({ referrer: '' }),
      mkEvent({ referrer: 'https://google.com' }),
    ];
    const result = trafficSources(pvs);
    const direct = result.find(s => s.name === 'Direct');
    expect(direct.pct).toBe(67);
  });
});

describe('sessionsByHour', () => {
  it('returns 24-element array', () => {
    const result = sessionsByHour([mkEvent()]);
    expect(result).toHaveLength(24);
  });

  it('increments the correct hour (UTC)', () => {
    const pvs = [mkEvent({ timestamp: { toDate: () => new Date('2026-04-10T12:00:00Z') } })];
    const result = sessionsByHour(pvs);
    expect(result[12]).toBe(1);
  });
});

describe('sparklineData', () => {
  it('returns an array of length equal to days', () => {
    const result = sparklineData([], 7);
    expect(result).toHaveLength(7);
  });
});

describe('topCampaigns', () => {
  it('returns only events with utmCampaign set', () => {
    const pvs = [
      mkEvent({ utmCampaign: 'spring' }),
      mkEvent({ utmCampaign: 'spring' }),
      mkEvent({ utmCampaign: null }),
    ];
    const result = topCampaigns(pvs, 5);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(['spring', 2]);
  });
});
```

- [ ] **Step 2: Run tests — confirm they all fail**

```bash
npm test -- --reporter=verbose 2>&1 | grep -E "FAIL|Cannot find module"
```

Expected: `Cannot find module './analyticsUtils.js'` — good, the module doesn't exist yet.

- [ ] **Step 3: Create the utility module**

Create `src/components/admin/analytics/analyticsUtils.js`:

```javascript
import UAParser from 'ua-parser-js';

// ─── Core helpers ───────────────────────────────────────────

/** Group an array of objects by a field value and count occurrences */
export function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] ?? 'unknown';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

/** Return top N [key, count] pairs from a countBy result, sorted descending */
export function topN(obj, n = 10) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

// ─── Time helpers ────────────────────────────────────────────

function toDate(ts) {
  return ts?.toDate ? ts.toDate() : new Date(ts);
}

function toDateKey(ts) {
  return toDate(ts).toISOString().slice(0, 10);
}

/**
 * Group events by calendar day (YYYY-MM-DD), filling all `days` days with 0.
 * Returns sorted array of [dateString, count].
 */
export function groupByDay(events, days) {
  const map = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    map[d.toISOString().slice(0, 10)] = 0;
  }
  for (const e of events) {
    const key = toDateKey(e.timestamp);
    if (key in map) map[key]++;
  }
  return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
}

// ─── Engagement metrics ──────────────────────────────────────

/** Percentage of sessions that viewed only 1 page (0–100, integer) */
export function bounceRate(pageviews) {
  const sessionCounts = countBy(pageviews, 'sessionId');
  const total = Object.keys(sessionCounts).length;
  if (total === 0) return 0;
  const bounced = Object.values(sessionCounts).filter((c) => c === 1).length;
  return Math.round((bounced / total) * 100);
}

/** Mean seconds from page_exit events (elementId holds the seconds as a string) */
export function avgTimeOnPage(pageExitEvents) {
  if (pageExitEvents.length === 0) return 0;
  const total = pageExitEvents.reduce((sum, e) => sum + Number(e.elementId || 0), 0);
  return Math.round(total / pageExitEvents.length);
}

/** Format seconds as "Xm Ys" or "Xs" */
export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m === 0 ? `${s}s` : `${m}m ${s}s`;
}

/**
 * Mean of the max scroll threshold reached per session+page combo.
 * e.g. if a session hits 25 and 50 on /, their contribution is 50.
 */
export function avgScrollDepth(scrollEvents) {
  const maxBySessionPage = {};
  for (const e of scrollEvents) {
    const key = `${e.sessionId}:${e.page}`;
    const val = Number(e.elementId || 0);
    maxBySessionPage[key] = Math.max(maxBySessionPage[key] || 0, val);
  }
  const values = Object.values(maxBySessionPage);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/**
 * For the top `n` pages by pageview count, return threshold reach percentages.
 * Result: [{ page, thresholds: [{ threshold, pct }] }]
 */
export function scrollDepthByPage(pageviews, scrollEvents, n = 4) {
  const topPages = topN(countBy(pageviews, 'page'), n).map(([page]) => page);
  return topPages.map((page) => {
    const pvSessions = new Set(pageviews.filter((e) => e.page === page).map((e) => e.sessionId));
    const total = pvSessions.size;
    const scrollsForPage = scrollEvents.filter((e) => e.page === page);
    const thresholds = [25, 50, 75, 100].map((t) => {
      if (total === 0) return { threshold: t, pct: 0 };
      const reached = new Set(
        scrollsForPage.filter((e) => Number(e.elementId) >= t).map((e) => e.sessionId)
      );
      return { threshold: t, pct: Math.round((reached.size / total) * 100) };
    });
    return { page, thresholds };
  });
}

// ─── User journeys ────────────────────────────────────────────

/**
 * Top N page-path sequences across sessions.
 * Deduplicates consecutive same-page entries; excludes single-page sessions.
 * Returns [[pathString, count], ...]
 */
export function topJourneys(pageviews, n = 5) {
  const sessions = {};
  for (const e of pageviews) {
    if (!sessions[e.sessionId]) sessions[e.sessionId] = [];
    sessions[e.sessionId].push({ page: e.page, ts: toDate(e.timestamp) });
  }
  const journeyCounts = {};
  for (const events of Object.values(sessions)) {
    const sorted = [...events].sort((a, b) => a.ts - b.ts);
    const pages = sorted.map((e) => e.page);
    const deduped = pages.filter((p, i) => i === 0 || p !== pages[i - 1]);
    if (deduped.length < 2) continue;
    const key = deduped.join(' → ');
    journeyCounts[key] = (journeyCounts[key] || 0) + 1;
  }
  return topN(journeyCounts, n);
}

// ─── Traffic sources ──────────────────────────────────────────

const SEARCH_DOMAINS = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex'];
const SOCIAL_DOMAINS = ['facebook', 'instagram', 'twitter', 'x.com', 'linkedin', 'tiktok', 'youtube', 'pinterest'];

export function categoriseSource(referrer) {
  if (!referrer) return 'Direct';
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (SEARCH_DOMAINS.some((d) => host.includes(d))) return 'Search';
    if (SOCIAL_DOMAINS.some((d) => host.includes(d))) return 'Social';
    return 'Referral';
  } catch {
    return 'Direct';
  }
}

/**
 * Returns [{ name, count, pct }] for Direct / Search / Social / Referral.
 */
export function trafficSources(pageviews) {
  const counts = {};
  for (const e of pageviews) {
    const cat = categoriseSource(e.referrer);
    counts[cat] = (counts[cat] || 0) + 1;
  }
  const total = pageviews.length;
  if (total === 0) return [];
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
}

// ─── Device / browser ────────────────────────────────────────

/**
 * Parse userAgent strings using ua-parser-js.
 * Returns { devices: [{ name, count, pct }], browsers: [{ name, count, pct }] }
 */
export function parseDevices(events) {
  const deviceCounts = {};
  const browserCounts = {};
  for (const e of events) {
    if (!e.userAgent) continue;
    const parser = new UAParser(e.userAgent);
    const deviceType = parser.getDevice().type || 'desktop';
    const browserName = parser.getBrowser().name || 'Unknown';
    deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
    browserCounts[browserName] = (browserCounts[browserName] || 0) + 1;
  }
  const totalD = Object.values(deviceCounts).reduce((a, b) => a + b, 0) || 1;
  const totalB = Object.values(browserCounts).reduce((a, b) => a + b, 0) || 1;
  return {
    devices: topN(deviceCounts, 5).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
      pct: Math.round((count / totalD) * 100),
    })),
    browsers: topN(browserCounts, 5).map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / totalB) * 100),
    })),
  };
}

// ─── Hourly distribution ─────────────────────────────────────

/** Returns a 24-element array: count of pageviews per UTC hour */
export function sessionsByHour(pageviews) {
  const hours = Array(24).fill(0);
  for (const e of pageviews) {
    hours[toDate(e.timestamp).getUTCHours()]++;
  }
  return hours;
}

// ─── Sparklines ──────────────────────────────────────────────

/** Return last `days` daily counts for sparkline rendering */
export function sparklineData(events, days = 7) {
  return groupByDay(events, days).map(([, count]) => count);
}

// ─── UTM / campaigns ─────────────────────────────────────────

/** Top N utm_campaign values from pageviews that have one */
export function topCampaigns(pageviews, n = 10) {
  const withUtm = pageviews.filter((e) => e.utmCampaign);
  return topN(countBy(withUtm, 'utmCampaign'), n);
}

/** Top N utm_source values */
export function topUtmSources(pageviews, n = 8) {
  const withUtm = pageviews.filter((e) => e.utmSource);
  return topN(countBy(withUtm, 'utmSource'), n);
}
```

- [ ] **Step 4: Run tests — confirm they all pass**

```bash
npm test -- --reporter=verbose 2>&1 | tail -30
```

Expected: all tests pass. If `avgScrollDepth` test fails by 1 (rounding difference), check the expected value: `Math.round((50 + 25) / 2) = 38` is correct.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/analytics/
git commit -m "feat: analytics utility functions with full test coverage"
```

---

## Task 7: AreaChart component

**Files:**
- Create: `src/components/admin/analytics/AreaChart.jsx`

- [ ] **Step 1: Create AreaChart.jsx**

```jsx
/**
 * SVG area chart showing two overlapping series (page views + sessions).
 *
 * Props:
 *   pvByDay    [['YYYY-MM-DD', count], ...]  — pageview daily counts
 *   sessByDay  [['YYYY-MM-DD', count], ...]  — session daily counts
 */
export default function AreaChart({ pvByDay, sessByDay }) {
  const W = 1000;
  const H = 130;
  const PAD_V = 10; // vertical padding so peaks aren't clipped

  const pvCounts = pvByDay.map(([, c]) => c);
  const sessCounts = sessByDay.map(([, c]) => c);
  const n = pvCounts.length;
  const maxVal = Math.max(...pvCounts, 1);

  function pt(i, val) {
    const x = n > 1 ? (i / (n - 1)) * W : 0;
    const y = H - PAD_V - (val / maxVal) * (H - PAD_V * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }

  function buildPaths(counts) {
    if (counts.length === 0) return { line: '', area: '' };
    const pts = counts.map((v, i) => pt(i, v));
    const line = pts.join(' ');
    const lastX = pts[pts.length - 1].split(',')[0];
    const area = `M ${pts.join(' L ')} L ${lastX},${H} L 0,${H} Z`;
    return { line, area };
  }

  const pv = buildPaths(pvCounts);
  const sess = buildPaths(sessCounts);

  // Y-axis labels based on rounded max
  const yMax = Math.ceil(maxVal / 10) * 10 || 10;
  const yLabels = [yMax, Math.round(yMax * 0.75), Math.round(yMax / 2), Math.round(yMax / 4), 0];

  // X-axis: show 5 evenly spaced date labels
  const xDates = n > 0
    ? [0, Math.floor(n / 4), Math.floor(n / 2), Math.floor((3 * n) / 4), n - 1].map(
        (i) => pvByDay[i]?.[0]
      )
    : [];

  function fmtDate(d) {
    if (!d) return '';
    const dt = new Date(d + 'T00:00:00Z');
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  const gridYs = [0.25, 0.5, 0.75, 1].map(
    (f) => (H - PAD_V - f * (H - PAD_V * 2)).toFixed(1)
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* Y-axis labels */}
      <div
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 28,
          width: 32, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {yLabels.map((v) => (
          <span key={v} style={{ fontSize: '0.6rem', color: '#334155', lineHeight: 1 }}>{v}</span>
        ))}
      </div>

      <div style={{ marginLeft: 36 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: 150, display: 'block' }}
        >
          <defs>
            <linearGradient id="ac-pvGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="ac-sessGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {gridYs.map((y) => (
            <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#1a2840" strokeWidth="1" />
          ))}
          <line x1="0" y1={H - PAD_V} x2={W} y2={H - PAD_V} stroke="#1a2840" strokeWidth="1" />

          {/* Sessions (draw behind pageviews) */}
          {sess.area && <path d={sess.area} fill="url(#ac-sessGrad)" />}
          {sess.line && (
            <polyline points={sess.line} fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinejoin="round" />
          )}

          {/* Pageviews */}
          {pv.area && <path d={pv.area} fill="url(#ac-pvGrad)" />}
          {pv.line && (
            <polyline points={pv.line} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
          )}
        </svg>

        {/* X-axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
          {xDates.map((d, i) => (
            <span key={i} style={{ fontSize: '0.6rem', color: '#334155' }}>{fmtDate(d)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify tests still pass**

```bash
npm test 2>&1 | tail -5
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/analytics/AreaChart.jsx
git commit -m "feat: AreaChart SVG component for 30-day pageview/session trend"
```

---

## Task 8: DonutChart component

**Files:**
- Create: `src/components/admin/analytics/DonutChart.jsx`

- [ ] **Step 1: Create DonutChart.jsx**

```jsx
/**
 * SVG stroke-based donut chart.
 *
 * Props:
 *   segments        [{ color, pct, label }]  — must sum to ~100
 *   size            number (default 120)      — SVG width/height in px
 *   strokeWidth     number (default 14)       — ring thickness in px
 *   centerLabel     string                    — large text in the centre
 *   centerSublabel  string                    — small text below centre
 */
export default function DonutChart({
  segments,
  size = 120,
  strokeWidth = 14,
  centerLabel,
  centerSublabel,
}) {
  const r = size / 2 - strokeWidth;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ flexShrink: 0 }}
    >
      {/* Track ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a2840" strokeWidth={strokeWidth} />

      {/* Segments — rotated so start is at 12 o'clock */}
      <g transform={`rotate(-90, ${cx}, ${cy})`}>
        {segments.map((seg, i) => {
          const dash = (seg.pct / 100) * circumference;
          const gap = circumference - dash;
          const offset = -cumulative;
          cumulative += dash;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash.toFixed(2)} ${gap.toFixed(2)}`}
              strokeDashoffset={offset.toFixed(2)}
            />
          );
        })}
      </g>

      {/* Centre labels */}
      {centerLabel && (
        <text
          x={cx}
          y={cy - (centerSublabel ? size * 0.04 : 0)}
          textAnchor="middle"
          fill="#f1f5f9"
          fontSize={size * 0.1}
          fontWeight="700"
        >
          {centerLabel}
        </text>
      )}
      {centerSublabel && (
        <text
          x={cx}
          y={cy + size * 0.09}
          textAnchor="middle"
          fill="#64748b"
          fontSize={size * 0.065}
        >
          {centerSublabel}
        </text>
      )}
    </svg>
  );
}
```

- [ ] **Step 2: Verify tests still pass**

```bash
npm test 2>&1 | tail -5
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/analytics/DonutChart.jsx
git commit -m "feat: DonutChart reusable SVG component"
```

---

## Task 9: AdminAnalytics.jsx — full dashboard rewrite

**Files:**
- Modify: `src/pages/admin/AdminAnalytics.jsx`

- [ ] **Step 1: Replace AdminAnalytics.jsx with the new dashboard**

Replace the entire file with:

```jsx
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import AdminLayout from '../../components/admin/AdminLayout';
import { db, auth } from '../../lib/firebase';
import AreaChart from '../../components/admin/analytics/AreaChart';
import DonutChart from '../../components/admin/analytics/DonutChart';
import {
  countBy, topN, groupByDay, bounceRate, avgTimeOnPage, formatDuration,
  avgScrollDepth, scrollDepthByPage, topJourneys, trafficSources, parseDevices,
  sessionsByHour, sparklineData, topCampaigns, topUtmSources,
} from '../../components/admin/analytics/analyticsUtils.js';

// ─── Colour palette ────────────────────────────────────────────────────────────
const C = {
  bg: '#070d1a', card: '#0d1526', border: '#1a2840',
  text: '#e2e8f0', muted: '#64748b', dim: '#334155',
  blue: '#2563eb', purple: '#a855f7', green: '#16a34a',
  amber: '#d97706', cyan: '#22d3ee', emerald: '#4ade80',
  red: '#f87171',
};

// ─── Internal sub-components ───────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: C.dim, margin: '26px 0 12px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function Sparkline({ data, color }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const n = data.length;
  const W = 80, H = 24;
  const pts = data.map((v, i) => {
    const x = n > 1 ? (i / (n - 1)) * W : 0;
    const y = H - 4 - (v / max) * (H - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const lastPt = pts.split(' ').pop();
  const [lx, ly] = lastPt.split(',');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block', marginTop: 8 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="2.5" fill={color} />
    </svg>
  );
}

function MetricCard({ label, value, sub, subColor = C.muted, sparkData, sparkColor }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ fontSize: '0.7rem', color: C.muted, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: subColor, marginTop: 4 }}>{sub}</div>}
      {sparkData && <Sparkline data={sparkData} color={sparkColor || C.blue} />}
    </div>
  );
}

function BarRow({ name, pct, color = C.blue }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 5 }}>
        <span style={{ color: C.muted }}>{name}</span>
        <span style={{ color: C.text, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ background: C.border, borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: 6, background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}

function TRow({ rank, name, count, maxCount }) {
  const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${C.bg}`, gap: 10, fontSize: '0.78rem' }}>
      <span style={{ color: C.dim, fontSize: '0.65rem', fontWeight: 700, width: 14, flexShrink: 0 }}>{rank}</span>
      <span style={{ color: C.muted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.76rem' }}>{name}</span>
      <div style={{ flex: 0.8 }}>
        <div style={{ background: C.border, borderRadius: 4, height: 4 }}>
          <div style={{ width: `${pct}%`, height: 4, background: C.blue, borderRadius: 4 }} />
        </div>
      </div>
      <span style={{ color: C.text, fontWeight: 700, flexShrink: 0 }}>{count}</span>
    </div>
  );
}

function CountryRow({ flag, name, pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: `1px solid ${C.bg}`, fontSize: '0.77rem' }}>
      <span style={{ fontSize: '1rem' }}>{flag}</span>
      <span style={{ color: C.muted, flex: 1 }}>{name}</span>
      <div style={{ flex: 1.2, background: C.border, borderRadius: 4, height: 4 }}>
        <div style={{ width: `${pct}%`, height: 4, background: C.blue, borderRadius: 4 }} />
      </div>
      <span style={{ color: C.text, fontWeight: 700, width: 34, textAlign: 'right', fontSize: '0.75rem' }}>{pct}%</span>
    </div>
  );
}

function JourneyRow({ path, count }) {
  const pages = path.split(' → ');
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${C.bg}`, flexWrap: 'wrap', gap: 0 }}>
      {pages.map((p, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ background: '#172554', color: '#93c5fd', padding: '2px 8px', borderRadius: 5, fontSize: '0.7rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{p}</span>
          {i < pages.length - 1 && <span style={{ color: C.border, padding: '0 5px', fontSize: '0.75rem' }}>→</span>}
        </span>
      ))}
      <span style={{ marginLeft: 'auto', paddingLeft: 10, color: C.muted, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{count}×</span>
    </div>
  );
}

function ScrollDepthSection({ scrollByPage }) {
  const thresholdColors = { 25: '#1d4ed8', 50: '#2563eb', 75: '#3b82f6', 100: '#93c5fd' };
  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        {[25, 50, 75, 100].map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.65rem', color: C.muted }}>
            <div style={{ width: 8, height: 8, background: thresholdColors[t], borderRadius: 2 }} />
            {t}%
          </div>
        ))}
      </div>
      {scrollByPage.map(({ page, thresholds }) => (
        <div key={page} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '0.7rem', color: C.muted, marginBottom: 6, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page}</div>
          {thresholds.map(({ threshold, pct }) => (
            <div key={threshold} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: '0.6rem', color: C.dim, width: 28, textAlign: 'right', flexShrink: 0 }}>{threshold}%</span>
              <div style={{ flex: 1, background: C.border, borderRadius: 3, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: 8, background: thresholdColors[threshold], borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: '0.62rem', color: C.muted, width: 28, textAlign: 'right', flexShrink: 0 }}>{pct}%</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function HourlyBar({ hours }) {
  const max = Math.max(...hours, 1);
  return (
    <svg viewBox="0 0 264 40" style={{ width: '100%', height: 40, display: 'block' }}>
      {hours.map((count, h) => {
        const barH = Math.round((count / max) * 34);
        const isPeak = count > max * 0.6;
        return (
          <rect
            key={h}
            x={h * 11}
            y={36 - barH}
            width={9}
            height={barH}
            fill={isPeak ? C.blue : '#1e3a5f'}
          />
        );
      })}
      {[0, 6, 12, 18, 23].map((h) => (
        <text key={h} x={h * 11 + 4} y={52} fontSize="6" fill={C.dim} textAnchor="middle">{h}h</text>
      ))}
    </svg>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
      {children}
    </div>
  );
}

// ─── Flag lookup (top 10 aviation markets) ────────────────────────────────────
const FLAG_MAP = {
  'United Kingdom': '🇬🇧', 'United States': '🇺🇸', 'Australia': '🇦🇺',
  'Canada': '🇨🇦', 'Germany': '🇩🇪', 'France': '🇫🇷', 'UAE': '🇦🇪',
  'Netherlands': '🇳🇱', 'Switzerland': '🇨🇭', 'New Zealand': '🇳🇿',
  'South Africa': '🇿🇦', 'Singapore': '🇸🇬', 'Ireland': '🇮🇪',
  'Norway': '🇳🇴', 'Sweden': '🇸🇪', 'Denmark': '🇩🇰',
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminAnalytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [excludedIps, setExcludedIps] = useState([]);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Load excluded IPs from admin config endpoint (requires auth token)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { setConfigLoaded(true); return; }
    user.getIdToken()
      .then((token) =>
        fetch('/api/analytics/config', { headers: { Authorization: `Bearer ${token}` } })
      )
      .then((r) => r.json())
      .then(({ excludedIps: ips }) => setExcludedIps(Array.isArray(ips) ? ips : []))
      .catch(() => {})
      .finally(() => setConfigLoaded(true));
  }, []);

  // Load events for selected time window
  useEffect(() => {
    if (!configLoaded) return;
    setLoading(true);
    const since = Timestamp.fromDate(new Date(Date.now() - days * 86400 * 1000));
    const q = query(
      collection(db, 'page_events'),
      where('timestamp', '>=', since),
      orderBy('timestamp', 'desc')
    );
    getDocs(q)
      .then((snap) => setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .finally(() => setLoading(false));
  }, [days, configLoaded]);

  // ─── Filter out admin IPs ──────────────────────────────────────────────────
  const filtered = excludedIps.length
    ? events.filter((e) => !excludedIps.includes(e.ip))
    : events;

  // ─── Segment by event type ────────────────────────────────────────────────
  const pageviews = filtered.filter((e) => e.eventType === 'pageview');
  const ctaClicks = filtered.filter((e) => e.eventType === 'cta_click');
  const formSubmits = filtered.filter((e) => e.eventType === 'form_submit');
  const scrollEvents = filtered.filter((e) => e.eventType === 'scroll_depth');
  const exitEvents = filtered.filter((e) => e.eventType === 'page_exit');

  // ─── Deduplicate sessions for chart (first pageview per session per day) ──
  const seenSessions = new Set();
  const firstPvPerSession = pageviews.filter((e) => {
    if (seenSessions.has(e.sessionId)) return false;
    seenSessions.add(e.sessionId);
    return true;
  });

  // ─── Aggregations ─────────────────────────────────────────────────────────
  const uniqueSessions = new Set(filtered.map((e) => e.sessionId)).size;
  const pvByDay = groupByDay(pageviews, days);
  const sessByDay = groupByDay(firstPvPerSession, days);
  const bounce = bounceRate(pageviews);
  const avgTime = avgTimeOnPage(exitEvents);
  const avgScroll = avgScrollDepth(scrollEvents);
  const topPages = topN(countBy(pageviews, 'page'), 7);
  const sources = trafficSources(pageviews);
  const { devices, browsers } = parseDevices(pageviews);
  const topCountries = topN(countBy(filtered.filter((e) => e.country), 'country'), 7);
  const hours = sessionsByHour(pageviews);
  const scrollByPage = scrollDepthByPage(pageviews, scrollEvents, 4);
  const journeys = topJourneys(pageviews, 5);
  const topCTAs = topN(countBy(ctaClicks, 'elementId'), 6);
  const topForms = topN(countBy(formSubmits, 'page'), 5);
  const campaigns = topCampaigns(pageviews, 8);
  const utmSrc = topUtmSources(pageviews, 6);

  // Sparklines (last 7 days)
  const sparkDays = Math.min(7, days);
  const pvSpark = sparklineData(pageviews, sparkDays);
  const sessSpark = sparklineData(firstPvPerSession, sparkDays);
  const ctaSpark = sparklineData(ctaClicks, sparkDays);
  const formSpark = sparklineData(formSubmits, sparkDays);

  // Donut segments
  const sourceColors = { Direct: C.green, Search: C.blue, Social: C.purple, Referral: C.amber };
  const sourceDonuts = sources.map((s) => ({ color: sourceColors[s.name] || C.muted, pct: s.pct, label: s.name }));
  const deviceColors = ['#2563eb', '#a855f7', '#0891b2', '#16a34a', '#d97706'];
  const deviceDonuts = devices.map((d, i) => ({ color: deviceColors[i] || C.muted, pct: d.pct, label: d.name }));

  // ─── Styles ────────────────────────────────────────────────────────────────
  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };
  const grid3 = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 };
  const grid4 = { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 };
  const donutWrap = { display: 'flex', alignItems: 'center', gap: 20, marginTop: 4 };
  const legendItem = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.76rem' };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div style={{ background: C.bg, minHeight: '100vh', padding: '0 0 60px', margin: '-1.5rem', color: C.text }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '20px 28px 0' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9' }}>Analytics</h1>
            <div style={{ display: 'flex', gap: 4 }}>
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  style={{
                    background: days === d ? '#172554' : 'transparent',
                    border: `1px solid ${days === d ? C.blue : C.border}`,
                    color: days === d ? '#93c5fd' : C.muted,
                    padding: '5px 14px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer',
                    fontWeight: days === d ? 600 : 400,
                  }}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* IP Filter Banner */}
          {excludedIps.length > 0 && (
            <div style={{
              background: '#052e16', border: '1px solid #166534', borderRadius: 8,
              padding: '8px 16px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: '0.78rem', color: '#86efac',
            }}>
              <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', flexShrink: 0 }} />
              Filtering {excludedIps.length === 1 ? 'your IP' : `${excludedIps.length} IPs`} — showing real visitor data only
            </div>
          )}

          {loading ? (
            <p style={{ color: C.muted, paddingTop: 40 }}>Loading…</p>
          ) : (
            <>
              {/* ── Area Chart ─────────────────────────────────────────── */}
              <Card style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>Page Views &amp; Sessions — Last {days} Days</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {[['#3b82f6', 'Page Views'], ['#a855f7', 'Sessions']].map(([color, label]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: C.muted }}>
                        <div style={{ width: 22, height: 3, background: color, borderRadius: 2 }} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                <AreaChart pvByDay={pvByDay} sessByDay={sessByDay} />
              </Card>

              {/* ── Overview ───────────────────────────────────────────── */}
              <SectionLabel>Overview</SectionLabel>
              <div style={grid4}>
                <MetricCard label="Page Views" value={pageviews.length.toLocaleString()} sparkData={pvSpark} sparkColor={C.blue} />
                <MetricCard label="Unique Sessions" value={uniqueSessions.toLocaleString()} sparkData={sessSpark} sparkColor={C.purple} />
                <MetricCard label="CTA Clicks" value={ctaClicks.length.toLocaleString()} sparkData={ctaSpark} sparkColor={C.cyan} />
                <MetricCard label="Form Submits" value={formSubmits.length.toLocaleString()} sparkData={formSpark} sparkColor={C.emerald} />
              </div>

              {/* ── Engagement ─────────────────────────────────────────── */}
              <SectionLabel>Engagement</SectionLabel>
              <div style={grid3}>
                <MetricCard label="Bounce Rate" value={`${bounce}%`} sub={bounce < 40 ? '↓ Good' : '↑ High'} subColor={bounce < 40 ? C.emerald : C.red} />
                <MetricCard label="Avg. Time on Page" value={formatDuration(avgTime)} sub="across all pages" />
                <MetricCard label="Avg. Scroll Depth" value={`${avgScroll}%`} sub={avgScroll > 60 ? '↑ Strong engagement' : 'Room to improve'} subColor={avgScroll > 60 ? C.emerald : C.muted} />
              </div>

              {/* ── Acquisition ────────────────────────────────────────── */}
              <SectionLabel>Acquisition</SectionLabel>
              <div style={grid2}>
                <Card>
                  <CardTitle>Top Pages</CardTitle>
                  {topPages.length === 0 ? <p style={{ color: C.muted, fontSize: '0.875rem' }}>No data</p> : (
                    topPages.map(([page, count], i) => (
                      <TRow key={page} rank={i + 1} name={page} count={count} maxCount={topPages[0][1]} />
                    ))
                  )}
                </Card>

                <Card>
                  <CardTitle>Traffic Sources</CardTitle>
                  <div style={donutWrap}>
                    <DonutChart
                      segments={sourceDonuts}
                      size={120}
                      centerLabel={sources[0] ? `${sources[0].pct}%` : '—'}
                      centerSublabel={sources[0]?.name}
                    />
                    <div style={{ flex: 1 }}>
                      {sources.map((s) => (
                        <div key={s.name} style={legendItem}>
                          <div style={{ width: 10, height: 10, background: sourceColors[s.name] || C.muted, borderRadius: 3, flexShrink: 0 }} />
                          <span style={{ color: C.muted, flex: 1 }}>{s.name}</span>
                          <span style={{ color: C.text, fontWeight: 700 }}>{s.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* ── Audience ───────────────────────────────────────────── */}
              <SectionLabel>Audience</SectionLabel>
              <div style={grid2}>
                <Card>
                  <CardTitle>Devices &amp; Browsers</CardTitle>
                  <div style={donutWrap}>
                    <DonutChart
                      segments={deviceDonuts}
                      size={110}
                      centerLabel={devices[0] ? `${devices[0].pct}%` : '—'}
                      centerSublabel={devices[0]?.name}
                    />
                    <div style={{ flex: 1 }}>
                      {devices.map((d, i) => (
                        <div key={d.name} style={legendItem}>
                          <div style={{ width: 10, height: 10, background: deviceColors[i] || C.muted, borderRadius: 3, flexShrink: 0 }} />
                          <span style={{ color: C.muted, flex: 1 }}>{d.name}</span>
                          <span style={{ color: C.text, fontWeight: 700 }}>{d.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 14 }}>
                    {browsers.map((b) => (
                      <BarRow key={b.name} name={b.name} pct={b.pct} color={C.amber} />
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardTitle>Top Countries</CardTitle>
                  {topCountries.map(([country, count]) => {
                    const total = topCountries.reduce((s, [, c]) => s + c, 0);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <CountryRow key={country} flag={FLAG_MAP[country] || '🌍'} name={country} pct={pct} />
                    );
                  })}
                  {topCountries.length === 0 && (
                    <p style={{ color: C.muted, fontSize: '0.875rem' }}>No geo data yet — new events will include location</p>
                  )}
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 14 }}>
                    <div style={{ fontSize: '0.7rem', color: C.dim, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sessions by Hour (UTC)</div>
                    <HourlyBar hours={hours} />
                  </div>
                </Card>
              </div>

              {/* ── Behaviour ──────────────────────────────────────────── */}
              <SectionLabel>Behaviour</SectionLabel>
              <div style={grid2}>
                <Card>
                  <CardTitle>Scroll Depth by Page</CardTitle>
                  {scrollByPage.length > 0
                    ? <ScrollDepthSection scrollByPage={scrollByPage} />
                    : <p style={{ color: C.muted, fontSize: '0.875rem' }}>No scroll data yet — will appear after deployment</p>
                  }
                </Card>

                <Card>
                  <CardTitle>Top User Journeys</CardTitle>
                  {journeys.length > 0
                    ? journeys.map(([path, count]) => <JourneyRow key={path} path={path} count={count} />)
                    : <p style={{ color: C.muted, fontSize: '0.875rem' }}>No multi-page sessions yet</p>
                  }
                </Card>
              </div>

              {/* ── Campaigns ──────────────────────────────────────────── */}
              {(campaigns.length > 0 || utmSrc.length > 0) && (
                <>
                  <SectionLabel>Campaigns</SectionLabel>
                  <div style={grid2}>
                    <Card>
                      <CardTitle>Top UTM Campaigns</CardTitle>
                      {campaigns.map(([name, count], i) => (
                        <TRow key={name} rank={i + 1} name={name} count={count} maxCount={campaigns[0][1]} />
                      ))}
                    </Card>
                    <Card>
                      <CardTitle>Top UTM Sources</CardTitle>
                      {utmSrc.map(([name, count], i) => (
                        <TRow key={name} rank={i + 1} name={name} count={count} maxCount={utmSrc[0][1]} />
                      ))}
                    </Card>
                  </div>
                </>
              )}

              {/* ── Interactions ───────────────────────────────────────── */}
              <SectionLabel>Interactions</SectionLabel>
              <div style={grid2}>
                <Card>
                  <CardTitle>Top CTA Clicks</CardTitle>
                  {topCTAs.length === 0 ? <p style={{ color: C.muted, fontSize: '0.875rem' }}>No data</p> : (
                    topCTAs.map(([name, count], i) => (
                      <TRow key={name} rank={i + 1} name={name} count={count} maxCount={topCTAs[0][1]} />
                    ))
                  )}
                </Card>
                <Card>
                  <CardTitle>Top Form Submit Pages</CardTitle>
                  {topForms.length === 0 ? <p style={{ color: C.muted, fontSize: '0.875rem' }}>No data</p> : (
                    topForms.map(([page, count], i) => (
                      <TRow key={page} rank={i + 1} name={page} count={count} maxCount={topForms[0][1]} />
                    ))
                  )}
                </Card>
              </div>

            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Run all tests**

```bash
npm test 2>&1 | tail -10
```

Expected: all tests pass (the dashboard component itself isn't unit tested — its correctness comes from the utility function tests).

- [ ] **Step 3: Build the admin app and verify no compile errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with no errors. If there are missing import errors, double-check the paths in the import section match the files created in Tasks 6, 7, and 8.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminAnalytics.jsx
git commit -m "feat: redesign analytics dashboard with charts, geo, scroll depth, UTM, journeys"
```

---

## Task 10: .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Check current .gitignore**

```bash
grep -n "superpowers" .gitignore 2>/dev/null || echo "not present"
```

- [ ] **Step 2: Add .superpowers/ entry**

Open `.gitignore` and add this line:

```
.superpowers/
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers/ brainstorm artefacts"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|-----------------|------|
| IP capture on every event | Task 3 |
| ADMIN_IP env var + /api/analytics/config | Task 3 |
| Dashboard fetches config, filters events | Task 9 |
| Geo enrichment at write time (ip-api.com, 2s timeout) | Task 3 |
| Private IP skip | Task 3 |
| Rate limiting 60 req/min | Task 2 + 3 |
| trust proxy | Task 2 |
| scroll_depth events | Task 5 |
| page_exit events | Task 5 |
| UTM capture client-side | Task 4 |
| UTM stored server-side | Task 3 |
| ua-parser-js device/browser | Task 6 |
| Traffic source categorisation | Task 6 |
| Bounce rate | Task 6 |
| Avg time on page | Task 6 |
| Avg scroll depth | Task 6 |
| Scroll depth by page | Task 6 |
| User journeys | Task 6 |
| Sessions by hour | Task 6 |
| UTM campaign/source breakdown | Task 6 |
| Area chart (hero) | Task 7 |
| Donut chart | Task 8 |
| Full dashboard rewrite | Task 9 |
| .gitignore for .superpowers/ | Task 10 |

**Data retention:** Firestore TTL policy must be configured manually via the Firebase Console (Firestore → TTL policies → collection: `page_events`, field: `timestamp`, duration: 12 months). No code change needed — add a note to your internal docs.

**Firestore indexes:** No new indexes needed. The dashboard query is unchanged (`where timestamp >= since, orderBy timestamp desc`). All IP/geo/country/UTM filtering is done client-side on the fetched event set.
