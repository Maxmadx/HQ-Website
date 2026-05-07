import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import FooterMinimal from '../components/FooterMinimal';
import Seo from '../components/seo/Seo';
import { buildItemList, buildBreadcrumbList } from '../components/seo/jsonLd';
import { useCollection } from '../hooks/useFirestore';
import { CATEGORIES, AIRCRAFT, CONDITIONS } from '../lib/partsSchema';
import '../assets/css/main.css';
import '../assets/css/components.css';

export default function Parts() {
  const { docs: parts, loading } = useCollection('parts');
  const [category, setCategory] = useState('all');
  const [aircraft, setAircraft] = useState('all');
  const [condition, setCondition] = useState('all');

  const visible = useMemo(() => parts.filter((p) => {
    if (p.status !== 'active') return false;
    if (category !== 'all' && p.category !== category) return false;
    if (aircraft !== 'all' && !p.aircraftCompat?.includes(aircraft)) return false;
    if (condition !== 'all' && p.condition !== condition) return false;
    return true;
  }), [parts, category, aircraft, condition]);

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

        <section style={{ padding: '7rem 2rem 3rem', textAlign: 'center', borderBottom: '1px solid #e8e6e2' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#999', display: 'block', marginBottom: '0.75rem' }}>Robinson Parts Specialists</span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a', margin: '0 0 1rem' }}>Parts Catalogue</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: '#555', lineHeight: 1.8 }}>
            Browse our Robinson parts inventory. £500K+ of stock spanning every category. New, overhauled, exchange, and repaired — same-day dispatch on AOG.
          </p>
        </section>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <FilterRow label="Category" value={category} options={['all', ...CATEGORIES]} onChange={setCategory} />
          <FilterRow label="Aircraft" value={aircraft} options={['all', ...AIRCRAFT]} onChange={setAircraft} />
          <FilterRow label="Condition" value={condition} options={['all', ...CONDITIONS]} onChange={setCondition} />

          {loading ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Loading parts…</p>
          ) : visible.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ color: '#666', marginBottom: '1rem' }}>No parts match these filters.</p>
              <Link to="/parts/enquiry" style={{ color: '#1a1a1a', fontWeight: 600 }}>Send a general enquiry →</Link>
            </div>
          ) : (
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

          <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#eae8e4', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#555' }}>Don't see the part you need?</p>
            <Link to="/parts/enquiry" style={{ display: 'inline-block', padding: '0.6rem 1.5rem', background: '#1a1a1a', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Send a general enquiry →
            </Link>
          </div>
        </div>

        <FooterMinimal />
      </div>
    </>
  );
}

function FilterRow({ label, value, options, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', minWidth: '70px' }}>{label}</span>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} style={{ padding: '0.35rem 0.85rem', borderRadius: '4px', border: '1px solid', borderColor: value === o ? '#1a1a1a' : '#e8e6e2', background: value === o ? '#1a1a1a' : '#fff', color: value === o ? '#fff' : '#555', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {o === 'all' ? 'All' : o.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
