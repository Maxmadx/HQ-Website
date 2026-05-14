import { describe, it, expect } from 'vitest';
import { eventsToCsv } from './exportCsv';

describe('eventsToCsv', () => {
  it('emits a header row even with no events', () => {
    const csv = eventsToCsv([]);
    expect(csv).toBe(
      'timestamp,sessionId,visitorId,page,eventType,elementId,country,utmSource,utmCampaign,referralRefCode,value,transactionId,itemCategory'
    );
  });

  it('serialises a Firestore Timestamp to ISO', () => {
    const ts = { toDate: () => new Date('2026-05-14T10:00:00.000Z') };
    const csv = eventsToCsv([{ timestamp: ts, sessionId: 's1', eventType: 'pageview', page: '/' }]);
    const dataRow = csv.split('\n')[1];
    expect(dataRow.startsWith('2026-05-14T10:00:00.000Z,s1,')).toBe(true);
  });

  it('accepts Date and numeric millis timestamps too', () => {
    const millis = Date.parse('2026-05-14T10:00:00.000Z');
    const csv = eventsToCsv([
      { timestamp: new Date('2026-05-14T10:00:00.000Z'), sessionId: 's1' },
      { timestamp: millis, sessionId: 's2' },
    ]);
    const rows = csv.split('\n');
    expect(rows[1]).toMatch(/^2026-05-14T10:00:00\.000Z,s1,/);
    expect(rows[2]).toMatch(/^2026-05-14T10:00:00\.000Z,s2,/);
  });

  it('quotes and escapes fields containing commas or quotes', () => {
    const csv = eventsToCsv([
      { sessionId: 's1', page: '/search?q=a,b', elementId: 'say "hi"' },
    ]);
    const dataRow = csv.split('\n')[1];
    expect(dataRow).toContain('"/search?q=a,b"');
    expect(dataRow).toContain('"say ""hi"""');
  });

  it('renders null/undefined fields as empty strings', () => {
    const csv = eventsToCsv([{ sessionId: 's1', eventType: 'pageview' }]);
    const dataRow = csv.split('\n')[1];
    // timestamp empty, sessionId s1, visitorId empty, page empty, eventType pageview...
    expect(dataRow).toBe(',s1,,,pageview,,,,,,,,');
  });
});
