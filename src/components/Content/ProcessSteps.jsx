import React from 'react';

/**
 * Process Steps - comp-027
 * EXACT conversion from inspiration-2.html lines 861-900
 * Status: needs-work
 * Feedback: "Add this to the PPL(H) details page and as you scroll one of the dots will fill with colour and text will appear in the middle describing each step"
 * Interactivity: scroll-based animation with dot fill and text reveal
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-027
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const ProcessSteps = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem' }}>
        <div className="hq-container">
          <div className="hq-section-header">
            <span className="hq-overline">How It Works</span>
            <h2 className="hq-section-title">Start Flying in 4 Steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '30px', left: '12.5%', right: '12.5%', height: '2px', background: 'var(--hq-border)' }}></div>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--hq-accent)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>01</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Book Trial</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-body)' }}>30-min hands-on experience. From £299.</p>
            </div>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '60px', height: '60px', background: '#fff', border: '2px solid var(--hq-accent)', color: 'var(--hq-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>02</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Start Training</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-body)' }}>Flexible lessons around your schedule.</p>
            </div>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '60px', height: '60px', background: '#fff', border: '2px solid var(--hq-border)', color: 'var(--hq-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>03</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pass Test</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-body)' }}>Skills test after 45+ hours.</p>
            </div>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '60px', height: '60px', background: '#fff', border: '2px solid var(--hq-border)', color: 'var(--hq-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>04</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Take Flight</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--hq-body)' }}>License in hand. The sky is yours.</p>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="Add this to the PPL(H) details page and as you scroll one of the dots will fill with colour and text will appear in the middle describing each step"
        />
      )}
    </>
  );
};

export default ProcessSteps;
