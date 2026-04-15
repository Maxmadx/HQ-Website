/**
 * DynamicBlogPost - Renders a Firestore blog post using the block format.
 * Uses the same BlogLayout and visual styling as the static JSX blog posts.
 *
 * All user-authored HTML is sanitised with DOMPurify before being injected
 * into the DOM via ref (see SafeHtml component below).
 */

import { useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import BlogLayout from '../blog/components/BlogLayout';

// ─────────────────────────────────────────────
// SafeHtml - renders inline HTML safely via DOMPurify + DOM ref
// Avoids React's dangerouslySetInnerHTML while keeping the same security guarantee.
// ─────────────────────────────────────────────
const ALLOWED = {
  ALLOWED_TAGS: ['strong', 'em', 'u', 'a', 'br', 'span'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'style'],
};

function SafeHtml({ html, tag: Tag = 'span', style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = DOMPurify.sanitize(html || '', ALLOWED);
    }
  }, [html]);
  return <Tag ref={ref} style={style} />;
}

// ─────────────────────────────────────────────
// Callout colour maps (mirrors the static Callout component)
// ─────────────────────────────────────────────
const CALLOUT_COLORS = {
  info:    { bg: '#e7f5ff', border: '#339af0', icon: '#1971c2' },
  warning: { bg: '#fff9db', border: '#fab005', icon: '#e67700' },
  tip:     { bg: '#d3f9d8', border: '#51cf66', icon: '#2f9e44' },
  quote:   { bg: '#f8f9fa', border: '#868e96', icon: '#495057' },
};

// ─────────────────────────────────────────────
// Block Renderers
// ─────────────────────────────────────────────
function BlockRenderer({ block }) {
  const C = CALLOUT_COLORS;

  switch (block.type) {
    case 'paragraph':
      return <SafeHtml html={block.html} tag="p" />;

    case 'heading2':
      return <h2>{block.text}</h2>;

    case 'heading3':
      return <h3>{block.text}</h3>;

    case 'bulletList':
      return (
        <ul>
          {(block.items || []).map((item, i) => (
            <SafeHtml key={i} html={item} tag="li" />
          ))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol>
          {(block.items || []).map((item, i) => (
            <SafeHtml key={i} html={item} tag="li" />
          ))}
        </ol>
      );

    case 'callout': {
      const col = C[block.variant] || C.info;
      return (
        <div style={{
          background: col.bg,
          borderLeft: `4px solid ${col.border}`,
          borderRadius: '0 8px 8px 0',
          padding: '1.25rem 1.5rem',
          margin: '1.5rem 0',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <div style={{ flex: 1 }}>
            {block.title && (
              <h4 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.95rem',
                fontWeight: 600,
                color: col.icon,
                margin: '0 0 0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}>
                {block.title}
              </h4>
            )}
            <div style={{ fontSize: '0.95rem', color: '#495057', lineHeight: 1.6 }}>
              {block.content}
            </div>
          </div>
        </div>
      );
    }

    case 'keypoint':
      return (
        <div style={{ background: '#1a1a1a', color: '#fff', borderRadius: '8px', padding: '1.5rem 2rem', margin: '2rem 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            marginBottom: '1rem', paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ width: 20, height: 20, color: '#51cf66', flexShrink: 0 }}>
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h4 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.85rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              margin: 0, color: '#fff',
            }}>
              {block.title}
            </h4>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {(block.points || []).map((point, i) => (
              <li key={i} style={{
                paddingLeft: '1.25rem', marginBottom: '0.5rem',
                fontSize: '0.95rem', lineHeight: 1.5,
                color: 'rgba(255,255,255,0.9)', position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', left: 0, top: '0.5rem',
                  width: 6, height: 6, background: '#51cf66',
                  borderRadius: '50%', display: 'inline-block',
                }} />
                {point}
              </li>
            ))}
          </ul>
        </div>
      );

    case 'image': {
      if (!block.url) return null;
      const imgStyles = {
        full:   { width: '100%', display: 'block', margin: '1.5rem 0' },
        center: { display: 'block', margin: '1.5rem auto', maxWidth: '75%' },
        left:   { float: 'left', margin: '0 1.5rem 1rem 0', maxWidth: '45%' },
        right:  { float: 'right', margin: '0 0 1rem 1.5rem', maxWidth: '45%' },
      };
      return (
        <figure style={{ margin: '1.5rem 0', overflow: 'hidden' }}>
          <img
            src={block.url}
            alt={block.alt || ''}
            style={{ ...(imgStyles[block.placement] || imgStyles.full), borderRadius: '6px', objectFit: 'cover' }}
          />
          {block.caption && (
            <figcaption style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic', clear: 'both' }}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid #e8e6e2', margin: '2rem 0' }} />;

    default:
      return null;
  }
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
function DynamicBlogPost({ post }) {
  let date = post.date || '';
  if (!date && post.publishedAt) {
    const d = post.publishedAt.toDate ? post.publishedAt.toDate() : new Date(post.publishedAt);
    date = d.toISOString().split('T')[0];
  }

  return (
    <BlogLayout
      postId={post.slug}
      title={post.title}
      category={post.category || 'General'}
      date={date}
      author={post.author || 'HQ Aviation'}
      heroImage={post.coverImage || null}
    >
      {(post.blocks || []).map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </BlogLayout>
  );
}

export default DynamicBlogPost;
