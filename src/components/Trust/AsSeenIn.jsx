import React from 'react';

/**
 * As Seen In - comp-015
 * EXACT conversion from inspiration-2.html lines 340-360
 * Status: approved
 */

const ComponentNote = ({ status, feedback }) => {
  if (!feedback) return null;

  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-015
      </div>
      <p className="component-note__text">{feedback}</p>
    </div>
  );
};

const AsSeenIn = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '3rem 2rem', background: 'var(--hq-hover-bg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span className="hq-overline">Featured In</span>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4rem', marginTop: '1.5rem', flexWrap: 'wrap', opacity: 0.5 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700 }}>BBC</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase' }}>Top Gear</span>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontStyle: 'italic' }}>The Times</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', fontWeight: 600 }}>FLYER</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' }}>Pilot Magazine</span>
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

export default AsSeenIn;
