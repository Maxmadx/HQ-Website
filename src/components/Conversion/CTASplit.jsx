import React from 'react';

/**
 * CTA Split - comp-013
 * EXACT conversion from inspiration-2.html lines 945-969
 * Status: needs-work
 * Feedback: "The 'Book a Trial Flight' component needs to appear in the discovery flight page. This component is ugly so it needs work but the sentiment is there"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-013
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const CTASplit = ({ showNote = true }) => {
  return (
    <>
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: 'var(--hq-accent)', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: '#fff' }}>
          <i className="fas fa-plane-departure" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', opacity: 0.9 }}></i>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Book a Trial Flight</h3>
          <p style={{ opacity: 0.9, marginBottom: '1.5rem', maxWidth: '300px' }}>Experience helicopter flight firsthand. 30 minutes of pure magic.</p>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>From £299</span>
          <a href="#" className="hq-btn" style={{ background: '#fff', color: 'var(--hq-accent)' }}>Book Now</a>
        </div>
        <div style={{ background: 'var(--hq-primary)', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: '#fff' }}>
          <i className="fas fa-helicopter" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', opacity: 0.9 }}></i>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>View Our Aircraft</h3>
          <p style={{ opacity: 0.7, marginBottom: '1.5rem', maxWidth: '300px' }}>Explore our range of new and pre-owned Robinson helicopters.</p>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', opacity: 0.5, marginBottom: '1.5rem' }}>R22 • R44 • R66 • R88</span>
          <a href="#" className="hq-btn hq-btn--ghost">Browse Fleet</a>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="The 'Book a Trial Flight' component needs to appear in the discovery flight page. This component is ugly so it needs work but the sentiment is there"
        />
      )}
    </>
  );
};

export default CTASplit;
