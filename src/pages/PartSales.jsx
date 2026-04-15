/**
 * PART SALES PAGE
 * Standalone page for Robinson helicopter parts ordering
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

import '../assets/css/main.css';
import '../assets/css/components.css';

import FooterMinimal from '../components/FooterMinimal';

function PartSales() {
  const [partsAircraft, setPartsAircraft] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [partsDesc, setPartsDesc] = useState('');
  const [partsEmail, setPartsEmail] = useState('');
  const [partsInfo, setPartsInfo] = useState('');
  const [partsSubmitting, setPartsSubmitting] = useState(false);
  const [partsSubmitted, setPartsSubmitted] = useState(false);
  const [partsError, setPartsError] = useState(null);

  async function handlePartsSubmit(e) {
    e.preventDefault();
    setPartsSubmitting(true);
    setPartsError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: partsEmail, // email used as identifier since no name field
          email: partsEmail,
          subject: partsAircraft ? `Parts Enquiry — ${partsAircraft}` : 'Parts Enquiry',
          message: [partsDesc && `Part: ${partsDesc}`, partsInfo && `Info: ${partsInfo}`].filter(Boolean).join('\n'),
          source: 'parts-enquiry',
        }),
      });
      if (!res.ok) throw new Error('server');
      setPartsSubmitted(true);
    } catch {
      setPartsError('Failed to send. Please try again.');
    } finally {
      setPartsSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        .ps-page {
          min-height: 100vh;
          background: #faf9f6;
          font-family: 'Space Grotesk', sans-serif;
        }

        /* Header */
        .ps-header {
          background: #1a1a1a;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ps-header__logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: #faf9f6;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .ps-header__back {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: #999;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: color 0.2s;
        }
        .ps-header__back:hover { color: #fff; }

        /* Hero */
        .ps-hero {
          padding: 7rem 2rem 3rem;
          text-align: center;
          border-bottom: 1px solid #e8e6e2;
        }
        .ps-hero__pre {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #999;
          display: block;
          margin-bottom: 0.75rem;
        }
        .ps-hero__title {
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0 0 1rem;
          letter-spacing: -0.01em;
        }
        .ps-hero__desc {
          max-width: 600px;
          margin: 0 auto;
          font-size: 0.95rem;
          color: #555;
          line-height: 1.8;
        }

        /* Main content */
        .ps-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          align-items: start;
        }

        /* Left column */
        .ps-info__title {
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
        }
        .ps-info__text {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .ps-info__stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .ps-info__stat {
          background: #eae8e4;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 8px;
          padding: 1.25rem;
          text-align: center;
        }
        .ps-info__stat-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          display: block;
        }
        .ps-info__stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
        }

        /* Service card */
        .ps-service-card {
          background: #eae8e4;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
        }
        .ps-service-card__pre {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
          display: block;
          margin-bottom: 0.5rem;
        }
        .ps-service-card__title {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0 0 0.75rem;
        }
        .ps-service-card__desc {
          font-size: 0.82rem;
          color: #666;
          line-height: 1.6;
          margin: 0 0 1rem;
        }
        .ps-service-card__placeholder {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #999;
          border: 1px dashed #d1d5db;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          display: inline-block;
        }

        /* Right column - form */
        .ps-form {
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .ps-form__title {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.35rem;
        }
        .ps-form__subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #999;
          display: block;
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .ps-form__field {
          margin-bottom: 1.25rem;
        }
        .ps-form__field:last-of-type {
          margin-bottom: 1.75rem;
        }
        .ps-form__field label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.4rem;
        }
        .ps-form__input {
          width: 100%;
          padding: 0.6rem 0.75rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          color: #1a1a1a;
          background: #faf9f6;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .ps-form__input:focus {
          outline: none;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
        }
        .ps-form__input::placeholder { color: #bbb; }
        .ps-form__aircraft-btns {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .ps-form__aircraft-btn {
          padding: 0.4rem 0.85rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          border: 1px solid #e8e6e2;
          border-radius: 4px;
          background: #faf9f6;
          color: #777;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .ps-form__aircraft-btn:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }
        .ps-form__aircraft-btn--active {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }
        .ps-form__aircraft-btn--active:hover {
          background: #333;
          border-color: #333;
          color: #fff;
        }
        .ps-form__submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #fff;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .ps-form__submit:hover { background: #333; }
        .ps-form__submit span {
          font-size: 0.9rem;
          transition: transform 0.2s;
        }
        .ps-form__submit:hover span {
          transform: translateX(3px);
        }

        /* Auth card */
        .ps-auth-card {
          background: #fff;
          border: 1px solid #e8e6e2;
          border-radius: 8px;
          padding: 2.5rem 2rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .ps-auth-card__icon {
          margin-bottom: 1.25rem;
        }
        .ps-auth-card__title {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #1a1a1a;
          margin: 0 0 0.75rem;
        }
        .ps-auth-card__desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.6;
          margin: 0 0 1.5rem;
        }
        .ps-auth-card__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 2rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #fff;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 1.25rem;
        }
        .ps-auth-card__btn:hover { background: #333; }
        .ps-auth-card__btn span { font-size: 0.9rem; transition: transform 0.2s; }
        .ps-auth-card__btn:hover span { transform: translateX(3px); }
        .ps-auth-card__request {
          display: block;
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ps-auth-card__request:hover { border-color: #1a1a1a; color: #1a1a1a; }

        /* Signed-in bar */
        .ps-form__signed-in {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e8e6e2;
        }
        .ps-form__signed-in-badge {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #16a34a;
          background: #dcfce7;
          padding: 0.25rem 0.6rem;
          border-radius: 2px;
          border: 1px solid #86efac;
        }
        .ps-form__sign-out {
          background: none;
          border: none;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.65rem;
          color: #999;
          cursor: pointer;
          text-decoration: underline;
        }
        .ps-form__sign-out:hover { color: #555; }

        @media (max-width: 768px) {
          .ps-main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="ps-page">
        <Header />

        <section className="ps-hero">
          <span className="ps-hero__pre">Robinson Parts Specialists</span>
          <h1 className="ps-hero__title">Part Sales</h1>
          <p className="ps-hero__desc">
            As one of the biggest Robinson service centres in Europe, we have a constant influx of parts
            and excellent relations with the Robinson factory. Our £500K+ parts inventory
            spans engine components, airframe parts, consumables, avionics, and accessories — with same-day
            dispatch available for AOG situations.
          </p>
        </section>

        <div className="ps-main">
          <div className="ps-info">
            <h2 className="ps-info__title">Why Order From HQ?</h2>
            <p className="ps-info__text">
              Our established relationships with specialist freight forwarders mean that whether a part is on the
              shelf at HQ or shipping direct from the Robinson factory, it won't be sitting in a loading bay for long.
              We hold one of the largest Robinson parts inventories in Europe, and our team knows every component
              inside and out.
            </p>

          </div>

          <div>
            {!signedIn ? (
              <div className="ps-auth-card">
                <div className="ps-auth-card__icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5"><path d="M12 2a5 5 0 015 5v3H7V7a5 5 0 015-5zM4 10h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10z"/><circle cx="12" cy="16" r="1.5"/></svg>
                </div>
                <h3 className="ps-auth-card__title">HQ Service Center Account</h3>
                <p className="ps-auth-card__desc">
                  Sign in to your account to request parts, track orders, and access priority AOG dispatch.
                </p>
                <button className="ps-auth-card__btn" onClick={() => setSignedIn(true)}>
                  Sign In <span>→</span>
                </button>
                <button className="ps-auth-card__request" onClick={() => setSignedIn(true)}>
                  Request Access
                </button>
              </div>
            ) : (
              <>
                {partsSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
                    <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Enquiry Received</p>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>We'll be in touch shortly about your parts request.</p>
                  </div>
                ) : (
                  <form className="ps-form" onSubmit={handlePartsSubmit}>
                    <div className="ps-form__signed-in">
                      <span className="ps-form__signed-in-badge">Signed In</span>
                      <button type="button" className="ps-form__sign-out" onClick={() => setSignedIn(false)}>Sign Out</button>
                    </div>
                    <h3 className="ps-form__title">Request Parts</h3>
                    <span className="ps-form__subtitle">Fill in the details and we'll get back to you</span>

                    <div className="ps-form__field">
                      <label>Aircraft Type</label>
                      <div className="ps-form__aircraft-btns">
                        {['R22', 'R44', 'R66', 'N/A'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`ps-form__aircraft-btn ${partsAircraft === type ? 'ps-form__aircraft-btn--active' : ''}`}
                            onClick={() => setPartsAircraft(partsAircraft === type ? '' : type)}
                          >{type}</button>
                        ))}
                      </div>
                    </div>

                    <div className="ps-form__field">
                      <label htmlFor="ps-desc">Part Description</label>
                      <input id="ps-desc" type="text" className="ps-form__input" placeholder="Part number or description" value={partsDesc} onChange={(e) => setPartsDesc(e.target.value)} />
                    </div>

                    <div className="ps-form__field">
                      <label htmlFor="ps-email">Email</label>
                      <input id="ps-email" type="email" className="ps-form__input" placeholder="your@email.com" value={partsEmail} onChange={(e) => setPartsEmail(e.target.value)} />
                    </div>

                    <div className="ps-form__field">
                      <label htmlFor="ps-info">Additional Information</label>
                      <textarea id="ps-info" className="ps-form__input" rows="3" placeholder="Any additional details..." value={partsInfo} onChange={(e) => setPartsInfo(e.target.value)} />
                    </div>

                    <button type="submit" className="ps-form__submit" disabled={partsSubmitting}>
                      {partsSubmitting ? 'Sending…' : 'Send Parts Enquiry'} {!partsSubmitting && <span>→</span>}
                    </button>
                    {partsError && <p style={{ marginTop: '0.75rem', color: '#dc2626', fontSize: '0.8rem' }}>{partsError}</p>}
                  </form>
                )}
              </>
            )}
          </div>
        </div>

        <FooterMinimal />
      </div>
    </>
  );
}

export default PartSales;
