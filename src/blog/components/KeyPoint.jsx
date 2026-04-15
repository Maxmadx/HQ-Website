/**
 * KeyPoint - Highlighted summary box for key takeaways
 */

function KeyPoint({ title = "Key Takeaways", points }) {
  return (
    <div className="key-point">
      <div className="key-point__header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h4>{title}</h4>
      </div>
      <ul className="key-point__list">
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>

      <style>{`
        .key-point {
          background: #1a1a1a;
          color: #fff;
          border-radius: 8px;
          padding: 1.5rem 2rem;
          margin: 2rem 0;
        }

        .key-point__header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .key-point__header svg {
          width: 20px;
          height: 20px;
          color: #51cf66;
        }

        .key-point__header h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0;
          color: #fff;
        }

        .key-point__list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .key-point__list li {
          position: relative;
          padding-left: 1.25rem;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          line-height: 1.5;
          color: rgba(255,255,255,0.9);
        }

        .key-point__list li:last-child {
          margin-bottom: 0;
        }

        .key-point__list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.5rem;
          width: 6px;
          height: 6px;
          background: #51cf66;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

export default KeyPoint;
