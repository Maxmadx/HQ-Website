import { useImageSlot } from '../hooks/useImageSlot';

/**
 * Drop-in img replacement backed by Firestore image slots.
 * Uses the slot's URL if available, falls back to src prop.
 *
 * Usage: <ImageSlot slotId="home-hero-background" src="/fallback.jpg" alt="Hero" className="..." style={{...}} />
 */
export default function ImageSlot({ slotId, src, alt: altProp, className, style, width, height, ...rest }) {
  const { url, alt: slotAlt } = useImageSlot(slotId, src);
  return (
    <img
      src={url || src}
      alt={slotAlt || altProp || ''}
      className={className}
      style={style}
      data-slot-id={slotId}
      width={width || 1200}
      height={height || 800}
      loading="lazy"
      {...rest}
    />
  );
}
