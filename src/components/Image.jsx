// src/components/Image.jsx
import { Helmet } from 'react-helmet-async';
import { buildSrcSet, isLocalPath, isProxyableUrl, variantUrl } from '../lib/imageVariantUrl';
import { getManifestEntry } from '../lib/optimisedManifest';

const DEV_MODE = import.meta.env.DEV;

const RUNTIME_WIDTHS = [400, 800, 1200, 1600, 2400];
const RUNTIME_FORMATS = ['avif', 'webp', 'jpeg'];

function buildRuntimeSrcSet(srcUrl, format, widths) {
  const encoded = encodeURIComponent(srcUrl);
  return widths
    .map(w => `/api/image?src=${encoded}&w=${w}&fmt=${format} ${w}w`)
    .join(', ');
}

function isDevMode(props) {
  // __forceProd / __forceDev test hooks let unit tests pin behaviour independent of vitest env
  if (props.__forceProd) return false;
  if (props.__forceDev) return true;
  return DEV_MODE;
}

// CMS media-library URLs mirror the local asset tree
// (…/media-library/assets/images/X ↔ /assets/images/X). When the equivalent
// local optimised asset exists, prefer it — it serves a pre-built <picture>
// instead of round-tripping through the /api/image proxy.
const MEDIA_LIBRARY_MARKER = '/media-library/assets/images/';
function resolveSrc(src) {
  if (typeof src !== 'string') return src;
  const i = src.indexOf(MEDIA_LIBRARY_MARKER);
  if (i === -1) return src;
  const localPath = src.slice(i + '/media-library'.length);
  return getManifestEntry(localPath) ? localPath : src;
}

export default function Image(props) {
  const {
    src: rawSrc,
    alt,
    width,
    height,
    sizes = '(max-width: 768px) 100vw, 1200px',
    priority = false,
    className,
    loading,
    ...rest
  } = props;

  // Pop the test-only overrides so we don't pass them to the DOM
  delete rest.__forceProd;
  delete rest.__forceDev;

  const src = resolveSrc(rawSrc);

  // Dev mode: render plain <img>. Variants don't exist until npm run build.
  if (isDevMode(props)) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        className={className}
        {...rest}
      />
    );
  }

  // Local source with manifest entry → emit <picture> with full srcset
  if (isLocalPath(src)) {
    const entry = getManifestEntry(src);
    if (entry && !entry.skipped) {
      const widths = entry.variantWidths;
      const formats = entry.variantFormats; // typically ['avif', 'webp', 'jpeg' OR 'png']
      const fallbackFormat = formats[formats.length - 1]; // jpeg or png
      const fallbackWidth = widths.includes(1200) ? 1200 : widths[Math.floor(widths.length / 2)];

      // LQIP blur-up only works behind opaque images. For transparent cutouts
      // (hasAlpha) the placeholder bleeds through and never clears, so skip it.
      const lqipBgStyle = entry.lqip && !entry.hasAlpha
        ? { backgroundImage: `url("${entry.lqip}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : undefined;

      const avifSrcSet = buildSrcSet(src, 'avif', widths);

      return (
        <>
          {priority && (
            <Helmet>
              <link
                rel="preload"
                as="image"
                imageSrcSet={avifSrcSet}
                imageSizes={sizes}
                type="image/avif"
              />
            </Helmet>
          )}
          <picture>
            {formats.map((fmt) => (
              <source
                key={fmt}
                type={`image/${fmt === 'jpeg' ? 'jpeg' : fmt}`}
                srcSet={buildSrcSet(src, fmt, widths)}
                sizes={sizes}
              />
            ))}
            <img
              src={variantUrl(src, fallbackWidth, fallbackFormat)}
              srcSet={buildSrcSet(src, fallbackFormat, widths)}
              sizes={sizes}
              width={width}
              height={height}
              alt={alt}
              loading={loading ?? (priority ? 'eager' : 'lazy')}
              decoding={priority ? undefined : 'async'}
              fetchpriority={priority ? 'high' : undefined}
              className={className}
              style={lqipBgStyle}
              {...rest}
            />
          </picture>
        </>
      );
    }
    // Local source NOT in manifest (e.g. skipped-by-size, or unknown path): render plain <img>
    return (
      <img src={src} alt={alt} width={width} height={height}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        className={className} {...rest} />
    );
  }

  // Proxyable URLs (Firebase Storage / hqaviation.com) — emit <picture> with
  // srcset pointing at the /api/image runtime endpoint. We don't know the
  // source's alpha at render time, so always emit AVIF/WebP/JPEG. CMS images
  // are photos, so JPEG fallback is correct.
  if (isProxyableUrl(src)) {
    const fallbackFormat = 'jpeg';
    const fallbackWidth = 1200;
    const encoded = encodeURIComponent(src);
    const fallbackSrc = `/api/image?src=${encoded}&w=${fallbackWidth}&fmt=${fallbackFormat}`;
    return (
      <picture>
        {RUNTIME_FORMATS.map((fmt) => (
          <source
            key={fmt}
            type={`image/${fmt === 'jpeg' ? 'jpeg' : fmt}`}
            srcSet={buildRuntimeSrcSet(src, fmt, RUNTIME_WIDTHS)}
            sizes={sizes}
          />
        ))}
        <img
          src={fallbackSrc}
          srcSet={buildRuntimeSrcSet(src, fallbackFormat, RUNTIME_WIDTHS)}
          sizes={sizes}
          width={width}
          height={height}
          alt={alt}
          loading={loading ?? (priority ? 'eager' : 'lazy')}
          decoding={priority ? undefined : 'async'}
          fetchpriority={priority ? 'high' : undefined}
          className={className}
          onError={(e) => {
            // If the /api/image proxy is unavailable, fall back to the raw
            // source so the image still renders (unoptimised, but visible).
            const img = e.currentTarget;
            if (img.dataset.rawFallback) return;
            img.dataset.rawFallback = '1';
            const picture = img.parentNode;
            if (picture && picture.tagName === 'PICTURE') {
              picture.querySelectorAll('source').forEach((s) => s.remove());
            }
            img.srcset = '';
            img.src = src;
          }}
          {...rest}
        />
      </picture>
    );
  }

  // External URLs — no optimisation possible, plain <img>
  return (
    <img src={src} alt={alt} width={width} height={height}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      className={className} {...rest} />
  );
}
