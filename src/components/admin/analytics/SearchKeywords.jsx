import { useMemo, useState } from 'react';
import { topLineStats, byKeyword, byPage } from './searchKeywordsAggregations';
import InfoTooltip from './InfoTooltip';

function fmtNum(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '0';
  return Math.round(n).toLocaleString('en-GB');
}

function fmtPct(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '0%';
  return `${(n * 100).toFixed(2)}%`;
}

function fmtPos(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || n === 0) return '—';
  return n.toFixed(2);
}

function Stat({ label, value, topic }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}{topic && <InfoTooltip topic={topic} />}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default function SearchKeywords({ rows = [], dateLabel = '' }) {
  const [tab, setTab] = useState('keyword');

  const stats = useMemo(() => topLineStats(rows), [rows]);
  const keywordRows = useMemo(() => byKeyword(rows), [rows]);
  const pageRows = useMemo(() => byPage(rows), [rows]);

  const tableRows = tab === 'keyword' ? keywordRows : pageRows;
  const isEmpty = rows.length === 0;

  return (
    <section style={{ background: '#1a1a1a', borderRadius: 12, padding: 24, color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Search Keywords (Google)<InfoTooltip topic="searchKeywords" /></h2>
        {dateLabel && <span style={{ opacity: 0.7, fontSize: 13 }}>{dateLabel}</span>}
      </header>

      <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
        <Stat label="Clicks" value={fmtNum(stats.clicks)} topic="gscClicks" />
        <Stat label="Impressions" value={fmtNum(stats.impressions)} topic="gscImpressions" />
        <Stat label="CTR" value={fmtPct(stats.ctr)} topic="gscCtr" />
        <Stat label="Avg. Position" value={fmtPos(stats.avgPosition)} topic="gscAvgPosition" />
      </div>

      {isEmpty ? (
        <p style={{ opacity: 0.7, fontStyle: 'italic', margin: 0 }}>No search data yet — give the GSC sync a day to populate.</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => setTab('keyword')}
              style={{
                padding: '6px 12px', fontSize: 13, fontWeight: 600,
                background: tab === 'keyword' ? '#a855f7' : 'transparent',
                color: '#fff', border: '1px solid ' + (tab === 'keyword' ? '#a855f7' : '#334155'),
                borderRadius: 6, cursor: 'pointer',
              }}
            >
              By Keyword
            </button>
            <button
              type="button"
              onClick={() => setTab('page')}
              style={{
                padding: '6px 12px', fontSize: 13, fontWeight: 600,
                background: tab === 'page' ? '#a855f7' : 'transparent',
                color: '#fff', border: '1px solid ' + (tab === 'page' ? '#a855f7' : '#334155'),
                borderRadius: 6, cursor: 'pointer',
              }}
            >
              By Page
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a2a', textAlign: 'left' }}>
                <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500 }}>{tab === 'keyword' ? 'Keyword' : 'Page'}</th>
                <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500, textAlign: 'right' }}>Clicks</th>
                <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500, textAlign: 'right' }}>Impressions</th>
                <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500, textAlign: 'right' }}>CTR</th>
                <th style={{ padding: '8px 4px', color: '#94a3b8', fontWeight: 500, textAlign: 'right' }}>Avg. Position</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(0, 50).map((row) => (
                <tr key={tab === 'keyword' ? row.query : row.page} style={{ borderBottom: '1px solid #2a2a2a' }}>
                  <td style={{ padding: '8px 4px' }}>{tab === 'keyword' ? row.query : row.page}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>{fmtNum(row.clicks)}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', color: '#94a3b8' }}>{fmtNum(row.impressions)}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right' }}>{fmtPct(row.ctr)}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', color: '#94a3b8' }}>{fmtPos(row.avgPosition)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
