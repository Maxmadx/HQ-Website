/**
 * SVG stroke-based donut chart.
 *
 * Props:
 *   segments        [{ color, pct, label }]  — must sum to ~100
 *   size            number (default 120)      — SVG width/height in px
 *   strokeWidth     number (default 14)       — ring thickness in px
 *   centerLabel     string                    — large text in the centre
 *   centerSublabel  string                    — small text below centre
 */
export default function DonutChart({
  segments,
  size = 120,
  strokeWidth = 14,
  centerLabel,
  centerSublabel,
}) {
  const r = size / 2 - strokeWidth;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ flexShrink: 0 }}
    >
      {/* Track ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a2840" strokeWidth={strokeWidth} />

      {/* Segments — rotated so start is at 12 o'clock */}
      <g transform={`rotate(-90, ${cx}, ${cy})`}>
        {segments.map((seg, i) => {
          const dash = (seg.pct / 100) * circumference;
          const gap = circumference - dash;
          const offset = -cumulative;
          cumulative += dash;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash.toFixed(2)} ${gap.toFixed(2)}`}
              strokeDashoffset={offset.toFixed(2)}
            />
          );
        })}
      </g>

      {/* Centre labels */}
      {centerLabel && (
        <text
          x={cx}
          y={cy - (centerSublabel ? size * 0.04 : 0)}
          textAnchor="middle"
          fill="#f1f5f9"
          fontSize={size * 0.1}
          fontWeight="700"
        >
          {centerLabel}
        </text>
      )}
      {centerSublabel && (
        <text
          x={cx}
          y={cy + size * 0.09}
          textAnchor="middle"
          fill="#64748b"
          fontSize={size * 0.065}
        >
          {centerSublabel}
        </text>
      )}
    </svg>
  );
}
