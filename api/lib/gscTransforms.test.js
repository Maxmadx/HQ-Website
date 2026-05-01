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
