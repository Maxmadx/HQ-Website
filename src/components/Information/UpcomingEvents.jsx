import React from 'react';

/**
 * Upcoming Events - comp-025
 * EXACT conversion from inspiration-2.html lines 1247-1289
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-025
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const UpcomingEvents = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'var(--hq-hover-bg)' }}>
        <div className="hq-container">
          <div className="hq-section-header">
            <span className="hq-overline">Calendar</span>
            <h2 className="hq-section-title">Upcoming Events</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-light)' }}>
              <div style={{ textAlign: 'center', minWidth: '60px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, display: 'block' }}>15</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>FEB</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-accent)' }}>OPEN DAY</span>
                <h3 style={{ fontWeight: 600, margin: '0.25rem 0' }}>Spring Open Day</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--hq-body)', margin: 0 }}>10am - 4pm • Free Entry</p>
              </div>
              <a href="#" className="hq-btn hq-btn--outline">Register</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-light)' }}>
              <div style={{ textAlign: 'center', minWidth: '60px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, display: 'block' }}>01</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-subtle)' }}>MAR</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--hq-accent)' }}>EXPEDITION</span>
                <h3 style={{ fontWeight: 600, margin: '0.25rem 0' }}>Alps Adventure 2025</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--hq-body)', margin: 0 }}>7 days • Limited to 6 aircraft</p>
              </div>
              <a href="#" className="hq-btn hq-btn--accent">Book</a>
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

export default UpcomingEvents;
