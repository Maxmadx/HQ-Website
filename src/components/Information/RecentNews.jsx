import React from 'react';

/**
 * Recent News - comp-021
 * EXACT conversion from inspiration-2.html lines 1209-1245
 * Status: approved (HIGH PRIORITY)
 * Feedback: "Important page"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-021 (HIGH PRIORITY)
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const RecentNews = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem' }}>
        <div className="hq-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="hq-overline">Latest</span>
              <h2 className="hq-section-title" style={{ textAlign: 'left' }}>News & Updates</h2>
            </div>
            <a href="#" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--hq-accent)', textDecoration: 'none' }}>VIEW ALL →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ height: '180px', background: "url('/assets/images/new-aircraft/r66/blue-r66-palo-verde-front-v4.png') center/contain no-repeat", backgroundColor: 'var(--hq-hover-bg)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}></div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>JAN 2025 • AIRCRAFT</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0.5rem 0' }}>R66 NxG Series Now Available</h3>
            </a>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ height: '180px', background: "url('/assets/images/expeditions/helicopter-expeditions-quentin-smith.webp') center/cover", borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}></div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>DEC 2024 • EXPEDITION</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0.5rem 0' }}>Alps Expedition 2025 Dates Announced</h3>
            </a>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ height: '180px', background: "url('/assets/images/team/british-helicopter-team.webp') center/cover", borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}></div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>DEC 2024 • TRAINING</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0.5rem 0' }}>New Instructor Joins the Team</h3>
            </a>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="Important page"
        />
      )}
    </>
  );
};

export default RecentNews;
