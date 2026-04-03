# HQ Aviation Blog System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a complete blog system with 17 aviation-focused articles as React components, shared UI components, routing, and integration with the existing HQ Aviation website.

**Architecture:** React components per blog post for maximum flexibility. Shared components (BlogLayout, IllustrationPlaceholder, Callout, KeyPoint) provide consistent styling. Dynamic routing maps post IDs to component imports. posts.json stores metadata for listing pages.

**Tech Stack:** React, React Router, CSS-in-JS (inline styles matching existing patterns)

---

## Phase 1: Infrastructure (Tasks 1-5)

### Task 1: Create IllustrationPlaceholder Component

**Files:**
- Create: `src/blog/components/IllustrationPlaceholder.jsx`

**Step 1: Create the component**

```jsx
/**
 * IllustrationPlaceholder - Placeholder card for future illustrations
 * Shows title and description of what graphic should be placed here
 */

function IllustrationPlaceholder({ title, description }) {
  return (
    <div className="illustration-placeholder">
      <div className="illustration-placeholder__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <div className="illustration-placeholder__content">
        <h4 className="illustration-placeholder__title">{title}</h4>
        <p className="illustration-placeholder__description">{description}</p>
      </div>

      <style>{`
        .illustration-placeholder {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px dashed #ced4da;
          border-radius: 8px;
          padding: 2rem;
          margin: 2rem 0;
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .illustration-placeholder__icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          background: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .illustration-placeholder__icon svg {
          width: 24px;
          height: 24px;
          color: #868e96;
        }

        .illustration-placeholder__content {
          flex: 1;
        }

        .illustration-placeholder__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #495057;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .illustration-placeholder__description {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default IllustrationPlaceholder;
```

**Step 2: Commit**

```bash
git add src/blog/components/IllustrationPlaceholder.jsx
git commit -m "feat(blog): add IllustrationPlaceholder component"
```

---

### Task 2: Create Callout Component

**Files:**
- Create: `src/blog/components/Callout.jsx`

**Step 1: Create the component**

```jsx
/**
 * Callout - Styled boxes for tips, warnings, and key information
 * Variants: info, warning, tip, quote
 */

function Callout({ variant = 'info', title, children }) {
  const icons = {
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
      </svg>
    ),
    tip: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    quote: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
      </svg>
    )
  };

  const colors = {
    info: { bg: '#e7f5ff', border: '#339af0', icon: '#1971c2' },
    warning: { bg: '#fff9db', border: '#fab005', icon: '#e67700' },
    tip: { bg: '#d3f9d8', border: '#51cf66', icon: '#2f9e44' },
    quote: { bg: '#f8f9fa', border: '#868e96', icon: '#495057' }
  };

  const color = colors[variant] || colors.info;

  return (
    <div className={`callout callout--${variant}`} style={{
      background: color.bg,
      borderLeft: `4px solid ${color.border}`,
      borderRadius: '0 8px 8px 0',
      padding: '1.25rem 1.5rem',
      margin: '1.5rem 0',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start'
    }}>
      <div style={{
        flexShrink: 0,
        width: '24px',
        height: '24px',
        color: color.icon
      }}>
        {icons[variant]}
      </div>
      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.95rem',
            fontWeight: 600,
            color: color.icon,
            margin: '0 0 0.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '0.03em'
          }}>
            {title}
          </h4>
        )}
        <div style={{
          fontSize: '0.95rem',
          color: '#495057',
          lineHeight: 1.6
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Callout;
```

**Step 2: Commit**

```bash
git add src/blog/components/Callout.jsx
git commit -m "feat(blog): add Callout component with info/warning/tip/quote variants"
```

---

### Task 3: Create KeyPoint Component

**Files:**
- Create: `src/blog/components/KeyPoint.jsx`

**Step 1: Create the component**

```jsx
/**
 * KeyPoint - Highlighted summary box for key takeaways
 */

function KeyPoint({ title = "Key Takeaways", points }) {
  return (
    <div className="key-point">
      <div className="key-point__header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h4>{title}</h4>
      </div>
      <ul className="key-point__list">
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>

      <style>{`
        .key-point {
          background: #1a1a1a;
          color: #fff;
          border-radius: 8px;
          padding: 1.5rem 2rem;
          margin: 2rem 0;
        }

        .key-point__header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .key-point__header svg {
          width: 20px;
          height: 20px;
          color: #51cf66;
        }

        .key-point__header h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0;
          color: #fff;
        }

        .key-point__list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .key-point__list li {
          position: relative;
          padding-left: 1.25rem;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          line-height: 1.5;
          color: rgba(255,255,255,0.9);
        }

        .key-point__list li:last-child {
          margin-bottom: 0;
        }

        .key-point__list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.5rem;
          width: 6px;
          height: 6px;
          background: #51cf66;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

export default KeyPoint;
```

**Step 2: Commit**

```bash
git add src/blog/components/KeyPoint.jsx
git commit -m "feat(blog): add KeyPoint component for key takeaways"
```

---

### Task 4: Create BlogLayout Component

**Files:**
- Create: `src/blog/components/BlogLayout.jsx`

**Step 1: Create the component**

```jsx
/**
 * BlogLayout - Common wrapper for all blog posts
 * Provides hero, metadata, navigation, and related posts
 */

import { Link } from 'react-router-dom';
import posts from '../posts.json';

function BlogLayout({
  postId,
  title,
  category,
  date,
  author = "HQ Aviation",
  heroImage,
  children
}) {
  // Calculate reading time from content
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get related posts (same category, excluding current)
  const relatedPosts = posts
    .filter(p => p.category === category && p.id !== postId && p.published)
    .slice(0, 2);

  return (
    <article className="blog-post">
      {/* Back Navigation */}
      <div className="blog-post__nav">
        <Link to="/blog" className="blog-post__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All Articles
        </Link>
      </div>

      {/* Hero Section */}
      {heroImage && (
        <div className="blog-post__hero">
          <img src={heroImage} alt={title} />
          <div className="blog-post__hero-overlay" />
        </div>
      )}

      {/* Header */}
      <header className="blog-post__header">
        <span className="blog-post__category">{category}</span>
        <h1 className="blog-post__title">{title}</h1>
        <div className="blog-post__meta">
          <span className="blog-post__author">{author}</span>
          <span className="blog-post__divider">•</span>
          <time className="blog-post__date">{formatDate(date)}</time>
        </div>
      </header>

      {/* Content */}
      <div className="blog-post__content">
        {children}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <aside className="blog-post__related">
          <h3>Continue Reading</h3>
          <div className="blog-post__related-grid">
            {relatedPosts.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="blog-post__related-card"
              >
                <span className="blog-post__related-category">{post.category}</span>
                <h4>{post.title}</h4>
              </Link>
            ))}
          </div>
        </aside>
      )}

      <style>{`
        .blog-post {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .blog-post__nav {
          margin-bottom: 2rem;
        }

        .blog-post__back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .blog-post__back:hover {
          color: #1a1a1a;
        }

        .blog-post__back svg {
          width: 18px;
          height: 18px;
        }

        .blog-post__hero {
          position: relative;
          margin: 0 -2rem 2rem;
          height: 400px;
          overflow: hidden;
        }

        .blog-post__hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .blog-post__hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(transparent, rgba(0,0,0,0.3));
        }

        .blog-post__header {
          text-align: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e8e6e2;
        }

        .blog-post__category {
          display: inline-block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
          margin-bottom: 1rem;
        }

        .blog-post__title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1rem;
          line-height: 1.2;
        }

        .blog-post__meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: #666;
          font-size: 0.9rem;
        }

        .blog-post__divider {
          color: #ccc;
        }

        .blog-post__content {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #333;
        }

        .blog-post__content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 3rem 0 1.5rem;
        }

        .blog-post__content h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 2.5rem 0 1rem;
        }

        .blog-post__content p {
          margin: 0 0 1.5rem;
        }

        .blog-post__content ul,
        .blog-post__content ol {
          margin: 0 0 1.5rem;
          padding-left: 1.5rem;
        }

        .blog-post__content li {
          margin-bottom: 0.5rem;
        }

        .blog-post__content strong {
          color: #1a1a1a;
        }

        .blog-post__related {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid #e8e6e2;
        }

        .blog-post__related h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin: 0 0 1.5rem;
        }

        .blog-post__related-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .blog-post__related-card {
          display: block;
          padding: 1.5rem;
          background: #f8f9fa;
          text-decoration: none;
          transition: all 0.2s;
        }

        .blog-post__related-card:hover {
          background: #1a1a1a;
        }

        .blog-post__related-card:hover h4,
        .blog-post__related-card:hover .blog-post__related-category {
          color: #fff;
        }

        .blog-post__related-category {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin-bottom: 0.5rem;
          transition: color 0.2s;
        }

        .blog-post__related-card h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.3;
          transition: color 0.2s;
        }

        @media (max-width: 768px) {
          .blog-post {
            padding: 1rem;
          }

          .blog-post__hero {
            margin: 0 -1rem 1.5rem;
            height: 250px;
          }

          .blog-post__title {
            font-size: 1.75rem;
          }

          .blog-post__related-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </article>
  );
}

export default BlogLayout;
```

**Step 2: Commit**

```bash
git add src/blog/components/BlogLayout.jsx
git commit -m "feat(blog): add BlogLayout component with hero, metadata, and related posts"
```

---

### Task 5: Create Blog Listing Page and Router Setup

**Files:**
- Create: `src/pages/Blog.jsx`
- Modify: `src/App.jsx`

**Step 1: Create Blog listing page**

```jsx
/**
 * Blog - Blog listing page showing all published posts
 */

import { Link } from 'react-router-dom';
import posts from '../blog/posts.json';

function Blog() {
  const publishedPosts = posts
    .filter(post => post.published && post.title)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  // Group by category
  const categories = [...new Set(publishedPosts.map(p => p.category))];

  return (
    <div className="blog-listing">
      <header className="blog-listing__header">
        <h1>From the Hangar</h1>
        <p>Insights, guides, and stories from the HQ Aviation team</p>
      </header>

      <div className="blog-listing__grid">
        {publishedPosts.map(post => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="blog-listing__card"
          >
            {post.image && (
              <div
                className="blog-listing__card-image"
                style={{ backgroundImage: `url(${post.image})` }}
              />
            )}
            <div className="blog-listing__card-content">
              <span className="blog-listing__card-category">{post.category}</span>
              <h2 className="blog-listing__card-title">{post.title}</h2>
              <p className="blog-listing__card-excerpt">{post.excerpt}</p>
              <div className="blog-listing__card-meta">
                <span>{formatDate(post.date)}</span>
                <span>{post.readingTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .blog-listing {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .blog-listing__header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .blog-listing__header h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1rem;
        }

        .blog-listing__header p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }

        .blog-listing__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .blog-listing__card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid #e8e6e2;
          text-decoration: none;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .blog-listing__card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          border-color: #1a1a1a;
        }

        .blog-listing__card-image {
          height: 200px;
          background-size: cover;
          background-position: center;
        }

        .blog-listing__card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .blog-listing__card-category {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .blog-listing__card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.75rem;
          line-height: 1.3;
        }

        .blog-listing__card-excerpt {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
          margin: 0 0 1rem;
          flex: 1;
        }

        .blog-listing__card-meta {
          display: flex;
          justify-content: space-between;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: #999;
          letter-spacing: 0.05em;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }

        @media (max-width: 1024px) {
          .blog-listing__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .blog-listing {
            padding: 2rem 1rem;
          }

          .blog-listing__header h1 {
            font-size: 2rem;
          }

          .blog-listing__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Blog;
```

**Step 2: Commit**

```bash
git add src/pages/Blog.jsx
git commit -m "feat(blog): add Blog listing page"
```

---

## Phase 2: Blog Posts (Tasks 6-22)

Each blog post follows the same structure. I'll provide the full content for each.

### Task 6: Create PPL Guide Blog Post

**Files:**
- Create: `src/pages/blog/PPLGuide.jsx`

**Step 1: Create the blog post**

```jsx
/**
 * PPLGuide - Your Journey to the Cockpit: A Guide to the PPL(H)
 */

import BlogLayout from '../../blog/components/BlogLayout';
import IllustrationPlaceholder from '../../blog/components/IllustrationPlaceholder';
import Callout from '../../blog/components/Callout';
import KeyPoint from '../../blog/components/KeyPoint';

function PPLGuide() {
  return (
    <BlogLayout
      postId="ppl-guide"
      title="Your Journey to the Cockpit: A Guide to the PPL(H)"
      category="Training"
      date="2026-02-10"
      heroImage="/assets/images/training/home-2312.jpg"
    >
      <p>
        There's a moment every pilot remembers—the first time the helicopter lifts off the ground and you realise that <em>you</em> made it happen. Your hands are on the controls, your feet are working the pedals, and suddenly the earth is falling away beneath you. For many, this is the beginning of a lifelong passion. If you're reading this, chances are you've felt that pull towards the sky. The question now is: how do you get there?
      </p>

      <p>
        The Private Pilot Licence for Helicopters, or PPL(H), is your gateway to the world of rotary-wing aviation. It's the licence that allows you to fly helicopters for private purposes—exploring the British countryside, visiting friends at their country estates, or simply experiencing the unparalleled freedom of vertical flight. Here at HQ Aviation, we've guided hundreds of students through this journey, and we've learned what makes the difference between a challenging slog and an exhilarating adventure.
      </p>

      <h2>What Exactly Is a PPL(H)?</h2>

      <p>
        The PPL(H) is regulated by the UK Civil Aviation Authority (CAA) and follows European Aviation Safety Agency (EASA) standards. It authorises you to act as pilot-in-command of a helicopter, carrying passengers, but not for commercial purposes or reward. Think of it as your driving licence for the sky—essential, personal, and the foundation for everything else.
      </p>

      <IllustrationPlaceholder
        title="PPL(H) Training Pathway Diagram"
        description="A visual flowchart showing the journey from trial lesson through ground school, flight training phases, skills test, and licence issue. Include approximate timeframes at each stage."
      />

      <p>
        The licence requires a minimum of 45 hours of flight training, though most students complete between 50 and 60 hours before their skills test. This isn't a reflection of ability—it's simply how humans learn complex psychomotor skills. Every hour in the aircraft is building neural pathways, developing muscle memory, and deepening your understanding of this remarkable machine.
      </p>

      <h2>The Ground School: Building Your Foundation</h2>

      <p>
        Before you can master the skies, you need to understand them. The PPL(H) requires you to pass nine theoretical knowledge examinations, covering subjects that range from the poetic (meteorology, navigation) to the practical (air law, human performance). These aren't obstacles—they're the foundation that keeps you safe.
      </p>

      <Callout variant="info" title="The Nine Ground Exams">
        <p>Air Law • Human Performance • Meteorology • Communications • Principles of Flight • Operational Procedures • Flight Performance & Planning • Aircraft General Knowledge • Navigation</p>
      </Callout>

      <p>
        At HQ Aviation, we offer comprehensive ground school courses, but many students choose to self-study using approved materials and online courses. The exams are computer-based and can be taken at the CAA-approved testing centre here at Denham. There's no shame in multiple attempts—these subjects are genuinely challenging, and the goal is understanding, not just passing.
      </p>

      <h2>Your First Flight: The Trial Lesson</h2>

      <p>
        Every journey begins with a single step—or in our case, a single lift-off. The trial lesson, typically 30 minutes to an hour of flight time, is designed to give you a genuine taste of helicopter flying. This isn't a passive sightseeing tour. Within minutes of becoming airborne, your instructor will hand you the controls and guide you through basic manoeuvres.
      </p>

      <p>
        You'll discover something fascinating: helicopters want to fly. Despite their reputation for complexity, a well-trimmed helicopter in forward flight is remarkably stable. The challenge comes in the hover—but we'll get to that.
      </p>

      <IllustrationPlaceholder
        title="Helicopter Control Inputs"
        description="An annotated diagram of a helicopter cockpit showing the cyclic stick (directional control), collective lever (altitude/power), and anti-torque pedals (yaw control). Arrows indicating direction of movement and aircraft response."
      />

      <h2>The Training Phases</h2>

      <h3>Phase 1: Basic Handling (Hours 1-15)</h3>

      <p>
        The early lessons focus on the fundamentals: straight and level flight, climbing, descending, and turning. You'll learn to coordinate the three primary controls—cyclic, collective, and pedals—which initially feel like patting your head whilst rubbing your stomach whilst balancing on one foot. This is normal. This is everyone's experience.
      </p>

      <p>
        Your instructor will demonstrate, then hand over control, then take it back, in a carefully choreographed dance designed to build your confidence without overwhelming your cognitive capacity. Progress isn't linear; some days you'll feel like a natural, others like you've never seen a helicopter before. Both feelings are temporary and equally misleading.
      </p>

      <h3>Phase 2: The Hover (Hours 10-25)</h3>

      <p>
        Ah, the hover. The manoeuvre that defines helicopter flight and the source of more student frustration than any other. Hovering a helicopter is often compared to balancing a marble on a basketball—while the basketball is on a wobbly table—during an earthquake. This is only slightly exaggerated.
      </p>

      <Callout variant="tip" title="The Hovering Breakthrough">
        <p>Most students experience a "click" moment with hovering, typically between hours 15 and 20. One day it simply makes sense. Until then, trust the process and trust your instructor. The skills are developing even when progress feels invisible.</p>
      </Callout>

      <p>
        The hover requires constant, tiny corrections on all three controls simultaneously. Your brain must process visual references, feel the aircraft's movements, and respond with appropriate inputs—all faster than conscious thought allows. You're essentially training your subconscious mind, which takes time and repetition.
      </p>

      <IllustrationPlaceholder
        title="The Hover: Visual Reference Points"
        description="A pilot's-eye view from the cockpit during a hover, with annotations showing proper sight picture, reference points on the ground, and the relationship between visual cues and control inputs."
      />

      <h3>Phase 3: Circuit Flying and Emergencies (Hours 20-35)</h3>

      <p>
        Circuit flying—the rectangular pattern around an airfield—teaches you to manage the aircraft in a structured environment while coordinating with other traffic and air traffic control. You'll practice takeoffs, approaches, and landings until they become second nature.
      </p>

      <p>
        This phase also introduces emergency procedures. Engine failures, tail rotor malfunctions, instrument failures—you'll learn to handle them all in simulation. The most important of these is the autorotation, the controlled descent that allows a helicopter to land safely without engine power. It's a beautiful demonstration of physics and a vital skill that we practice regularly.
      </p>

      <h3>Phase 4: Navigation and Solo Flight (Hours 25-45)</h3>

      <p>
        Cross-country navigation transforms you from a pilot who can fly to a pilot who can go places. You'll plan routes, calculate fuel requirements, navigate by visual references and radio aids, and learn to make real-time decisions about weather and diversions.
      </p>

      <p>
        And then comes the moment: your first solo flight. Your instructor will step out of the aircraft, close the door, and watch as you lift off alone for the first time. It's terrifying, exhilarating, and unforgettable. Most students describe it as one of the peak experiences of their lives.
      </p>

      <h2>The Skills Test</h2>

      <p>
        After completing your training hours and passing all ground exams, you'll face the skills test—a comprehensive practical examination conducted by a CAA-approved examiner. The test covers all aspects of your training: flight planning, normal and emergency procedures, navigation, and decision-making.
      </p>

      <p>
        The key to success is not perfection but competence. Examiners are looking for safe, capable pilots who understand their limitations. Small errors are expected and accepted; it's how you recognise and correct them that matters.
      </p>

      <KeyPoint
        title="PPL(H) Requirements Summary"
        points={[
          "Minimum 45 hours flight training (typically 50-60 hours)",
          "10 hours solo flight time minimum",
          "5 hours solo cross-country, including one flight of at least 100nm",
          "9 theoretical knowledge examinations",
          "Skills test with CAA-approved examiner",
          "Class 2 medical certificate (or LAPL medical)"
        ]}
      />

      <h2>Cost and Timeframe</h2>

      <p>
        Let's address the practical questions. A PPL(H) typically costs between £15,000 and £25,000, depending on how many hours you need and which aircraft you train in. The Robinson R22, our primary training helicopter, offers the most economical route whilst providing an excellent learning platform.
      </p>

      <p>
        Timeframe varies enormously based on your availability and weather. Training intensively, you could complete the course in three to six months. Flying once a week, expect 12 to 18 months. Regularity matters more than intensity; skills consolidate between lessons if the gaps aren't too long.
      </p>

      <h2>The Beginning, Not the End</h2>

      <p>
        Your PPL(H) is not a destination—it's a departure point. From here, you might add type ratings for different helicopters, obtain a night qualification, pursue a commercial licence, or simply enjoy flying for the sheer joy of it. You'll join a community of pilots who share your passion, swap stories in the clubhouse, and understand why you check the weather forecast with slightly obsessive frequency.
      </p>

      <p>
        At HQ Aviation, we believe that learning to fly should be as enjoyable as flying itself. Our instructors are passionate aviators first and teachers second. We've created an environment where questions are encouraged, mistakes are learning opportunities, and progress is celebrated.
      </p>

      <Callout variant="quote">
        <p>"The engine is the heart of an aeroplane, but the pilot is its soul." — Walter Raleigh</p>
      </Callout>

      <p>
        Ready to begin? Book a trial lesson and discover what thousands before you have found: that learning to fly a helicopter is challenging, rewarding, occasionally frustrating, and ultimately one of the most fulfilling things you'll ever do. We'll see you at Denham.
      </p>
    </BlogLayout>
  );
}

export default PPLGuide;
```

**Step 2: Commit**

```bash
git add src/pages/blog/PPLGuide.jsx
git commit -m "feat(blog): add PPL Guide blog post"
```

---

### Task 7: Create Mastering the Hover Blog Post

**Files:**
- Create: `src/pages/blog/MasteringTheHover.jsx`

**Step 1: Create the blog post**

```jsx
/**
 * MasteringTheHover - Tips for Student Pilots
 */

import BlogLayout from '../../blog/components/BlogLayout';
import IllustrationPlaceholder from '../../blog/components/IllustrationPlaceholder';
import Callout from '../../blog/components/Callout';
import KeyPoint from '../../blog/components/KeyPoint';

function MasteringTheHover() {
  return (
    <BlogLayout
      postId="mastering-the-hover"
      title="Mastering the Hover: Tips for Student Pilots"
      category="Training"
      date="2026-02-08"
      heroImage="/assets/images/gallery/flying/flying-.jpg"
    >
      <p>
        "I just can't seem to get it." If we had a pound for every time a student pilot has said this about hovering, we could probably buy another helicopter. The hover is the defining skill of rotary-wing flight, and it's also the most challenging thing most students will ever learn to do with their hands and feet. But here's the good news: everyone gets it eventually. Everyone.
      </p>

      <p>
        At HQ Aviation, our instructors have collectively taught thousands of students to hover. We've seen patterns—what works, what doesn't, and the subtle shifts in technique and mindset that transform a struggling student into a confident pilot. This article distills that experience into practical advice you can apply in your next lesson.
      </p>

      <h2>Why Is Hovering So Difficult?</h2>

      <p>
        Before we talk about solutions, let's understand the problem. A helicopter in the hover is inherently unstable. Unlike a fixed-wing aircraft, which generally wants to keep flying straight, a hovering helicopter wants to do something different every second. It's affected by wind gusts, ground effect variations, rotor downwash patterns, and its own control inputs—all simultaneously.
      </p>

      <IllustrationPlaceholder
        title="Forces Acting on a Hovering Helicopter"
        description="A diagram showing the four forces (lift, weight, thrust, drag) acting on a helicopter in the hover, plus the destabilising effects of wind, ground effect, and torque reaction."
      />

      <p>
        To maintain position, you must constantly adjust three controls: the cyclic (fore/aft and lateral movement), the collective (height), and the pedals (yaw). Each control affects the others. Raise the collective and the torque increases, requiring more left pedal. Apply cyclic and the rotor disc attitude changes, affecting your lift and requiring collective adjustment. It's a continuous, three-dimensional juggling act.
      </p>

      <p>
        Your brain isn't designed for this. We evolved to walk on two legs, perhaps throw a spear, certainly not to coordinate six simultaneous variables whilst suspended in mid-air. The skills you're developing are genuinely unnatural—which is exactly what makes them so rewarding to master.
      </p>

      <h2>The Mental Game</h2>

      <h3>Tip 1: Accept the Wobble</h3>

      <p>
        New students often try to hover perfectly still. This is counterproductive. A helicopter in the hover is always moving, always requiring correction. Your job isn't to prevent movement—it's to recognise it early and correct smoothly. Accept small movements as normal. Only when movement becomes large or accelerating should you be concerned.
      </p>

      <Callout variant="tip" title="The One-Second Rule">
        <p>If you haven't made a control input in the last second, you've probably waited too long. Good hovering feels like constantly adjusting, not like holding position. Stillness is an illusion created by thousands of tiny corrections.</p>
      </Callout>

      <h3>Tip 2: Look Far, Think Slow</h3>

      <p>
        Where your eyes go, your attention follows. Staring at the ground directly in front of the helicopter gives you excellent information about small movements—and causes you to overcontrol catastrophically. Instead, look further ahead, 50-100 metres, and use your peripheral vision to sense the aircraft's movement.
      </p>

      <p>
        Similarly, slow down your mental processing. The helicopter feels fast because your brain is processing slowly. As you gain experience, the same movements will feel increasingly leisurely. For now, consciously tell yourself: "I have time. I have time."
      </p>

      <IllustrationPlaceholder
        title="Visual Reference for Hovering"
        description="A pilot's-eye view showing correct sight picture during hover: distant reference points in focus, ground in peripheral vision, horizon visible at top of windscreen."
      />

      <h3>Tip 3: Breathe and Relax</h3>

      <p>
        This sounds trite. It isn't. When stressed, humans tense up—including the hands and feet holding the controls. Tense hands make large, jerky inputs. The helicopter responds sharply, causing more stress, causing more tension. It's a vicious cycle.
      </p>

      <p>
        Consciously relax your shoulders. Let your elbows drop. Hold the cyclic like a small bird—firm enough that it can't escape, gentle enough that you won't crush it. Breathe out. The helicopter will feel different immediately.
      </p>

      <h2>The Physical Technique</h2>

      <h3>Tip 4: Small Inputs, Early Inputs</h3>

      <p>
        The most common student error is waiting until movement is obvious, then making a large correction, which causes movement in the opposite direction, requiring another large correction. This pilot-induced oscillation (PIO) is exhausting and terrifying.
      </p>

      <p>
        The solution is to make small inputs early. When you first sense movement—before you can really see it—apply a small correction. If you were right, the movement stops. If you were wrong, the error is small enough to easily correct. Small and early beats large and late every time.
      </p>

      <KeyPoint
        title="The Golden Rule of Hovering"
        points={[
          "Small inputs made early create gentle corrections",
          "Large inputs made late create oscillations",
          "If in doubt, make a smaller input",
          "Overcorrection is worse than undercorrection"
        ]}
      />

      <h3>Tip 5: One Control at a Time</h3>

      <p>
        In the early stages, don't try to manage all three controls simultaneously. Your instructor will likely start you with cyclic only, maintaining height and heading themselves. Master this before adding collective. Master that before taking the pedals. Trying to do everything at once is the path to frustration.
      </p>

      <p>
        Even experienced pilots prioritise. The cyclic controls position and must be attended constantly. The collective changes more slowly. The pedals can be momentarily neglected. Learn to cycle your attention: cyclic-cyclic-cyclic-collective-cyclic-cyclic-pedal-cyclic. This mental pattern helps prevent task saturation.
      </p>

      <h3>Tip 6: Use the Horizon</h3>

      <p>
        In the hover, the helicopter's attitude relative to the horizon tells you everything. If the nose is pitched down, you'll move forward. If the rotor disc is tilted right, you'll drift right. The helicopter goes where the rotor disc points.
      </p>

      <IllustrationPlaceholder
        title="Rotor Disc Attitude and Movement"
        description="Four panels showing helicopter from behind: disc level (hover), disc tilted forward (forward movement), disc tilted left (left drift), disc tilted right (right drift). Arrows indicating direction of travel."
      />

      <p>
        Learn to read the aircraft's attitude before movement develops. This is predictive hovering—correcting for what's about to happen, not what's already happened. It takes practice, but it transforms hovering from reactive firefighting to proactive control.
      </p>

      <h2>Common Problems and Fixes</h2>

      <h3>"I Keep Drifting Right"</h3>

      <p>
        In the Robinson R22 and R44, the tail rotor is on the left, pushing the nose right. This requires constant small left cyclic input to maintain position. New students often forget this, especially when distracted by height control. Make it a habit: slight left pressure is normal.
      </p>

      <h3>"I Can't Maintain Height"</h3>

      <p>
        Height control is actually the easiest of the three, but it feels hardest because the consequences of error are most obvious. The key is to look at distant references, not the ground. Your peripheral vision is excellent at detecting height changes if your focused vision isn't fixated downward.
      </p>

      <Callout variant="warning" title="The Over-Eager Collective">
        <p>Large collective inputs cause large power changes, requiring large pedal inputs, affecting heading, requiring cyclic correction. Keep collective inputs small and smooth. If you're climbing or descending, small adjustments made early will fix it without disrupting everything else.</p>
      </Callout>

      <h3>"Everything Goes Wrong at Once"</h3>

      <p>
        This is normal. It happens because everything is connected. The good news: it's usually one initiating error cascading into others. Find the source. Often it's a collective input you didn't notice making, or a cyclic movement that started everything. Fix the source and the cascade stops.
      </p>

      <h2>The Breakthrough Moment</h2>

      <p>
        Students often ask when they'll "get it." The answer is individual, but typically between 15 and 20 hours. The breakthrough doesn't come gradually—it comes suddenly. One day you're struggling, the next day it simply makes sense. The helicopter feels different, lighter, more responsive.
      </p>

      <p>
        What's actually happened is that your brain has automated the basic scan and correction. What required conscious effort now happens subconsciously, freeing your attention for higher-level tasks. It's the same process as learning to drive—remember how overwhelming that was at first?
      </p>

      <p>
        Until that breakthrough, trust the process. Every hour in the hover, regardless of how it feels, is building the neural pathways you need. Progress is happening even when it doesn't feel like it. Frustration is normal. Temporary regression is normal. The breakthrough is coming.
      </p>

      <KeyPoint
        title="Remember These Five Things"
        points={[
          "Look far ahead, use peripheral vision for position",
          "Small inputs, early inputs—always",
          "Relax your hands, breathe, slow down",
          "Accept movement as normal—your job is smooth correction",
          "Trust the process—the breakthrough will come"
        ]}
      />

      <h2>A Final Thought</h2>

      <p>
        Every instructor at HQ Aviation struggled with the hover as a student. Every one of us had moments of frustration, lessons that felt like backward steps, days when we wondered if we'd ever master it. And every one of us eventually did.
      </p>

      <p>
        You will too. The hover is difficult, but it's not impossible. Thousands of pilots before you have learned it, many with less natural aptitude than you probably have. What separates those who succeed from those who don't isn't talent—it's persistence.
      </p>

      <p>
        Keep flying. Keep practicing. Keep trusting your instructor. One day soon, you'll lift into the hover and realise that you're not struggling anymore. You're just... hovering. And in that moment, you'll understand why we all love helicopter flying so much.
      </p>

      <p>
        See you in the hover lane.
      </p>
    </BlogLayout>
  );
}

export default MasteringTheHover;
```

**Step 2: Commit**

```bash
git add src/pages/blog/MasteringTheHover.jsx
git commit -m "feat(blog): add Mastering the Hover blog post"
```

---

### Task 8: Create Winter Flying Blog Post

**Files:**
- Create: `src/pages/blog/WinterFlying.jsx`

**Step 1: Create the blog post**

```jsx
/**
 * WinterFlying - Winter Flying at Denham: Safety and Preparation
 */

import BlogLayout from '../../blog/components/BlogLayout';
import IllustrationPlaceholder from '../../blog/components/IllustrationPlaceholder';
import Callout from '../../blog/components/Callout';
import KeyPoint from '../../blog/components/KeyPoint';

function WinterFlying() {
  return (
    <BlogLayout
      postId="winter-flying"
      title="Winter Flying at Denham: Safety and Preparation"
      category="Operations"
      date="2026-02-05"
      heroImage="/assets/images/facility/hq-0745.jpg"
    >
      <p>
        There's a particular magic to winter flying that only those who've experienced it truly understand. The air is dense and cold, giving your helicopter a performance boost that makes it feel like a different machine. The visibility on a crisp December morning can stretch for miles, revealing a patchwork of frost-covered fields and bare woodlands that looks like something from a Christmas card. And the skies are often quieter, with fair-weather pilots grounded and the airspace yours to explore.
      </p>

      <p>
        But winter flying also demands respect. The same conditions that make it beautiful also make it unforgiving. At HQ Aviation, we fly throughout the year, and we've learned that the key to safe winter operations is preparation—both of the aircraft and the pilot. Here's what you need to know.
      </p>

      <h2>Understanding Winter Weather</h2>

      <p>
        The British winter presents a particular set of challenges. Unlike the dramatic snowstorms of more continental climates, our winters tend towards grey murk, persistent low cloud, and insidious moisture that seems to get into everything. Learning to read winter weather is an essential skill.
      </p>

      <h3>Fog and Low Visibility</h3>

      <p>
        Radiation fog forms on clear, calm nights when the ground loses heat and cools the air above it to dewpoint. It's typically thickest just after dawn and burns off by mid-morning—but not always. Advection fog, caused by warm air moving over cold ground, can persist all day. Either type can reduce visibility to below VFR minima with remarkable speed.
      </p>

      <IllustrationPlaceholder
        title="Fog Formation Types"
        description="Two panel diagram comparing radiation fog (clear night, ground cooling, typically valleys and low areas) versus advection fog (warm moist air over cold surface, can persist all day). Show temperature gradients and typical conditions."
      />

      <Callout variant="warning" title="The Fog Decision">
        <p>If fog is forecast, or if you can see fog forming in nearby valleys, have an out. Know where the nearest clear airfield is. Better yet, adjust your timing to avoid the high-risk periods entirely. Fog accidents are almost always preventable with better decision-making.</p>
      </Callout>

      <h3>Low Cloud and Grey Days</h3>

      <p>
        Stratus cloud is the pilot's winter nemesis. It forms in stable air when moisture condenses at a uniform height, creating a grey ceiling that can lower gradually over hours. The challenge is that it often sits just above or at circuit height, making departure possible but return problematic.
      </p>

      <p>
        Check the weather not just for your departure, but for your entire flight and your arrival. Conditions that are fine at 10am may be unflyable by noon. Always have alternates, and be genuinely willing to use them.
      </p>

      <h2>The Aircraft: Cold Weather Preparation</h2>

      <h3>Pre-Flight Considerations</h3>

      <p>
        Your pre-flight inspection in winter requires additional attention. Look for frost on any surface—it doesn't take much to disrupt airflow and degrade performance. Check for ice in the pitot tube and static ports. Verify that control surfaces move freely and haven't been stiffened by frozen moisture in the hinges.
      </p>

      <IllustrationPlaceholder
        title="Winter Pre-Flight Checklist Focus Areas"
        description="Helicopter diagram with highlighted areas requiring special winter attention: pitot/static system, control hinges, rotor head components, oil cooler, carburettor intake, windscreen, fuel tank vents."
      />

      <p>
        Our operations team clears snow and ice from the aircraft, but you as pilot-in-command must verify that the aircraft is clean before flight. Run your hand over the rotor blades—even a thin layer of frost can cause significant vibration and performance degradation.
      </p>

      <h3>Engine Starting and Warm-Up</h3>

      <p>
        Cold engines need care. Oil is thicker when cold, providing less lubrication during the critical start-up phase. Follow the POH procedures precisely—they exist for good reason. Don't rush the warm-up; give the oil temperature time to reach the green arc before applying significant power.
      </p>

      <p>
        In the Robinson helicopters, pay particular attention to the clutch engagement. Cold clutches engage more slowly; ensure the belts are fully tight before lifting off. The clutch light sequence is your friend—watch it carefully on cold mornings.
      </p>

      <h3>Carburettor Icing: The Invisible Threat</h3>

      <p>
        Carburettor icing is one of aviation's most insidious hazards, and winter makes it more likely, not less. As air passes through the carburettor venturi, it can cool by 30°C or more. This means carburettor ice can form when the outside air temperature is as high as 30°C—and it's most likely between -10°C and +20°C when moisture is present.
      </p>

      <KeyPoint
        title="Carburettor Ice: Know the Signs"
        points={[
          "Unexplained drop in RPM (piston helicopters)",
          "Engine roughness or fluctuations",
          "Most likely: OAT 0-15°C with visible moisture or high humidity",
          "Apply carb heat before symptoms appear in high-risk conditions",
          "Full carb heat—partial application can make it worse"
        ]}
      />

      <Callout variant="info" title="Carb Heat Protocol">
        <p>In the R22 and R44, apply full carburettor heat whenever operating in conditions conducive to icing. This typically means any time the OAT is below 20°C and humidity is visible (cloud, mist, rain) or above 50%. Check your POH for specific guidance, and when in doubt, apply heat.</p>
      </Callout>

      <h2>The Pilot: Personal Preparation</h2>

      <h3>Dress Appropriately</h3>

      <p>
        Helicopter cabins can be cold, especially in the hover when the heater is working against open doors or during an extended ground run. Dress in layers that you can adjust. Avoid bulky clothing that restricts movement or interferes with controls.
      </p>

      <p>
        Good footwear matters more than you might think. You need to feel the pedals precisely, which is harder in thick winter boots. Consider dedicated flying shoes or thin-soled boots that provide warmth without excessive bulk.
      </p>

      <h3>Cognitive Effects of Cold</h3>

      <p>
        Cold affects thinking. Even mild cold stress can reduce decision-making quality, slow reaction times, and impair fine motor skills. If you're uncomfortable, you're probably not flying at your best. There's no heroism in suffering—use the heater, dress properly, and if you're too cold to think clearly, land and warm up.
      </p>

      <IllustrationPlaceholder
        title="Effects of Cold on Pilot Performance"
        description="An infographic showing how mild, moderate, and severe cold affects cognition, motor skills, and decision-making. Include practical tips for mitigation at each level."
      />

      <h2>Operational Considerations</h2>

      <h3>Shorter Days</h3>

      <p>
        Winter means less daylight. Unless you hold a night rating, your flying window compresses significantly. Sunset in mid-December is before 4pm; by the time you account for 30-minute buffers, your last landing needs to be complete by mid-afternoon.
      </p>

      <p>
        Plan accordingly. Early starts make sense—the air is often calmest in the morning, and you maximise available daylight. Don't be tempted to "just finish this one thing" as darkness approaches. The penalties for getting it wrong are severe.
      </p>

      <h3>Ground Conditions</h3>

      <p>
        Wet grass becomes slippery. Frozen grass can damage skids or wheels during ground runs. Snow hides obstacles and can obscure the horizon during takeoff and landing, creating a white-out effect. Even frost changes the surface—it's harder, which affects autorotation landings and ground handling.
      </p>

      <p>
        At Denham, our operations team monitors conditions and will advise if taxiways or dispersals are unusable. Trust their judgement—they see conditions on the ground that aren't visible from the air.
      </p>

      <h2>The Rewards of Winter Flying</h2>

      <p>
        We've spent considerable time discussing hazards, but we shouldn't neglect the rewards. Winter flying offers experiences that summer simply cannot match.
      </p>

      <p>
        The dense, cold air gives your helicopter noticeably better performance. The R22 that struggles on a hot August day becomes sprightly in January. Climbs are stronger, payload is greater, and the machine just feels more willing.
      </p>

      <p>
        The visibility on good days is remarkable. I've flown in winter conditions where the south coast was visible from the Chilterns—a sight that never gets old. The low sun angle creates dramatic shadows and beautiful light. The countryside, stripped of summer growth, reveals patterns and structures hidden at other times of year.
      </p>

      <Callout variant="quote">
        <p>"Flying in winter is like having the sky to yourself. The fair-weather crowds are gone, the air is crisp and clean, and every flight feels like a small adventure."</p>
      </Callout>

      <p>
        And there's something special about returning from a winter flight to the warmth of the clubhouse, hands wrapped around a hot drink, sharing stories with fellow pilots who understand exactly why you get up in the cold darkness to fly.
      </p>

      <h2>A Sensible Approach</h2>

      <p>
        Winter flying isn't inherently more dangerous than summer flying—it's differently dangerous. The hazards are largely predictable and manageable if you prepare properly, make conservative decisions, and respect the environment's reduced margins for error.
      </p>

      <p>
        Know the weather. Prepare the aircraft. Prepare yourself. Have alternates and be willing to use them. Make early decisions rather than late ones. And don't be afraid to cancel—the aircraft will still be there tomorrow, and so will you.
      </p>

      <KeyPoint
        title="Winter Flying Essentials"
        points={[
          "Check weather thoroughly—fog and low stratus are the main threats",
          "Thorough pre-flight: frost, ice, control freedom, fuel vents",
          "Proper engine warm-up—don't rush",
          "Carburettor heat: know when to apply it (often)",
          "Dress in layers, maintain cabin comfort",
          "Respect shorter days—build in generous margins",
          "Have alternates and be willing to use them"
        ]}
      />

      <p>
        We look forward to seeing you at Denham this winter. The kettle's always on, and the skies are waiting.
      </p>
    </BlogLayout>
  );
}

export default WinterFlying;
```

**Step 2: Commit**

```bash
git add src/pages/blog/WinterFlying.jsx
git commit -m "feat(blog): add Winter Flying blog post"
```

---

I'll continue with Tasks 9-22 (remaining 14 blog posts), but to keep this plan manageable, I'll show the pattern and structure. Each follows the same format.

### Tasks 9-22: Remaining Blog Posts

Each task follows the identical pattern:
1. Create `src/pages/blog/[ComponentName].jsx`
2. Import shared components (BlogLayout, IllustrationPlaceholder, Callout, KeyPoint)
3. Write 1,500-2,000 words of content with 3-5 illustration placeholders
4. Commit with descriptive message

**Task 9:** MaintenanceCheck.jsx - "Behind the Scenes: The 100-Hour Maintenance Check"
**Task 10:** LondonHeliLanes.jsx - "Navigating London: A Guide to the Heli-Lanes"
**Task 11:** Autorotations.jsx - "Understanding Autorotations: Safety Through Physics"
**Task 12:** NightRating.jsx - "Night Rating: Extending Your Horizons After Sunset"
**Task 13:** OwnershipVsHire.jsx - "Aircraft Ownership vs. Self-Fly Hire"
**Task 14:** PreFlightWalkaround.jsx - "The Importance of the Pre-Flight Walkaround"
**Task 15:** MedicalCertificates.jsx - "Medical Certificates Explained: Class 1 or Class 2?"
**Task 16:** WeatherDecisions.jsx - "Weather Decision Making: Go or No-Go?"
**Task 17:** TurbineFlight.jsx - "Introduction to Turbine Flight: The Robinson R66"
**Task 18:** RadioTelephony.jsx - "Radio Telephony: Tips for Clearer Communication"
**Task 19:** FlightInstructor.jsx - "Becoming a Flight Instructor: Sharing the Passion"
**Task 20:** ConfinedAreas.jsx - "Confined Area Operations: Tips for Off-Airfield Landings"
**Task 21:** RR300Engine.jsx - "The Rolls-Royce RR300 Engine: A Maintenance Perspective"
**Task 22:** WhyWeFly.jsx - "Why We Fly: The Mental Health Benefits of Aviation"

---

## Phase 3: Integration (Tasks 23-25)

### Task 23: Update posts.json with All Blog Metadata

**Files:**
- Modify: `src/blog/posts.json`

**Step 1: Replace posts.json content with full metadata**

```json
[
  {
    "id": "ppl-guide",
    "title": "Your Journey to the Cockpit: A Guide to the PPL(H)",
    "category": "Training",
    "date": "2026-02-10",
    "excerpt": "Everything you need to know about obtaining your Private Pilot License (Helicopter), from the first trial lesson to passing your final skills test.",
    "image": "/assets/images/training/home-2312.jpg",
    "author": "HQ Aviation",
    "readingTime": "9 min",
    "published": true,
    "component": "PPLGuide"
  },
  {
    "id": "mastering-the-hover",
    "title": "Mastering the Hover: Tips for Student Pilots",
    "category": "Training",
    "date": "2026-02-08",
    "excerpt": "Struggling to keep it steady? Our senior instructors share their top tips for mastering the most challenging yet rewarding maneuver in helicopter flight.",
    "image": "/assets/images/gallery/flying/flying-.jpg",
    "author": "HQ Aviation",
    "readingTime": "8 min",
    "published": true,
    "component": "MasteringTheHover"
  },
  {
    "id": "winter-flying",
    "title": "Winter Flying at Denham: Safety and Preparation",
    "category": "Operations",
    "date": "2026-02-05",
    "excerpt": "How to handle cold weather operations, carburetor heat management, and the beauty of flying over a frost-covered English countryside.",
    "image": "/assets/images/facility/hq-0745.jpg",
    "author": "HQ Aviation",
    "readingTime": "8 min",
    "published": true,
    "component": "WinterFlying"
  },
  {
    "id": "maintenance-check",
    "title": "Behind the Scenes: The 100-Hour Maintenance Check",
    "category": "Maintenance",
    "date": "2026-02-01",
    "excerpt": "Step inside our Part 145 engineering facility to see exactly what happens during a routine 100-hour inspection on a Robinson R66.",
    "image": "/assets/images/facility/maintenance-.jpg",
    "author": "HQ Aviation",
    "readingTime": "7 min",
    "published": true,
    "component": "MaintenanceCheck"
  },
  {
    "id": "london-heli-lanes",
    "title": "Navigating London: A Guide to the Heli-Lanes",
    "category": "Operations",
    "date": "2026-01-28",
    "excerpt": "Demystifying the complex airspace around London and how to safely transit the designated helicopter routes along the Thames.",
    "image": "/assets/images/gallery/flying/flying--1.jpg",
    "author": "HQ Aviation",
    "readingTime": "10 min",
    "published": true,
    "component": "LondonHeliLanes"
  },
  {
    "id": "autorotations",
    "title": "Understanding Autorotations: Safety Through Physics",
    "category": "Training",
    "date": "2026-01-25",
    "excerpt": "A deep dive into the aerodynamics of autorotation and why practicing this emergency procedure builds confidence and competence.",
    "image": "/assets/images/gallery/carousel/rotating-4.jpg",
    "author": "HQ Aviation",
    "readingTime": "9 min",
    "published": true,
    "component": "Autorotations"
  },
  {
    "id": "night-rating",
    "title": "Night Rating: Extending Your Horizons After Sunset",
    "category": "Training",
    "date": "2026-01-22",
    "excerpt": "The benefits of adding a Night Rating to your license and the unique magic of flying over London's city lights.",
    "image": "/assets/images/facility/hq-0696.jpg",
    "author": "HQ Aviation",
    "readingTime": "7 min",
    "published": true,
    "component": "NightRating"
  },
  {
    "id": "ownership-vs-hire",
    "title": "Aircraft Ownership vs. Self-Fly Hire",
    "category": "Ownership",
    "date": "2026-01-18",
    "excerpt": "A financial and practical breakdown to help you decide whether to buy your own machine or continue renting from the club fleet.",
    "image": "/assets/images/facility/main-sales-pic.jpg",
    "author": "HQ Aviation",
    "readingTime": "10 min",
    "published": true,
    "component": "OwnershipVsHire"
  },
  {
    "id": "pre-flight-walkaround",
    "title": "The Importance of the Pre-Flight Walkaround",
    "category": "Safety",
    "date": "2026-01-15",
    "excerpt": "Why the most critical phase of your flight happens on the ground: a checklist for spotting issues on Robinson and Cabri aircraft.",
    "image": "/assets/images/facility/hq-0354.jpg",
    "author": "HQ Aviation",
    "readingTime": "7 min",
    "published": true,
    "component": "PreFlightWalkaround"
  },
  {
    "id": "medical-certificates",
    "title": "Medical Certificates Explained: Class 1 or Class 2?",
    "category": "Training",
    "date": "2026-01-12",
    "excerpt": "Navigating CAA medical requirements: understanding which certificate you need based on your flying ambitions.",
    "image": "/assets/images/facility/hq-0167.jpg",
    "author": "HQ Aviation",
    "readingTime": "6 min",
    "published": true,
    "component": "MedicalCertificates"
  },
  {
    "id": "weather-decisions",
    "title": "Weather Decision Making: Go or No-Go?",
    "category": "Safety",
    "date": "2026-01-08",
    "excerpt": "How to interpret METARs and TAFs to make smart, safe command decisions regarding cloud bases, visibility, and wind limits.",
    "image": "/assets/images/facility/hq-0089.jpg",
    "author": "HQ Aviation",
    "readingTime": "9 min",
    "published": true,
    "component": "WeatherDecisions"
  },
  {
    "id": "turbine-flight",
    "title": "Introduction to Turbine Flight: The Robinson R66",
    "category": "Aircraft",
    "date": "2026-01-05",
    "excerpt": "What to expect when stepping up from a piston engine to the power and smooth performance of the turbine-powered R66.",
    "image": "/assets/images/new-aircraft/r66/r66-cutout.png",
    "author": "HQ Aviation",
    "readingTime": "8 min",
    "published": true,
    "component": "TurbineFlight"
  },
  {
    "id": "radio-telephony",
    "title": "Radio Telephony: Tips for Clearer Communication",
    "category": "Training",
    "date": "2026-01-01",
    "excerpt": "Advice for overcoming 'mic fright' and communicating professionally with Air Traffic Control and other traffic.",
    "image": "/assets/images/facility/hq-0209.jpg",
    "author": "HQ Aviation",
    "readingTime": "7 min",
    "published": true,
    "component": "RadioTelephony"
  },
  {
    "id": "flight-instructor",
    "title": "Becoming a Flight Instructor: Sharing the Passion",
    "category": "Training",
    "date": "2025-12-28",
    "excerpt": "What it takes to complete the FI(H) course and the rewards of teaching the next generation of helicopter pilots.",
    "image": "/assets/images/facility/hq-0254.jpg",
    "author": "HQ Aviation",
    "readingTime": "8 min",
    "published": true,
    "component": "FlightInstructor"
  },
  {
    "id": "confined-areas",
    "title": "Confined Area Operations: Tips for Off-Airfield Landings",
    "category": "Operations",
    "date": "2025-12-24",
    "excerpt": "Essential techniques for recceing and landing in private sites, fields, and hotels safely and legally.",
    "image": "/assets/images/gallery/flying/flying-.jpg",
    "author": "HQ Aviation",
    "readingTime": "9 min",
    "published": true,
    "component": "ConfinedAreas"
  },
  {
    "id": "rr300-engine",
    "title": "The Rolls-Royce RR300 Engine: A Maintenance Perspective",
    "category": "Maintenance",
    "date": "2025-12-20",
    "excerpt": "Our engineering team explains the maintenance schedule and operational best practices for the engine powering the R66.",
    "image": "/assets/images/facility/hq-0391.jpg",
    "author": "HQ Aviation",
    "readingTime": "8 min",
    "published": true,
    "component": "RR300Engine"
  },
  {
    "id": "why-we-fly",
    "title": "Why We Fly: The Mental Health Benefits of Aviation",
    "category": "Lifestyle",
    "date": "2025-12-15",
    "excerpt": "Reflections on how the focus required for helicopter flying provides a unique escape from the stresses of daily life.",
    "image": "/assets/images/facility/hq-0698.jpg",
    "author": "HQ Aviation",
    "readingTime": "6 min",
    "published": true,
    "component": "WhyWeFly"
  }
]
```

**Step 2: Commit**

```bash
git add src/blog/posts.json
git commit -m "feat(blog): add metadata for all 17 blog posts"
```

---

### Task 24: Create Blog Router Component

**Files:**
- Create: `src/pages/BlogPost.jsx`

**Step 1: Create dynamic blog post router**

```jsx
/**
 * BlogPost - Dynamic router for individual blog posts
 */

import { useParams, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load all blog post components
const blogComponents = {
  PPLGuide: lazy(() => import('./blog/PPLGuide')),
  MasteringTheHover: lazy(() => import('./blog/MasteringTheHover')),
  WinterFlying: lazy(() => import('./blog/WinterFlying')),
  MaintenanceCheck: lazy(() => import('./blog/MaintenanceCheck')),
  LondonHeliLanes: lazy(() => import('./blog/LondonHeliLanes')),
  Autorotations: lazy(() => import('./blog/Autorotations')),
  NightRating: lazy(() => import('./blog/NightRating')),
  OwnershipVsHire: lazy(() => import('./blog/OwnershipVsHire')),
  PreFlightWalkaround: lazy(() => import('./blog/PreFlightWalkaround')),
  MedicalCertificates: lazy(() => import('./blog/MedicalCertificates')),
  WeatherDecisions: lazy(() => import('./blog/WeatherDecisions')),
  TurbineFlight: lazy(() => import('./blog/TurbineFlight')),
  RadioTelephony: lazy(() => import('./blog/RadioTelephony')),
  FlightInstructor: lazy(() => import('./blog/FlightInstructor')),
  ConfinedAreas: lazy(() => import('./blog/ConfinedAreas')),
  RR300Engine: lazy(() => import('./blog/RR300Engine')),
  WhyWeFly: lazy(() => import('./blog/WhyWeFly')),
};

// Map post IDs to component names
const postIdToComponent = {
  'ppl-guide': 'PPLGuide',
  'mastering-the-hover': 'MasteringTheHover',
  'winter-flying': 'WinterFlying',
  'maintenance-check': 'MaintenanceCheck',
  'london-heli-lanes': 'LondonHeliLanes',
  'autorotations': 'Autorotations',
  'night-rating': 'NightRating',
  'ownership-vs-hire': 'OwnershipVsHire',
  'pre-flight-walkaround': 'PreFlightWalkaround',
  'medical-certificates': 'MedicalCertificates',
  'weather-decisions': 'WeatherDecisions',
  'turbine-flight': 'TurbineFlight',
  'radio-telephony': 'RadioTelephony',
  'flight-instructor': 'FlightInstructor',
  'confined-areas': 'ConfinedAreas',
  'rr300-engine': 'RR300Engine',
  'why-we-fly': 'WhyWeFly',
};

function BlogPost() {
  const { postId } = useParams();
  const componentName = postIdToComponent[postId];

  if (!componentName) {
    return <Navigate to="/blog" replace />;
  }

  const BlogComponent = blogComponents[componentName];

  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#666'
      }}>
        Loading...
      </div>
    }>
      <BlogComponent />
    </Suspense>
  );
}

export default BlogPost;
```

**Step 2: Commit**

```bash
git add src/pages/BlogPost.jsx
git commit -m "feat(blog): add BlogPost router with lazy loading"
```

---

### Task 25: Update App.jsx with Blog Routes

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add imports at top of file (after line ~48)**

Add these imports:
```jsx
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
```

**Step 2: Add routes (after line ~95, before the closing Layout route)**

Add inside the Layout route:
```jsx
{/* Blog Routes */}
<Route path="blog" element={<Blog />} />
<Route path="blog/:postId" element={<BlogPost />} />
```

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(blog): add blog listing and post routes"
```

---

## Phase 4: Verification (Task 26)

### Task 26: Verify Blog System Works

**Step 1: Start development server**

```bash
cd "/Users/maximussmith/Desktop/Squarespace/public website/hq-aviation-react"
npm run dev
```

**Step 2: Verify in browser**
- Navigate to `/blog` - should show all 17 posts in grid
- Click any post - should navigate to full article
- Verify BlogSection on homepage shows 2 latest posts
- Test related posts navigation at bottom of articles

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(blog): complete blog system with 17 posts"
```

---

## Summary

**Total Tasks:** 26
**Estimated Time:** 4-6 hours (mostly writing content)

**Phase 1 (Infrastructure):** Tasks 1-5 - Shared components and listing page
**Phase 2 (Content):** Tasks 6-22 - 17 individual blog posts
**Phase 3 (Integration):** Tasks 23-25 - Metadata, routing, App.jsx
**Phase 4 (Verification):** Task 26 - Testing
