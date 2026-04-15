import React from 'react';

/**
 * Mountain Flying Hazards - comp-084
 * EXACT conversion from inspiration-2.html lines 4043-4085
 * Status: approved
 * Feedback: "Nice. So a 5 day course in Scotland"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-084
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const MountainFlyingHazards = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div className="hq-container" style={{ maxWidth: '900px' }}>
          <div className="hq-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="hq-overline hq-overline--accent">Advanced Training</span>
            <h2 className="hq-section-title">Mountain Flying</h2>
          </div>
          <p style={{ fontSize: '1.1rem', color: 'var(--hq-body)', textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>Master the unique challenges of high-altitude operations with our specialized mountain flying course, taught by polar expedition pilots.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🌬️</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Wind Effects</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>Rotors, turbulence, downdrafts</p>
            </div>
            <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📉</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Density Altitude</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>Performance calculations</p>
            </div>
            <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏔️</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Confined Areas</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>Pinnacle & ridge landings</p>
            </div>
            <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>❄️</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Cold Weather</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>Icing & white-out</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="#" className="hq-btn hq-btn--outline">Learn More</a>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="Nice. So a 5 day course in Scotland"
        />
      )}
    </>
  );
};

export default MountainFlyingHazards;
