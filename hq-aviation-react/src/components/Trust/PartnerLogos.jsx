import React from 'react';

/**
 * Partner Logos - comp-022
 * EXACT conversion from inspiration-2.html lines 362-393
 * Status: needs-work
 * Feedback: "Needs better icons but yes having our partners is cool, include Denham Aerodrome"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-022
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const PartnerLogos = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '3rem 2rem', borderTop: '1px solid var(--hq-border)', borderBottom: '1px solid var(--hq-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span className="hq-overline">Trusted Partners</span>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-helicopter" style={{ fontSize: '2rem', color: 'var(--hq-muted)' }}></i>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>Robinson</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-cog" style={{ fontSize: '2rem', color: 'var(--hq-muted)' }}></i>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>Rolls-Royce</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-shield-alt" style={{ fontSize: '2rem', color: 'var(--hq-muted)' }}></i>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>Hayward Aviation</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-map-marked-alt" style={{ fontSize: '2rem', color: 'var(--hq-muted)' }}></i>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem' }}>Helipaddy</span>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="Needs better icons but yes having our partners is cool, include Denham Aerodrome"
        />
      )}
    </>
  );
};

export default PartnerLogos;
