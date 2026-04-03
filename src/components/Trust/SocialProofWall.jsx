import React from 'react';

/**
 * Social Proof Wall - comp-012
 * EXACT conversion from inspiration-2.html lines 482-509
 * Status: needs-work
 * Feedback: "We should have a 'Join Our Community' section with the Instagram, Facebook and YouTube socials"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-012
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const SocialProofWall = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem' }}>
        <div className="hq-container">
          <div className="hq-section-header">
            <span className="hq-overline">@hqaviation</span>
            <h2 className="hq-section-title">Join Our Community</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
            <div style={{ aspectRatio: '1', background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fab fa-instagram" style={{ fontSize: '2rem', color: 'var(--hq-muted)' }}></i></div>
            <div style={{ aspectRatio: '1', background: "url('/assets/images/facility/busy-hangar.jpg') center/cover" }}></div>
            <div style={{ aspectRatio: '1', background: "url('/assets/images/team/british-helicopter-team.webp') center/cover" }}></div>
            <div style={{ aspectRatio: '1', background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fab fa-instagram" style={{ fontSize: '2rem', color: 'var(--hq-muted)' }}></i></div>
            <div style={{ aspectRatio: '1', background: "url('/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp') center/cover" }}></div>
            <div style={{ aspectRatio: '1', background: "url('/assets/images/expeditions/north-pole.jpg') center/cover" }}></div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="#" className="hq-btn hq-btn--outline"><i className="fab fa-instagram" style={{ marginRight: '0.5rem' }}></i>Follow @hqaviation</a>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="We should have a 'Join Our Community' section with the Instagram, Facebook and YouTube socials"
        />
      )}
    </>
  );
};

export default SocialProofWall;
