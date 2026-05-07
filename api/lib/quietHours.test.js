import { describe, it, expect } from 'vitest';
import { isQuietHourLondon, nextSendableTime, QUIET_START_HOUR, QUIET_END_HOUR } from './quietHours.js';

// Helper: build a UTC date with explicit London-local hour (BST: UTC+1, GMT: UTC+0)
// In May, London is BST (+1), so London 9:00 = UTC 8:00.
// In Jan, London is GMT (+0), so London 9:00 = UTC 9:00.
function londonAt(year, monthIdx0, day, londonHour, londonMin = 0) {
  // Build via a string the JS engine will localize correctly
  const iso = new Date(Date.UTC(year, monthIdx0, day, londonHour, londonMin)).toISOString();
  // Adjust by the offset of London at that moment
  const sample = new Date(Date.UTC(year, monthIdx0, day, 12, 0));
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: 'numeric',
    hour12: false,
    timeZoneName: 'short',
  });
  const parts = fmt.formatToParts(sample);
  const tzName = parts.find((p) => p.type === 'timeZoneName').value;
  const offsetH = tzName === 'BST' ? 1 : 0;
  return new Date(Date.UTC(year, monthIdx0, day, londonHour - offsetH, londonMin));
}

describe('isQuietHourLondon', () => {
  it('exports the boundary constants', () => {
    expect(QUIET_END_HOUR).toBe(8);
    expect(QUIET_START_HOUR).toBe(20);
  });

  it('returns true at midnight London', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 0, 0))).toBe(true);
  });

  it('returns true at 7:59 London', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 7, 59))).toBe(true);
  });

  it('returns false at 8:00 London (boundary opens)', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 8, 0))).toBe(false);
  });

  it('returns false at noon London', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 12, 0))).toBe(false);
  });

  it('returns false at 19:59 London', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 19, 59))).toBe(false);
  });

  it('returns true at 20:00 London (boundary closes)', () => {
    expect(isQuietHourLondon(londonAt(2026, 4, 15, 20, 0))).toBe(true);
  });

  it('handles the GMT/BST boundary in March', () => {
    // 2026-03-29 is the spring-forward day. 9:00 GMT = 9:00 BST after the shift.
    // Both are outside quiet hours, so result stays consistent.
    expect(isQuietHourLondon(londonAt(2026, 2, 29, 9, 0))).toBe(false);
  });
});

describe('nextSendableTime', () => {
  it('returns the input unchanged when not in quiet hours', () => {
    const noon = londonAt(2026, 4, 15, 12, 0);
    expect(nextSendableTime(noon).getTime()).toBe(noon.getTime());
  });

  it('rolls forward to 08:00 London when called during night-time', () => {
    const twoAm = londonAt(2026, 4, 15, 2, 0);
    const next = nextSendableTime(twoAm);
    // Should be 08:00 London on the SAME calendar day (May 15)
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour: 'numeric',
      hour12: false,
    });
    expect(fmt.format(next)).toBe('08');
  });

  it('rolls forward to 08:00 London NEXT day when called during late evening', () => {
    const elevenPm = londonAt(2026, 4, 15, 23, 0);
    const next = nextSendableTime(elevenPm);
    // Next sendable should be May 16 at 08:00 London
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      day: '2-digit',
      hour: 'numeric',
      hour12: false,
    });
    expect(fmt.format(next)).toMatch(/^16,?\s*08$/);
  });
});
