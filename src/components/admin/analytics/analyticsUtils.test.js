// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  countBy, topN, groupByDay, bounceRate, avgTimeOnPage, formatDuration,
  avgScrollDepth, scrollDepthByPage, topJourneys, categoriseSource,
  trafficSources, sessionsByHour, sparklineData, topCampaigns,
  parseDevices, topUtmSources, topReferrerDomains,
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
    // Use a date 2 days ago so this test stays valid regardless of when it runs
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000);
    const dayKey = twoDaysAgo.toISOString().slice(0, 10);
    const events = [
      mkEvent({ timestamp: { toDate: () => new Date(twoDaysAgo) } }),
      mkEvent({ timestamp: { toDate: () => new Date(twoDaysAgo) } }),
    ];
    const result = groupByDay(events, 7);
    const day = result.find(([d]) => d === dayKey);
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

  it('drops backgrounded-tab outliers (> 30 min)', () => {
    const exits = [
      mkEvent({ eventType: 'page_exit', elementId: '30' }),
      mkEvent({ eventType: 'page_exit', elementId: '90' }),
      mkEvent({ eventType: 'page_exit', elementId: '7200' }), // 2h backgrounded tab — dropped
    ];
    expect(avgTimeOnPage(exits)).toBe(60); // mean of 30 & 90 only
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
    // s1 max = 50, s2 max = 25, avg = 37.5 → rounds to 38
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
  it('returns Direct / Unknown for empty referrer', () => {
    expect(categoriseSource('')).toBe('Direct / Unknown');
    expect(categoriseSource(null)).toBe('Direct / Unknown');
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
  it('groups and totals sources correctly (per session)', () => {
    const pvs = [
      mkEvent({ referrer: '', sessionId: 's1' }),
      mkEvent({ referrer: '', sessionId: 's2' }),
      mkEvent({ referrer: 'https://google.com', sessionId: 's3' }),
    ];
    const result = trafficSources(pvs);
    const direct = result.find(s => s.name === 'Direct / Unknown');
    expect(direct.pct).toBe(67); // 2 of 3 sessions
  });

  it('counts each session once even with many pageviews (SPA entry referrer repeats)', () => {
    const pvs = [
      mkEvent({ referrer: 'https://google.com', sessionId: 's1' }),
      mkEvent({ referrer: 'https://google.com', sessionId: 's1' }),
      mkEvent({ referrer: 'https://google.com', sessionId: 's1' }),
      mkEvent({ referrer: '', sessionId: 's2' }),
    ];
    const result = trafficSources(pvs);
    // Per-pageview this would be 75% Search; per-session it is 50/50.
    expect(result.find(s => s.name === 'Search').pct).toBe(50);
    expect(result.find(s => s.name === 'Direct / Unknown').pct).toBe(50);
  });
});

describe('sessionsByHour', () => {
  it('returns 24-element array', () => {
    const result = sessionsByHour([mkEvent()]);
    expect(result).toHaveLength(24);
  });

  it('buckets by Europe/London hour during BST (UTC+1)', () => {
    // 2026-04-10 is British Summer Time → 12:00 UTC = 13:00 London
    const pvs = [mkEvent({ timestamp: { toDate: () => new Date('2026-04-10T12:00:00Z') } })];
    expect(sessionsByHour(pvs)[13]).toBe(1);
  });

  it('buckets by Europe/London hour during GMT (winter)', () => {
    // 2026-01-10 is GMT → 12:00 UTC = 12:00 London
    const pvs = [mkEvent({ timestamp: { toDate: () => new Date('2026-01-10T12:00:00Z') } })];
    expect(sessionsByHour(pvs)[12]).toBe(1);
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

describe('parseDevices', () => {
  const CHROME_WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const SAFARI_IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

  it('classifies desktop and mobile devices', () => {
    const events = [
      mkEvent({ userAgent: CHROME_WIN }),
      mkEvent({ userAgent: SAFARI_IOS }),
    ];
    const { devices } = parseDevices(events);
    const names = devices.map(d => d.name.toLowerCase());
    expect(names).toContain('desktop');
    expect(names).toContain('mobile');
  });

  it('returns browser names', () => {
    const events = [mkEvent({ userAgent: CHROME_WIN })];
    const { browsers } = parseDevices(events);
    expect(browsers[0].name).toBe('Chrome');
  });

  it('returns empty arrays for no events', () => {
    const { devices, browsers } = parseDevices([]);
    expect(devices).toHaveLength(0);
    expect(browsers).toHaveLength(0);
  });
});

describe('topUtmSources', () => {
  it('returns only events with utmSource set', () => {
    const pvs = [
      mkEvent({ utmSource: 'google' }),
      mkEvent({ utmSource: 'google' }),
      mkEvent({ utmSource: null }),
    ];
    const result = topUtmSources(pvs, 5);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(['google', 2]);
  });
});

describe('topReferrerDomains', () => {
  it('counts referring domains once per session, excluding search/social', () => {
    const pvs = [
      mkEvent({ referrer: 'https://aviationweek.com/a', sessionId: 's1' }),
      mkEvent({ referrer: 'https://aviationweek.com/a', sessionId: 's1' }), // same session — counts once
      mkEvent({ referrer: 'https://www.aviationweek.com/b', sessionId: 's2' }),
      mkEvent({ referrer: 'https://google.com', sessionId: 's3' }), // search — excluded
      mkEvent({ referrer: '', sessionId: 's4' }), // direct — excluded
    ];
    const result = topReferrerDomains(pvs, 5);
    expect(result).toEqual([['aviationweek.com', 2]]); // 2 sessions, not 3 pageviews
  });
});
