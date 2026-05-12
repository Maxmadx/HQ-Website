import { useState } from 'react';
import ProductInfoModal from './ProductInfoModal';

const fmtGbp = (pence) => `£${(Number(pence) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ReferralOfferCard({ booking, freeItem }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSheetSupported] = useState(typeof navigator !== 'undefined' && typeof navigator.share === 'function');

  if (!booking?.referralCode || !freeItem) return null;

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/training/trial-lessons?ref=${booking.referralCode}`;
  const primaryImage = (freeItem.images || []).find((i) => i.isPrimary) || (freeItem.images || [])[0];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function handleShare() {
    try {
      await navigator.share({
        title: 'HQ Aviation Discovery Flight',
        text: 'Book a Discovery Flight at HQ Aviation:',
        url: shareUrl,
      });
    } catch {}
  }

  return (
    <>
      <div style={S.card}>
        <h3 style={S.title}>Refer a friend</h3>
        <p style={S.subtitle}>Share with a friend. When they book a Discovery Flight using your link, this is yours — collect at HQ.</p>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={S.itemRow}
          aria-label={`View details of ${freeItem.name}`}
        >
          {primaryImage ? (
            <img src={primaryImage.url} alt={freeItem.name} width={64} height={64} style={S.thumb} />
          ) : (
            <div style={S.thumbPlaceholder} aria-hidden="true" />
          )}
          <div style={S.itemInfo}>
            <div style={S.itemName}>{freeItem.name}</div>
            <div style={S.priceRow}>
              {freeItem.price > 0 && <span style={S.priceStrike}>{fmtGbp(freeItem.price)}</span>}
              <span style={S.freePill}>FREE</span>
            </div>
          </div>
        </button>

        <div style={S.actions}>
          <button type="button" onClick={handleCopy} style={S.primaryBtn}>
            {copied ? '✓ Link copied' : 'Copy share link'}
          </button>
          {shareSheetSupported && (
            <button type="button" onClick={handleShare} style={S.secondaryBtn}>Share via…</button>
          )}
        </div>
      </div>

      <ProductInfoModal
        open={modalOpen}
        item={freeItem}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

const S = {
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '24px', display: 'flex', flexDirection: 'column' },
  title: { fontSize: '1rem', fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  subtitle: { fontSize: '0.85rem', color: '#666', margin: '0 0 16px', lineHeight: 1.5 },
  itemRow: { display: 'grid', gridTemplateColumns: '64px 1fr', gap: '12px', alignItems: 'center', background: '#faf9f6', border: '1px solid #e8e6e2', borderRadius: '8px', padding: '12px', cursor: 'pointer', textAlign: 'left', marginBottom: '16px' },
  thumb: { width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e6e2' },
  thumbPlaceholder: { width: 64, height: 64, borderRadius: 6, border: '1px dashed #e8e6e2', background: '#fff' },
  itemInfo: { minWidth: 0 },
  itemName: { fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '8px' },
  priceStrike: { color: '#999', textDecoration: 'line-through', fontSize: '0.85rem' },
  freePill: { background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' },
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  primaryBtn: { flex: '1 1 auto', padding: '12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
  secondaryBtn: { flex: '0 0 auto', padding: '12px 16px', background: '#fff', color: '#1a1a1a', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
};
