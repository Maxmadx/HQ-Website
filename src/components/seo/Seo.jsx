import { Helmet } from 'react-helmet-async';
import {
  SITE_URL,
  ORG_NAME,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  DEFAULT_LANG,
  DEFAULT_LOCALE,
  absoluteUrl,
} from '../../lib/seoDefaults';

export default function Seo({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
  noindex = false,
}) {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
  const canonicalUrl = canonical || `${SITE_URL}${normalizedPath}`;
  const image = absoluteUrl(ogImage || DEFAULT_OG_IMAGE);
  const fullTitle = title ? `${title} | ${ORG_NAME}` : ORG_NAME;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <html lang={DEFAULT_LANG} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={ORG_NAME} />
      <meta property="og:locale" content={DEFAULT_LOCALE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
      {TWITTER_HANDLE && <meta name="twitter:site" content={TWITTER_HANDLE} />}

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
