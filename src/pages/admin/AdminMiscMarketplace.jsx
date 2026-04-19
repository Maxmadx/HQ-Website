import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection, updateDocById } from '../../hooks/useFirestore';

const ENQUIRY_STATUSES = {
  new:       { label: 'New',       bg: '#fef3c7', color: '#92400e' },
  contacted: { label: 'Contacted', bg: '#e0f2fe', color: '#0369a1' },
  closed:    { label: 'Closed',    bg: '#f3f4f6', color: '#374151' },
};

const ORDER_STATUSES = {
  new:       { label: 'New',       bg: '#fef3c7', color: '#92400e' },
  fulfilled: { label: 'Fulfilled', bg: '#d1fae5', color: '#065f46' },
};

function displayAmount(pence) {
  return '£' + (pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Detail({ label, value }) {
  return (
    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.4rem 0.6rem' }}>
      <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '0.8rem', color: '#111827', fontWeight: 600, wordBreak: 'break-word' }}>{value || '—'}</div>
    </div>
  );
}

export default function AdminMiscMarketplace() {
  const { docs: entries, loading } = useCollection('misc_marketplace', 'createdAt');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  async function setStatus(id, status) {
    setUpdating(id);
    try { await updateDocById('misc_marketplace', id, { status }); }
    finally { setUpdating(null); }
  }

  const newCount = entries.filter((e) => e.status === 'new').length;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            Marketplace
            {newCount > 0 && (
              <span style={{ marginLeft: 10, fontSize: '0.75rem', fontWeight: 700, background: '#ef4444', color: '#fff', borderRadius: 99, padding: '2px 8px' }}>
                {newCount} new
              </span>
            )}
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0' }}>
            Misc item enquiries and purchases.
          </p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : entries.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No entries yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {entries.map((entry) => {
            const isOpen = expanded === entry.id;
            const isOrder = entry.type === 'order';
            const statuses = isOrder ? ORDER_STATUSES : ENQUIRY_STATUSES;
            const statusCfg = statuses[entry.status] || statuses.new;

            return (
              <div
                key={entry.id}
                style={{ background: '#fff', border: `1px solid ${entry.status === 'new' ? '#fbbf24' : '#e5e7eb'}`, borderRadius: '8px', overflow: 'hidden' }}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', cursor: 'pointer', userSelect: 'none' }}
                >
                  {/* Type badge */}
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    background: isOrder ? '#d1fae5' : '#fef3c7',
                    color: isOrder ? '#065f46' : '#92400e',
                    padding: '2px 7px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                  }}>
                    {isOrder ? 'Order' : 'Enquiry'}
                  </span>

                  {/* Customer name */}
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.customerName}
                  </span>

                  {/* Item name */}
                  <span style={{ fontSize: '0.8rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {entry.itemName}
                  </span>

                  {/* Amount (orders only) */}
                  {isOrder && (
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', whiteSpace: 'nowrap' }}>
                      {displayAmount(entry.amount)}
                    </span>
                  )}

                  {/* Date */}
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatDate(entry.createdAt)}</span>

                  {/* Status badge */}
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, background: statusCfg.bg, color: statusCfg.color, padding: '2px 8px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                    {statusCfg.label}
                  </span>

                  {/* Chevron */}
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem', transition: 'transform 0.15s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid #e5e7eb', padding: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Detail label="Email" value={entry.customerEmail} />
                      <Detail label="Phone" value={entry.customerPhone} />
                      <Detail label="Item" value={entry.itemName} />
                    </div>

                    {isOrder ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <Detail label="Qty" value={String(entry.qty || 1)} />
                        <Detail label="Amount" value={displayAmount(entry.amount)} />
                        <Detail label="Stripe Ref" value={entry.ref} />
                      </div>
                    ) : (
                      entry.message && (
                        <div style={{ marginTop: '0.5rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.75rem' }}>
                          <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Message</div>
                          <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{entry.message}</div>
                        </div>
                      )
                    )}

                    {/* Status actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', marginRight: '0.25rem' }}>Mark as:</span>
                      {Object.entries(statuses).map(([key, cfg]) => (
                        <button
                          key={key}
                          disabled={entry.status === key || updating === entry.id}
                          onClick={() => setStatus(entry.id, key)}
                          style={{
                            padding: '3px 10px', border: '1px solid #d1d5db', borderRadius: 99,
                            fontSize: '0.72rem', fontWeight: 600,
                            cursor: entry.status === key ? 'default' : 'pointer',
                            background: entry.status === key ? cfg.bg : '#fff',
                            color: entry.status === key ? cfg.color : '#374151',
                            opacity: updating === entry.id ? 0.5 : 1,
                          }}
                        >
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
