import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GLOSSARY } from './analyticsGlossary';

const FALLBACK = { title: 'No description available', body: 'This metric does not have an explanation registered yet.' };

const TOOLTIP_WIDTH = 320;

export default function InfoTooltip({ topic }) {
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    if (!open || !wrapperRef.current) return;
    const { left } = wrapperRef.current.getBoundingClientRect();
    setAlignRight(left + TOOLTIP_WIDTH > window.innerWidth - 8);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const entry = GLOSSARY[topic] || FALLBACK;

  return (
    <span ref={wrapperRef} style={{ position: 'relative', display: 'inline-block', marginLeft: 6 }}>
      <button
        type="button"
        aria-label="More info"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 16, height: 16, borderRadius: '50%',
          background: 'transparent', color: '#94a3b8',
          border: '1px solid #475569',
          fontSize: 11, fontWeight: 600, fontStyle: 'italic',
          cursor: 'pointer', padding: 0, lineHeight: 1,
        }}
      >
        i
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          style={{
            position: 'absolute', top: 'calc(100% + 8px)',
            ...(alignRight ? { right: 0 } : { left: 0 }),
            background: '#0f172a', color: '#f1f5f9',
            border: '1px solid #334155', borderRadius: 8,
            padding: '14px 16px',
            width: TOOLTIP_WIDTH, maxWidth: '90vw',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            zIndex: 100,
            fontSize: 13, lineHeight: 1.5,
            textTransform: 'none',
            letterSpacing: 0,
            fontWeight: 400,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <strong style={{ fontSize: 13, color: '#f1f5f9' }}>{entry.title}</strong>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent', color: '#94a3b8',
                border: 'none', padding: 0, fontSize: 16, cursor: 'pointer', lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          <p style={{ margin: 0, color: '#cbd5e1' }}>{entry.body}</p>
        </div>
      )}
    </span>
  );
}
