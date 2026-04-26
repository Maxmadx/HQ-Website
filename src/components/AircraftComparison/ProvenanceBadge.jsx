export default function ProvenanceBadge({ confidence, source, lastUpdated }) {
  const isVerified = confidence === 'verified';
  const colors = isVerified
    ? { bg: '#e8f0e8', fg: '#2a652a' }
    : { bg: '#fff4e0', fg: '#a06a00' };
  const label = isVerified ? 'verified' : 'estimate';
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
