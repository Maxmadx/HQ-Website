/**
 * AccordionVariations
 *
 * 20 visual variations of the fd-sales accordion header pattern.
 * Each variation uses the same 4 items (New Aircraft, Pre-Owned Aircraft,
 * Rebuilt Aircraft, Robinson Unmanned) and is fully interactive —
 * click any header to expand/collapse. Only the header styling varies;
 * the expanded body shows a simple placeholder.
 */

import React, { useState } from 'react';

const items = [
  'New Aircraft',
  'Pre-Owned Aircraft',
  'Rebuilt Aircraft',
  'Robinson Unmanned',
];

/* ------------------------------------------------------------------ */
/*  Shared accordion logic                                             */
/* ------------------------------------------------------------------ */
function Accordion({ children, title, index }) {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#999',
          marginBottom: '0.75rem',
        }}>
          Variation {String(index).padStart(2, '0')}
          <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>—</span>
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div style={{
      padding: '1.5rem 1rem',
      color: '#bbb',
      fontFamily: "'Inter', sans-serif",
      fontSize: '0.85rem',
      lineHeight: 1.7,
      borderLeft: '1px solid #eee',
      marginLeft: '0.5rem',
    }}>
      Section content would appear here — cards, descriptions, carousels, etc.
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook for accordion state                                           */
/* ------------------------------------------------------------------ */
function useAccordion() {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(prev => prev === i ? null : i);
  return { open, toggle };
}

/* ------------------------------------------------------------------ */
/*  V01 — Current: Left border + line + circle chevron                 */
/* ------------------------------------------------------------------ */
function V01() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={1} title="Current — Left border + line + circle chevron">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #e8e6e2' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem', cursor: 'pointer', borderLeft: '3px solid #1a1a1a',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#1a1a1a', userSelect: 'none',
          }}>
            {item}
            <span style={{ flex: 1, height: 1, background: '#e8e6e2' }} />
            <span style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '1.5px solid #1a1a1a', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'all 0.3s ease',
              background: open === i ? '#1a1a1a' : 'transparent',
              color: open === i ? '#fff' : '#1a1a1a',
              transform: open === i ? 'rotate(180deg)' : 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </span>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V02 — Minimal: No border, thin underline, plus/minus               */
/* ------------------------------------------------------------------ */
function V02() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={2} title="Minimal — No border, thin underline, plus/minus">
      {items.map((item, i) => (
        <div key={i}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 0', cursor: 'pointer',
            borderBottom: '1px solid #eee',
            fontFamily: "'Inter', sans-serif", fontSize: '0.95rem',
            fontWeight: 500, color: '#1a1a1a', userSelect: 'none',
            letterSpacing: '0.02em',
          }}>
            {item}
            <span style={{
              fontSize: '1.4rem', fontWeight: 300, lineHeight: 1,
              color: '#1a1a1a', transition: 'transform 0.2s ease',
              fontFamily: "'Inter', sans-serif",
            }}>
              {open === i ? '−' : '+'}
            </span>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V03 — Bold numbered: Number prefix + arrow                         */
/* ------------------------------------------------------------------ */
function V03() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={3} title="Numbered — Mono counter + right arrow">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #e8e6e2' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', gap: '1.25rem',
            padding: '1.1rem 0', cursor: 'pointer', userSelect: 'none',
          }}>
            <span style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem',
              color: '#bbb', letterSpacing: '0.05em', width: '2rem',
            }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: '#1a1a1a', flex: 1,
            }}>{item}</span>
            <span style={{
              fontSize: '1.1rem', color: '#1a1a1a',
              transition: 'transform 0.3s ease',
              transform: open === i ? 'rotate(90deg)' : 'none',
            }}>→</span>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V04 — Card style: Elevated cards with shadow                       */
/* ------------------------------------------------------------------ */
function V04() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={4} title="Card style — Elevated with shadow on open">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 8,
            border: open === i ? '1px solid #1a1a1a' : '1px solid #eee',
            boxShadow: open === i ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.3s ease', overflow: 'hidden',
          }}>
            <div onClick={() => toggle(i)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.1rem 1.25rem', cursor: 'pointer', userSelect: 'none',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: '#1a1a1a',
            }}>
              {item}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            {open === i && <div style={{ padding: '0 1.25rem 1.25rem' }}><Placeholder /></div>}
          </div>
        ))}
      </div>
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V05 — Orange accent: Left border turns orange on open              */
/* ------------------------------------------------------------------ */
function V05() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={5} title="Orange accent — Left border highlights on open">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #e8e6e2' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem 1rem', cursor: 'pointer',
            borderLeft: `3px solid ${open === i ? '#E04A2F' : '#ddd'}`,
            transition: 'border-color 0.3s ease',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: open === i ? '#E04A2F' : '#1a1a1a', userSelect: 'none',
          }}>
            {item}
            <span style={{ flex: 1 }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none', flexShrink: 0 }}><polyline points="6 9 12 15 18 9" /></svg>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V06 — Pill chevron: Rounded pill toggle                            */
/* ------------------------------------------------------------------ */
function V06() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={6} title="Pill toggle — Rounded pill open/close">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #e8e6e2' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 0', cursor: 'pointer', userSelect: 'none',
            borderLeft: '3px solid #1a1a1a', paddingLeft: '1rem',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#1a1a1a',
          }}>
            {item}
            <span style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0.3rem 0.8rem', borderRadius: 999,
              border: '1px solid #1a1a1a',
              background: open === i ? '#1a1a1a' : 'transparent',
              color: open === i ? '#fff' : '#1a1a1a',
              transition: 'all 0.3s ease', flexShrink: 0,
            }}>
              {open === i ? 'CLOSE' : 'OPEN'}
            </span>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V07 — Underline reveal: Thick underline slides in on hover/open    */
/* ------------------------------------------------------------------ */
function V07() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={7} title="Underline reveal — Bottom bar on open">
      {items.map((item, i) => (
        <div key={i}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.1rem 0 1rem', cursor: 'pointer', userSelect: 'none',
            borderBottom: open === i ? '2px solid #1a1a1a' : '1px solid #e8e6e2',
            transition: 'border-bottom 0.2s ease',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#1a1a1a',
          }}>
            {item}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9" /></svg>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V08 — Dark mode: Dark background headers                           */
/* ------------------------------------------------------------------ */
function V08() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={8} title="Dark mode — Dark header bars">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((item, i) => (
          <div key={i}>
            <div onClick={() => toggle(i)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem', cursor: 'pointer', userSelect: 'none',
              background: open === i ? '#1a1a1a' : '#2a2a2a',
              color: '#fff',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              transition: 'background 0.2s ease',
            }}>
              {item}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none', opacity: 0.6 }}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            {open === i && <div style={{ background: '#f8f8f6' }}><Placeholder /></div>}
          </div>
        ))}
      </div>
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V09 — Serif elegant: Playfair Display with thin line               */
/* ------------------------------------------------------------------ */
function V09() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={9} title="Serif elegant — Playfair Display with thin line">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #e8e6e2' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1.25rem 0', cursor: 'pointer', userSelect: 'none',
            fontFamily: "'Playfair Display', serif", fontSize: '1.2rem',
            fontWeight: 400, fontStyle: 'italic', color: '#1a1a1a',
            letterSpacing: '0.02em',
          }}>
            {item}
            <span style={{ flex: 1, height: 1, background: '#e0ded8' }} />
            <span style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem',
              color: '#999', transition: 'transform 0.3s ease',
              transform: open === i ? 'rotate(180deg)' : 'none',
            }}>▾</span>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V10 — Tag style: Monospace with bracket markers                    */
/* ------------------------------------------------------------------ */
function V10() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={10} title="Tag style — Monospace with bracket markers">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #e8e6e2' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '1rem 0', cursor: 'pointer', userSelect: 'none',
            fontFamily: "'Share Tech Mono', monospace", fontSize: '0.85rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a',
          }}>
            <span style={{ color: '#ccc' }}>[</span>
            <span style={{ color: open === i ? '#E04A2F' : '#999', transition: 'color 0.2s ease' }}>
              {open === i ? '−' : '+'}
            </span>
            <span style={{ color: '#ccc' }}>]</span>
            {item}
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V11 — Split: Left-aligned text, right-aligned square button        */
/* ------------------------------------------------------------------ */
function V11() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={11} title="Square button — Right-aligned square toggle">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #e8e6e2' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 0 1rem 1rem', cursor: 'pointer', userSelect: 'none',
            borderLeft: '3px solid #1a1a1a',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#1a1a1a',
          }}>
            {item}
            <span style={{
              width: 36, height: 36, borderRadius: 4,
              border: '1.5px solid #1a1a1a', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              background: open === i ? '#1a1a1a' : 'transparent',
              color: open === i ? '#fff' : '#1a1a1a',
              transition: 'all 0.3s ease',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9" /></svg>
            </span>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V12 — Left icon dot: Orange dot indicator                          */
/* ------------------------------------------------------------------ */
function V12() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={12} title="Dot indicator — Orange dot when open">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #e8e6e2' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', gap: '0.85rem',
            padding: '1.1rem 0', cursor: 'pointer', userSelect: 'none',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#1a1a1a',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: open === i ? '#E04A2F' : '#ddd',
              transition: 'background 0.3s ease',
            }} />
            {item}
            <span style={{ flex: 1 }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none', opacity: 0.5 }}><polyline points="6 9 12 15 18 9" /></svg>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V13 — Indented: Indent + small caps label                          */
/* ------------------------------------------------------------------ */
function V13() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={13} title="Indented — Stepped indent with small caps">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #eee' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 0', paddingLeft: i * 12,
            cursor: 'pointer', userSelect: 'none',
            fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: open === i ? '#1a1a1a' : '#666',
            transition: 'color 0.2s ease',
          }}>
            {item}
            <span style={{
              fontSize: '0.7rem', color: '#bbb',
              transform: open === i ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease',
            }}>▼</span>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V14 — Thick left bar: Heavy left border, full width background     */
/* ------------------------------------------------------------------ */
function V14() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={14} title="Thick left bar — Heavy border with fill on open">
      {items.map((item, i) => (
        <div key={i} style={{ marginBottom: 2 }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderLeft: `5px solid ${open === i ? '#E04A2F' : '#1a1a1a'}`,
            background: open === i ? '#f5f4f0' : 'transparent',
            cursor: 'pointer', userSelect: 'none',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#1a1a1a', transition: 'all 0.3s ease',
          }}>
            {item}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9" /></svg>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V15 — Aviation tabs: Tab-like with bottom active indicator         */
/* ------------------------------------------------------------------ */
function V15() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={15} title="Bottom indicator — Tab-style active bar">
      {items.map((item, i) => (
        <div key={i}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.1rem 0.5rem',
            cursor: 'pointer', userSelect: 'none',
            borderBottom: open === i ? '2px solid #E04A2F' : '1px solid #e8e6e2',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem',
            fontWeight: open === i ? 700 : 500,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: open === i ? '#1a1a1a' : '#888',
            transition: 'all 0.2s ease',
          }}>
            {item}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none', opacity: 0.4 }}><polyline points="6 9 12 15 18 9" /></svg>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V16 — Outline card: Rounded outline that highlights on open        */
/* ------------------------------------------------------------------ */
function V16() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={16} title="Outline card — Rounded border highlights on open">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            border: `1.5px solid ${open === i ? '#1a1a1a' : '#e0e0e0'}`,
            borderRadius: 12, overflow: 'hidden',
            transition: 'border-color 0.3s ease',
          }}>
            <div onClick={() => toggle(i)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem', cursor: 'pointer', userSelect: 'none',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: '#1a1a1a',
            }}>
              {item}
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: open === i ? '#1a1a1a' : '#f0f0ee',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease', flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open === i ? '#fff' : '#999'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9" /></svg>
              </span>
            </div>
            {open === i && <div style={{ padding: '0 1.25rem 1rem' }}><Placeholder /></div>}
          </div>
        ))}
      </div>
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V17 — Striped: Alternating subtle background stripes               */
/* ------------------------------------------------------------------ */
function V17() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={17} title="Striped — Alternating background tones">
      {items.map((item, i) => (
        <div key={i}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.1rem 1.25rem', cursor: 'pointer', userSelect: 'none',
            background: i % 2 === 0 ? '#f8f7f5' : 'transparent',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#1a1a1a',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#ccc', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem' }}>{String(i + 1).padStart(2, '0')}</span>
              {item}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9" /></svg>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V18 — Glassmorphism: Frosted glass headers                         */
/* ------------------------------------------------------------------ */
function V18() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={18} title="Glassmorphism — Frosted translucent headers">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map((item, i) => (
          <div key={i}>
            <div onClick={() => toggle(i)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem', cursor: 'pointer', userSelect: 'none',
              background: open === i ? 'rgba(26,26,26,0.05)' : 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 8,
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: '#1a1a1a', transition: 'background 0.3s ease',
            }}>
              {item}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none', opacity: 0.5 }}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            {open === i && <Placeholder />}
          </div>
        ))}
      </div>
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V19 — Rotary switch: Circle indicator rotates between states       */
/* ------------------------------------------------------------------ */
function V19() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={19} title="Rotary — Diagonal line rotates to indicate state">
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #e8e6e2' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem 0 1rem 1rem', cursor: 'pointer', userSelect: 'none',
            borderLeft: '3px solid #1a1a1a',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#1a1a1a',
          }}>
            {item}
            <span style={{ flex: 1, height: 1, background: '#e8e6e2' }} />
            <span style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '1.5px solid #1a1a1a', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'all 0.3s ease',
              transform: open === i ? 'rotate(45deg)' : 'none',
              background: open === i ? '#E04A2F' : 'transparent',
              borderColor: open === i ? '#E04A2F' : '#1a1a1a',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={open === i ? '#fff' : 'currentColor'} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </span>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  V20 — Dual-tone: Split background with dark number column          */
/* ------------------------------------------------------------------ */
function V20() {
  const { open, toggle } = useAccordion();
  return (
    <Accordion index={20} title="Dual-tone — Dark number column + light text">
      {items.map((item, i) => (
        <div key={i} style={{ marginBottom: 2, overflow: 'hidden' }}>
          <div onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'stretch',
            cursor: 'pointer', userSelect: 'none',
          }}>
            <span style={{
              width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: open === i ? '#E04A2F' : '#1a1a1a',
              color: '#fff', fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.7rem', letterSpacing: '0.05em',
              transition: 'background 0.3s ease', flexShrink: 0,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              background: open === i ? '#f5f4f0' : '#fafaf8',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: '#1a1a1a', transition: 'background 0.2s ease',
            }}>
              {item}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s ease', transform: open === i ? 'rotate(180deg)' : 'none', opacity: 0.4 }}><polyline points="6 9 12 15 18 9" /></svg>
            </span>
          </div>
          {open === i && <Placeholder />}
        </div>
      ))}
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
const variations = [
  V01, V02, V03, V04, V05, V06, V07, V08, V09, V10,
  V11, V12, V13, V14, V15, V16, V17, V18, V19, V20,
];

export default function AccordionVariations() {
  return (
    <>
      <style>{`
        .av-page {
          min-height: 100vh;
          background: #FAFAF8;
          padding: 3rem 1.5rem 6rem;
          font-family: 'Inter', sans-serif;
        }
        .av-page__header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .av-page__header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 400;
          color: #1a1a1a;
          margin: 0;
          letter-spacing: 0.02em;
        }
        .av-page__header p {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #999;
          margin: 0.75rem 0 0;
        }
      `}</style>
      <div className="av-page">
        <div className="av-page__header">
          <h1>Accordion Variations</h1>
          <p>20 header styles for collapsible sections</p>
        </div>
        {variations.map((V, i) => <V key={i} />)}
      </div>
    </>
  );
}
