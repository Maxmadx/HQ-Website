import React from 'react';

/**
 * Why Choose Us - comp-006
 * EXACT conversion from inspiration-2.html lines 619-679
 * Status: needs-work
 * Feedback: "Not a pretty component but 'Why Choose Us' could be a valuable component"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-006
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const WhyChooseUs = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem' }}>
        <div className="hq-container">
          <div className="hq-section-header">
            <span className="hq-overline">The HQ Difference</span>
            <h2 className="hq-section-title">Why Choose Us?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--hq-hover-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <i className="fas fa-history" style={{ fontSize: '1.5rem', color: 'var(--hq-accent)' }}></i>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>30+ Years Experience</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--hq-body)', lineHeight: 1.7 }}>Three decades as the UK's leading Robinson helicopter specialist. We've seen it all.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--hq-hover-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <i className="fas fa-certificate" style={{ fontSize: '1.5rem', color: 'var(--hq-accent)' }}></i>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Factory Authorized</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--hq-body)', lineHeight: 1.7 }}>Official Robinson dealer with factory-trained engineers. Genuine parts, guaranteed quality.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--hq-hover-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <i className="fas fa-users" style={{ fontSize: '1.5rem', color: 'var(--hq-accent)' }}></i>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Family Business</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--hq-body)', lineHeight: 1.7 }}>A family business that treats you like family. Personal service, lasting relationships.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--hq-hover-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <i className="fas fa-tools" style={{ fontSize: '1.5rem', color: 'var(--hq-accent)' }}></i>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>One-Stop Shop</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--hq-body)', lineHeight: 1.7 }}>Sales, training, maintenance, parts, and management. Everything helicopter under one roof.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--hq-hover-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <i className="fas fa-globe-europe" style={{ fontSize: '1.5rem', color: 'var(--hq-accent)' }}></i>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>World Record Holders</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--hq-body)', lineHeight: 1.7 }}>Led by Captain Q with 7 world records. Learn from the very best in the industry.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--hq-hover-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <i className="fas fa-map-marker-alt" style={{ fontSize: '1.5rem', color: 'var(--hq-accent)' }}></i>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Prime Location</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--hq-body)', lineHeight: 1.7 }}>20 minutes from Central London at Denham Aerodrome. Easy access, free parking.</p>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="Not a pretty component but 'Why Choose Us' could be a valuable component"
        />
      )}
    </>
  );
};

export default WhyChooseUs;
