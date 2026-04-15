import React from 'react';

/**
 * Location Highlight - comp-014
 * EXACT conversion from inspiration-2.html lines 1175-1207
 * Status: needs-work
 * Feedback: "Instead of 'Free Parking' say 'On Site Parking'. Instead of 1990 write 2010"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-014
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const LocationHighlight = ({ showNote = true }) => {
  return (
    <>
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: '#e5e5e5', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--hq-muted)' }}>
            <i className="fas fa-map-marked-alt" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <p>Interactive Map</p>
          </div>
        </div>
        <div style={{ padding: '3rem', background: 'var(--hq-background)' }}>
          <span className="hq-overline">Visit Us</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Denham Aerodrome</h2>
          <p style={{ color: 'var(--hq-body)', lineHeight: 1.8, marginBottom: '2rem' }}>Just 20 minutes from Central London, our purpose-built facility has been home to HQ Aviation since 2010.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)', marginBottom: '0.5rem' }}>ADDRESS</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>HQ Aviation<br />Tilehouse Lane<br />Denham, UB9 5DF</p>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)', marginBottom: '0.5rem' }}>GETTING HERE</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>5 min from M40 J1<br />20 min from M25 J16<br />On Site Parking</p>
            </div>
          </div>
          <a href="#" className="hq-btn hq-btn--primary"><i className="fas fa-directions" style={{ marginRight: '0.5rem' }}></i>Get Directions</a>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="Instead of 'Free Parking' say 'On Site Parking'. Instead of 1990 write 2010"
        />
      )}
    </>
  );
};

export default LocationHighlight;
