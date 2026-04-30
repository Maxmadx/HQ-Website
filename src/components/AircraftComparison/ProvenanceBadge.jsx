const STYLES = {
  verified:         { bg: '#e8f0e8', fg: '#2a652a', label: 'verified' },
  estimate:         { bg: '#fff4e0', fg: '#a06a00', label: 'estimate' },
  'pre-production': { bg: '#eef0f7', fg: '#3d4a8a', label: 'pre-production' },
};

export default function ProvenanceBadge({ confidence, source, lastUpdated }) {
  const style = STYLES[confidence] || STYLES.estimate;
  const colors = { bg: style.bg, fg: style.fg };
  const label = style.label;
  const tooltip = source ? `${source}${lastUpdated ? ` · ${lastUpdated}` : ''}` : label;

  return (
    <span
      title={tooltip}
      style={{
        display: 'inline-block',
        background: colors.bg,
        color: colors.fg,
        padding: '0.1rem 0.45rem',
        fontSize: '0.66rem',
        fontWeight: 600,
        borderRadius: '2px',
        textTransform: 'lowercase',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  );
}
