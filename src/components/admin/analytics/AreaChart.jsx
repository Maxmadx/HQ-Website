import { useState, useRef } from 'react';

/**
 * SVG area chart showing two overlapping series (page views + sessions).
 *
 * Props:
 *   pvByDay    [['YYYY-MM-DD', count], ...]  — pageview daily counts
 *   sessByDay  [['YYYY-MM-DD', count], ...]  — session daily counts
 */
export default function AreaChart({ pvByDay, sessByDay }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const W = 1000;
  const H = 130;
  const PAD_V = 10;

  const pvCounts = pvByDay.map(([, c]) => c);
  const sessCounts = sessByDay.map(([, c]) => c);
  const n = pvCounts.length;
  const maxVal = Math.max(...pvCounts, 1);

  function pt(i, val) {
    const x = n > 1 ? (i / (n - 1)) * W : 0;
    const y = H - PAD_V - (val / maxVal) * (H - PAD_V * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }

  function buildPaths(counts) {
    if (counts.length === 0) return { line: '', area: '' };
    const pts = counts.map((v, i) => pt(i, v));
    const line = pts.join(' ');
    const lastX = pts[pts.length - 1].split(',')[0];
    const area = `M ${pts.join(' L ')} L ${lastX},${H} L 0,${H} Z`;
    return { line, area };
  }

  const pv = buildPaths(pvCounts);
  const sess = buildPaths(sessCounts);

  const yMax = Math.ceil(maxVal / 10) * 10 || 10;
  const yLabels = [yMax, Math.round(yMax * 0.75), Math.round(yMax / 2), Math.round(yMax / 4), 0];

  const xDates = n > 0
    ? [0, Math.floor(n / 4), Math.floor(n / 2), Math.floor((3 * n) / 4), n - 1].map(
        (i) => pvByDay[i]?.[0]
      )
    : [];

  function fmtDate(d) {
    if (!d) return '';
    const dt = new Date(d + 'T00:00:00Z');
    return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  const gridYs = [0.25, 0.5, 0.75, 1].map(
    (f) => (H - PAD_V - f * (H - PAD_V * 2)).toFixed(1)
  );

  function handleMouseMove(e) {
    if (!svgRef.current || n === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const i = Math.min(n - 1, Math.max(0, Math.round(relX * (n - 1))));
    const screenX = e.clientX - rect.left;
    // Flip tooltip to left of cursor when in the right 40% of the chart
    const left = screenX < rect.width * 0.6 ? screenX + 14 : screenX - 132;
    setTooltip({
      i,
      left,
      date: pvByDay[i]?.[0],
      pv: pvCounts[i] ?? 0,
      sess: sessCounts[i] ?? 0,
    });
  }

  const crossX = tooltip ? (n > 1 ? (tooltip.i / (n - 1)) * W : 0) : null;
  const dotYpv = tooltip != null ? H - PAD_V - ((tooltip.pv / maxVal) * (H - PAD_V * 2)) : null;
  const dotYsess = tooltip != null ? H - PAD_V - ((tooltip.sess / maxVal) * (H - PAD_V * 2)) : null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Y-axis labels */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 28,
        width: 32, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {yLabels.map((v) => (
          <span key={v} style={{ fontSize: '0.6rem', color: '#334155', lineHeight: 1 }}>{v}</span>
        ))}
      </div>

      <div style={{ marginLeft: 36, position: 'relative' }}>

        {/* Hover tooltip */}
        {tooltip && (
          <div style={{
            position: 'absolute',
            top: 4,
            left: tooltip.left,
            background: '#0a1628',
            border: '1px solid #1e3a5f',
            borderRadius: 8,
            padding: '8px 12px',
            pointerEvents: 'none',
            zIndex: 20,
            minWidth: 120,
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: 6, fontWeight: 600 }}>
              {fmtDate(tooltip.date)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', marginBottom: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
              <span style={{ color: '#94a3b8', flex: 1 }}>Views</span>
              <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{tooltip.pv}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7', flexShrink: 0 }} />
              <span style={{ color: '#94a3b8', flex: 1 }}>Sessions</span>
              <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{tooltip.sess}</span>
            </div>
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: 150, display: 'block', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <linearGradient id="ac-pvGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="ac-sessGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {gridYs.map((y) => (
            <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#1a2840" strokeWidth="1" />
          ))}
          <line x1="0" y1={H - PAD_V} x2={W} y2={H - PAD_V} stroke="#1a2840" strokeWidth="1" />

          {/* Sessions (behind pageviews) */}
          {sess.area && <path d={sess.area} fill="url(#ac-sessGrad)" />}
          {sess.line && (
            <polyline points={sess.line} fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinejoin="round" />
          )}

          {/* Pageviews */}
          {pv.area && <path d={pv.area} fill="url(#ac-pvGrad)" />}
          {pv.line && (
            <polyline points={pv.line} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
          )}

          {/* Crosshair + dots on hover */}
          {tooltip && crossX !== null && (
            <>
              <line
                x1={crossX} y1={PAD_V} x2={crossX} y2={H - PAD_V}
                stroke="#475569" strokeWidth="1" strokeDasharray="4 3"
              />
              {dotYpv !== null && (
                <circle cx={crossX} cy={dotYpv} r="4.5" fill="#3b82f6" stroke="#070d1a" strokeWidth="2" />
              )}
              {dotYsess !== null && (
                <circle cx={crossX} cy={dotYsess} r="4.5" fill="#a855f7" stroke="#070d1a" strokeWidth="2" />
              )}
            </>
          )}
        </svg>

        {/* X-axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
          {xDates.map((d, i) => (
            <span key={i} style={{ fontSize: '0.6rem', color: '#334155' }}>{fmtDate(d)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
