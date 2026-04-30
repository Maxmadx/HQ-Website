import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import FinalDraftHeader from '../components/FinalDraftHeader';
import FooterMinimal from '../components/FooterMinimal';
import { db } from '../lib/firebase';

const CSS = `
  .mid-page {
    font-family: 'Space Grotesk', -apple-system, sans-serif;
    background: #fff;
    color: #1a1a1a;
    -webkit-font-smoothing: antialiased;
  }
  .mid-wrapper {
    display: flex;
    min-height: 100vh;
    padding-top: 60px;
  }
  .mid-left {
    flex: 1;
    position: sticky;
    top: 60px;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    border-right: 1px solid #eee;
    margin: 45px;
  }
  .mid-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #888;
    text-decoration: none;
    font-size: 0.75rem;
    padding: 20px 30px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
    font-family: 'Share Tech Mono', monospace;
  }
  .mid-back:hover { color: #1a1a1a; }
  .mid-image-section { flex: 1; display: flex; flex-direction: column; }
  .mid-main-image {
    flex: 0 0 auto;
    height: 45vh;
    overflow: hidden;
    margin: 0 30px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
  }
  .mid-carousel { position: relative; width: 100%; height: 100%; }
  .mid-slide {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    opacity: 0; transition: opacity 0.4s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .mid-slide--active { opacity: 1; z-index: 1; }
  .mid-slide img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .mid-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 10; width: 36px; height: 36px;
    background: rgba(255,255,255,0.95); border: none; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s, transform 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .mid-main-image:hover .mid-arrow { opacity: 1; }
  .mid-arrow:hover { transform: translateY(-50%) scale(1.1); }
  .mid-arrow svg { width: 18px; height: 18px; stroke: #333; stroke-width: 2; fill: none; }
  .mid-arrow--prev { left: 12px; }
  .mid-arrow--next { right: 12px; }
  .mid-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
  }
  .mid-thumbs {
    display: flex; justify-content: center; gap: 8px; padding: 16px 30px;
  }
  .mid-thumb {
    width: 65px; height: 45px; overflow: hidden;
    cursor: pointer; opacity: 0.4; transition: all 0.2s;
    border: 2px solid transparent; background: none; padding: 0;
  }
  .mid-thumb:hover, .mid-thumb--active { opacity: 1; border-color: #1a1a1a; }
  .mid-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .mid-right {
    flex: 1; overflow-y: auto; padding: 45px 45px 80px; margin: 45px;
  }
  .mid-eyebrow {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; text-transform: uppercase;
    letter-spacing: 0.15em; color: #999; display: block; margin-bottom: 8px;
  }
  .mid-name {
    font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700;
    letter-spacing: -0.5px; margin: 0 0 12px; text-transform: uppercase;
  }
  .mid-condition {
    display: inline-flex; align-items: center;
    padding: 4px 12px; font-size: 0.6rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em;
    font-family: 'Share Tech Mono', monospace; border-radius: 3px; margin-bottom: 20px;
  }
  .mid-condition--new { background: #f0fdf4; color: #166534; }
  .mid-condition--used { background: #fef3c7; color: #92400e; }
  .mid-description {
    font-size: 0.9rem; line-height: 1.8; color: #555;
    margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #eee;
  }
  .mid-section-title {
    font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.15em; color: #999; margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
    font-family: 'Share Tech Mono', monospace;
  }
  .mid-section-title::after { content: ''; flex: 1; height: 1px; background: #eee; }
  .mid-price {
    font-family: 'Share Tech Mono', monospace; font-size: 2rem;
    font-weight: 700; margin-bottom: 24px;
  }
  .mid-poa-label {
    font-family: 'Share Tech Mono', monospace; font-size: 1.4rem;
    color: #888; margin-bottom: 24px;
  }
  .mid-qty {
    display: flex; align-items: center; gap: 0; margin-bottom: 20px;
  }
  .mid-qty__label {
    font-size: 0.75rem; color: #666; margin-right: 12px;
    font-family: 'Share Tech Mono', monospace;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .mid-qty__btn {
    width: 36px; height: 36px;
    border: 1px solid #e8e6e2; background: #fff; cursor: pointer;
    font-size: 1.1rem; color: #1a1a1a;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .mid-qty__btn:first-of-type { border-radius: 4px 0 0 4px; }
  .mid-qty__btn:last-of-type { border-radius: 0 4px 4px 0; }
  .mid-qty__btn:hover:not(:disabled) { background: #f5f4f0; }
  .mid-qty__btn:disabled { opacity: 0.3; cursor: default; }
  .mid-qty__val {
    width: 48px; height: 36px;
    border: 1px solid #e8e6e2; border-left: none; border-right: none;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; font-weight: 700;
  }
  .mid-buy-btn {
    display: block; width: 100%; padding: 14px 24px;
    background: #1a1a1a; color: #fff; border: none; border-radius: 4px;
    font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em;
    cursor: pointer; transition: background 0.2s;
  }
  .mid-buy-btn:hover { background: #333; }
  .mid-enquiry-form { display: flex; flex-direction: column; gap: 14px; }
  .mid-field-label {
    display: block; font-size: 0.72rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em; color: #555; margin-bottom: 4px;
  }
  .mid-field-input {
    width: 100%; padding: 10px 14px;
    border: 1px solid #e8e6e2; border-radius: 4px;
    font-size: 0.9rem; font-family: 'Space Grotesk', sans-serif;
    color: #1a1a1a; box-sizing: border-box; transition: border-color 0.15s;
  }
  .mid-field-input:focus { outline: none; border-color: #1a1a1a; }
  .mid-field-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
  .mid-submit-btn {
    padding: 12px 24px; background: #1a1a1a; color: #fff;
    border: none; border-radius: 4px;
    font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; transition: background 0.2s; align-self: flex-start;
  }
  .mid-submit-btn:hover:not(:disabled) { background: #333; }
  .mid-submit-btn:disabled { opacity: 0.5; cursor: default; }
  .mid-success {
    padding: 20px; background: #f0fdf4;
    border: 1px solid #bbf7d0; border-radius: 6px;
    font-size: 0.9rem; color: #166534; line-height: 1.6;
  }
  .mid-error {
    padding: 12px; background: #fef2f2;
    border: 1px solid #fecaca; border-radius: 6px;
    font-size: 0.85rem; color: #991b1b;
  }
  .mid-not-found {
    padding: 80px 40px; text-align: center;
    font-family: 'Space Grotesk', sans-serif;
  }
  @media (max-width: 768px) {
    .mid-wrapper { flex-direction: column; }
    .mid-left {
      width: 100%; max-width: 100%;
      position: relative; top: auto;
      height: auto; border-right: none; border-bottom: 1px solid #eee;
    }
    .mid-main-image { height: 50vw; min-height: 200px; margin: 0; }
    .mid-right { padding: 30px 24px 60px; }
  }
`;

export default function MiscItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Gallery
  const [activeSlide, setActiveSlide] = useState(0);

  // Qty selector
  const [qty, setQty] = useState(1);

  // Enquiry form
  const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');

  useEffect(() => {
    getDoc(doc(db, 'misc_items', id)).then((snap) => {
      if (snap.exists()) {
        setItem({ id: snap.id, ...snap.data() });
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [id]);

  const images = item?.images || [];

  function prevSlide() {
    setActiveSlide((i) => (i - 1 + images.length) % images.length);
  }
  function nextSlide() {
    setActiveSlide((i) => (i + 1) % images.length);
  }

  function handleBuyNow() {
    navigate(
      `/checkout?type=misc` +
      `&itemId=${id}` +
      `&itemName=${encodeURIComponent(item.name)}` +
      `&price=${(item.price / 100).toFixed(2)}` +
      `&qty=${qty}` +
      (item.requiresShipping ? `&requiresShipping=1` : '')
    );
  }

  async function handleEnquirySubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setEnquiryError('');
    try {
      const res = await fetch('/api/misc-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          message: enquiry.message,
          itemId: id,
          itemName: item.name,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }
      setSubmitted(true);
    } catch (err) {
      setEnquiryError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <FinalDraftHeader />
        <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", color: '#888' }}>
          Loading…
        </div>
      </>
    );
  }

  if (notFound || !item) {
    return (
      <>
        <style>{CSS}</style>
        <FinalDraftHeader />
        <div className="mid-not-found">
          <p style={{ color: '#888', marginBottom: '16px' }}>Item not found.</p>
          <Link to="/misc" style={{ color: '#1a1a1a', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ← Back to Miscellaneous
          </Link>
        </div>
        <FooterMinimal />
      </>
    );
  }

  const isFixed = item.priceType === 'fixed';
  const stock = item.stock || 1;

  return (
    <>
      <style>{CSS}</style>
      <div className="mid-page">
        <FinalDraftHeader />
        <div className="mid-wrapper">

          {/* ── LEFT: Gallery ── */}
          <div className="mid-left">
            <Link to="/misc" className="mid-back">← Back to Miscellaneous</Link>

            <div className="mid-image-section">
              <div className="mid-main-image">
                {images.length > 0 ? (
                  <div className="mid-carousel">
                    {images.map((img, i) => (
                      <div key={i} className={`mid-slide ${i === activeSlide ? 'mid-slide--active' : ''}`}>
                        <img src={img.url} alt={img.alt || item.name} />
                      </div>
                    ))}
                    {images.length > 1 && (
                      <>
                        <button className="mid-arrow mid-arrow--prev" onClick={prevSlide} aria-label="Previous image">
                          <svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6" /></svg>
                        </button>
                        <button className="mid-arrow mid-arrow--next" onClick={nextSlide} aria-label="Next image">
                          <svg viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6" /></svg>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mid-placeholder">
                    <i className="fas fa-box" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mid-thumbs">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`mid-thumb ${i === activeSlide ? 'mid-thumb--active' : ''}`}
                      onClick={() => setActiveSlide(i)}
                      aria-label={`Image ${i + 1}`}
                    >
                      <img src={img.url} alt={img.alt || `${item.name} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="mid-right">
            {item.category && <span className="mid-eyebrow">{item.category}</span>}
            <h1 className="mid-name">{item.name}</h1>
            <span className={`mid-condition mid-condition--${item.condition || 'new'}`}>
              {item.condition === 'used' ? 'Used' : 'New'}
            </span>

            {item.description && (
              <p className="mid-description">{item.description}</p>
            )}

            {isFixed ? (
              /* ── Fixed price branch ── */
              <>
                <p className="mid-section-title">Purchase</p>
                <p className="mid-price">£{(item.price / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

                {item.hasQuantity && (
                  <div className="mid-qty">
                    <span className="mid-qty__label">Qty</span>
                    <button
                      className="mid-qty__btn"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                    >
                      −
                    </button>
                    <div className="mid-qty__val">{qty}</div>
                    <button
                      className="mid-qty__btn"
                      onClick={() => setQty((q) => Math.min(stock, q + 1))}
                      disabled={qty >= stock}
                    >
                      +
                    </button>
                  </div>
                )}

                <button className="mid-buy-btn" onClick={handleBuyNow}>
                  Buy Now{item.hasQuantity && qty > 1 ? ` £${((item.price / 100) * qty).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                </button>
              </>
            ) : (
              /* ── POA enquiry branch ── */
              <>
                <p className="mid-section-title">Enquire</p>
                <p className="mid-poa-label">Price on Application</p>

                {submitted ? (
                  <div className="mid-success">
                    Thanks. We'll be in touch shortly about the {item.name}.
                  </div>
                ) : (
                  <form className="mid-enquiry-form" onSubmit={handleEnquirySubmit}>
                    <div>
                      <label className="mid-field-label">Name *</label>
                      <input
                        className="mid-field-input"
                        type="text"
                        required
                        placeholder="Your full name"
                        value={enquiry.name}
                        onChange={(e) => setEnquiry((f) => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mid-field-label">Email *</label>
                      <input
                        className="mid-field-input"
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={enquiry.email}
                        onChange={(e) => setEnquiry((f) => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mid-field-label">Phone</label>
                      <input
                        className="mid-field-input"
                        type="tel"
                        placeholder="+44 7700 900000"
                        value={enquiry.phone}
                        onChange={(e) => setEnquiry((f) => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mid-field-label">Message</label>
                      <textarea
                        className="mid-field-input mid-field-textarea"
                        placeholder="Any additional questions…"
                        value={enquiry.message}
                        onChange={(e) => setEnquiry((f) => ({ ...f, message: e.target.value }))}
                      />
                    </div>
                    {enquiryError && <div className="mid-error">{enquiryError}</div>}
                    <button className="mid-submit-btn" type="submit" disabled={submitting}>
                      {submitting ? 'Sending…' : 'Send Enquiry'}
                    </button>
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
