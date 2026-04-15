import { Link } from 'react-router-dom';

function PartsEnquiry() {
  return (
    <div className="parts-enquiry">
      <div className="parts-enquiry__inner">
        <div className="parts-enquiry__header">
          <span className="parts-enquiry__pre">Robinson Parts Specialists</span>
          <h3 className="parts-enquiry__title">Part Sales</h3>
          <p className="parts-enquiry__desc">
            £500K+ genuine Robinson parts inventory with same-day dispatch for AOG situations.
            Engine components, airframe parts, consumables, avionics, and accessories.
          </p>
        </div>
        <div className="parts-enquiry__stats">
          {[
            { value: '1,200+', label: 'Engine Parts' },
            { value: '800+', label: 'Airframe Parts' },
            { value: '2,000+', label: 'Consumables' },
            { value: '24/7', label: 'AOG Support' },
          ].map((s, i) => (
            <div key={i} className="parts-enquiry__stat">
              <span className="parts-enquiry__stat-value">{s.value}</span>
              <span className="parts-enquiry__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="parts-enquiry__cta">
          <p className="parts-enquiry__cta-text">
            Need a part? Tell us the aircraft type, part number or description, and urgency.
          </p>
          <div className="parts-enquiry__actions">
            <Link to="/contact?subject=parts" className="parts-enquiry__btn">
              Send Parts Enquiry
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="tel:+441234567890" className="parts-enquiry__phone">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              Call Parts Desk
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .parts-enquiry {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          border: 1px solid #e8e6e2;
          background: #fff;
        }
        .parts-enquiry__inner {
          padding: 2rem;
        }
        .parts-enquiry__pre {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 0.5rem;
        }
        .parts-enquiry__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin: 0 0 0.75rem;
          color: #1a1a1a;
        }
        .parts-enquiry__desc {
          font-size: 0.82rem;
          line-height: 1.7;
          color: #666;
          margin: 0 0 1.5rem;
        }
        .parts-enquiry__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border-top: 1px solid #e8e6e2;
          border-bottom: 1px solid #e8e6e2;
          margin-bottom: 1.5rem;
        }
        .parts-enquiry__stat {
          text-align: center;
          padding: 0.9rem 0.5rem;
          border-right: 1px solid #e8e6e2;
        }
        .parts-enquiry__stat:last-child {
          border-right: none;
        }
        .parts-enquiry__stat-value {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.15rem;
        }
        .parts-enquiry__stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #999;
        }
        .parts-enquiry__cta-text {
          font-size: 0.78rem;
          color: #888;
          line-height: 1.5;
          margin: 0 0 1rem;
        }
        .parts-enquiry__actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .parts-enquiry__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.25rem;
          background: #1a1a1a;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .parts-enquiry__btn:hover {
          background: #333;
        }
        .parts-enquiry__phone {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #1a1a1a;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
          padding-bottom: 0.15rem;
          transition: border-color 0.3s ease;
        }
        .parts-enquiry__phone:hover {
          border-color: #1a1a1a;
        }

        @media (max-width: 600px) {
          .parts-enquiry__stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .parts-enquiry__stat:nth-child(2) {
            border-right: none;
          }
          .parts-enquiry__stat:nth-child(-n+2) {
            border-bottom: 1px solid #e8e6e2;
          }
          .parts-enquiry__actions {
            flex-direction: column;
            align-items: stretch;
          }
          .parts-enquiry__btn {
            justify-content: center;
          }
          .parts-enquiry__phone {
            justify-content: center;
            border-bottom: none;
            padding: 0.5rem 0;
          }
        }
      `}</style>
    </div>
  );
}

export default PartsEnquiry;
