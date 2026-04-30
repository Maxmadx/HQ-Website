import { describe, it, expect } from 'vitest';
import {
  computeFunnel,
  computeFunnelValue,
  segmentFunnelBySource,
  medianTimeToConversionHours,
} from './funnelAggregations';

const NOW = Date.now();
const tsHoursAgo = (h) => ({ toMillis: () => NOW - h * 3600 * 1000 });

const fixtureEvents = [
  // session A: full funnel, converted
  { sessionId: 'a', eventType: 'pageview',         page: '/',                           timestamp: tsHoursAgo(48), utmSource: 'google' },
  { sessionId: 'a', eventType: 'view_item',        itemCategory: 'discovery-flight',    timestamp: tsHoursAgo(47), utmSource: 'google' },
  { sessionId: 'a', eventType: 'begin_checkout',   itemCategory: 'discovery-flight',    timestamp: tsHoursAgo(46), value: 350, utmSource: 'google' },
  { sessionId: 'a', eventType: 'add_payment_info', itemCategory: 'discovery-flight',    timestamp: tsHoursAgo(45), value: 350, utmSource: 'google' },
  { sessionId: 'a', eventType: 'purchase',         itemCategory: 'discovery-flight',    timestamp: tsHoursAgo(44), value: 350, transactionId: 'pi_a' },

  // session B: viewed, never converted
  { sessionId: 'b', eventType: 'pageview',     page: '/training/trial-lessons',  timestamp: tsHoursAgo(20), utmSource: 'instagram' },
  { sessionId: 'b', eventType: 'view_item',    itemCategory: 'discovery-flight', timestamp: tsHoursAgo(19), utmSource: 'instagram' },

  // session C: viewed + began checkout, never paid
  { sessionId: 'c', eventType: 'view_item',      itemCategory: 'discovery-flight', timestamp: tsHoursAgo(10), utmSource: null },
  { sessionId: 'c', eventType: 'begin_checkout', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(9),  value: 150, utmSource: null },

  // session D: bought a different product (london-tour) — must be excluded from discovery-flight funnel
  { sessionId: 'd', eventType: 'view_item', itemCategory: 'london-tour', timestamp: tsHoursAgo(5) },
  { sessionId: 'd', eventType: 'purchase',  itemCategory: 'london-tour', timestamp: tsHoursAgo(4), value: 200, transactionId: 'pi_d' },

  // session E: webhook double-fire on the same pi — must dedupe via transactionId
  { sessionId: 'e', eventType: 'view_item',      itemCategory: 'discovery-flight', timestamp: tsHoursAgo(3) },
  { sessionId: 'e', eventType: 'begin_checkout', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(2), value: 350 },
  { sessionId: 'e', eventType: 'purchase',       itemCategory: 'discovery-flight', timestamp: tsHoursAgo(1), value: 350, transactionId: 'pi_e' },
  { sessionId: 'e', eventType: 'purchase',       itemCategory: 'discovery-flight', timestamp: tsHoursAgo(1), value: 350, transactionId: 'pi_e' },
];

describe('computeFunnel', () => {
  it('counts unique sessions at each stage for the requested category', () => {
    const out = computeFunnel(fixtureEvents, { itemCategory: 'discovery-flight' });
    expect(out.visits).toBe(4); // sessions a, b, c, e (d only fired non-funnel-counted events for this category)
    expect(out.viewedProduct).toBe(4); // a, b, c, e
    expect(out.beganCheckout).toBe(3); // a, c, e
    expect(out.purchased).toBe(2); // a, e (e dedupes via transactionId)
  });

  it('returns zeros for an empty event list', () => {
    expect(computeFunnel([], { itemCategory: 'discovery-flight' })).toEqual({
      visits: 0, viewedProduct: 0, beganCheckout: 0, purchased: 0,
    });
  });

  it('excludes events outside the date range', () => {
    const events = [
      { sessionId: 'x', eventType: 'view_item', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(200) },
      { sessionId: 'y', eventType: 'view_item', itemCategory: 'discovery-flight', timestamp: tsHoursAgo(2) },
    ];
    const since = Date.now() - 24 * 3600 * 1000;
    const out = computeFunnel(events, { itemCategory: 'discovery-flight', sinceMs: since });
    expect(out.viewedProduct).toBe(1);
  });
});

describe('computeFunnelValue', () => {
  it('sums purchase value and computes AOV', () => {
    const out = computeFunnelValue(fixtureEvents, { itemCategory: 'discovery-flight' });
    expect(out.totalValue).toBe(700); // 350 (a) + 350 (e)
    expect(out.purchasedCount).toBe(2);
    expect(out.aov).toBe(350);
  });

  it('returns zero AOV when no purchases', () => {
    expect(computeFunnelValue([], { itemCategory: 'discovery-flight' })).toEqual({
      totalValue: 0, purchasedCount: 0, aov: 0,
    });
  });
});

describe('segmentFunnelBySource', () => {
  it('groups funnel counts by utmSource (with "direct" bucket for null)', () => {
    const rows = segmentFunnelBySource(fixtureEvents, { itemCategory: 'discovery-flight' });
    const bySource = Object.fromEntries(rows.map((r) => [r.source, r]));
    expect(bySource.google.purchased).toBe(1);
    expect(bySource.instagram.purchased).toBe(0);
    expect(bySource.direct.purchased).toBe(1); // session e (null utmSource)
  });
});

describe('medianTimeToConversionHours', () => {
  it('returns the median hours between first pageview/view_item and purchase', () => {
    const out = medianTimeToConversionHours(fixtureEvents, { itemCategory: 'discovery-flight' });
    // session a: 48h - 44h = 4h
    // session e: 3h - 1h = 2h
    // median of [4, 2] = 3
    expect(out).toBe(3);
  });

  it('returns null when there are no completed conversions', () => {
    const noPurchase = fixtureEvents.filter((e) => e.eventType !== 'purchase');
    expect(medianTimeToConversionHours(noPurchase, { itemCategory: 'discovery-flight' })).toBeNull();
  });
});
