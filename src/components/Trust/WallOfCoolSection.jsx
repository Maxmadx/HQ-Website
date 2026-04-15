/**
 * WallOfCoolSection — public-facing wall of approved community images.
 *
 * Reads from Firestore `wall_of_cool` (status=approved, type=image),
 * ordered by the `order` field set by admins.
 *
 * Images are lazy-loaded via IntersectionObserver — each img starts with
 * a grey placeholder and swaps to its real src when it enters the viewport.
 */

import { useEffect, useRef, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function WallOfCoolSection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchApproved() {
      try {
        const q = query(
          collection(db, 'wall_of_cool'),
          where('status', '==', 'approved'),
          where('type', '==', 'image'),
          orderBy('order', 'asc'),
        );
        const snap = await getDocs(q);
        setImages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('WallOfCoolSection fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchApproved();
  }, []);

  // Set up IntersectionObserver after images load
  useEffect(() => {
    if (loading || images.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              observerRef.current.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '200px 0px' }, // start loading 200px before entering viewport
    );

    if (containerRef.current) {
      containerRef.current.querySelectorAll('.woc-lazy-img').forEach((img) => {
        observerRef.current.observe(img);
      });
    }

    return () => observerRef.current?.disconnect();
  }, [loading, images]);

  if (loading) return null; // section is invisible while loading — no layout shift
  if (images.length === 0) return null; // nothing to show, hide section entirely

  return (
    <section style={{ padding: '4rem 1.5rem', background: '#f9fafb' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 8 }}>
            Community
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
            Wall of Cool
          </h2>
        </div>

        {/* Image grid */}
        <div ref={containerRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.5rem',
        }}>
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                aspectRatio: '1',
                background: '#e5e7eb',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <img
                className="woc-lazy-img"
                data-src={img.imageUrl}
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt={img.alt || 'Wall of Cool'}
                onLoad={(e) => { e.target.style.opacity = 1; }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
