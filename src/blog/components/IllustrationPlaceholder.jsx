/**
 * IllustrationPlaceholder - Placeholder card for future illustrations
 * Shows title and description of what graphic should be placed here
 */

function IllustrationPlaceholder({ title, description }) {
  return (
    <div className="illustration-placeholder">
      <div className="illustration-placeholder__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <div className="illustration-placeholder__content">
        <h4 className="illustration-placeholder__title">{title}</h4>
        <p className="illustration-placeholder__description">{description}</p>
      </div>

      <style>{`
        .illustration-placeholder {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px dashed #ced4da;
          border-radius: 8px;
          padding: 2rem;
          margin: 2rem 0;
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .illustration-placeholder__icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          background: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .illustration-placeholder__icon svg {
          width: 24px;
          height: 24px;
          color: #868e96;
        }

        .illustration-placeholder__content {
          flex: 1;
        }

        .illustration-placeholder__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #495057;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .illustration-placeholder__description {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default IllustrationPlaceholder;
