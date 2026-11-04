import type { StaticImageData } from "next/image";
import bathroom from "../../public/images/bathroom-vanity.webp";
import apartment from "../../public/images/empty-apartment.webp";
import cleaner from "../../public/images/swept-cleaner-benchtop.webp";

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
  cleaner: {
    src: cleaner,
    alt: "Swept Cleaning cleaner in a purple uniform wiping down a stone kitchen benchtop in a bright living area",
  },
} satisfies Record<string, Photo>;

/** Photo per service. Services without one fall back to their illustration. */
export const servicePhotos: Partial<Record<string, Photo>> = {
  "regular-house-cleaning": photos.cleaner,
  "deep-cleaning": photos.bathroom,
  "bond-cleaning": photos.apartment,
};
