import { useEffect, useState } from 'react';
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
import { getOverrideForPath } from '../../lib/seoOverrides';

export default function Seo({
  title: titleProp,
  description: descriptionProp,
  canonical,
  ogImage: ogImageProp,
  ogType = 'website',
  jsonLd,
  noindex = false,
}) {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
  const canonicalUrl = canonical || `${SITE_URL}${normalizedPath}`;

  // SEO override (spec 15): admin-set per-page meta beats code defaults.
  // Async load; first paint uses code defaults, override applied within ~50ms.
  const [override, setOverride] = useState(null);
  useEffect(() => {
    let cancelled = false;
    getOverrideForPath(normalizedPath).then((data) => {
      if (!cancelled && data) setOverride(data);
    });
    return () => { cancelled = true; };
  }, [normalizedPath]);

  const title = override?.title || titleProp;
  const description = override?.description || descriptionProp;
  const ogImage = override?.ogImage || ogImageProp;
  // Only emit og/twitter image when the caller explicitly passed ogImage, OR
  // when this is a page-level Seo (title is set) — in that case fall back to
  // DEFAULT_OG_IMAGE. App-level <Seo jsonLd={…}/> calls (no title, no ogImage)
  // emit no image tag, so they don't clobber page-level og:image.
  const image = ogImage
    ? absoluteUrl(ogImage)
    : (title ? absoluteUrl(DEFAULT_OG_IMAGE) : null);
  // Only build a title-string when a page actually passes title — same reason.
  const fullTitle = title ? `${title} | ${ORG_NAME}` : null;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <html lang={DEFAULT_LANG} />
      {fullTitle && <title>{fullTitle}</title>}
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {fullTitle && <meta property="og:title" content={fullTitle} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={ORG_NAME} />
      <meta property="og:locale" content={DEFAULT_LOCALE} />

      <meta name="twitter:card" content="summary_large_image" />
      {fullTitle && <meta name="twitter:title" content={fullTitle} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      {TWITTER_HANDLE && <meta name="twitter:site" content={TWITTER_HANDLE} />}

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
