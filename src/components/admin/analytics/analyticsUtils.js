import { UAParser } from 'ua-parser-js';

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
    if (!e.timestamp) continue;
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
  const toNum = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
  const total = pageExitEvents.reduce((sum, e) => sum + toNum(e.elementId), 0);
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
  const toNum = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
  for (const e of scrollEvents) {
    const key = `${e.sessionId}:${e.page}`;
    const val = toNum(e.elementId);
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
const SOCIAL_DOMAINS = ['facebook', 'instagram', 'twitter', 'x.com', 't.co', 'linkedin', 'tiktok', 'youtube', 'pinterest'];

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
    if (!e.timestamp) continue;
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

/**
 * Top N actual referring domains (excludes search engines, social networks, and empty referrers).
 * Strips www. prefix. Returns [[domain, count], ...].
 */
export function topReferrerDomains(pageviews, n = 8) {
  const domainCounts = {};
  for (const e of pageviews) {
    if (!e.referrer) continue;
    try {
      const host = new URL(e.referrer).hostname.toLowerCase();
      if (SEARCH_DOMAINS.some((d) => host.includes(d))) continue;
      if (SOCIAL_DOMAINS.some((d) => host.includes(d))) continue;
      const clean = host.replace(/^www\./, '');
      domainCounts[clean] = (domainCounts[clean] || 0) + 1;
    } catch {}
  }
  return topN(domainCounts, n);
}

/**
 * Booking conversion funnel for HQ Aviation.
 * steps = [{ label, match: (page: string) => boolean }]
 * The final step (form submit) is taken from formSubmitEvents.
 * Returns [{ label, count, pct }] where pct is relative to step 0 (total sessions).
 */
export function funnelData(pageviews, formSubmitEvents, steps) {
  const sessionPages = {};
  for (const e of pageviews) {
    if (!sessionPages[e.sessionId]) sessionPages[e.sessionId] = new Set();
    sessionPages[e.sessionId].add(e.page);
  }
  const allSessions = Object.keys(sessionPages);
  const top = allSessions.length || 1;

  const results = steps.map(({ label, match }) => {
    const count = allSessions.filter((sid) => [...sessionPages[sid]].some(match)).length;
    return { label, count, pct: Math.round((count / top) * 100) };
  });

  const formSessions = new Set(formSubmitEvents.map((e) => e.sessionId)).size;
  results.push({
    label: 'Submitted Form',
    count: formSessions,
    pct: Math.round((formSessions / top) * 100),
  });

  return results;
}

/**
 * Per-page average time on page (seconds) from page_exit events.
 * elementId on page_exit events holds the elapsed seconds as a string.
 * Returns [{ page, avgSeconds, count }] sorted by avgSeconds desc.
 */
export function avgTimeByPage(exitEvents, n = 8) {
  const toNum = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
  const byPage = {};
  for (const e of exitEvents) {
    if (!e.page) continue;
    if (!byPage[e.page]) byPage[e.page] = { total: 0, count: 0 };
    byPage[e.page].total += toNum(e.elementId);
    byPage[e.page].count += 1;
  }
  return Object.entries(byPage)
    .filter(([, { count }]) => count > 0)
    .map(([page, { total, count }]) => ({
      page,
      avgSeconds: Math.round(total / count),
      count,
    }))
    .sort((a, b) => b.avgSeconds - a.avgSeconds)
    .slice(0, n);
}
