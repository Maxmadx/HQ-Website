import React from 'react';

/**
 * Founder Story - comp-007
 * EXACT conversion from inspiration-2.html lines 681-712
 * Status: needs-work (HIGH PRIORITY)
 * Feedback: "We need a founder section but it has to be really good, creative and beautiful"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-007 (HIGH PRIORITY)
      </div>
      <p className="component-note__text">{feedback}</p>
    </div>
  );
};

const FounderStory = ({ showNote = true }) => {
  return (
    <>
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '500px' }}>
        <div style={{ background: "url('/assets/images/team/helicopter-genius-quentin-smith-great-britain.webp') center/cover" }}></div>
        <div style={{ background: 'var(--hq-primary)', color: '#fff', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--hq-accent)', marginBottom: '1rem' }}>MEET THE FOUNDER</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '1.5rem' }}>Captain Quentin Smith</h2>
          <p style={{ fontSize: '1rem', opacity: 0.8, lineHeight: 1.8, marginBottom: '1.5rem' }}>"In 2010, I turned my passion for flight into HQ Aviation. Today, we're the UK's leading Robinson specialist, but our mission remains the same: sharing the joy of helicopter flight with everyone who walks through our doors."</p>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, display: 'block' }}>15,000+</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', opacity: 0.5 }}>FLIGHT HOURS</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, display: 'block' }}>7</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', opacity: 0.5 }}>WORLD RECORDS</span>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, display: 'block' }}>50+</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', opacity: 0.5 }}>COUNTRIES</span>
            </div>
          </div>
          <a href="#" className="hq-btn hq-btn--accent" style={{ alignSelf: 'flex-start' }}>Read His Story</a>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="We need a founder section but it has to be really good, creative and beautiful"
        />
      )}
    </>
  );
};

export default FounderStory;
