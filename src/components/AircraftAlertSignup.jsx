import { useState } from 'react';

const AIRCRAFT_CATALOGUE = [
  { make: 'Robinson', models: ['R22 Beta I', 'R22 Beta II', 'R22 Mariner', 'R44 Raven I', 'R44 Raven II', 'R44 Cadet', 'R44 Clipper', 'R66 Turbine'] },
  { make: 'Airbus Helicopters', models: ['H125', 'H130', 'H135', 'H145', 'H160', 'AS350 Écureuil'] },
  { make: 'Bell', models: ['206B JetRanger III', '206L LongRanger', '407', '429', '505 Jet Ranger X'] },
  { make: 'Leonardo', models: ['AW109 Power', 'AW109 Trekker', 'AW119 Koala', 'AW139'] },
  { make: 'MD Helicopters', models: ['MD500E', 'MD520N NOTAR', 'MD902 Explorer'] },
  { make: 'Sikorsky', models: ['S-76C', 'S-300C', 'S-92'] },
  { make: 'Enstrom', models: ['280FX Shark', '480B'] },
  { make: 'Guimbal', models: ['Cabri G2'] },
];

const CONDITION_OPTIONS = ['Excellent', 'Good', 'Fair', 'For Parts / Project'];

function formatBudget(raw) {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('en-GB');
}

export default function AircraftAlertSignup() {
  const [intent, setIntent] = useState(null); // 'buy' | 'sell'
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Buyer state
  const [expandedMakes, setExpandedMakes] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [maxHours, setMaxHours] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [budget, setBudget] = useState('');
  const [buyName, setBuyName] = useState('');
  const [buyEmail, setBuyEmail] = useState('');
  const [buyPhone, setBuyPhone] = useState('');
  const [buyNotes, setBuyNotes] = useState('');

  // Seller state
  const [sellMake, setSellMake] = useState('');
  const [sellModel, setSellModel] = useState('');
  const [sellYear, setSellYear] = useState('');
  const [sellHours, setSellHours] = useState('');
  const [sellCondition, setSellCondition] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellReg, setSellReg] = useState('');
  const [sellName, setSellName] = useState('');
  const [sellEmail, setSellEmail] = useState('');
  const [sellPhone, setSellPhone] = useState('');
  const [sellNotes, setSellNotes] = useState('');

  function toggleMake(make) {
    setExpandedMakes(prev =>
      prev.includes(make) ? prev.filter(m => m !== make) : [...prev, make]
    );
  }

  function toggleModel(model) {
    setSelectedModels(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  }

  async function handleBuySubmit(e) {
    e.preventDefault();
    if (!buyEmail) { setError('Email is required'); return; }
    setSubmitting(true);
    setError('');
    try {
      const aircraft = selectedModels.length > 0 ? selectedModels.join(', ') : 'Any / Open';
      const message = [
        'Intent: Looking to BUY',
        `Aircraft of interest: ${aircraft}`,
        `Max total hours: ${maxHours || 'Not specified'}`,
        `Max age: ${maxAge ? maxAge + ' years' : 'Not specified'}`,
        `Budget: ${budget ? '£' + budget : 'Not specified'}`,
        buyNotes ? `Additional requirements: ${buyNotes}` : '',
      ].filter(Boolean).join('\n');
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: buyName,
          email: buyEmail,
          phone: buyPhone,
          subject: 'Aircraft Purchase Enquiry',
          message,
          source: 'used-sales-buy-alert',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSellSubmit(e) {
    e.preventDefault();
    if (!sellEmail) { setError('Email is required'); return; }
    setSubmitting(true);
    setError('');
    try {
      const message = [
        'Intent: Looking to SELL',
        `Aircraft: ${[sellMake, sellModel].filter(Boolean).join(' ') || 'Not specified'}`,
        `Year: ${sellYear || 'Not specified'}`,
        `Total airframe hours: ${sellHours || 'Not specified'}`,
        `Condition: ${sellCondition || 'Not specified'}`,
        `Asking price: ${sellPrice || 'Not specified'}`,
        `Registration / Serial: ${sellReg || 'Not provided'}`,
        sellNotes ? `Additional details: ${sellNotes}` : '',
      ].filter(Boolean).join('\n');
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sellName,
          email: sellEmail,
          phone: sellPhone,
          subject: 'Aircraft Sale Enquiry',
          message,
          source: 'used-sales-sell-alert',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="alert-adv">
          <div className="alert-adv__inner">
            <div className="alert-adv__success">
              <div className="alert-adv__success-icon">✓</div>
              <div className="alert-adv__success-title">We'll Be in Touch</div>
              <p className="alert-adv__success-body">
                Your enquiry has been received. Our sales team will contact you within 24 hours to discuss your requirements in detail.
              </p>
              <div className="alert-adv__contact-fallback">
                <a href="tel:+441895833838">+44 (0) 1895 833 838</a>
                <span>·</span>
                <a href="mailto:sales@hqaviation.com">sales@hqaviation.com</a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="alert-adv">
        <div className="alert-adv__inner">

          {!intent && (
            <div className="alert-adv__intent-col">
              <button className="alert-adv__intent-btn" onClick={() => setIntent('buy')}>
                <span className="alert-adv__intent-icon">→</span>
                <span className="alert-adv__intent-title">I'm Looking to Buy</span>
                <span className="alert-adv__intent-sub">Register your requirements. We'll notify you the moment a match arrives — often before it's publicly listed.</span>
              </button>
              <button className="alert-adv__intent-btn" onClick={() => setIntent('sell')}>
                <span className="alert-adv__intent-icon">↗</span>
                <span className="alert-adv__intent-title">I'm Looking to Sell</span>
                <span className="alert-adv__intent-sub">Reach our qualified buyer network. Discreet, fast, and handled by people who know helicopters.</span>
              </button>
            </div>
          )}

          {/* BUY FORM */}
          {intent === 'buy' && (
            <form className="alert-adv__form" onSubmit={handleBuySubmit}>
              <div className="alert-adv__form-header">
                <span className="alert-adv__form-badge">Buyer Registration</span>
                <button type="button" className="alert-adv__back-btn" onClick={() => setIntent(null)}>← Change</button>
              </div>

              <div className="alert-adv__field-group">
                <label className="alert-adv__field-label">
                  Aircraft of Interest <span className="alert-adv__optional">— expand a manufacturer and select models</span>
                </label>
                <div className="alert-adv__makes-grid">
                  {AIRCRAFT_CATALOGUE.map(({ make, models }) => (
                    <div key={make} className="alert-adv__make-block">
                      <button
                        type="button"
                        className={`alert-adv__make-toggle${expandedMakes.includes(make) ? ' active' : ''}`}
                        onClick={() => toggleMake(make)}
                      >
                        <span>{make}</span>
                        <span className="alert-adv__make-arrow">{expandedMakes.includes(make) ? '−' : '+'}</span>
                      </button>
                      {expandedMakes.includes(make) && (
                        <div className="alert-adv__models-list">
                          {models.map(model => (
                            <label
                              key={model}
                              className={`alert-adv__model-chip${selectedModels.includes(model) ? ' selected' : ''}`}
                            >
                              <input type="checkbox" checked={selectedModels.includes(model)} onChange={() => toggleModel(model)} />
                              <span>{model}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {selectedModels.length > 0 && (
                  <div className="alert-adv__selected-summary">
                    {selectedModels.map(m => (
                      <span key={m} className="alert-adv__selected-tag">
                        {m}
                        <button type="button" onClick={() => toggleModel(m)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="alert-adv__field-row">
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Max Total Hours</label>
                  <input type="number" className="alert-adv__input" placeholder="e.g. 2000" value={maxHours} onChange={e => setMaxHours(e.target.value)} min="0" />
                </div>
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Max Age (years)</label>
                  <input type="number" className="alert-adv__input" placeholder="e.g. 10" value={maxAge} onChange={e => setMaxAge(e.target.value)} min="0" />
                </div>
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Budget (£)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="alert-adv__input"
                    placeholder="e.g. 350,000"
                    value={budget}
                    onChange={e => setBudget(formatBudget(e.target.value))}
                  />
                </div>
              </div>

              <div className="alert-adv__field-row">
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Your Name</label>
                  <input type="text" className="alert-adv__input" placeholder="Full name" value={buyName} onChange={e => setBuyName(e.target.value)} />
                </div>
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Email <span className="alert-adv__required">*</span></label>
                  <input type="email" className="alert-adv__input" placeholder="you@example.com" value={buyEmail} onChange={e => setBuyEmail(e.target.value)} required />
                </div>
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Phone</label>
                  <input type="tel" className="alert-adv__input" placeholder="+44" value={buyPhone} onChange={e => setBuyPhone(e.target.value)} />
                </div>
              </div>

              <div className="alert-adv__field">
                <label className="alert-adv__field-label">Additional Requirements <span className="alert-adv__optional">(optional)</span></label>
                <textarea className="alert-adv__input alert-adv__textarea" placeholder="Avionics fit, IFR equipped, engine type, specific configuration or use case..." value={buyNotes} onChange={e => setBuyNotes(e.target.value)} rows={3} />
              </div>

              {error && <div className="alert-adv__error">{error}</div>}

              <div className="alert-adv__form-footer">
                <button type="submit" className="alert-adv__submit-btn" disabled={submitting}>
                  {submitting ? 'Registering…' : 'Register Buyer Interest'}
                </button>
                <span className="alert-adv__privacy">We never share your details. You can unsubscribe at any time.</span>
              </div>
            </form>
          )}

          {/* SELL FORM */}
          {intent === 'sell' && (
            <form className="alert-adv__form" onSubmit={handleSellSubmit}>
              <div className="alert-adv__form-header">
                <span className="alert-adv__form-badge alert-adv__form-badge--sell">Seller Registration</span>
                <button type="button" className="alert-adv__back-btn" onClick={() => setIntent(null)}>← Change</button>
              </div>

              <div className="alert-adv__field-row">
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Manufacturer</label>
                  <select className="alert-adv__input alert-adv__select" value={sellMake} onChange={e => { setSellMake(e.target.value); setSellModel(''); }}>
                    <option value="">Select manufacturer</option>
                    {AIRCRAFT_CATALOGUE.map(({ make }) => <option key={make} value={make}>{make}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Model</label>
                  {sellMake && sellMake !== 'Other' ? (
                    <select className="alert-adv__input alert-adv__select" value={sellModel} onChange={e => setSellModel(e.target.value)}>
                      <option value="">Select model</option>
                      {(AIRCRAFT_CATALOGUE.find(c => c.make === sellMake)?.models || []).map(m => <option key={m} value={m}>{m}</option>)}
                      <option value="Other">Other / Not listed</option>
                    </select>
                  ) : (
                    <input type="text" className="alert-adv__input" placeholder="Model designation" value={sellModel} onChange={e => setSellModel(e.target.value)} />
                  )}
                </div>
              </div>

              <div className="alert-adv__field-row">
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Year of Manufacture</label>
                  <input type="number" className="alert-adv__input" placeholder="e.g. 2018" value={sellYear} onChange={e => setSellYear(e.target.value)} min="1950" max={new Date().getFullYear()} />
                </div>
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Total Airframe Hours</label>
                  <input type="number" className="alert-adv__input" placeholder="e.g. 1450" value={sellHours} onChange={e => setSellHours(e.target.value)} min="0" />
                </div>
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Condition</label>
                  <select className="alert-adv__input alert-adv__select" value={sellCondition} onChange={e => setSellCondition(e.target.value)}>
                    <option value="">Select condition</option>
                    {CONDITION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="alert-adv__field-row">
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Asking Price</label>
                  <input type="text" className="alert-adv__input" placeholder="e.g. £320,000 or Offers" value={sellPrice} onChange={e => setSellPrice(e.target.value)} />
                </div>
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Registration / Serial <span className="alert-adv__optional">(optional)</span></label>
                  <input type="text" className="alert-adv__input" placeholder="e.g. G-ABCD" value={sellReg} onChange={e => setSellReg(e.target.value)} />
                </div>
              </div>

              <div className="alert-adv__field-row">
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Your Name</label>
                  <input type="text" className="alert-adv__input" placeholder="Full name" value={sellName} onChange={e => setSellName(e.target.value)} />
                </div>
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Email <span className="alert-adv__required">*</span></label>
                  <input type="email" className="alert-adv__input" placeholder="you@example.com" value={sellEmail} onChange={e => setSellEmail(e.target.value)} required />
                </div>
                <div className="alert-adv__field">
                  <label className="alert-adv__field-label">Phone</label>
                  <input type="tel" className="alert-adv__input" placeholder="+44" value={sellPhone} onChange={e => setSellPhone(e.target.value)} />
                </div>
              </div>

              <div className="alert-adv__field">
                <label className="alert-adv__field-label">Additional Details <span className="alert-adv__optional">(optional)</span></label>
                <textarea className="alert-adv__input alert-adv__textarea" placeholder="Engine status, recent maintenance, avionics fit, reason for sale, any damage history..." value={sellNotes} onChange={e => setSellNotes(e.target.value)} rows={3} />
              </div>

              {error && <div className="alert-adv__error">{error}</div>}

              <div className="alert-adv__form-footer">
                <button type="submit" className="alert-adv__submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Aircraft for Sale'}
                </button>
                <span className="alert-adv__privacy">Completely confidential. We discuss terms before any listing goes public.</span>
              </div>
            </form>
          )}

        </div>
      </div>
    </>
  );
}

const styles = `
.alert-adv {
  padding: 0;
  font-family: 'Space Grotesk', -apple-system, sans-serif;
}
.alert-adv::before {
  content: '';
  display: block;
  height: 1px;
  width: 60px;
  background: #e8e6e2;
  margin: 0 auto;
}
.alert-adv__inner {
  width: 100%;
  margin: 0;
}
.alert-adv__intro {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}
.alert-adv__intro-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #999;
}
.alert-adv__intro-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  margin: 0;
  line-height: 1.15;
}
.alert-adv__intro-text {
  font-size: 0.85rem;
  color: #777;
  line-height: 1.65;
  margin: 0;
}
.alert-adv__intent-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  margin-top: 1.5rem;
}
.alert-adv__intent-btn {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.5rem;
  row-gap: 0.2rem;
  align-items: center;
  padding: 0.9rem 1.25rem;
  background: #fff;
  border: 1px solid #e8e6e2;
  cursor: pointer;
  transition: all 0.22s ease;
  text-align: left;
  color: #1a1a1a;
  font-family: inherit;
  width: 100%;
}
.alert-adv__intent-btn:hover {
  border-color: #1a1a1a;
  background: #faf9f6;
}
.alert-adv__intent-icon {
  grid-column: 1;
  grid-row: 1;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85rem;
  color: #999;
  line-height: 1;
}
.alert-adv__intent-title {
  grid-column: 2;
  grid-row: 1;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #1a1a1a;
}
.alert-adv__intent-sub {
  grid-column: 2;
  grid-row: 2;
  font-size: 0.72rem;
  color: #999;
  line-height: 1.5;
}
/* Form */
.alert-adv__form {
  background: #fff;
  border: 1px solid #e8e6e2;
  padding: 2.5rem;
  margin-bottom: 1rem;
}
.alert-adv__form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e8e6e2;
}
.alert-adv__form-badge {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: #faf9f6;
  color: #666;
  padding: 0.35rem 0.75rem;
  border: 1px solid #e8e6e2;
}
.alert-adv__form-badge--sell {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}
.alert-adv__back-btn {
  background: none;
  border: none;
  color: #bbb;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.alert-adv__back-btn:hover { color: #1a1a1a; }
.alert-adv__field-group { margin-bottom: 1.75rem; }
.alert-adv__field-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.alert-adv__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1.25rem;
}
.alert-adv__field-row .alert-adv__field { margin-bottom: 0; }
.alert-adv__field-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
}
.alert-adv__optional {
  color: #bbb;
  font-size: 0.55rem;
  text-transform: none;
  letter-spacing: 0;
  font-family: 'Space Grotesk', sans-serif;
}
.alert-adv__required { color: #c00; }
.alert-adv__input {
  background: #faf9f6;
  border: 1px solid #e0ddd8;
  padding: 0.7rem 0.9rem;
  color: #1a1a1a;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.88rem;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.alert-adv__input::placeholder { color: #bbb; }
.alert-adv__input:focus { outline: none; border-color: #1a1a1a; }
.alert-adv__select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.9rem center;
  padding-right: 2.5rem;
  cursor: pointer;
}
.alert-adv__select option { background: #fff; color: #1a1a1a; }
.alert-adv__textarea { resize: vertical; min-height: 80px; }
/* Aircraft picker */
.alert-adv__makes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 0.4rem;
  margin-top: 0.75rem;
}
.alert-adv__make-block { display: flex; flex-direction: column; }
.alert-adv__make-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.55rem 0.8rem;
  background: #faf9f6;
  border: 1px solid #e0ddd8;
  color: #555;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.18s;
  text-align: left;
}
.alert-adv__make-toggle:hover,
.alert-adv__make-toggle.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #fff;
}
.alert-adv__make-arrow {
  font-size: 0.9rem;
  line-height: 1;
  color: inherit;
  opacity: 0.5;
}
.alert-adv__models-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0.5rem;
  border: 1px solid #e0ddd8;
  border-top: none;
  background: #f5f4f1;
}
.alert-adv__model-chip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.28rem 0.55rem;
  font-size: 0.72rem;
  color: #666;
  cursor: pointer;
  border: 1px solid #ddd;
  background: #fff;
  transition: all 0.15s;
  font-family: 'Space Grotesk', sans-serif;
  user-select: none;
}
.alert-adv__model-chip input { display: none; }
.alert-adv__model-chip:hover {
  border-color: #999;
  color: #1a1a1a;
}
.alert-adv__model-chip.selected {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #fff;
}
.alert-adv__selected-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.75rem;
}
.alert-adv__selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.22rem 0.55rem;
  background: #1a1a1a;
  border: 1px solid #1a1a1a;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.03em;
}
.alert-adv__selected-tag button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  line-height: 1;
  opacity: 0.55;
}
.alert-adv__selected-tag button:hover { opacity: 1; }
/* Form footer */
.alert-adv__form-footer {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e8e6e2;
}
.alert-adv__submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 2rem;
  background: #1a1a1a;
  border: 2px solid #1a1a1a;
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.22s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.alert-adv__submit-btn:hover:not(:disabled) {
  background: #333;
  border-color: #333;
}
.alert-adv__submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.alert-adv__privacy {
  font-size: 0.7rem;
  color: #bbb;
  line-height: 1.5;
}
.alert-adv__error {
  color: #c00;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.68rem;
  margin-top: 0.5rem;
}
/* Direct contact */
.alert-adv__direct-contact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.75rem;
  border-top: 1px solid #e8e6e2;
}
.alert-adv__direct-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #bbb;
}
.alert-adv__direct-link {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}
.alert-adv__direct-link:hover { color: #1a1a1a; }
.alert-adv__direct-sep { color: #ddd; }
/* Success */
.alert-adv__success {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
  padding: 3rem 2rem;
}
.alert-adv__success-icon {
  width: 52px;
  height: 52px;
  background: #f5f4f1;
  border: 1px solid #e0ddd8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #1a1a1a;
  margin: 0 auto 1.5rem;
}
.alert-adv__success-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.alert-adv__success-body {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}
.alert-adv__contact-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.alert-adv__contact-fallback a {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}
.alert-adv__contact-fallback a:hover { color: #1a1a1a; }
.alert-adv__contact-fallback span { color: #ddd; }
@media (max-width: 768px) {
  .alert-adv { padding: 2rem 1.25rem; }
  .alert-adv__intent-col { grid-template-columns: 1fr; }
  .alert-adv__form { padding: 1.5rem; }
  .alert-adv__makes-grid { grid-template-columns: 1fr 1fr; }
  .alert-adv__form-footer { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 480px) {
  .alert-adv__makes-grid { grid-template-columns: 1fr; }
}
`;
