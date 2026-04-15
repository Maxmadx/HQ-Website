import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import AdminLayout from '../../components/admin/AdminLayout';

function StatCard({ label, value, sub, link, color }) {
  const inner = (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px',
      padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
    }}>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: color || '#111827', lineHeight: 1 }}>
        {value === null ? '—' : value}
      </div>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{sub}</div>}
    </div>
  );
  return link ? (
    <Link to={link} style={{ textDecoration: 'none', display: 'block', transition: 'transform 0.1s' }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
    >{inner}</Link>
  ) : inner;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newLeads: null,
    pendingWall: null,
    activeListings: null,
    publishedPosts: null,
    visibleReviews: null,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [newLeads, pendingWall, activeListings, publishedPosts, visibleReviews] = await Promise.all([
          getCountFromServer(query(collection(db, 'leads'), where('status', '==', 'new'))),
          getCountFromServer(query(collection(db, 'wall_of_cool'), where('status', '==', 'pending'))),
          getCountFromServer(query(collection(db, 'listings'), where('status', '==', 'active'))),
          getCountFromServer(query(collection(db, 'blog_posts'), where('status', '==', 'published'))),
          getCountFromServer(query(collection(db, 'reviews'), where('visible', '==', true))),
        ]);
        setStats({
          newLeads: newLeads.data().count,
          pendingWall: pendingWall.data().count,
          activeListings: activeListings.data().count,
          publishedPosts: publishedPosts.data().count,
          visibleReviews: visibleReviews.data().count,
        });
      } catch {
        // Firestore unavailable or rules not deployed — stats stay null
      }
    }
    fetchStats();
  }, []);

  const navCards = [
    { label: 'Listings', link: '/admin/listings', icon: '✈️' },
    { label: 'Blog Posts', link: '/admin/blog', icon: '📝' },
    { label: 'Leads', link: '/admin/leads', icon: '📬' },
    { label: 'Pricing', link: '/admin/pricing', icon: '💷' },
    { label: 'Images', link: '/admin/images', icon: '🖼️' },
    { label: 'Text Editor', link: '/admin/text', icon: '✍️' },
    { label: 'Analytics', link: '/admin/analytics', icon: '📈' },
    { label: 'Wall of Cool', link: '/admin/wall-of-cool', icon: '📸' },
    { label: 'Reviews', link: '/admin/reviews', icon: '⭐' },
  ];

  return (
    <AdminLayout>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>Dashboard</h1>

      {/* Live stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard
          label="New Leads"
          value={stats.newLeads}
          sub="awaiting reply"
          link="/admin/leads"
          color={stats.newLeads > 0 ? '#dc2626' : '#111827'}
        />
        <StatCard
          label="Pending Wall"
          value={stats.pendingWall}
          sub="needs review"
          link="/admin/wall-of-cool"
          color={stats.pendingWall > 0 ? '#d97706' : '#111827'}
        />
        <StatCard
          label="Active Listings"
          value={stats.activeListings}
          link="/admin/listings"
        />
        <StatCard
          label="Blog Posts"
          value={stats.publishedPosts}
          sub="published"
          link="/admin/blog"
        />
        <StatCard
          label="Reviews Live"
          value={stats.visibleReviews}
          sub="visible on site"
          link="/admin/reviews"
        />
      </div>

      {/* Navigation grid */}
      <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Quick Access</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {navCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem', textDecoration: 'none', display: 'block', transition: 'box-shadow 0.15s' }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
            <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{card.label}</div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
