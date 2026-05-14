/**
 * Turn an array of page_events docs into a CSV string for download.
 * Pure — no DOM access — so the row/escaping logic is unit-testable.
 */

const COLUMNS = [
  'timestamp', 'sessionId', 'visitorId', 'page', 'eventType', 'elementId',
  'country', 'utmSource', 'utmCampaign', 'referralRefCode', 'value',
  'transactionId', 'itemCategory',
];

// Firestore Timestamp | Date | number(ms) → ISO string. Anything else → ''.
function toIso(ts) {
  if (!ts) return '';
  if (typeof ts.toDate === 'function') return ts.toDate().toISOString();
  if (ts instanceof Date) return ts.toISOString();
  if (typeof ts === 'number') return new Date(ts).toISOString();
  return '';
}

// Quote a field only when it contains a comma, quote, or newline; double internal quotes.
function escapeField(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function eventsToCsv(events = []) {
  const header = COLUMNS.join(',');
  const rows = events.map((ev) => COLUMNS.map((col) => {
    const raw = col === 'timestamp' ? toIso(ev.timestamp) : ev[col];
    return escapeField(raw);
  }).join(','));
  return [header, ...rows].join('\n');
}
