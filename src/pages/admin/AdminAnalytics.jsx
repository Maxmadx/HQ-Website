import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../lib/firebase';

function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'unknown';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function topN(obj, n = 10) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n);
}

export default function AdminAnalytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    setLoading(true);
    const since = Timestamp.fromDate(new Date(Date.now() - days * 86400 * 1000));
    const q = query(
      collection(db, 'page_events'),
      where('timestamp', '>=', since),
      orderBy('timestamp', 'desc')
    );
    getDocs(q)
      .then((snap) => setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .finally(() => setLoading(false));
  }, [days]);

  const pageviews = events.filter((e) => e.eventType === 'pageview');
  const ctaClicks = events.filter((e) => e.eventType === 'cta_click');
  const formSubmits = events.filter((e) => e.eventType === 'form_submit');
  const topPages = topN(countBy(pageviews, 'page'));
  const topCTAs = topN(countBy(ctaClicks, 'elementId'));
  const uniqueSessions = new Set(events.map((e) => e.sessionId)).size;

  const cardStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem', flex: '1 1 160px' };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Analytics</h1>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} style={{ padding: '0.4rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}>
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {loading ? <p style={{ color: '#6b7280' }}>Loading…</p> : (
        <>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {[
              { label: 'Page Views', value: pageviews.length },
              { label: 'Unique Sessions', value: uniqueSessions },
              { label: 'CTA Clicks', value: ctaClicks.length },
              { label: 'Form Submits', value: formSubmits.length },
            ].map((stat) => (
              <div key={stat.label} style={cardStyle}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{stat.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>{stat.value.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {[['Top Pages', topPages, 'page'], ['Top CTA Clicks', topCTAs, 'elementId']].map(([title, rows]) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>{title}</h2>
                {rows.length === 0 ? <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No data</p> : (
                  <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                    <tbody>
                      {rows.map(([label, count]) => (
                        <tr key={label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.5rem 0', color: '#374151', fontFamily: 'monospace', fontSize: '0.8rem' }}>{label}</td>
                          <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600, color: '#111827' }}>{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>Events by Type</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {topN(countBy(events, 'eventType'), 10).map(([type, count]) => (
                <div key={type} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.5rem 1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{type}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>{count}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
