import { getImageProps } from "next/image";
import type { StaticImageData } from "next/image";

const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * Decorative hero photo loaded on desktop only. On phones the purple overlay hides it
 * almost entirely, so skipping the download keeps mobile LCP fast.
 */
export function HeroBackground({ src, className = "" }: { src: StaticImageData; className?: string }) {
  const { props } = getImageProps({ src, alt: "", fill: true, sizes: "100vw", quality: 70, priority: true });
  const { srcSet, sizes, src: _full, ...rest } = props;
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={srcSet} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img {...rest} src={BLANK} className={className} />
    </picture>
  );
}
