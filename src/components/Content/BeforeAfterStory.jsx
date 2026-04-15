import React from 'react';

/**
 * Before & After Story - comp-004
 * EXACT conversion from inspiration-2.html lines 714-753
 * Status: approved
 * Feedback: "This would be nice in the PPL(H) details page"
 * Target: training/ppl
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-004
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const BeforeAfterStory = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, var(--hq-hover-bg) 0%, var(--hq-background) 100%)' }}>
        <div className="hq-container">
          <div className="hq-section-header">
            <span className="hq-overline">Transformation</span>
            <h2 className="hq-section-title">From Dream to Reality</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--hq-hover-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <i className="fas fa-user" style={{ fontSize: '2rem', color: 'var(--hq-muted)' }}></i>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--hq-muted)' }}>Before</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--hq-body)', lineHeight: 1.7 }}>"I always dreamed of flying but thought it was impossible. Too expensive, too complicated, not for people like me."</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-arrow-right" style={{ fontSize: '1.5rem', color: 'var(--hq-accent)' }}></i>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>4 MONTHS</span>
            </div>
            <div style={{ background: 'var(--hq-primary)', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: '#fff' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <i className="fas fa-helicopter" style={{ fontSize: '2rem', color: 'var(--hq-accent)' }}></i>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--hq-accent)' }}>After</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: 1.7 }}>"Now I'm a licensed pilot with my own R44. HQ made it achievable. The freedom is indescribable."</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="#" className="hq-btn hq-btn--primary">Start Your Journey</a>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="This would be nice in the PPL(H) details page"
        />
      )}
    </>
  );
};

export default BeforeAfterStory;
