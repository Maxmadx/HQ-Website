import React from 'react';

/**
 * Ferry Flight Services - comp-077
 * EXACT conversion from inspiration-2.html lines 3810-3844
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-077
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const FerryFlightServices = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div className="hq-container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="hq-overline hq-overline--accent">Worldwide Delivery</span>
              <h2 className="hq-section-title" style={{ marginBottom: '1rem' }}>Ferry Flight Services</h2>
              <p style={{ fontSize: '1rem', color: 'var(--hq-body)', lineHeight: 1.8, marginBottom: '1.5rem' }}>We deliver helicopters anywhere in the world. From factory collection in Torrance, California to your home base—we handle everything.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--hq-background)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Trans-Atlantic</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--hq-muted)' }}>USA → Europe</div>
                </div>
                <div style={{ background: 'var(--hq-background)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>European</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--hq-muted)' }}>Any EU destination</div>
                </div>
                <div style={{ background: 'var(--hq-background)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Middle East</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--hq-muted)' }}>Dubai, Qatar, KSA</div>
                </div>
                <div style={{ background: 'var(--hq-background)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Custom Routes</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--hq-muted)' }}>Anywhere possible</div>
                </div>
              </div>
              <a href="#" className="hq-btn hq-btn--primary">Request Quote</a>
            </div>
            <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌍</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'var(--hq-primary)' }}>35,000+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--hq-muted)' }}>Miles ferried by our team</div>
            </div>
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

export default FerryFlightServices;
