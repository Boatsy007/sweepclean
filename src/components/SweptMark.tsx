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
    // Phones/tablets: purple logo on a white header (60px). Desktop: white logo on purple (78px).
    const wm = Math.round((logoColor.width / logoColor.height) * 60);
    const wd = Math.round((logoWhite.width / logoWhite.height) * 78);
    return (
      <>
        <Image src={logoColor} alt="Swept Cleaning" width={wm} height={60} priority={priority} sizes={`${wm}px`} className="h-[60px] w-auto lg:hidden" />
        <Image src={logoWhite} alt="Swept Cleaning" width={wd} height={78} priority={priority} sizes={`${wd}px`} className="hidden h-[78px] w-auto lg:block" />
      </>
    );
  }
  const h = size === "lg" ? 88 : 60;
  const w = Math.round(ratio * h);
  return <Image src={src} alt="Swept Cleaning" width={w} height={h} priority={priority} sizes={`${w}px`} style={{ height: h, width: "auto" }} />;
}
