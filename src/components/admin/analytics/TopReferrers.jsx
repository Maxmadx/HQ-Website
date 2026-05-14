import { useMemo } from 'react';
import { computeTopReferrers } from './referralAggregations';
import InfoTooltip from './InfoTooltip';

function fmtGbp(pence) {
  if (typeof pence !== 'number' || !Number.isFinite(pence)) return '£0';
  return `£${Math.round(pence / 100).toLocaleString('en-GB')}`;
}

function fmtDate(ms) {
  if (typeof ms !== 'number') return '—';
  return new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function TopReferrers({ friendBookings = [], referrers = {}, dateLabel = '' }) {
  const rows = useMemo(
    () => computeTopReferrers(friendBookings, referrers),
    [friendBookings, referrers],
  );

  return (
    <section style={{ background: '#1a1a1a', borderRadius: 12, padding: 24, color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Top Referrers<InfoTooltip topic="topReferrers" /></h2>
        {dateLabel && <span style={{ opacity: 0.7, fontSize: 13 }}>{dateLabel}</span>}
      </header>

      {rows.length === 0 ? (
        <p style={{ opacity: 0.7, fontStyle: 'italic', marginTop: 16 }}>No completed referrals in this range yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', opacity: 0.6, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <th style={{ padding: '6px 8px' }}>Referrer</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Friends Booked</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Revenue</th>
              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Last</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} style={{ borderTop: '1px solid #2a2a2a' }}>
                <td style={{ padding: '8px' }}>
                  <div style={{ fontWeight: 600 }}>{r.name || <span style={{ opacity: 0.6 }}>Unknown ({r.code})</span>}</div>
                  {r.email && <div style={{ fontSize: 12, opacity: 0.6 }}>{r.email}</div>}
                </td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>{r.bookingsReferred.toLocaleString('en-GB')}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{fmtGbp(r.revenuePence)}</td>
                <td style={{ padding: '8px', textAlign: 'right', opacity: 0.7 }}>{fmtDate(r.lastBookingAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
