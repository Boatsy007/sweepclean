import Image from "next/image";
import logoColor from "../../public/brand/swept-logo.png";
import logoWhite from "../../public/brand/swept-logo-white.png";
import markColor from "../../public/brand/swept-mark.png";
import markWhite from "../../public/brand/swept-mark-white.png";

/* Official Swept Cleaning artwork (public/brand/). */

/** The swirl mark on its own – decorative unless `alt` is given. */
export function SweptMark({ size = 40, tone = "color", className, alt = "" }: { size?: number; tone?: "color" | "white"; className?: string; alt?: string }) {
  return <Image src={tone === "white" ? markWhite : markColor} alt={alt} width={size} height={size} className={className} sizes={`${size}px`} />;
}

/** Full lock-up: swirl + "swept" + "— CLEANING —". */
export function Logo({ tone = "color", size = "md", priority = false }: { tone?: "color" | "white"; size?: "md" | "lg"; priority?: boolean }) {
  const src = tone === "white" ? logoWhite : logoColor;
  const h = size === "lg" ? 64 : 46;
  const w = Math.round((src.width / src.height) * h);
  return <Image src={src} alt="Swept Cleaning" width={w} height={h} priority={priority} sizes={`${w}px`} style={{ height: h, width: "auto" }} />;
}
