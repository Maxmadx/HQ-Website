/**
 * SVG area chart showing two overlapping series (page views + sessions).
 *
 * Props:
 *   pvByDay    [['YYYY-MM-DD', count], ...]  — pageview daily counts
 *   sessByDay  [['YYYY-MM-DD', count], ...]  — session daily counts
 */
export default function AreaChart({ pvByDay, sessByDay }) {
  const W = 1000;
  const H = 130;
  const PAD_V = 10; // vertical padding so peaks aren't clipped

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

  // Y-axis labels based on rounded max
  const yMax = Math.ceil(maxVal / 10) * 10 || 10;
  const yLabels = [yMax, Math.round(yMax * 0.75), Math.round(yMax / 2), Math.round(yMax / 4), 0];

  // X-axis: show 5 evenly spaced date labels
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

  return (
    <div style={{ position: 'relative' }}>
      {/* Y-axis labels */}
      <div
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 28,
          width: 32, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {yLabels.map((v) => (
          <span key={v} style={{ fontSize: '0.6rem', color: '#334155', lineHeight: 1 }}>{v}</span>
        ))}
      </div>

      <div style={{ marginLeft: 36 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: 150, display: 'block' }}
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

          {/* Sessions (draw behind pageviews) */}
          {sess.area && <path d={sess.area} fill="url(#ac-sessGrad)" />}
          {sess.line && (
            <polyline points={sess.line} fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinejoin="round" />
          )}

          {/* Pageviews */}
          {pv.area && <path d={pv.area} fill="url(#ac-pvGrad)" />}
          {pv.line && (
            <polyline points={pv.line} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
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
