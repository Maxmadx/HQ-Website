import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import { useCollection, deleteDocById, createDoc, updateDocById } from '../../hooks/useFirestore';

const SEED_PRESS_LINKS = [
  {
    title: "HQ Aviation Gains Approval as RR300 Authorized Service Center",
    author: "HeliHub",
    externalUrl: "https://www.helihub.com/2019/04/08/hq-aviation-gains-approval-as-rr300-authorized-service-center/",
    date: "2019-04-08",
    excerpt: "HQ Aviation at Denham joins the Rolls-Royce RR300 Service Center network, cementing its position as the UK's largest Robinson R66 operator and a key support hub for R66 owners across Europe.",
    image: "",
  },
  {
    title: "Captain Q: The Man Who Flew to Both Poles",
    author: "Avaunt Magazine",
    externalUrl: "https://avauntmagazine.com/quentin-smith/",
    date: "2016-03-01",
    excerpt: "Avaunt Magazine profiles HQ Aviation founder Quentin Smith — Guinness World Record holder, two-time aerobatics world champion, and the first pilot to fly a piston helicopter to both the North and South Poles.",
    image: "",
  },
  {
    title: "Quentin Smith: Helicopter Hero",
    author: "Collective Magazine",
    externalUrl: "http://www.collectivemag.com/quentin-smith-helicopter-hero/",
    date: "2017-06-01",
    excerpt: "Collective Magazine spotlights Captain Q — the force behind HQ Aviation and Denham's world-class Robinson helicopter training school.",
    image: "",
  },
  {
    title: "Learn to Fly: How Much Does a Helicopter Licence Cost?",
    author: "FLYER Magazine",
    externalUrl: "https://flyer.co.uk/feature/learn-to-fly-how-much-does-a-helicopter-ppl-cost/",
    date: "2023-09-01",
    excerpt: "FLYER's comprehensive guide to PPL(H) costs features HQ Aviation at Denham as one of the leading training schools in the UK, breaking down the real cost of earning a helicopter licence.",
    image: "",
  },
  {
    title: "Airfield Update: Denham Wins Best GA Airport and Defends Helicopter Training in Court",
    author: "FLYER Magazine",
    externalUrl: "https://flyer.co.uk/airfield-update-denham-old-warden/",
    date: "2022-03-01",
    excerpt: "FLYER reports on Denham Aerodrome — home of HQ Aviation — winning the Airport Operators Association's Best General Aviation Airport award and successfully defending helicopter training in a High Court appeal.",
    image: "",
  },
  {
    title: "World Beater: Marking Jennifer Murray's Helicopter Circumnavigation",
    author: "Helicopters Magazine",
    externalUrl: "https://www.helicoptersmagazine.com/world-beater-marking-jennifer-murrays-special-helicopter-feat-7239/",
    date: "2022-08-08",
    excerpt: "Helicopters Magazine marks the anniversary of the first female round-the-world helicopter flight — co-piloted by Quentin Smith, founder of HQ Aviation, in a Robinson R44 across 28 countries in 97 days.",
    image: "",
  },
  {
    title: "On This Day: First Woman to Circumnavigate the World by Helicopter",
    author: "General Aviation News",
    externalUrl: "https://generalaviationnews.com/2017/08/08/on-this-day-in-history-first-woman-to-circumnavigate-the-world-by-helicopter/",
    date: "2017-08-08",
    excerpt: "General Aviation News recalls the 1997 record flight by Jennifer Murray and HQ Aviation's Quentin Smith — 28 countries, 97 days, one Robinson R44 — earning multiple world firsts.",
    image: "",
  },
];

const today = () => new Date().toISOString().split('T')[0];
const EMPTY_FORM = () => ({ title: '', author: '', externalUrl: '', date: today(), excerpt: '', image: '' });

const labelStyle = {
  display: 'block', fontSize: '0.8rem', fontWeight: 600,
  color: '#374151', marginBottom: '0.25rem',
};
const inputStyle = {
  width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box',
  background: '#fff',
};

export default function AdminBlog() {
  const { docs: posts, loading } = useCollection('blog_posts');
  const { docs: pressLinks, loading: pressLoading } = useCollection('press_links');
  const [activeTab, setActiveTab] = useState('posts');
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [editingPress, setEditingPress] = useState(null); // id of row being edited
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [blogViewMap, setBlogViewMap] = useState({});
  const [viewsLoading, setViewsLoading] = useState(false);
  const [viewsFetched, setViewsFetched] = useState(false);
  const [viewsError, setViewsError] = useState(false);

  useEffect(() => {
    if (activeTab !== 'posts' || viewsFetched) return;
    setViewsLoading(true);
    setViewsFetched(true);
    getDocs(
      query(
        collection(db, 'page_events'),
        where('eventType', '==', 'pageview'),
        where('page', '>=', '/blog/'),
        where('page', '<', '/blog/~'),
      ),
    )
      .then((snap) => {
        const map = {};
        snap.docs.forEach((d) => {
          const path = d.data().page;
          map[path] = (map[path] || 0) + 1;
        });
        setBlogViewMap(map);
      })
      .catch(() => { setViewsError(true); })
      .finally(() => setViewsLoading(false));
  }, [activeTab, viewsFetched]);

  async function handleSeed() {
    setSeeding(true);
    try {
      await Promise.all(
        SEED_PRESS_LINKS.map((p) =>
          createDoc('press_links', { ...p, category: 'Press', published: true })
        )
      );
    } finally {
      setSeeding(false);
    }
  }

  function startEdit(p) {
    setEditingPress(p.id);
    setEditForm({
      title: p.title || '',
      author: p.author || '',
      externalUrl: p.externalUrl || '',
      date: p.date || today(),
      excerpt: p.excerpt || '',
      image: p.image || '',
    });
    setEditError('');
  }

  function cancelEdit() {
    setEditingPress(null);
    setEditForm({});
    setEditError('');
  }

  async function handleUpdatePress(e, id) {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.author.trim() || !editForm.externalUrl.trim() || !editForm.date) {
      setEditError('Title, publication, URL, and date are required.');
      return;
    }
    setEditSaving(true);
    setEditError('');
    try {
      await updateDocById('press_links', id, {
        title: editForm.title.trim(),
        author: editForm.author.trim(),
        externalUrl: editForm.externalUrl.trim(),
        date: editForm.date,
        excerpt: editForm.excerpt.trim(),
        image: editForm.image.trim(),
      });
      cancelEdit();
    } catch (err) {
      setEditError(`Failed to update: ${err?.message || err}`);
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDeletePost(id) {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteDocById('blog_posts', id);
    } finally {
      setDeleting(null);
    }
  }

  async function handleDeletePress(id) {
    if (!window.confirm('Remove this press link? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteDocById('press_links', id);
    } finally {
      setDeleting(null);
    }
  }

  async function handleSavePress(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.externalUrl.trim() || !form.date) {
      setFormError('Title, publication, URL, and date are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      await createDoc('press_links', {
        title: form.title.trim(),
        author: form.author.trim(),
        externalUrl: form.externalUrl.trim(),
        date: form.date,
        excerpt: form.excerpt.trim(),
        image: form.image.trim(),
        category: 'Press',
        published: true,
      });
      setForm(EMPTY_FORM());
      setShowForm(false);
    } catch (err) {
      console.error('press_links save error:', err);
      setFormError(`Failed to save: ${err?.message || err}`);
    } finally {
      setSaving(false);
    }
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const tabStyle = (id) => ({
    padding: '0.5rem 1.25rem',
    background: 'none',
    border: 'none',
    borderBottom: activeTab === id ? '2px solid #111827' : '2px solid transparent',
    marginBottom: '-2px',
    cursor: 'pointer',
    fontWeight: activeTab === id ? 700 : 400,
    color: activeTab === id ? '#111827' : '#6b7280',
    fontSize: '0.9rem',
  });

  return (
    <AdminLayout>
      {/* Tab strip */}
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '2px solid #e5e7eb', marginBottom: '1.75rem' }}>
        <button style={tabStyle('posts')} onClick={() => setActiveTab('posts')}>Blog Posts</button>
        <button style={tabStyle('press')} onClick={() => setActiveTab('press')}>Press Links</button>
      </div>

      {/* ── Blog Posts tab ── */}
      {activeTab === 'posts' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Blog Posts</h1>
            <Link
              to="/admin/blog/new"
              style={{
                background: '#111827', color: '#fff', padding: '0.5rem 1rem',
                borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
              }}
            >
              + New Post
            </Link>
          </div>

          {loading ? (
            <p style={{ color: '#6b7280' }}>Loading…</p>
          ) : posts.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No posts yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    {['Title', 'Slug', 'Status', 'Published', 'Views', ''].map((h) => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: h === 'Views' ? 'right' : 'left', color: '#374151', fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: '#111827', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#6b7280', fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.slug}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><StatusBadge status={p.status} /></td>
                      <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{formatDate(p.publishedAt)}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#6b7280', textAlign: 'right', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {viewsLoading || viewsError ? '—' : (blogViewMap[`/blog/${p.slug || p.id}`] ?? 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                        <Link to={`/admin/blog/${p.id}`} style={{ color: '#2563eb', textDecoration: 'none', marginRight: '1rem', fontWeight: 500 }}>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(p.id)}
                          disabled={deleting === p.id}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}
                        >
                          {deleting === p.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Press Links tab ── */}
      {activeTab === 'press' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>Press Links</h1>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
                External articles written about HQ Aviation. These appear under "In the Press" on the main page.
              </p>
            </div>
            <button
              onClick={() => { setShowForm((f) => !f); setFormError(''); setForm(EMPTY_FORM()); }}
              style={{
                background: showForm ? '#6b7280' : '#111827',
                color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px',
                border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {showForm ? '✕ Cancel' : '+ Add Press Link'}
            </button>
          </div>

          {/* Add form */}
          {showForm && (
            <form
              onSubmit={handleSavePress}
              style={{
                background: '#f9fafb', border: '1px solid #e5e7eb',
                borderRadius: '8px', padding: '1.5rem', marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Article Title *</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. FLYER Magazine: Denham's Helicopter Powerhouse"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Publication / Author *</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g. FLYER Magazine"
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>External URL *</label>
                  <input
                    style={inputStyle}
                    type="url"
                    placeholder="https://..."
                    value={form.externalUrl}
                    onChange={(e) => setForm((f) => ({ ...f, externalUrl: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input
                    style={inputStyle}
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Excerpt</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                    placeholder="Short description of the article…"
                    value={form.excerpt}
                    onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Cover Image URL</label>
                  <input
                    style={inputStyle}
                    placeholder="/assets/images/... or https://..."
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  />
                </div>
              </div>

              {formError && (
                <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{formError}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                style={{
                  background: '#111827', color: '#fff', padding: '0.5rem 1.25rem',
                  border: 'none', borderRadius: '6px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.875rem',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? 'Saving…' : 'Save Press Link'}
              </button>
            </form>
          )}

          {/* Press links table */}
          {pressLoading ? (
            <p style={{ color: '#6b7280' }}>Loading…</p>
          ) : pressLinks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed #d1d5db', borderRadius: '8px', color: '#6b7280' }}>
              <p style={{ marginBottom: '1rem' }}>No press links yet.</p>
              <button
                onClick={handleSeed}
                disabled={seeding}
                style={{
                  background: '#f3f4f6', color: '#374151', padding: '0.5rem 1.25rem',
                  border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.875rem',
                }}
              >
                {seeding ? 'Importing…' : 'Import starter press links'}
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    {['Title', 'Publication', 'Date', 'URL', 'Clicks', ''].map((h) => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: h === 'Clicks' ? 'right' : 'left', color: '#374151', fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pressLinks.map((p) => (
                    <>
                      <tr key={p.id} style={{ borderBottom: editingPress === p.id ? 'none' : '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: '#111827', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{p.author}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{p.date || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <a href={p.externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.8rem' }}>
                            {p.externalUrl}
                          </a>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#6b7280', textAlign: 'right', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {(p.clicks ?? 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                          {editingPress === p.id ? (
                            <button
                              onClick={cancelEdit}
                              style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', marginRight: '1rem' }}
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={() => startEdit(p)}
                              style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', marginRight: '1rem' }}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePress(p.id)}
                            disabled={deleting === p.id}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}
                          >
                            {deleting === p.id ? 'Removing…' : 'Remove'}
                          </button>
                        </td>
                      </tr>
                      {editingPress === p.id && (
                        <tr key={`${p.id}-edit`} style={{ borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                          <td colSpan={5} style={{ padding: '1rem 1rem 1.25rem' }}>
                            <form onSubmit={(e) => handleUpdatePress(e, p.id)}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div>
                                  <label style={labelStyle}>Article Title *</label>
                                  <input style={inputStyle} value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} />
                                </div>
                                <div>
                                  <label style={labelStyle}>Publication / Author *</label>
                                  <input style={inputStyle} value={editForm.author} onChange={(e) => setEditForm((f) => ({ ...f, author: e.target.value }))} />
                                </div>
                                <div>
                                  <label style={labelStyle}>External URL *</label>
                                  <input style={inputStyle} type="url" value={editForm.externalUrl} onChange={(e) => setEditForm((f) => ({ ...f, externalUrl: e.target.value }))} />
                                </div>
                                <div>
                                  <label style={labelStyle}>Date *</label>
                                  <input style={inputStyle} type="date" value={editForm.date} onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <label style={labelStyle}>Excerpt</label>
                                  <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }} value={editForm.excerpt} onChange={(e) => setEditForm((f) => ({ ...f, excerpt: e.target.value }))} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <label style={labelStyle}>Cover Image URL</label>
                                  <input style={inputStyle} placeholder="/assets/images/... or https://..." value={editForm.image} onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))} />
                                </div>
                              </div>
                              {editError && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{editError}</p>}
                              <button
                                type="submit"
                                disabled={editSaving}
                                style={{ background: '#111827', color: '#fff', padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', opacity: editSaving ? 0.6 : 1 }}
                              >
                                {editSaving ? 'Saving…' : 'Save Changes'}
                              </button>
                            </form>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
