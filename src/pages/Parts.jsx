import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import FooterMinimal from '../components/FooterMinimal';
import Seo from '../components/seo/Seo';
import { buildItemList, buildBreadcrumbList } from '../components/seo/jsonLd';
import { useCollection } from '../hooks/useFirestore';
import { CATEGORIES, AIRCRAFT, CONDITIONS } from '../lib/partsSchema';
import EnquireModal from '../components/parts/EnquireModal';
import '../assets/css/main.css';
import '../assets/css/components.css';

export default function Parts() {
  const { docs: parts, loading } = useCollection('parts');
  const cardRef = useRef(null);
  const [category, setCategory] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [condition, setCondition] = useState([]);
  const [query, setQuery] = useState('');

  const toggle = (setter) => (val) =>
    setter((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));

  // Progressively flatten the rising card's top corners as the user scrolls.
  // Done via direct ref/style mutation to avoid re-rendering the grid on every scroll event.
  useEffect(() => {
    const MAX_RADIUS = 14;
    const FLATTEN_DISTANCE = 280;
    const update = () => {
      const y = window.scrollY || 0;
      const r = Math.max(0, MAX_RADIUS - (y * MAX_RADIUS) / FLATTEN_DISTANCE);
      if (cardRef.current) cardRef.current.style.borderRadius = `${r}px ${r}px 0 0`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const hasFilter = query.trim().length > 0 || category.length > 0 || aircraft.length > 0 || condition.length > 0;

  const matchesFilters = (p) => {
    const q = query.trim().toLowerCase();
    if (category.length && !category.includes(p.category)) return false;
    if (aircraft.length && !aircraft.some((a) => p.aircraftCompat?.includes(a))) return false;
    if (condition.length && !condition.includes(p.condition)) return false;
    if (q) {
      const haystack = `${p.partNumber || ''} ${p.title || ''} ${p.description || ''} ${p.category || ''} ${(p.aircraftCompat || []).join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  };

  const visible = useMemo(
    () => parts.filter((p) => p.status === 'active' && matchesFilters(p)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parts, category, aircraft, condition, query]
  );

  // Previously sourced (sold) listings only surface when the user is filtering
  // — that's how customers discover "we've handled this part before, ask us".
  const soldVisible = useMemo(
    () => (hasFilter ? parts.filter((p) => p.status === 'sold' && matchesFilters(p)) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parts, category, aircraft, condition, query, hasFilter]
  );

  const [requestPart, setRequestPart] = useState(null);
  const [generalOpen, setGeneralOpen] = useState(false);

  const jsonLd = [
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Parts', path: '/parts' },
    ]),
    buildItemList({
      name: 'Robinson Helicopter Parts',
      // Item name uses the full "{partNumber} {title}" phrase so the
      // ItemList JSON-LD reflects how customers actually search.
      items: visible.slice(0, 50).map((p) => ({ name: `${p.partNumber} ${p.title}`, url: `/parts/${p.id}` })),
    }),
  ];

  return (
    <>
      <Seo
        title="Robinson Helicopter Parts Catalogue"
        description="Browse Robinson R22, R44, and R66 parts at HQ Aviation — engine, rotor, avionics, airframe, and consumables. New, overhauled, exchange, and repaired conditions. Enquire for stock and pricing."
        canonical="https://hqaviation.com/parts"
        jsonLd={jsonLd}
      />

      <div style={{ minHeight: '100vh', background: '#faf9f6', fontFamily: "'Space Grotesk', sans-serif" }}>
        <Header />

        <section
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            padding: '9rem 2rem 9rem',
            textAlign: 'center',
            backgroundImage: "linear-gradient(rgba(15,15,15,0.6), rgba(15,15,15,0.82)), url('/assets/images/facility/hq-0056.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 64px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 64px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9), rgba(0,0,0,0.4) 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9), rgba(0,0,0,0.4) 80%)',
            }}
          />
          <span style={{ position: 'relative', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '1rem' }}>Robinson Parts Specialists</span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700, textTransform: 'uppercase', color: '#fff', margin: '0 0 1.25rem', letterSpacing: '-0.01em' }}>Parts</h1>
          <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75 }}>
            As one of the biggest Robinson service centres in Europe, we have a constant influx of parts and excellent relations with the Robinson factory. Our inventory spans engine components, airframe parts, consumables, avionics, and accessories.
          </p>
        </section>

        <div
          ref={cardRef}
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '1200px',
            margin: '-5rem auto 0',
            padding: '3rem 2.25rem 3rem',
            minHeight: '100vh',
            background: '#fff',
            borderRadius: '14px 14px 0 0',
            boxShadow: '0 -12px 40px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a part number, title, or keyword…"
                aria-label="Search parts"
                style={{ width: '100%', padding: '0.65rem 2.5rem 0.65rem 0.95rem', borderRadius: '4px', border: '1px solid #e8e6e2', background: '#fff', color: '#1a1a1a', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              />
              {query ? (
                <button onClick={() => setQuery('')} aria-label="Clear search" style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1.1rem', padding: '0 0.4rem', lineHeight: 1 }}>×</button>
              ) : (
                <span aria-hidden="true" style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none', display: 'inline-flex' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.25rem' }}>
            <FilterDropdown label="Category" selected={category} options={CATEGORIES} onToggle={toggle(setCategory)} onClear={() => setCategory([])} />
            <FilterDropdown label="Aircraft" selected={aircraft} options={AIRCRAFT} onToggle={toggle(setAircraft)} onClear={() => setAircraft([])} />
            <FilterDropdown label="Condition" selected={condition} options={CONDITIONS} onToggle={toggle(setCondition)} onClear={() => setCondition([])} />
          </div>

          {loading ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Loading parts…</p>
          ) : visible.length === 0 ? null : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '2rem' }}>
              {visible.map((p) => {
                const cardImage = (p.images || []).find((i) => i.isPrimary)?.url || p.images?.[0]?.url;
                return (
                  <Link key={p.id} to={`/parts/${p.id}`} aria-label={`${p.partNumber} ${p.title}`} style={{ background: '#fff', border: '1px solid #e8e6e2', borderRadius: '8px', overflow: 'hidden', textDecoration: 'none', color: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ aspectRatio: '4 / 3', background: cardImage ? `url(${cardImage}) center / cover` : 'linear-gradient(135deg, #eae8e4, #d8d6d2)' }} />
                    <div style={{ padding: '1rem' }}>
                      {/* Card title combines PN and title so the link text reads
                          as a single search phrase. PN gets a mono treatment
                          inline rather than as a separate eyebrow line. */}
                      <h2 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                        <span style={{ fontFamily: 'monospace', color: '#666', marginRight: '0.4em' }}>{p.partNumber}</span>
                        {p.title}
                      </h2>
                      <div style={{ fontSize: '0.7rem', color: '#777', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {(p.aircraftCompat || []).join(' · ').toUpperCase()} · {p.category} · {p.condition}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{p.priceDisplay || 'POA'}</div>
                        {p.hasQuantity && p.stock > 0 && (
                          <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600 }}>{p.stock} in stock</div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Previously sourced — sold listings shown only when the user is
              filtering, so the page suggests "we've handled this before, ask
              us to source it again". */}
          {!loading && soldVisible.length > 0 && (
            <div style={{ marginTop: '4rem' }}>
              <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e6e2' }}>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#888', display: 'block', marginBottom: '0.3rem' }}>Previously Sourced</span>
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>We've handled these before</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {soldVisible.map((p) => {
                  const cardImage = (p.images || []).find((i) => i.isPrimary)?.url || p.images?.[0]?.url;
                  return (
                    <div key={p.id} style={{ background: '#fafaf8', border: '1px dashed #d6d2cc', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', aspectRatio: '4 / 3', background: cardImage ? `url(${cardImage}) center / cover` : 'linear-gradient(135deg, #eae8e4, #d8d6d2)', filter: 'grayscale(0.4)' }}>
                        <span style={{ position: 'absolute', top: '0.6rem', left: '0.6rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#fff', background: 'rgba(26,26,26,0.85)', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>Sold</span>
                      </div>
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.5rem', lineHeight: 1.3, color: '#1a1a1a' }}>
                          <span style={{ fontFamily: 'monospace', color: '#666', marginRight: '0.4em' }}>{p.partNumber}</span>
                          {p.title}
                        </h3>
                        <div style={{ fontSize: '0.7rem', color: '#777', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {(p.aircraftCompat || []).join(' · ').toUpperCase()} · {p.category} · {p.condition}
                        </div>
                        <button
                          type="button"
                          onClick={() => setRequestPart(p)}
                          style={{ marginTop: 'auto', padding: '0.55rem 0.85rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}
                        >
                          Request →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {requestPart && (
            <EnquireModal part={requestPart} mode="request" onClose={() => setRequestPart(null)} />
          )}
          {generalOpen && (
            <EnquireModal part={null} mode="general" onClose={() => setGeneralOpen(false)} />
          )}

          {visible.length > 0 ? (
            <div style={{ marginTop: '5rem', padding: '1.25rem 1.5rem', background: '#eae8e4', borderRadius: '8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#888' }}>Bespoke Sourcing</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1a1a' }}>Don't see the part you need?</span>
              </div>
              <button type="button" onClick={() => setGeneralOpen(true)} style={{ display: 'inline-block', padding: '0.65rem 1.4rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                Send a general enquiry →
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '3rem', padding: '4.5rem 2rem', background: '#eae8e4', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#888', display: 'block', marginBottom: '0.85rem' }}>Bespoke Sourcing</span>
              <h3 style={{ margin: '0 0 0.85rem', fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Don't see the part you need?</h3>
              <p style={{ margin: '0 auto 1.75rem', maxWidth: '520px', fontSize: '0.9rem', color: '#555', lineHeight: 1.7 }}>
                Tell us the part number or describe what you're after — we'll check the network, factory stock, and our exchange partners and get back to you within 24 hours.
              </p>
              <button type="button" onClick={() => setGeneralOpen(true)} style={{ display: 'inline-block', padding: '0.85rem 1.75rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                Send a general enquiry →
              </button>
            </div>
          )}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: '4rem' }}>
            <hr style={{ width: '100%', margin: 0, border: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #d6d2cc 20%, #d6d2cc 80%, transparent)' }} />
          </div>
        </div>

        <FooterMinimal />
      </div>
    </>
  );
}

function FilterDropdown({ label, selected, options, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const active = selected.length > 0;
  const summary = active
    ? selected.map((s) => s.toUpperCase()).join(', ')
    : 'All';

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.85rem',
          borderRadius: '4px',
          border: '1px solid',
          borderColor: active ? '#1a1a1a' : '#e8e6e2',
          background: active ? '#1a1a1a' : '#fff',
          color: active ? '#fff' : '#1a1a1a',
          cursor: 'pointer',
          fontSize: '0.7rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: active ? 'rgba(255,255,255,0.65)' : '#999' }}>{label.toUpperCase()}</span>
        <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</span>
        <span aria-hidden="true" style={{ fontSize: '0.6rem', opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 120ms' }}>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 20,
            minWidth: '100%',
            background: '#fff',
            border: '1px solid #e8e6e2',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            whiteSpace: 'nowrap',
          }}
        >
          {options.map((o) => {
            const isOn = selected.includes(o);
            return (
              <button
                key={o}
                type="button"
                role="menuitemcheckbox"
                aria-checked={isOn}
                onClick={() => onToggle(o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.7rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: isOn ? '#1a1a1a' : 'transparent',
                  color: isOn ? '#fff' : '#1a1a1a',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <span aria-hidden="true" style={{ display: 'inline-block', width: '0.85rem', fontSize: '0.7rem' }}>{isOn ? '✓' : ''}</span>
                {o.toUpperCase()}
              </button>
            );
          })}
          {active && (
            <>
              <div style={{ height: '1px', background: '#e8e6e2', margin: '0.25rem 0' }} />
              <button
                type="button"
                onClick={onClear}
                style={{ padding: '0.35rem 0.7rem', border: 'none', background: 'transparent', color: '#777', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Share Tech Mono', monospace", textAlign: 'left' }}
              >
                Clear
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
