import React from 'react';

/**
 * World Record Timeline - comp-032
 * EXACT conversion from inspiration-2.html lines 1811-1853
 * Status: approved
 * Feedback: "This timeline will be great to have"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-032
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const WorldRecordTimeline = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: 'var(--hq-primary)' }}>
        <div className="hq-container">
          <div className="hq-section-header" style={{ marginBottom: '3rem' }}>
            <span className="hq-overline" style={{ color: 'var(--hq-accent)' }}>Captain Q's Legacy</span>
            <h2 className="hq-section-title" style={{ color: '#fff' }}>Historic Achievements</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--hq-accent)', minWidth: '60px' }}>1998</div>
              <div style={{ flex: 1, paddingBottom: '2rem', borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-8px', top: 0, width: '14px', height: '14px', borderRadius: '50%', background: 'var(--hq-accent)' }}></div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Around the World by Helicopter</h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>First circumnavigation of the globe in a Robinson R44, covering 35,000 miles across 26 countries.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--hq-accent)', minWidth: '60px' }}>2005</div>
              <div style={{ flex: 1, paddingBottom: '2rem', borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-8px', top: 0, width: '14px', height: '14px', borderRadius: '50%', background: 'var(--hq-accent)' }}></div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>North Pole Landing</h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>Historic first helicopter landing at the Geographic North Pole in a Robinson R44.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--hq-accent)', minWidth: '60px' }}>2013</div>
              <div style={{ flex: 1, paddingBottom: 0, paddingLeft: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-8px', top: 0, width: '14px', height: '14px', borderRadius: '50%', background: 'var(--hq-accent)' }}></div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>South Pole Expedition</h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>Completed journey to the Geographic South Pole, becoming first to reach both poles by helicopter.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="This timeline will be great to have"
        />
      )}
    </>
  );
};

export default WorldRecordTimeline;
