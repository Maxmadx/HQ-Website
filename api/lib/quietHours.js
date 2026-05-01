'use strict';

// Quiet hours in Europe/London local time. Recovery emails are deferred
// outside this window so we don't wake people up.
const QUIET_END_HOUR = 8;    // 08:00 — sending allowed FROM this hour
const QUIET_START_HOUR = 20; // 20:00 — sending stops AT this hour

function londonHour(date) {
  // Use Intl to extract the London-local hour without DST math
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: 'numeric',
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const hourPart = parts.find((p) => p.type === 'hour');
  const h = parseInt(hourPart.value, 10);
  // Edge case: '24' represents midnight in some locales
  return h === 24 ? 0 : h;
}

function isQuietHourLondon(date = new Date()) {
  const h = londonHour(date);
  return h < QUIET_END_HOUR || h >= QUIET_START_HOUR;
}

function nextSendableTime(date = new Date()) {
  if (!isQuietHourLondon(date)) return new Date(date.getTime());

  const h = londonHour(date);
  // If we're after 20:00, jump to tomorrow's 08:00 London.
  // If we're before 08:00, jump to today's 08:00 London.
  const target = new Date(date.getTime());

  // Build today's 08:00 London by formatting + reparsing
  const dayFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const parts = dayFmt.formatToParts(date);
  const y = parts.find((p) => p.type === 'year').value;
  const m = parts.find((p) => p.type === 'month').value;
  const d = parts.find((p) => p.type === 'day').value;

  // Determine London's UTC offset at that date
  const sample = new Date(`${y}-${m}-${d}T12:00:00Z`);
  const tzFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    timeZoneName: 'short',
  });
  const tzParts = tzFmt.formatToParts(sample);
  const tzName = tzParts.find((p) => p.type === 'timeZoneName').value;
  const offsetHours = tzName === 'BST' ? 1 : 0;

  // Today 08:00 London = UTC ${08 - offsetHours}:00 on the same calendar day
  const todayEightLondonUTC = new Date(Date.UTC(
    parseInt(y, 10),
    parseInt(m, 10) - 1,
    parseInt(d, 10),
    8 - offsetHours,
    0, 0, 0,
  ));

  if (h < QUIET_END_HOUR) {
    return todayEightLondonUTC;
  }
  // h >= 20: jump to tomorrow
  const tomorrow = new Date(todayEightLondonUTC.getTime() + 24 * 3600 * 1000);
  return tomorrow;
}

module.exports = {
  QUIET_END_HOUR,
  QUIET_START_HOUR,
  isQuietHourLondon,
  nextSendableTime,
};
