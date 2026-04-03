/**
 * Callout - Styled boxes for tips, warnings, and key information
 * Variants: info, warning, tip, quote
 */

function Callout({ variant = 'info', title, children }) {
  const icons = {
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
      </svg>
    ),
    tip: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    quote: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
      </svg>
    )
  };

  const colors = {
    info: { bg: '#e7f5ff', border: '#339af0', icon: '#1971c2' },
    warning: { bg: '#fff9db', border: '#fab005', icon: '#e67700' },
    tip: { bg: '#d3f9d8', border: '#51cf66', icon: '#2f9e44' },
    quote: { bg: '#f8f9fa', border: '#868e96', icon: '#495057' }
  };

  const color = colors[variant] || colors.info;

  return (
    <div className={`callout callout--${variant}`} style={{
      background: color.bg,
      borderLeft: `4px solid ${color.border}`,
      borderRadius: '0 8px 8px 0',
      padding: '1.25rem 1.5rem',
      margin: '1.5rem 0',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start'
    }}>
      <div style={{
        flexShrink: 0,
        width: '24px',
        height: '24px',
        color: color.icon
      }}>
        {icons[variant]}
      </div>
      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.95rem',
            fontWeight: 600,
            color: color.icon,
            margin: '0 0 0.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '0.03em'
          }}>
            {title}
          </h4>
        )}
        <div style={{
          fontSize: '0.95rem',
          color: '#495057',
          lineHeight: 1.6
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Callout;
