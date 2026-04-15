/**
 * BlogLayout - Common wrapper for all blog posts
 * Provides header, hero, metadata, navigation, related posts, and footer
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import posts from '../posts.json';
import FinalDraftHeader from '../../components/FinalDraftHeader';
import FooterMinimal from '../../components/FooterMinimal';
import '../../assets/css/main.css';
import '../../assets/css/components.css';

function BlogLayout({
  postId,
  title,
  category,
  date,
  author = "HQ Aviation",
  heroImage,
  children
}) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="final-draft" style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif", background: '#faf9f6', color: '#1a1a1a' }}>
      <FinalDraftHeader />

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
            padding-top: 120px;
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
              padding-top: 100px;
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

      <FooterMinimal />
    </div>
  );
}

export default BlogLayout;
