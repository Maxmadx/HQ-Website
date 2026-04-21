/**
 * DebugPanel — live animation inspector for the testing page.
 *
 * Reads all motion values from useHeroScroll via a single requestAnimationFrame
 * loop (not per-value subscriptions). Renders a fixed overlay in the top-right
 * corner of the hero sticky viewport.
 *
 * Toggle with the D key (managed in TestingHeroSection).
 */
import { useEffect, useState } from 'react';

export function DebugPanel({ values, open }) {
  const [snap, setSnap] = useState(null);

  useEffect(() => {
    if (!open) return;

    let raf;
    const tick = () => {
      setSnap({
        progress:   values.scrollYProgress.get(),
        phase:      values.phase.get(),
        midX:       values._raw.midX.get(),
        rX:         values._raw.rX.get(),
        rY:         values._raw.rY.get(),
        brX:        values._raw.brX.get(),
        brY:        values._raw.brY.get(),
        blY:        values._raw.blY.get(),
        logoScale:  values.logoScale.get(),
        logoYpx:    values.logoYpx.get(),
        logoXpx:    values.logoXpx.get(),
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, values]);

  if (!open || !snap) return null;

  const fmt  = (n, d = 1) => (typeof n === 'number' ? n.toFixed(d) : n);
  const fmtP = (n)        => (typeof n === 'number' ? n.toFixed(4) : n);

  return (
    <div style={styles.panel}>
      <div style={styles.title}>DEBUG — press D to hide</div>

      <Row label="progress" value={fmtP(snap.progress)} color="#7dd3fc" />
      <PhaseRow phase={snap.phase} />

      <Divider />
      <div style={styles.sectionLabel}>POLYGON</div>
      <Row label="midX" value={fmt(snap.midX)} color="#fbbf24" />
      <Row label="rX  " value={fmt(snap.rX)}   color="#fbbf24" />
      <Row label="rY  " value={fmt(snap.rY, 2)} color="#fbbf24" />
      <Row label="brX " value={fmt(snap.brX)}  color="#fbbf24" />
      <Row label="brY " value={fmt(snap.brY)}  color="#fbbf24" />
      <Row label="blY " value={fmt(snap.blY)}  color="#fbbf24" />

      <Divider />
      <div style={styles.sectionLabel}>LOGO</div>
      <Row label="scale" value={fmtP(snap.logoScale)} color="#c4b5fd" />
      <Row label="Y px " value={`${fmt(snap.logoYpx)}px`} color="#c4b5fd" />
      <Row label="X px " value={`${fmt(snap.logoXpx)}px`} color="#c4b5fd" />
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div style={styles.row}>
      <span style={{ ...styles.label, color }}>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  );
}

function PhaseRow({ phase }) {
  const colors = {
    rotate:     '#86efac',
    transition: '#fde68a',
    collapse:   '#fca5a5',
    handoff:    '#a5f3fc',
  };
  return (
    <div style={styles.row}>
      <span style={{ ...styles.label, color: '#7dd3fc' }}>phase   </span>
      <span style={{ ...styles.value, color: colors[phase] ?? '#fff' }}>{phase}</span>
    </div>
  );
}

function Divider() {
  return <div style={styles.divider} />;
}

const styles = {
  panel: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 50,
    background: 'rgba(0,0,0,0.88)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 7,
    padding: '10px 14px',
    fontFamily: 'monospace',
    fontSize: '0.6rem',
    lineHeight: 1.9,
    color: '#aaa',
    minWidth: 210,
    pointerEvents: 'none',
    userSelect: 'none',
  },
  title: {
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.1em',
    fontSize: '0.55rem',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: '0.1em',
    fontSize: '0.5rem',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    whiteSpace: 'pre',
  },
  value: {
    color: '#fff',
    tabularNums: true,
  },
  divider: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    margin: '4px 0',
  },
};
