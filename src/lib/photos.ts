import type { StaticImageData } from "next/image";
import bathroom from "../../public/images/bathroom-vanity.webp";
import apartment from "../../public/images/empty-apartment.webp";

export type Photo = { src: StaticImageData; alt: string };

export const photos = {
  bathroom: {
    src: bathroom,
    alt: "Bright, spotless bathroom with a white basin, marble benchtop and folded towels, overlooking the Gold Coast",
  },
  apartment: {
    src: apartment,
    alt: "Empty, freshly cleaned apartment with gleaming tiled floors and moving boxes, ready for handover",
  },
} satisfies Record<string, Photo>;

/** Photo per service. Services without one fall back to their illustration. */
export const servicePhotos: Partial<Record<string, Photo>> = {
  "deep-cleaning": photos.bathroom,
  "bond-cleaning": photos.apartment,
};
