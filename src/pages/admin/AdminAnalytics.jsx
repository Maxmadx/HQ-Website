import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import AdminLayout from '../../components/admin/AdminLayout';
import { db, auth } from '../../lib/firebase';
import AreaChart from '../../components/admin/analytics/AreaChart';
import DonutChart from '../../components/admin/analytics/DonutChart';
import {
  countBy, topN, groupByDay, bounceRate, avgTimeOnPage, formatDuration,
  avgScrollDepth, scrollDepthByPage, topJourneys, trafficSources, parseDevices,
  sessionsByHour, sparklineData, topCampaigns, topUtmSources,
} from '../../components/admin/analytics/analyticsUtils.js';

// ─── Colour palette ────────────────────────────────────────────────────────────
const C = {
  bg: '#070d1a', card: '#0d1526', border: '#1a2840',
  text: '#e2e8f0', muted: '#64748b', dim: '#334155',
  blue: '#2563eb', purple: '#a855f7', green: '#16a34a',
  amber: '#d97706', cyan: '#22d3ee', emerald: '#4ade80',
  red: '#f87171',
};

// ─── Internal sub-components ───────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: C.dim, margin: '26px 0 12px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function Sparkline({ data, color }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const n = data.length;
  const W = 80, H = 24;
  const pts = data.map((v, i) => {
    const x = n > 1 ? (i / (n - 1)) * W : 0;
    const y = H - 4 - (v / max) * (H - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const lastPt = pts.split(' ').pop();
  const [lx, ly] = lastPt.split(',');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block', marginTop: 8 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="2.5" fill={color} />
    </svg>
  );
}

function MetricCard({ label, value, sub, subColor = C.muted, sparkData, sparkColor }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ fontSize: '0.7rem', color: C.muted, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: subColor, marginTop: 4 }}>{sub}</div>}
      {sparkData && <Sparkline data={sparkData} color={sparkColor || C.blue} />}
    </div>
  );
}

function BarRow({ name, pct, color = C.blue }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 5 }}>
        <span style={{ color: C.muted }}>{name}</span>
        <span style={{ color: C.text, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ background: C.border, borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: 6, background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}

function TRow({ rank, name, count, maxCount }) {
  const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${C.bg}`, gap: 10, fontSize: '0.78rem' }}>
      <span style={{ color: C.dim, fontSize: '0.65rem', fontWeight: 700, width: 14, flexShrink: 0 }}>{rank}</span>
      <span style={{ color: C.muted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.76rem' }}>{name}</span>
      <div style={{ flex: 0.8 }}>
        <div style={{ background: C.border, borderRadius: 4, height: 4 }}>
          <div style={{ width: `${pct}%`, height: 4, background: C.blue, borderRadius: 4 }} />
        </div>
      </div>
      <span style={{ color: C.text, fontWeight: 700, flexShrink: 0 }}>{count}</span>
    </div>
  );
}

function CountryRow({ flag, name, pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: `1px solid ${C.bg}`, fontSize: '0.77rem' }}>
      <span style={{ fontSize: '1rem' }}>{flag}</span>
      <span style={{ color: C.muted, flex: 1 }}>{name}</span>
      <div style={{ flex: 1.2, background: C.border, borderRadius: 4, height: 4 }}>
        <div style={{ width: `${pct}%`, height: 4, background: C.blue, borderRadius: 4 }} />
      </div>
      <span style={{ color: C.text, fontWeight: 700, width: 34, textAlign: 'right', fontSize: '0.75rem' }}>{pct}%</span>
    </div>
  );
}

function JourneyRow({ path, count }) {
  const pages = path.split(' → ');
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${C.bg}`, flexWrap: 'wrap', gap: 0 }}>
      {pages.map((p, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ background: '#172554', color: '#93c5fd', padding: '2px 8px', borderRadius: 5, fontSize: '0.7rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{p}</span>
          {i < pages.length - 1 && <span style={{ color: C.border, padding: '0 5px', fontSize: '0.75rem' }}>→</span>}
        </span>
      ))}
      <span style={{ marginLeft: 'auto', paddingLeft: 10, color: C.muted, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{count}×</span>
    </div>
  );
}

function ScrollDepthSection({ scrollByPage }) {
  const thresholdColors = { 25: '#1d4ed8', 50: '#2563eb', 75: '#3b82f6', 100: '#93c5fd' };
  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        {[25, 50, 75, 100].map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.65rem', color: C.muted }}>
            <div style={{ width: 8, height: 8, background: thresholdColors[t], borderRadius: 2 }} />
            {t}%
          </div>
        ))}
      </div>
      {scrollByPage.map(({ page, thresholds }) => (
        <div key={page} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '0.7rem', color: C.muted, marginBottom: 6, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page}</div>
          {thresholds.map(({ threshold, pct }) => (
            <div key={threshold} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: '0.6rem', color: C.dim, width: 28, textAlign: 'right', flexShrink: 0 }}>{threshold}%</span>
              <div style={{ flex: 1, background: C.border, borderRadius: 3, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: 8, background: thresholdColors[threshold], borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: '0.62rem', color: C.muted, width: 28, textAlign: 'right', flexShrink: 0 }}>{pct}%</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function HourlyBar({ hours }) {
  const max = Math.max(...hours, 1);
  return (
    <svg viewBox="0 0 264 40" style={{ width: '100%', height: 40, display: 'block' }}>
      {hours.map((count, h) => {
        const barH = Math.round((count / max) * 34);
        const isPeak = count > max * 0.6;
        return (
          <rect
            key={h}
            x={h * 11}
            y={36 - barH}
            width={9}
            height={barH}
            fill={isPeak ? C.blue : '#1e3a5f'}
          />
        );
      })}
      {[0, 6, 12, 18, 23].map((h) => (
        <text key={h} x={h * 11 + 4} y={52} fontSize="6" fill={C.dim} textAnchor="middle">{h}h</text>
      ))}
    </svg>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
      {children}
    </div>
  );
}

// ─── Flag lookup (top 10 aviation markets) ────────────────────────────────────
const FLAG_MAP = {
  'United Kingdom': '🇬🇧', 'United States': '🇺🇸', 'Australia': '🇦🇺',
  'Canada': '🇨🇦', 'Germany': '🇩🇪', 'France': '🇫🇷', 'UAE': '🇦🇪',
  'Netherlands': '🇳🇱', 'Switzerland': '🇨🇭', 'New Zealand': '🇳🇿',
  'South Africa': '🇿🇦', 'Singapore': '🇸🇬', 'Ireland': '🇮🇪',
  'Norway': '🇳🇴', 'Sweden': '🇸🇪', 'Denmark': '🇩🇰',
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminAnalytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [excludedIps, setExcludedIps] = useState([]);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Load excluded IPs from admin config endpoint (requires auth token)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { setConfigLoaded(true); return; }
    user.getIdToken()
      .then((token) =>
        fetch('/api/analytics/config', { headers: { Authorization: `Bearer ${token}` } })
      )
      .then((r) => r.json())
      .then(({ excludedIps: ips }) => setExcludedIps(Array.isArray(ips) ? ips : []))
      .catch(() => {})
      .finally(() => setConfigLoaded(true));
  }, []);

  // Load events for selected time window
  useEffect(() => {
    if (!configLoaded) return;
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
  }, [days, configLoaded]);

  // ─── Filter out admin IPs ──────────────────────────────────────────────────
  const filtered = excludedIps.length
    ? events.filter((e) => !excludedIps.includes(e.ip))
    : events;

  // ─── Segment by event type ────────────────────────────────────────────────
  const pageviews = filtered.filter((e) => e.eventType === 'pageview');
  const ctaClicks = filtered.filter((e) => e.eventType === 'cta_click');
  const formSubmits = filtered.filter((e) => e.eventType === 'form_submit');
  const scrollEvents = filtered.filter((e) => e.eventType === 'scroll_depth');
  const exitEvents = filtered.filter((e) => e.eventType === 'page_exit');

  // ─── Deduplicate sessions for chart (first pageview per session per day) ──
  const seenSessions = new Set();
  const firstPvPerSession = pageviews.filter((e) => {
    if (seenSessions.has(e.sessionId)) return false;
    seenSessions.add(e.sessionId);
    return true;
  });

  // ─── Aggregations ─────────────────────────────────────────────────────────
  const uniqueSessions = new Set(filtered.map((e) => e.sessionId)).size;
  const pvByDay = groupByDay(pageviews, days);
  const sessByDay = groupByDay(firstPvPerSession, days);
  const bounce = bounceRate(pageviews);
  const avgTime = avgTimeOnPage(exitEvents);
  const avgScroll = avgScrollDepth(scrollEvents);
  const topPages = topN(countBy(pageviews, 'page'), 7);
  const sources = trafficSources(pageviews);
  const { devices, browsers } = parseDevices(pageviews);
  const topCountries = topN(countBy(filtered.filter((e) => e.country), 'country'), 7);
  const hours = sessionsByHour(pageviews);
  const scrollByPage = scrollDepthByPage(pageviews, scrollEvents, 4);
  const journeys = topJourneys(pageviews, 5);
  const topCTAs = topN(countBy(ctaClicks, 'elementId'), 6);
  const topForms = topN(countBy(formSubmits, 'page'), 5);
  const campaigns = topCampaigns(pageviews, 8);
  const utmSrc = topUtmSources(pageviews, 6);

  // Sparklines (last 7 days)
  const sparkDays = Math.min(7, days);
  const pvSpark = sparklineData(pageviews, sparkDays);
  const sessSpark = sparklineData(firstPvPerSession, sparkDays);
  const ctaSpark = sparklineData(ctaClicks, sparkDays);
  const formSpark = sparklineData(formSubmits, sparkDays);

  // Donut segments
  const sourceColors = { Direct: C.green, Search: C.blue, Social: C.purple, Referral: C.amber };
  const sourceDonuts = sources.map((s) => ({ color: sourceColors[s.name] || C.muted, pct: s.pct, label: s.name }));
  const deviceColors = ['#2563eb', '#a855f7', '#0891b2', '#16a34a', '#d97706'];
  const deviceDonuts = devices.map((d, i) => ({ color: deviceColors[i] || C.muted, pct: d.pct, label: d.name }));

  // ─── Styles ────────────────────────────────────────────────────────────────
  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };
  const grid3 = { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 };
  const grid4 = { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 };
  const donutWrap = { display: 'flex', alignItems: 'center', gap: 20, marginTop: 4 };
  const legendItem = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.76rem' };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div style={{ background: C.bg, minHeight: '100vh', padding: '0 0 60px', margin: '-1.5rem', color: C.text }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '20px 28px 0' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9' }}>Analytics</h1>
            <div style={{ display: 'flex', gap: 4 }}>
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  style={{
                    background: days === d ? '#172554' : 'transparent',
                    border: `1px solid ${days === d ? C.blue : C.border}`,
                    color: days === d ? '#93c5fd' : C.muted,
                    padding: '5px 14px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer',
                    fontWeight: days === d ? 600 : 400,
                  }}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* IP Filter Banner */}
          {excludedIps.length > 0 && (
            <div style={{
              background: '#052e16', border: '1px solid #166534', borderRadius: 8,
              padding: '8px 16px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: '0.78rem', color: '#86efac',
            }}>
              <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', flexShrink: 0 }} />
              Filtering {excludedIps.length === 1 ? 'your IP' : `${excludedIps.length} IPs`} — showing real visitor data only
            </div>
          )}

          {loading ? (
            <p style={{ color: C.muted, paddingTop: 40 }}>Loading…</p>
          ) : (
            <>
              {/* ── Area Chart ─────────────────────────────────────────── */}
              <Card style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>Page Views &amp; Sessions — Last {days} Days</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {[['#3b82f6', 'Page Views'], ['#a855f7', 'Sessions']].map(([color, label]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: C.muted }}>
                        <div style={{ width: 22, height: 3, background: color, borderRadius: 2 }} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                <AreaChart pvByDay={pvByDay} sessByDay={sessByDay} />
              </Card>

              {/* ── Overview ───────────────────────────────────────────── */}
              <SectionLabel>Overview</SectionLabel>
              <div style={grid4}>
                <MetricCard label="Page Views" value={pageviews.length.toLocaleString()} sparkData={pvSpark} sparkColor={C.blue} />
                <MetricCard label="Unique Sessions" value={uniqueSessions.toLocaleString()} sparkData={sessSpark} sparkColor={C.purple} />
                <MetricCard label="CTA Clicks" value={ctaClicks.length.toLocaleString()} sparkData={ctaSpark} sparkColor={C.cyan} />
                <MetricCard label="Form Submits" value={formSubmits.length.toLocaleString()} sparkData={formSpark} sparkColor={C.emerald} />
              </div>

              {/* ── Engagement ─────────────────────────────────────────── */}
              <SectionLabel>Engagement</SectionLabel>
              <div style={grid3}>
                <MetricCard label="Bounce Rate" value={`${bounce}%`} sub={bounce < 40 ? '↓ Good' : '↑ High'} subColor={bounce < 40 ? C.emerald : C.red} />
                <MetricCard label="Avg. Time on Page" value={formatDuration(avgTime)} sub="across all pages" />
                <MetricCard label="Avg. Scroll Depth" value={`${avgScroll}%`} sub={avgScroll > 60 ? '↑ Strong engagement' : 'Room to improve'} subColor={avgScroll > 60 ? C.emerald : C.muted} />
              </div>

              {/* ── Acquisition ────────────────────────────────────────── */}
              <SectionLabel>Acquisition</SectionLabel>
              <div style={grid2}>
                <Card>
                  <CardTitle>Top Pages</CardTitle>
                  {topPages.length === 0 ? <p style={{ color: C.muted, fontSize: '0.875rem' }}>No data</p> : (
                    topPages.map(([page, count], i) => (
                      <TRow key={page} rank={i + 1} name={page} count={count} maxCount={topPages[0][1]} />
                    ))
                  )}
                </Card>

                <Card>
                  <CardTitle>Traffic Sources</CardTitle>
                  <div style={donutWrap}>
                    <DonutChart
                      segments={sourceDonuts}
                      size={120}
                      centerLabel={sources[0] ? `${sources[0].pct}%` : '—'}
                      centerSublabel={sources[0]?.name}
                    />
                    <div style={{ flex: 1 }}>
                      {sources.map((s) => (
                        <div key={s.name} style={legendItem}>
                          <div style={{ width: 10, height: 10, background: sourceColors[s.name] || C.muted, borderRadius: 3, flexShrink: 0 }} />
                          <span style={{ color: C.muted, flex: 1 }}>{s.name}</span>
                          <span style={{ color: C.text, fontWeight: 700 }}>{s.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* ── Audience ───────────────────────────────────────────── */}
              <SectionLabel>Audience</SectionLabel>
              <div style={grid2}>
                <Card>
                  <CardTitle>Devices &amp; Browsers</CardTitle>
                  <div style={donutWrap}>
                    <DonutChart
                      segments={deviceDonuts}
                      size={110}
                      centerLabel={devices[0] ? `${devices[0].pct}%` : '—'}
                      centerSublabel={devices[0]?.name}
                    />
                    <div style={{ flex: 1 }}>
                      {devices.map((d, i) => (
                        <div key={d.name} style={legendItem}>
                          <div style={{ width: 10, height: 10, background: deviceColors[i] || C.muted, borderRadius: 3, flexShrink: 0 }} />
                          <span style={{ color: C.muted, flex: 1 }}>{d.name}</span>
                          <span style={{ color: C.text, fontWeight: 700 }}>{d.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 14 }}>
                    {browsers.map((b) => (
                      <BarRow key={b.name} name={b.name} pct={b.pct} color={C.amber} />
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardTitle>Top Countries</CardTitle>
                  {topCountries.map(([country, count]) => {
                    const total = topCountries.reduce((s, [, c]) => s + c, 0);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <CountryRow key={country} flag={FLAG_MAP[country] || '🌍'} name={country} pct={pct} />
                    );
                  })}
                  {topCountries.length === 0 && (
                    <p style={{ color: C.muted, fontSize: '0.875rem' }}>No geo data yet — new events will include location</p>
                  )}
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 14 }}>
                    <div style={{ fontSize: '0.7rem', color: C.dim, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sessions by Hour (UTC)</div>
                    <HourlyBar hours={hours} />
                  </div>
                </Card>
              </div>

              {/* ── Behaviour ──────────────────────────────────────────── */}
              <SectionLabel>Behaviour</SectionLabel>
              <div style={grid2}>
                <Card>
                  <CardTitle>Scroll Depth by Page</CardTitle>
                  {scrollByPage.length > 0
                    ? <ScrollDepthSection scrollByPage={scrollByPage} />
                    : <p style={{ color: C.muted, fontSize: '0.875rem' }}>No scroll data yet — will appear after deployment</p>
                  }
                </Card>

                <Card>
                  <CardTitle>Top User Journeys</CardTitle>
                  {journeys.length > 0
                    ? journeys.map(([path, count]) => <JourneyRow key={path} path={path} count={count} />)
                    : <p style={{ color: C.muted, fontSize: '0.875rem' }}>No multi-page sessions yet</p>
                  }
                </Card>
              </div>

              {/* ── Campaigns ──────────────────────────────────────────── */}
              {(campaigns.length > 0 || utmSrc.length > 0) && (
                <>
                  <SectionLabel>Campaigns</SectionLabel>
                  <div style={grid2}>
                    <Card>
                      <CardTitle>Top UTM Campaigns</CardTitle>
                      {campaigns.map(([name, count], i) => (
                        <TRow key={name} rank={i + 1} name={name} count={count} maxCount={campaigns[0][1]} />
                      ))}
                    </Card>
                    <Card>
                      <CardTitle>Top UTM Sources</CardTitle>
                      {utmSrc.map(([name, count], i) => (
                        <TRow key={name} rank={i + 1} name={name} count={count} maxCount={utmSrc[0][1]} />
                      ))}
                    </Card>
                  </div>
                </>
              )}

              {/* ── Interactions ───────────────────────────────────────── */}
              <SectionLabel>Interactions</SectionLabel>
              <div style={grid2}>
                <Card>
                  <CardTitle>Top CTA Clicks</CardTitle>
                  {topCTAs.length === 0 ? <p style={{ color: C.muted, fontSize: '0.875rem' }}>No data</p> : (
                    topCTAs.map(([name, count], i) => (
                      <TRow key={name} rank={i + 1} name={name} count={count} maxCount={topCTAs[0][1]} />
                    ))
                  )}
                </Card>
                <Card>
                  <CardTitle>Top Form Submit Pages</CardTitle>
                  {topForms.length === 0 ? <p style={{ color: C.muted, fontSize: '0.875rem' }}>No data</p> : (
                    topForms.map(([page, count], i) => (
                      <TRow key={page} rank={i + 1} name={page} count={count} maxCount={topForms[0][1]} />
                    ))
                  )}
                </Card>
              </div>

            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
