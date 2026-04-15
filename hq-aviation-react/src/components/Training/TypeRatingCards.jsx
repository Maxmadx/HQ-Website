import React from 'react';

/**
 * Type Rating Cards - comp-051
 * EXACT conversion from inspiration-2.html lines 2739-2787
 * Status: needs-work
 * Feedback: "Have a type rating component for R44, R66, H500, AS350, Bell 407"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-051
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const TypeRatingCards = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'var(--hq-background)' }}>
        <div className="hq-container">
          <div className="hq-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="hq-overline hq-overline--accent">Type Ratings</span>
            <h2 className="hq-section-title">Add to Your License</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--hq-accent)' }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>R22</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--hq-muted)', marginBottom: '1.5rem' }}>Piston Single</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--hq-body)', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--hq-border)' }}>Min 5 hours training</div>
                <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--hq-border)' }}>Skills test included</div>
                <div style={{ padding: '0.5rem 0' }}>RHC Safety Course req.</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>From <strong style={{ fontSize: '1.25rem', color: 'var(--hq-primary)' }}>£2,400</strong></div>
            </div>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--hq-primary)' }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>R44</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--hq-muted)', marginBottom: '1.5rem' }}>Piston Single</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--hq-body)', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--hq-border)' }}>Min 5 hours training</div>
                <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--hq-border)' }}>Skills test included</div>
                <div style={{ padding: '0.5rem 0' }}>RHC Safety Course req.</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>From <strong style={{ fontSize: '1.25rem', color: 'var(--hq-primary)' }}>£3,200</strong></div>
            </div>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center', borderTop: '4px solid #6366f1' }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>R66</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--hq-muted)', marginBottom: '1.5rem' }}>Turbine Single</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--hq-body)', marginBottom: '1rem' }}>
                <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--hq-border)' }}>Min 10 hours training</div>
                <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--hq-border)' }}>Skills test included</div>
                <div style={{ padding: '0.5rem 0' }}>Turbine differences</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--hq-muted)' }}>From <strong style={{ fontSize: '1.25rem', color: 'var(--hq-primary)' }}>£9,500</strong></div>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="Have a type rating component for R44, R66, H500, AS350, Bell 407"
        />
      )}
    </>
  );
};

export default TypeRatingCards;
