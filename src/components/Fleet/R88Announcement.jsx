import React from 'react';

/**
 * R88 Announcement - comp-047
 * EXACT conversion from inspiration-2.html lines 2530-2572
 * Status: needs-work
 * Feedback: "Yes let's have a component like this for each type then, have the side profile though"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-047
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const R88Announcement = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '1rem', right: '2rem', background: 'var(--hq-accent)', color: '#fff', fontSize: '0.65rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coming 2025</div>
        <div className="hq-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--hq-accent)', display: 'block', marginBottom: '1rem' }}>INTRODUCING</span>
              <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: '1rem' }}>Robinson R88</h2>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '2rem' }}>The new flagship. 8+ seats, twin turbine power, and unmatched capability. Redefining what a Robinson can do.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>8+</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>SEATS</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>2×</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>TURBINES</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>150</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>KNOTS</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>400</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>NM RANGE</div>
                </div>
              </div>
              <a href="#" className="hq-btn hq-btn--accent">Register Interest</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/images/new-aircraft/r88/r88-jellybean-left.png" alt="Robinson R88" style={{ maxWidth: '100%', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="Yes let's have a component like this for each type then, have the side profile though"
        />
      )}
    </>
  );
};

export default R88Announcement;
