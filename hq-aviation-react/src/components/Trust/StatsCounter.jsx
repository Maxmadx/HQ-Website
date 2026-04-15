import React from 'react';

/**
 * Stats Counter - comp-008
 * EXACT conversion from inspiration-2.html lines 310-338
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  if (!feedback) return null;

  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-008
      </div>
      <p className="component-note__text">{feedback}</p>
    </div>
  );
};

const StatsCounter = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'var(--hq-dark-bg)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#fff', display: 'block' }}>34</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)' }}>YEARS IN BUSINESS</span>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#fff', display: 'block' }}>500+</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)' }}>AIRCRAFT SOLD</span>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#fff', display: 'block' }}>1,200+</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)' }}>PILOTS TRAINED</span>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#fff', display: 'block' }}>50+</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)' }}>COUNTRIES VISITED</span>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback={null}
        />
      )}
    </>
  );
};

export default StatsCounter;
