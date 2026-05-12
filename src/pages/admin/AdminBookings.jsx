import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollection, updateDocById } from '../../hooks/useFirestore';

const STATUS_LABELS = {
  new:       { label: 'New',       bg: '#fef3c7', color: '#92400e' },
  confirmed: { label: 'Confirmed', bg: '#d1fae5', color: '#065f46' },
  fulfilled: { label: 'Fulfilled', bg: '#e0e7ff', color: '#3730a3' },
};

function displayAmount(pence) {
  return '£' + (pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const AIRCRAFT_NAMES = { r22: 'Robinson R22', r44: 'Robinson R44', r66: 'Robinson R66' };
function aircraftName(code, fallback) {
  return AIRCRAFT_NAMES[code] || fallback || code || '—';
}

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function BookingDetails({ booking }) {
  if (booking.productType === 'london-tour') {
    const expName = booking.experience === 'private' ? 'Private Charter' : 'Shared';
    const timeName = { day: 'Daytime', sunset: 'Sunset', night: 'Night' }[booking.timeOfDay] || booking.timeOfDay;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.75rem' }}>
        <Detail label="Experience" value={expName} />
        <Detail label="Time of Day" value={timeName} />
        <Detail label="Passengers" value={booking.experience === 'private' ? 'Private (up to 4)' : `${booking.quantity} passenger${booking.quantity !== 1 ? 's' : ''}`} />
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.75rem' }}>
      <Detail label="Aircraft" value={booking.aircraftName || booking.aircraft} />
      <Detail label="Duration" value={`${booking.duration} minutes`} />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.4rem 0.6rem' }}>
      <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '0.8rem', color: '#111827', fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default function AdminBookings() {
  const { docs: bookings, loading } = useCollection('bookings', 'createdAt');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  async function setStatus(id, status) {
    setUpdating(id);
    try { await updateDocById('bookings', id, { status }); }
    finally { setUpdating(null); }
  }

  const newCount = bookings.filter((b) => b.status === 'new').length;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            Bookings
            {newCount > 0 && (
              <span style={{ marginLeft: 10, fontSize: '0.75rem', fontWeight: 700, background: '#ef4444', color: '#fff', borderRadius: 99, padding: '2px 8px' }}>
                {newCount} new
              </span>
            )}
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0' }}>
            Discovery flight and London tour bookings confirmed via Stripe.
          </p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : bookings.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No bookings yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bookings.map((b) => {
            const isOpen = expanded === b.id;
            const statusCfg = STATUS_LABELS[b.status] || STATUS_LABELS.new;
            const typeLabel = b.productType === 'london-tour' ? 'London Tour' : 'Discovery Flight';

            return (
              <div key={b.id} style={{ background: '#fff', border: `1px solid ${b.status === 'new' ? '#fbbf24' : '#e5e7eb'}`, borderRadius: '8px', overflow: 'hidden' }}>
                {/* Header row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : b.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', cursor: 'pointer', userSelect: 'none' }}
                >
                  {/* Type badge */}
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, background: b.productType === 'london-tour' ? '#ede9fe' : '#e0f2fe', color: b.productType === 'london-tour' ? '#5b21b6' : '#0369a1', padding: '2px 7px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {typeLabel}
                  </span>

                  {/* Upgraded pill */}
                  {b.upgrade && (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, background: '#ecfdf5', color: '#065f46', padding: '2px 7px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', border: '1px solid #6ee7b7' }}>
                      Upgraded
                    </span>
                  )}

                  {/* Customer name */}
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827', flex: 1 }}>{b.customerName}</span>

                  {/* Amount — totalAmountPence (includes upgrade) preferred over original amount */}
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', whiteSpace: 'nowrap' }}>{displayAmount(b.totalAmountPence ?? b.amount)}</span>

                  {/* Date */}
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatDate(b.createdAt)}</span>

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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      <Detail label="Email" value={b.customerEmail || '—'} />
                      <Detail label="Phone" value={b.customerPhone || '—'} />
                      <Detail label="Booking Ref" value={b.ref} />
                    </div>

                    <BookingDetails booking={b} />

                    {b.upgrade && (
                      <div style={{ marginTop: '0.75rem', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '6px', padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                          Upgraded
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#047857', fontWeight: 600, marginBottom: '2px' }}>Originally Booked</div>
                            <div style={{ fontSize: '0.8rem', color: '#064e3b', fontWeight: 600 }}>
                              {aircraftName(b.originalAircraft)} · {b.originalDuration ?? '—'} min
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#047857', fontWeight: 600, marginBottom: '2px' }}>Upgrade Paid</div>
                            <div style={{ fontSize: '0.8rem', color: '#064e3b', fontWeight: 600 }}>
                              {displayAmount((b.totalAmountPence ?? b.amount) - (b.amount ?? 0))}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#047857', fontWeight: 600, marginBottom: '2px' }}>Upgraded At</div>
                            <div style={{ fontSize: '0.8rem', color: '#064e3b', fontWeight: 600 }}>
                              {formatDate(b.upgrade.upgradedAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {b.wantsVoucher && (
                      <div style={{ marginTop: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                          Gift Voucher Requested
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, marginBottom: '2px' }}>Delivery Address</div>
                            <div style={{ fontSize: '0.8rem', color: '#111827', whiteSpace: 'pre-line' }}>{b.voucherAddress || '—'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, marginBottom: '2px' }}>Message</div>
                            <div style={{ fontSize: '0.8rem', color: '#111827', fontStyle: b.voucherMessage ? 'italic' : 'normal' }}>{b.voucherMessage || '—'}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', marginRight: '0.25rem' }}>Mark as:</span>
                      {Object.entries(STATUS_LABELS).map(([key, cfg]) => (
                        <button
                          key={key}
                          disabled={b.status === key || updating === b.id}
                          onClick={() => setStatus(b.id, key)}
                          style={{
                            padding: '3px 10px', border: '1px solid #d1d5db', borderRadius: 99,
                            fontSize: '0.72rem', fontWeight: 600, cursor: b.status === key ? 'default' : 'pointer',
                            background: b.status === key ? cfg.bg : '#fff',
                            color: b.status === key ? cfg.color : '#374151',
                            opacity: updating === b.id ? 0.5 : 1,
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
