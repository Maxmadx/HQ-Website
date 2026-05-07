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
