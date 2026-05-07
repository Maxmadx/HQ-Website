import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import FooterMinimal from '../components/FooterMinimal';
import Seo from '../components/seo/Seo';
import { buildProduct, buildBreadcrumbList } from '../components/seo/jsonLd';
import { useDocument } from '../hooks/useFirestore';
import '../assets/css/main.css';
import '../assets/css/components.css';
import EnquireModal from '../components/parts/EnquireModal';

const CONDITION_LABELS = {
  new: 'New',
  overhauled: 'Overhauled',
  exchange: 'Exchange',
  repaired: 'Repaired',
};

export default function PartDetail() {
  const { id } = useParams();
  const { data: part, loading } = useDocument('parts', id);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#faf9f6' }}>
        <Header />
        <p style={{ textAlign: 'center', padding: '6rem 2rem', color: '#666' }}>Loading…</p>
      </div>
    );
  }
  // 'active' is the only condition that puts a listing on the public site.
  // 'sold' / 'archived' / 'discontinued' all redirect away.
  if (!part || part.status !== 'active') return <Navigate to="/parts" replace />;

  const primaryImage = (part.images || []).find((i) => i.isPrimary) || part.images?.[0];
  const fullName = `${part.partNumber} ${part.title}`; // e.g. "A102 Tail Rotor Pitch Link"
  const inStock = part.hasQuantity ? part.stock > 0 : true;
  const [enquireOpen, setEnquireOpen] = useState(false);

  const productSchema = buildProduct({
    name: fullName,
    description: part.description || `${fullName} — Robinson ${(part.aircraftCompat || []).join('/').toUpperCase()} part at HQ Aviation. Enquire for stock and pricing.`,
    image: primaryImage?.url || '/assets/images/og-default.png',
    url: `/parts/${part.id}`,
    // Single Offer per listing (not AggregateOffer — each listing is one
    // condition + one price). Omit the offers block entirely when priceGbp
    // is null (POA), so we don't emit a zero-price Offer to Google.
    offers: part.priceGbp != null ? {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      price: (part.priceGbp / 100).toFixed(2),
      itemCondition: ({
        new: 'https://schema.org/NewCondition',
        overhauled: 'https://schema.org/RefurbishedCondition',
        exchange: 'https://schema.org/RefurbishedCondition',
        repaired: 'https://schema.org/RefurbishedCondition',
      })[part.condition] || 'https://schema.org/UsedCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'HQ Aviation' },
    } : undefined,
  });

  const jsonLd = [
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Parts', path: '/parts' },
      { name: part.partNumber, path: `/parts/${part.id}` },
    ]),
    productSchema,
  ];

  return (
    <>
      <Seo
        title={fullName}
        description={part.description?.slice(0, 160) || `${fullName} — Robinson ${(part.aircraftCompat || []).join('/').toUpperCase()} part at HQ Aviation. Enquire for stock and pricing.`}
        canonical={`https://hqaviation.com/parts/${part.id}`}
        ogImage={primaryImage?.url}
        ogType="product"
        jsonLd={jsonLd}
      />

      <div style={{ minHeight: '100vh', background: '#faf9f6', fontFamily: "'Space Grotesk', sans-serif" }}>
        <Header />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
          <Link to="/parts" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#777', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>← All parts</Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '2rem' }}>
            <div>
              <div style={{ aspectRatio: '4 / 3', background: primaryImage?.url ? `url(${primaryImage.url}) center / cover` : 'linear-gradient(135deg, #eae8e4, #d8d6d2)', borderRadius: '8px' }} />
            </div>
            <div>
              {/* Single H1 containing BOTH the part number and the title so the
                  full search phrase ("A102 Tail Rotor Pitch Link") is one
                  strong on-page signal. PN is rendered with a tabular/mono
                  treatment via inline span so it remains visually distinct. */}
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#1a1a1a', margin: '0 0 1rem', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                <span style={{ fontFamily: 'monospace', marginRight: '0.5em' }}>{part.partNumber}</span>
                {part.title}
              </h1>

              <div style={{ fontSize: '0.8rem', color: '#777', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {(part.aircraftCompat || []).join(' · ').toUpperCase()} · {part.category}
                {part.airworthinessLifeLimited && <> · Life-limited</>}
                {part.exportControlled && <> · Export-controlled</>}
              </div>

              <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.7, marginBottom: '2rem' }}>{part.description}</p>

              {/* Single condition + price block. No variants table — each
                  listing is one specific available unit (or one stock-counted
                  SKU). */}
              <div style={{ background: '#fff', border: '1px solid #e8e6e2', borderRadius: '8px', padding: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999' }}>
                    {CONDITION_LABELS[part.condition] || part.condition}
                    {part.hasQuantity && part.stock > 0 && <> · {part.stock} in stock</>}
                    {part.hasQuantity && part.stock === 0 && <> · Out of stock</>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#777' }}>
                    {part.leadTimeDays === 0 ? 'Available now' : `~${part.leadTimeDays} day lead time`}
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' }}>
                  {part.priceDisplay || 'POA'}
                </div>
                {part.condition === 'exchange' && part.coreChargeGbp != null && (
                  <div style={{ fontSize: '0.85rem', color: '#777', marginTop: '0.25rem' }}>
                    + £{(part.coreChargeGbp / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} core charge
                  </div>
                )}
              </div>

              <button onClick={() => setEnquireOpen(true)} style={{ width: '100%', padding: '0.85rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Enquire About This Part →
              </button>
              {enquireOpen && <EnquireModal part={part} onClose={() => setEnquireOpen(false)} />}
            </div>
          </div>
        </div>

        <FooterMinimal />
      </div>
    </>
  );
}
