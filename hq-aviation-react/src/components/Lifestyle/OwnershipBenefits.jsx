import React from 'react';

/**
 * Ownership Benefits - lifestyle-ownership-benefits
 * EXACT conversion from inspiration-2.html lines 1516-1557
 * Status: needs-work
 * Feedback: "I like the idea of having a benefit component. Make a complete list of the benefits - door to door etc."
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - lifestyle-ownership-benefits
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const OwnershipBenefits = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '5rem 2rem', background: '#faf9f6' }}>
        <div className="hq-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="hq-overline hq-overline--accent">Helicopter Ownership</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.1, margin: '0.5rem 0 2rem' }}>More Than Transport.<br />A Way of Life.</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(224,74,47,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className="fas fa-clock" style={{ color: 'var(--hq-accent)' }}></i></div>
                  <div><h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem' }}>Time Freedom</h3><p style={{ color: 'var(--hq-body)', margin: 0, fontSize: '0.9rem' }}>London to Edinburgh in 2.5 hours. Skip check-in queues, security lines, and delays.</p></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(224,74,47,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className="fas fa-map-marker-alt" style={{ color: 'var(--hq-accent)' }}></i></div>
                  <div><h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem' }}>Access Anywhere</h3><p style={{ color: 'var(--hq-body)', margin: 0, fontSize: '0.9rem' }}>Land at 2,000+ airfields across Europe. Remote estates, private helipads, events.</p></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(224,74,47,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className="fas fa-heart" style={{ color: 'var(--hq-accent)' }}></i></div>
                  <div><h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem' }}>Pure Joy</h3><p style={{ color: 'var(--hq-body)', margin: 0, fontSize: '0.9rem' }}>The view from 2,000 feet. The thrill of flight. Some things can't be measured in ROI.</p></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(224,74,47,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className="fas fa-pound-sign" style={{ color: 'var(--hq-accent)' }}></i></div>
                  <div><h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem' }}>Business Asset</h3><p style={{ color: 'var(--hq-body)', margin: 0, fontSize: '0.9rem' }}>Tax-efficient ownership structures. Potential charter revenue. An asset that pays for itself.</p></div>
                </div>
              </div>
              <a href="#" className="hq-btn hq-btn--primary" style={{ marginTop: '2rem' }}>Explore Ownership Options</a>
            </div>
            <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <img src="/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp" alt="Helicopter ownership lifestyle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="I like the idea of having a benefit component. Make a complete list of the benefits - door to door etc."
        />
      )}
    </>
  );
};

export default OwnershipBenefits;
