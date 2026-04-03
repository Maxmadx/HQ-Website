import React from 'react';

/**
 * Helicopter vs Fixed Wing - comp-102
 * EXACT conversion from inspiration-2.html lines 4894-4932
 * Status: approved
 * Feedback: "I like it but not sure where we would put it. Don't make any omissions from the provided list"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-102
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const HelicopterVsFixedWing = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div className="hq-container" style={{ maxWidth: '800px' }}>
          <div className="hq-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="hq-overline hq-overline--accent">Why Helicopters?</span>
            <h2 className="hq-section-title">The Rotary Advantage</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ background: 'var(--hq-accent)', borderRadius: '12px', padding: '2rem', color: '#fff' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>🚁 Helicopters</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                <li style={{ padding: '0.5rem 0', display: 'flex', gap: '0.5rem' }}><span>✓</span> Land anywhere</li>
                <li style={{ padding: '0.5rem 0', display: 'flex', gap: '0.5rem' }}><span>✓</span> Hover capability</li>
                <li style={{ padding: '0.5rem 0', display: 'flex', gap: '0.5rem' }}><span>✓</span> No runway required</li>
                <li style={{ padding: '0.5rem 0', display: 'flex', gap: '0.5rem' }}><span>✓</span> Door-to-door travel</li>
                <li style={{ padding: '0.5rem 0', display: 'flex', gap: '0.5rem' }}><span>✓</span> Unique skill set</li>
              </ul>
            </div>
            <div style={{ background: 'var(--hq-background)', borderRadius: '12px', padding: '2rem' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--hq-muted)' }}>✈️ Fixed Wing</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: 'var(--hq-muted)' }}>
                <li style={{ padding: '0.5rem 0', display: 'flex', gap: '0.5rem' }}><span>•</span> Runway dependent</li>
                <li style={{ padding: '0.5rem 0', display: 'flex', gap: '0.5rem' }}><span>•</span> Higher cruise speed</li>
                <li style={{ padding: '0.5rem 0', display: 'flex', gap: '0.5rem' }}><span>•</span> Lower operating costs</li>
                <li style={{ padding: '0.5rem 0', display: 'flex', gap: '0.5rem' }}><span>•</span> Longer range</li>
                <li style={{ padding: '0.5rem 0', display: 'flex', gap: '0.5rem' }}><span>•</span> More common license</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="I like it but not sure where we would put it. Don't make any omissions from the provided list"
        />
      )}
    </>
  );
};

export default HelicopterVsFixedWing;
