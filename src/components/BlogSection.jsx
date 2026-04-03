/**
 * BlogSection - Minimal editorial-style blog preview
 * Displays 2 latest published posts with left-edge image accent
 */

import { Link } from 'react-router-dom';
import posts from '../blog/posts.json';

function BlogSection() {
  // Filter published posts, sort by date descending, take 2
  const latestPosts = posts
    .filter(post => post.published && post.title)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 2);

  // Format date to "12 FEB 2026" style
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  if (latestPosts.length === 0) {
    return null;
  }

  return (
    <section className="fd-blog">
      <div className="fd-blog__header">
        <span className="fd-blog__header-line"></span>
        <span className="fd-blog__header-label">Latest from HQ</span>
        <span className="fd-blog__header-line"></span>
      </div>

      <div className="fd-blog__grid">
        {latestPosts.map((post) => (
          <Link
            to={`/blog/${post.id}`}
            key={post.id}
            className="fd-blog__card"
          >
            {post.image && (
              <div
                className="fd-blog__card-accent"
                style={{ backgroundImage: `url(${post.image})` }}
              />
            )}
            <div className="fd-blog__card-content">
              <span className="fd-blog__card-category">{post.category}</span>
              <h3 className="fd-blog__card-title">{post.title}</h3>
              {post.excerpt && (
                <p className="fd-blog__card-excerpt">{post.excerpt}</p>
              )}
              <span className="fd-blog__card-date">{formatDate(post.date)}</span>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .fd-blog {
          padding: 4rem 2rem;
          background: #faf9f6;
          max-width: 900px;
          margin: 0 auto;
        }

        .fd-blog__header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .fd-blog__header-line {
          width: 40px;
          height: 1px;
          background: linear-gradient(to right, transparent, #c0bdb8, transparent);
        }

        .fd-blog__header-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #999;
        }

        .fd-blog__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .fd-blog__card {
          display: flex;
          background: #ffffff;
          border: 1px solid #e8e6e2;
          text-decoration: none;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .fd-blog__card:hover {
          transform: translateY(-2px);
          border-color: #1a1a1a;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }

        .fd-blog__card-accent {
          width: 4px;
          min-height: 100%;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }

        .fd-blog__card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .fd-blog__card-category {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
        }

        .fd-blog__card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.2;
        }

        .fd-blog__card-excerpt {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
          margin: 0.25rem 0;
        }

        .fd-blog__card-date {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: #999;
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .fd-blog__grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}

export default BlogSection;
