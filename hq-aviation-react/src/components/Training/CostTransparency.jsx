import React from 'react';

/**
 * Cost Transparency - showcase-cost-transparency
 * EXACT conversion from live inspiration-2 page
 * Status: approved
 * Feedback: "Pricing page is important"
 */

const ComponentNote = ({ status, feedback }) => {
  return (
    <div className={`component-note component-note--${status}`}>
      <div className="component-note__label">
        {status === 'approved' ? 'Approved' : 'Needs Work'} - showcase-cost-transparency
      </div>
      {feedback && <p className="component-note__text">{feedback}</p>}
    </div>
  );
};

const CostTransparency = ({ showNote = true }) => {
  return (
    <>
      <section style={{ padding: '5rem 2rem', background: 'var(--hq-background)' }}>
        <div className="hq-container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="hq-overline hq-overline--accent">Transparent Pricing</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>What It <em>Really</em> Costs</h2>
            <p style={{ color: 'var(--hq-body)', fontSize: '1.1rem' }}>No hidden fees. No surprises. Here's the full picture for your PPL(H).</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><h4 style={{ margin: '0 0 0.25rem' }}>Flight Training</h4><p style={{ margin: 0, color: 'var(--hq-body)', fontSize: '0.9rem' }}>Minimum 45 hours required. Most students complete in 50-60 hours.</p></div>
              <span style={{ fontWeight: 700, color: 'var(--hq-accent)', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>£16,000 - £20,000</span>
            </div>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><h4 style={{ margin: '0 0 0.25rem' }}>Ground School</h4><p style={{ margin: 0, color: 'var(--hq-body)', fontSize: '0.9rem' }}>Theory training for all 9 exams included in your training package.</p></div>
              <span style={{ fontWeight: 700, color: '#22c55e', fontSize: '1.1rem' }}>Included</span>
            </div>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><h4 style={{ margin: '0 0 0.25rem' }}>Exam Fees</h4><p style={{ margin: 0, color: 'var(--hq-body)', fontSize: '0.9rem' }}>CAA theory exam fees (9 exams) plus skills test fee.</p></div>
              <span style={{ fontWeight: 700, color: 'var(--hq-accent)', fontSize: '1.1rem' }}>£500 - £800</span>
            </div>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><h4 style={{ margin: '0 0 0.25rem' }}>Medical Certificate</h4><p style={{ margin: 0, color: 'var(--hq-body)', fontSize: '0.9rem' }}>Class 2 medical required. Arranged through CAA-approved examiners.</p></div>
              <span style={{ fontWeight: 700, color: 'var(--hq-accent)', fontSize: '1.1rem' }}>£200 - £300</span>
            </div>
            <div style={{ background: 'var(--hq-primary)', color: '#fff', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '1.1rem' }}>Typical Total Investment</span>
              <strong style={{ fontSize: '1.75rem' }}>£17,000 - £22,000</strong>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1.5rem', background: 'rgba(224,74,47,0.05)', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 1rem', color: 'var(--hq-body)' }}><strong>Payment flexibility:</strong> Pay-as-you-fly available. Block booking discounts.</p>
            <a href="#" className="hq-btn hq-btn--outline">Discuss Your Training Plan</a>
          </div>
        </div>
      </section>
      {showNote && (
        <ComponentNote
          status="approved"
          feedback="Pricing page is important"
        />
      )}
    </>
  );
};

export default CostTransparency;
