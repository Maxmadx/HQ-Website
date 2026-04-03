import React from 'react';

/**
 * Team Preview - comp-026
 * EXACT conversion from inspiration-2.html lines 810-858
 * Status: needs-work
 * Feedback: "We need to take a team photograph as well - have helicopters lined up and have all the employees in uniform lined up on multiple rows to also showcase how big our workforce is. Then we need the 'Our Team' component but this component is really ugly so we need to make some variations of this that look better"
 * Action Required: Take team photograph with helicopters and uniformed employees
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-026
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const TeamPreview = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'var(--hq-hover-bg)' }}>
        <div className="hq-container">
          <div className="hq-section-header">
            <span className="hq-overline">Our Team</span>
            <h2 className="hq-section-title">Meet the Experts</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', border: '3px solid #fff', boxShadow: 'var(--shadow-light)' }}>
                <img src="/assets/images/team/quentin-smith-world-record-holder-helicopter-aerobatics.webp" alt="Quentin Smith" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Quentin Smith</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>FOUNDER & MD</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', border: '3px solid #fff', boxShadow: 'var(--shadow-light)' }}>
                <img src="/assets/images/team/british-helicopter-team.webp" alt="Mackie Alcantara" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mackie Alcantara</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>CHIEF INSTRUCTOR</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', border: '3px solid #fff', boxShadow: 'var(--shadow-light)', background: 'var(--hq-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-wrench" style={{ fontSize: '2rem', color: 'var(--hq-muted)' }}></i>
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>David Cross</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>CHIEF ENGINEER</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', border: '3px solid #fff', boxShadow: 'var(--shadow-light)', background: 'var(--hq-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-headset" style={{ fontSize: '2rem', color: 'var(--hq-muted)' }}></i>
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Alex & Nicola</h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>OPERATIONS</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="#" className="hq-btn hq-btn--outline">Meet the Full Team</a>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="We need to take a team photograph as well - have helicopters lined up and have all the employees in uniform lined up on multiple rows to also showcase how big our workforce is. Then we need the 'Our Team' component but this component is really ugly so we need to make some variations of this that look better"
        />
      )}
    </>
  );
};

export default TeamPreview;
