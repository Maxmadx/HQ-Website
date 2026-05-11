import React, { useEffect } from 'react';
import { useDiscoveryAddons } from '../../hooks/useDiscoveryAddons';
import { computeLineTotal, MAX_ADDON_QTY } from '../../lib/discoveryAddons';

const fmtGbp = (pence) => `£${(Number(pence) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DiscoveryAddons({ value, onChange, voucherActive = false }) {
  const { items, loading } = useDiscoveryAddons();

  // Force fulfilment to delivery whenever voucher becomes active.
  useEffect(() => {
    if (voucherActive && value.fulfilment !== 'delivery') {
      onChange({ ...value, fulfilment: 'delivery' });
    }
    // Intentionally only fire on the voucherActive transition. value/onChange
    // are read inside but don't need to retrigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherActive]);

  if (loading) return null;
  if (items.length === 0) return null;

  const qtyByItemId = value.qtyByItemId || {};
  const anyInBasket = Object.values(qtyByItemId).some((q) => q > 0);

  const setQty = (itemId, qty) => {
    const next = { ...qtyByItemId, [itemId]: qty };
    if (qty <= 0) delete next[itemId];
    const stillAny = Object.values(next).some((q) => q > 0);
    onChange({
      ...value,
      qtyByItemId: next,
      ...(stillAny ? {} : { fulfilment: 'collect', shippingAddress: { line1: '', line2: '', city: '', postcode: '' } }),
    });
  };

  const setFulfilment = (fulfilment) => {
    if (voucherActive && fulfilment === 'collect') return;
    onChange({ ...value, fulfilment });
  };

  const setAddress = (patch) => {
    onChange({ ...value, shippingAddress: { ...(value.shippingAddress || {}), ...patch } });
  };

  return (
    <div style={S.box}>
      <h3 style={S.title}>Add to your booking</h3>
      <p style={S.intro}>Get more from your discovery flight.</p>

      <ul style={S.list}>
        {items.map((item) => {
          const primary = (item.images || []).find((i) => i.isPrimary) || (item.images || [])[0];
          const qty = qtyByItemId[item.id] || 0;
          const pct = Number(item.discoveryAddonDiscountPct) || 0;
          const discountedUnit = computeLineTotal({ price: item.price, qty: 1, discountPct: pct });

          return (
            <li key={item.id} style={S.row}>
              {primary
                ? <img src={primary.url} alt={item.name} style={S.thumb} />
                : <div style={S.thumbPlaceholder} aria-hidden="true" />}
              <div style={S.info}>
                <div style={S.nameRow}>
                  <span style={S.name}>{item.name}</span>
                  {pct > 0 && <span style={S.pill}>{pct}% OFF</span>}
                </div>
                <div style={S.priceRow}>
                  {pct > 0 ? (
                    <>
                      <span style={S.priceStrike}>{fmtGbp(item.price)}</span>
                      <span style={S.priceFinal}>{fmtGbp(discountedUnit)}</span>
                    </>
                  ) : (
                    <span style={S.priceFinal}>{fmtGbp(item.price)}</span>
                  )}
                </div>
              </div>
              <div style={S.qty}>
                <button type="button" onClick={() => setQty(item.id, Math.max(0, qty - 1))} style={S.qtyBtn}>−</button>
                <span style={S.qtyN}>{qty}</span>
                <button type="button" onClick={() => setQty(item.id, Math.min(MAX_ADDON_QTY, qty + 1))} style={S.qtyBtn}>+</button>
              </div>
            </li>
          );
        })}
      </ul>

      {anyInBasket && (
        <div style={S.fulfil}>
          <span style={S.fulfilLabel}>Fulfilment:</span>
          <label style={{ ...S.radio, opacity: voucherActive ? 0.5 : 1 }}>
            <input
              type="radio"
              name="df-fulfilment"
              value="collect"
              checked={value.fulfilment === 'collect' && !voucherActive}
              onChange={() => setFulfilment('collect')}
              disabled={voucherActive}
            />
            Collect on the day
          </label>
          <label style={S.radio}>
            <input
              type="radio"
              name="df-fulfilment"
              value="delivery"
              checked={value.fulfilment === 'delivery' || voucherActive}
              onChange={() => setFulfilment('delivery')}
            />
            Delivery
          </label>
          {voucherActive && (
            <span style={S.note}>Required because the recipient redeems the flight later.</span>
          )}

          {(value.fulfilment === 'delivery' || voucherActive) && (
            <div style={S.addr}>
              <input style={S.input} placeholder="Address line 1" value={value.shippingAddress?.line1 || ''} onChange={(e) => setAddress({ line1: e.target.value })} required />
              <input style={S.input} placeholder="Address line 2 (optional)" value={value.shippingAddress?.line2 || ''} onChange={(e) => setAddress({ line2: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input style={S.input} placeholder="City" value={value.shippingAddress?.city || ''} onChange={(e) => setAddress({ city: e.target.value })} required />
                <input style={S.input} placeholder="Postcode" value={value.shippingAddress?.postcode || ''} onChange={(e) => setAddress({ postcode: e.target.value })} required />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const S = {
  box: { border: '1px solid #e8e6e2', borderRadius: 8, padding: 16, background: '#faf9f6', marginBottom: 16 },
  title: { fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  intro: { fontSize: '0.85rem', color: '#666', margin: '0 0 12px' },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 },
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  thumb: { width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e6e2', flexShrink: 0 },
  thumbPlaceholder: { width: 64, height: 64, borderRadius: 6, border: '1px dashed #e8e6e2', background: '#fff', flexShrink: 0 },
  info: { flex: '1 1 140px', minWidth: 0 },
  nameRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  name: { fontWeight: 600, fontSize: '0.9rem' },
  pill: { fontSize: '0.6rem', fontWeight: 700, background: '#1a1a1a', color: '#fff', padding: '2px 6px', borderRadius: 3, letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  priceRow: { fontSize: '0.85rem', display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' },
  priceStrike: { color: '#999', textDecoration: 'line-through' },
  priceFinal: { color: '#1a1a1a', fontWeight: 700 },
  qty: { display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 'auto' },
  qtyBtn: { width: 28, height: 28, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', borderRadius: 4, fontSize: '1rem' },
  qtyN: { minWidth: 20, textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
  fulfil: { marginTop: 16, paddingTop: 16, borderTop: '1px solid #e8e6e2', display: 'flex', flexDirection: 'column', gap: 8 },
  fulfilLabel: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#374151' },
  radio: { display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.875rem' },
  note: { fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' },
  addr: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 },
  input: { padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.875rem', boxSizing: 'border-box', width: '100%' },
};
