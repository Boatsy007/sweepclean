import Image from "next/image";
import logoColor from "../../public/brand/swept-logo.png";
import logoWhite from "../../public/brand/swept-logo-white.png";
import markColor from "../../public/brand/swept-mark.png";
import markWhite from "../../public/brand/swept-mark-white.png";

/* Official Swept Cleaning artwork (public/brand/). */

/** The sparkle mark on its own – decorative unless `alt` is given. */
export function SweptMark({ size = 40, tone = "color", className, alt = "" }: { size?: number; tone?: "color" | "white"; className?: string; alt?: string }) {
  return <Image src={tone === "white" ? markWhite : markColor} alt={alt} width={size} height={size} className={className} sizes={`${size}px`} />;
}

/** Full lock-up: "Swept Cleaning" with swoosh and sparkles. */
export function Logo({ tone = "color", size = "md", priority = false }: { tone?: "color" | "white"; size?: "md" | "lg" | "header"; priority?: boolean }) {
  const src = tone === "white" ? logoWhite : logoColor;
  const ratio = src.width / src.height;
  if (size === "header") {
    // Full-colour logo on the white header (proportions kept): 44px tall on phones, 56px on desktop.
    const r = logoColor.width / logoColor.height;
    const wm = Math.round(r * 44);
    const wd = Math.round(r * 56);
    return (
      <>
        <Image src={logoColor} alt="Swept Cleaning" width={wm} height={44} priority={priority} sizes={`${wm}px`} className="h-[44px] w-auto max-[389px]:h-[40px] max-[339px]:h-[34px] lg:hidden" />
        <Image src={logoColor} alt="Swept Cleaning" width={wd} height={56} priority={priority} sizes={`${wd}px`} className="hidden h-[44px] w-auto lg:block xl:h-[56px]" />
      </>
    );
  }
  const h = size === "lg" ? 64 : 48;
  const w = Math.round(ratio * h);
  return <Image src={src} alt="Swept Cleaning" width={w} height={h} priority={priority} sizes={`${w}px`} style={{ height: h, width: "auto" }} />;
}
