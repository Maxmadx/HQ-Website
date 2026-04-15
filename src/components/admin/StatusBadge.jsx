const COLOURS = {
  for_sale: { bg: '#d1fae5', text: '#065f46' },
  sold: { bg: '#fee2e2', text: '#991b1b' },
  reserved: { bg: '#fef3c7', text: '#92400e' },
  coming_soon: { bg: '#e0e7ff', text: '#3730a3' },
  published: { bg: '#d1fae5', text: '#065f46' },
  draft: { bg: '#f3f4f6', text: '#374151' },
  new: { bg: '#e0e7ff', text: '#3730a3' },
  contacted: { bg: '#fef3c7', text: '#92400e' },
  qualified: { bg: '#d1fae5', text: '#065f46' },
  closed: { bg: '#f3f4f6', text: '#374151' },
  pending: { bg: '#fef3c7', text: '#92400e' },
  approved: { bg: '#d1fae5', text: '#065f46' },
  rejected: { bg: '#fee2e2', text: '#991b1b' },
};

const LABELS = {
  for_sale: 'For Sale', sold: 'Sold', reserved: 'Reserved', coming_soon: 'Coming Soon',
  published: 'Published', draft: 'Draft', new: 'New', contacted: 'Contacted',
  qualified: 'Qualified', closed: 'Closed', pending: 'Pending', approved: 'Approved',
  rejected: 'Rejected',
};

export default function StatusBadge({ status }) {
  const colour = COLOURS[status] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: '9999px',
      fontSize: '0.75rem', fontWeight: 600, background: colour.bg, color: colour.text,
      textTransform: 'capitalize', letterSpacing: '0.02em',
    }}>
      {LABELS[status] ?? status}
    </span>
  );
}
