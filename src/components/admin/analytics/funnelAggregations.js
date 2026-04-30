/**
 * Pure aggregation functions for the purchase funnel dashboard tile.
 * Inputs are arrays of page_events docs (already fetched from Firestore by the caller).
 * No Firestore access here — keeps everything unit-testable with fixtures.
 */

function eventTimeMs(ev) {
  if (!ev || !ev.timestamp) return 0;
  if (typeof ev.timestamp.toMillis === 'function') return ev.timestamp.toMillis();
  if (ev.timestamp instanceof Date) return ev.timestamp.getTime();
  if (typeof ev.timestamp === 'number') return ev.timestamp;
  return 0;
}

function inRange(ev, sinceMs, untilMs) {
  const t = eventTimeMs(ev);
  if (sinceMs && t < sinceMs) return false;
  if (untilMs && t > untilMs) return false;
  return true;
}

function isCategoryMatch(ev, itemCategory) {
  if (!itemCategory) return true;
  // purchase / view_item / begin_checkout / add_payment_info all carry itemCategory
  if (ev.itemCategory === itemCategory) return true;
  // pageview events don't carry itemCategory — they count toward "Visits" via sessionId only
  return false;
}

/**
 * Funnel counts: unique sessionIds at each stage, with `purchased` deduped by transactionId.
 * "Visits" counts sessions that have at least one category-matching event in range.
 */
export function computeFunnel(events, { itemCategory, sinceMs, untilMs } = {}) {
  const visits = new Set();
  const viewed = new Set();
  const began = new Set();
  const purchasedTx = new Set();

  for (const ev of events) {
    if (!inRange(ev, sinceMs, untilMs)) continue;
    if (!isCategoryMatch(ev, itemCategory)) continue;

    // "Visits" counts every session that fired any category-relevant event in range
    if (ev.sessionId) visits.add(ev.sessionId);
    if (ev.eventType === 'view_item' && ev.sessionId) viewed.add(ev.sessionId);
    if (ev.eventType === 'begin_checkout' && ev.sessionId) began.add(ev.sessionId);
    if (ev.eventType === 'purchase' && ev.transactionId) purchasedTx.add(ev.transactionId);
  }

  return {
    visits: visits.size,
    viewedProduct: viewed.size,
    beganCheckout: began.size,
    purchased: purchasedTx.size,
  };
}

/**
 * £ value totals for the funnel. Only `purchase` events contribute to revenue.
 */
export function computeFunnelValue(events, { itemCategory, sinceMs, untilMs } = {}) {
  const seenTx = new Set();
  let totalValue = 0;
  let purchasedCount = 0;

  for (const ev of events) {
    if (!inRange(ev, sinceMs, untilMs)) continue;
    if (ev.eventType !== 'purchase') continue;
    if (!isCategoryMatch(ev, itemCategory)) continue;
    if (!ev.transactionId || seenTx.has(ev.transactionId)) continue;
    seenTx.add(ev.transactionId);
    purchasedCount += 1;
    totalValue += typeof ev.value === 'number' ? ev.value : 0;
  }

  return {
    totalValue,
    purchasedCount,
    aov: purchasedCount > 0 ? totalValue / purchasedCount : 0,
  };
}

/**
 * Funnel split by traffic source (utmSource). Null/empty utmSource bucketed as "direct".
 */
export function segmentFunnelBySource(events, opts = {}) {
  function bucket(ev) {
    return (ev.utmSource && String(ev.utmSource).trim()) || 'direct';
  }

  // First, group sessionId → source by the earliest event's utmSource
  const sessionSource = new Map();
  for (const ev of events) {
    if (!ev.sessionId) continue;
    if (!sessionSource.has(ev.sessionId)) {
      sessionSource.set(ev.sessionId, bucket(ev));
    }
  }

  // Then walk events and group funnel counts per source
  const grouped = new Map();
  for (const ev of events) {
    if (!ev.sessionId) continue;
    const source = sessionSource.get(ev.sessionId);
    if (!grouped.has(source)) {
      grouped.set(source, { source, visits: new Set(), viewed: new Set(), began: new Set(), purchasedTx: new Set() });
    }
    const row = grouped.get(source);
    row.visits.add(ev.sessionId);
    if (!isCategoryMatch(ev, opts.itemCategory)) continue;
    if (ev.eventType === 'view_item') row.viewed.add(ev.sessionId);
    if (ev.eventType === 'begin_checkout') row.began.add(ev.sessionId);
    if (ev.eventType === 'purchase' && ev.transactionId) row.purchasedTx.add(ev.transactionId);
  }

  return Array.from(grouped.values()).map((r) => ({
    source: r.source,
    visits: r.visits.size,
    viewedProduct: r.viewed.size,
    beganCheckout: r.began.size,
    purchased: r.purchasedTx.size,
  }));
}

/**
 * Median hours from each converted session's first relevant event to its purchase.
 * Returns null if no conversions in range.
 */
export function medianTimeToConversionHours(events, { itemCategory, sinceMs, untilMs } = {}) {
  // First pass: collect ALL in-range events per session (including pageviews without itemCategory)
  const allPerSession = new Map();
  for (const ev of events) {
    if (!inRange(ev, sinceMs, untilMs)) continue;
    if (!ev.sessionId) continue;
    if (!allPerSession.has(ev.sessionId)) allPerSession.set(ev.sessionId, []);
    allPerSession.get(ev.sessionId).push(ev);
  }

  const durations = [];
  for (const [, evs] of allPerSession) {
    // Only consider sessions that have a category-matching purchase
    const purchaseEv = evs.find(
      (e) => e.eventType === 'purchase' && isCategoryMatch(e, itemCategory)
    );
    if (!purchaseEv) continue;
    const earliest = evs
      .filter((e) => e.eventType === 'view_item' || e.eventType === 'pageview')
      .reduce((min, e) => Math.min(min, eventTimeMs(e)), Infinity);
    if (!Number.isFinite(earliest)) continue;
    const ms = eventTimeMs(purchaseEv) - earliest;
    if (ms > 0) durations.push(ms / 3600000);
  }

  if (durations.length === 0) return null;
  durations.sort((a, b) => a - b);
  const mid = Math.floor(durations.length / 2);
  if (durations.length % 2 === 0) {
    return (durations[mid - 1] + durations[mid]) / 2;
  }
  return durations[mid];
}
