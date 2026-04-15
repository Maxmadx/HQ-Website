import React from 'react';

/**
 * Fleet Showcase Carousel - comp-005
 * EXACT conversion from inspiration-2.html lines 568-617
 * Status: needs-work
 * Feedback: "This is a nice component for the Robinson helicopters in the sale page, could use a little work but a good start. The R66 shouldn't appear in black with the word 'popular' - it should appear like any other"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-005
      </div>
      <p className="component-note__text">{feedback}</p>
    </div>
  );
};

const FleetShowcaseCarousel = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 0', background: 'var(--hq-hover-bg)' }}>
        <div className="hq-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="hq-overline">Our Fleet</span>
              <h2 className="hq-section-title" style={{ textAlign: 'left' }}>Robinson Helicopters</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ width: '40px', height: '40px', border: '1px solid var(--hq-border)', background: '#fff', borderRadius: '50%', cursor: 'pointer' }}><i className="fas fa-chevron-left"></i></button>
              <button style={{ width: '40px', height: '40px', border: '1px solid var(--hq-border)', background: '#fff', borderRadius: '50%', cursor: 'pointer' }}><i className="fas fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', padding: '0 2rem', overflowX: 'auto' }}>
          <div style={{ flex: '0 0 300px', background: '#fff', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center' }}>
            <img src="/assets/images/new-aircraft/r22/r22-red-volcano-front-alpha-v3.png" alt="R22" style={{ height: '120px', marginBottom: '1rem' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>2 SEATS</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', margin: '0.5rem 0' }}>R22 Beta II</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--hq-accent)' }}>From $340,000</p>
          </div>
          <div style={{ flex: '0 0 300px', background: '#fff', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center' }}>
            <img src="/assets/images/new-aircraft/r44/raven-ii-front-alpha.png" alt="R44" style={{ height: '120px', marginBottom: '1rem' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>4 SEATS</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', margin: '0.5rem 0' }}>R44 Raven II</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--hq-accent)' }}>From $565,000</p>
          </div>
          <div style={{ flex: '0 0 300px', background: 'var(--hq-primary)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', color: '#fff', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--hq-accent)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.6rem', fontWeight: 600 }}>POPULAR</span>
            <img src="/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png" alt="R66" style={{ height: '120px', marginBottom: '1rem', marginTop: '1rem' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', opacity: 0.6 }}>5 SEATS • TURBINE</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', margin: '0.5rem 0' }}>R66 Turbine</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--hq-accent)' }}>From $1,290,000</p>
          </div>
          <div style={{ flex: '0 0 300px', background: '#fff', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center' }}>
            <img src="/assets/images/new-aircraft/r88/r88-jellybean-left.png" alt="R88" style={{ height: '120px', marginBottom: '1rem' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>10 SEATS • TWIN</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', margin: '0.5rem 0' }}>R88</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--hq-accent)' }}>From $2,850,000</p>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="This is a nice component for the Robinson helicopters in the sale page, could use a little work but a good start. The R66 shouldn't appear in black with the word 'popular' - it should appear like any other"
        />
      )}
    </>
  );
};

export default FleetShowcaseCarousel;
