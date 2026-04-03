import React from 'react';

/**
 * FAQ Accordion - comp-011
 * EXACT conversion from inspiration-2.html lines 1128-1173
 * Status: needs-work
 * Feedback: "We've got to include common questions but they have to be specific to where you have navigated to. This UI is not very good though - I prefer one that I had developed. When it comes to it just ask me or add a note for me to give you the details about the UI I like"
 * Note: ASK USER for preferred UI design details
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - comp-011
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const FAQAccordion = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="hq-section-header">
            <span className="hq-overline">FAQ</span>
            <h2 className="hq-section-title">Common Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-light)' }}>
              <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}>
                <span>How long does it take to get a helicopter license?</span>
                <i className="fas fa-plus" style={{ color: 'var(--hq-accent)' }}></i>
              </div>
              <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--hq-body)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Most students complete their PPL(H) in 3-6 months, training 1-2 times per week. Intensive courses are available for faster completion. The minimum requirement is 45 flight hours.
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-light)' }}>
              <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}>
                <span>Do I need any prior experience to start?</span>
                <i className="fas fa-plus" style={{ color: 'var(--hq-accent)' }}></i>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-light)' }}>
              <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}>
                <span>What's included in a trial flight?</span>
                <i className="fas fa-plus" style={{ color: 'var(--hq-accent)' }}></i>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-light)' }}>
              <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}>
                <span>How much does a helicopter cost to buy?</span>
                <i className="fas fa-plus" style={{ color: 'var(--hq-accent)' }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="needs-work"
          feedback="We've got to include common questions but they have to be specific to where you have navigated to. This UI is not very good though - I prefer one that I had developed. When it comes to it just ask me or add a note for me to give you the details about the UI I like"
        />
      )}
    </>
  );
};

export default FAQAccordion;
