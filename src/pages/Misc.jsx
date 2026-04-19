import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../hooks/useFirestore';
import FinalDraftHeader from '../components/FinalDraftHeader';
import FooterMinimal from '../components/FooterMinimal';

const CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  .misc-hero {
    padding: 8rem 2rem 5rem;
    background: #1a1a1a;
  }
  .misc-container {
    max-width: 1100px;
    margin: 0 auto;
  }
  .misc-eyebrow {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #666;
    display: block;
    margin-bottom: 1rem;
  }
  .misc-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 700;
    text-transform: uppercase;
    color: #fff;
    line-height: 1.0;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }
  .misc-subtitle {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    max-width: 480px;
  }
  .misc-catalogue {
    padding: 3.5rem 2rem 6rem;
    background: #faf9f6;
    min-height: 60vh;
  }
  .misc-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2.5rem;
  }
  .misc-filter__pill {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.4rem 1rem;
    border: 1px solid #e8e6e2;
    border-radius: 4px;
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .misc-filter__pill:hover {
    border-color: #1a1a1a;
    color: #1a1a1a;
  }
  .misc-filter__pill--active {
    background: #1a1a1a;
    color: #fff;
    border-color: #1a1a1a;
  }
  .misc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
  .misc-card {
    background: #fff;
    border: 1px solid #e8e6e2;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  .misc-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: #ccc;
  }
  .misc-card__image {
    aspect-ratio: 4 / 3;
    background: linear-gradient(135deg, #f5f4f0 0%, #eae8e2 100%);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .misc-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    display: block;
  }
  .misc-card:hover .misc-card__image img {
    transform: scale(1.04);
  }
  .misc-card__image-placeholder {
    font-size: 2.5rem;
    color: #ccc;
  }
  .misc-card__body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .misc-card__category {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
    display: block;
    margin-bottom: 0.35rem;
  }
  .misc-card__name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.4rem;
    line-height: 1.3;
  }
  .misc-card__desc {
    font-size: 0.8rem;
    color: #888;
    line-height: 1.5;
    margin: 0 0 0.75rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .misc-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid #e8e6e2;
    margin-bottom: 0.75rem;
    margin-top: auto;
  }
  .misc-card__condition {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 2px 8px;
    border-radius: 3px;
    font-weight: 600;
  }
  .misc-card__condition--new {
    background: #f0fdf4;
    color: #166534;
  }
  .misc-card__condition--used {
    background: #fef3c7;
    color: #92400e;
  }
  .misc-card__price {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.9rem;
    font-weight: 700;
    color: #1a1a1a;
  }
  .misc-card__enquire {
    display: block;
    text-align: center;
    padding: 0.5rem;
    background: #1a1a1a;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.2s ease;
  }
  .misc-card__enquire:hover {
    background: #333;
  }
  .misc-loading {
    color: #888;
    padding: 4rem 0;
    font-size: 0.9rem;
    font-family: 'Space Grotesk', sans-serif;
  }
  .misc-empty {
    text-align: center;
    padding: 5rem 0;
  }
  .misc-empty__text {
    font-family: 'Space Grotesk', sans-serif;
    color: #888;
    font-size: 0.9rem;
  }
  @media (max-width: 1024px) {
    .misc-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .misc-grid { grid-template-columns: 1fr; }
    .misc-hero { padding: 6rem 1.5rem 3.5rem; }
    .misc-catalogue { padding: 2rem 1.5rem 4rem; }
    .misc-container { padding: 0 1.5rem; }
  }
`;

export default function Misc() {
  const { docs: items, loading } = useCollection('misc_items');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(items.map((i) => i.category).filter(Boolean).sort())];
  const filtered = activeCategory === 'All' ? items : items.filter((i) => i.category === activeCategory);

  return (
    <>
      <style>{CSS}</style>
      <FinalDraftHeader />
      <main>
        <section className="misc-hero">
          <div className="misc-container">
            <span className="misc-eyebrow">HQ Aviation</span>
            <h1 className="misc-title">MISCELLANEOUS</h1>
            <p className="misc-subtitle">
              Accessories, apparel, ground equipment, training materials and more — everything beyond the aircraft itself, sourced and stocked by HQ.
            </p>
          </div>
        </section>

        <section className="misc-catalogue">
          <div className="misc-container">
            {loading ? (
              <p className="misc-loading">Loading…</p>
            ) : (
              <>
                {categories.length > 1 && (
                  <div className="misc-filter">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        className={`misc-filter__pill ${activeCategory === cat ? 'misc-filter__pill--active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {filtered.length === 0 ? (
                  <div className="misc-empty">
                    <p className="misc-empty__text">No items in this category yet.</p>
                  </div>
                ) : (
                  <div className="misc-grid">
                    {filtered.map((item) => {
                      const primary = item.images?.find((i) => i.isPrimary) || item.images?.[0];
                      return (
                        <div key={item.id} className="misc-card">
                          <div className="misc-card__image">
                            {primary ? (
                              <img src={primary.url} alt={primary.alt || item.name} />
                            ) : (
                              <div className="misc-card__image-placeholder">
                                <i className="fas fa-box"></i>
                              </div>
                            )}
                          </div>
                          <div className="misc-card__body">
                            <span className="misc-card__category">{item.category}</span>
                            <h3 className="misc-card__name">{item.name}</h3>
                            {item.description && (
                              <p className="misc-card__desc">{item.description}</p>
                            )}
                            <div className="misc-card__footer">
                              <span className={`misc-card__condition misc-card__condition--${item.condition || 'new'}`}>
                                {item.condition === 'used' ? 'Used' : 'New'}
                              </span>
                              <span className="misc-card__price">{item.priceDisplay || 'POA'}</span>
                            </div>
                            <Link to={`/misc/${item.id}`} className="misc-card__enquire">View Details</Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <FooterMinimal />
    </>
  );
}
