/**
 * Blog - Blog listing page showing all published posts
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import posts from '../blog/posts.json';
import FinalDraftHeader from '../components/FinalDraftHeader';
import FooterMinimal from '../components/FooterMinimal';
import '../assets/css/main.css';
import '../assets/css/components.css';

function Blog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="final-draft" style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif", background: '#faf9f6', color: '#1a1a1a' }}>
      <FinalDraftHeader />

      <div className="blog-listing">
        <header className="blog-listing__header">
          <h1>From the Hangar</h1>
          <p>Insights, guides, and stories from the HQ Aviation team</p>
        </header>

        <div className="blog-listing__grid">
          {publishedPosts.map(post => {
            const cardContent = (
              <>
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
              </>
            );
            return post.externalUrl ? (
              <a
                key={post.id}
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-listing__card"
              >
                {cardContent}
              </a>
            ) : (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="blog-listing__card"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

        <style>{`
          .blog-listing {
            max-width: 1200px;
            margin: 0 auto;
            padding: 4rem 2rem;
            padding-top: 140px;
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
              padding-top: 120px;
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

      <FooterMinimal />
    </div>
  );
}

export default Blog;
