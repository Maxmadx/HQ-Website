import { useEffect, useState } from 'react';

export default function ProductInfoModal({ open, item, onClose }) {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => { setActiveImg(0); }, [item?.id]);

  if (!open || !item) return null;

  const images = Array.isArray(item.images) ? item.images : [];
  const primary = images[activeImg];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '560px', width: 'calc(100% - 32px)', maxHeight: 'calc(100vh - 64px)', overflowY: 'auto', fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: '#666' }}>×</button>
        </div>
        {primary && (
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <img src={primary.url} alt={primary.alt || item.name} width={480} height={320} style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: '8px' }} />
            {images.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
                {images.map((img, i) => (
                  <button
                    key={img.url}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Image ${i + 1}`}
                    style={{ width: '40px', height: '40px', padding: 0, border: i === activeImg ? '2px solid #1a1a1a' : '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                  >
                    <img src={img.url} alt="" width={40} height={40} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px' }}>{item.name}</h2>
        {item.description && (
          <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.6, margin: 0 }}>{item.description}</p>
        )}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '10px 20px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
          >Got it</button>
        </div>
      </div>
    </div>
  );
}
