import React from 'react';

/**
 * Testimonial Slider - comp-009
 * EXACT conversion from inspiration-2.html lines 395-446
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  if (!feedback) return null;

  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-009
      </div>
      <p className="component-note__text">{feedback}</p>
    </div>
  );
};

const TestimonialSlider = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'var(--hq-background)' }}>
        <div className="hq-container">
          <div className="hq-section-header">
            <span className="hq-overline">Testimonials</span>
            <h2 className="hq-section-title">What Our Clients Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-light)' }}>
              <div style={{ color: '#fbbf24', marginBottom: '1rem' }}>★★★★★</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--hq-body)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>"Outstanding training school. The instructors are patient and professional. Couldn't recommend more highly."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--hq-hover-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>ST</div>
                <div>
                  <span style={{ fontWeight: 600, display: 'block' }}>Sarah T.</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--hq-subtle)' }}>PPL Student</span>
                </div>
              </div>
            </div>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-light)' }}>
              <div style={{ color: '#fbbf24', marginBottom: '1rem' }}>★★★★★</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--hq-body)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>"Made buying my first helicopter an absolute pleasure. Transparent pricing, no pressure, and excellent aftercare."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--hq-hover-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>DK</div>
                <div>
                  <span style={{ fontWeight: 600, display: 'block' }}>David K.</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--hq-subtle)' }}>R66 Owner</span>
                </div>
              </div>
            </div>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-light)' }}>
              <div style={{ color: '#fbbf24', marginBottom: '1rem' }}>★★★★★</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--hq-body)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>"The Alps expedition was life-changing. Captain Q and the team created an unforgettable experience."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--hq-hover-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>JH</div>
                <div>
                  <span style={{ fontWeight: 600, display: 'block' }}>James H.</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--hq-subtle)' }}>Expedition Participant</span>
                </div>
              </div>
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

export default TestimonialSlider;
