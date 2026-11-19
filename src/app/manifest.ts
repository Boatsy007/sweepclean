import type { MetadataRoute } from "next";

/** Web app manifest (/manifest.webmanifest) – the Swept icon for bookmarks and home screens. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Swept Cleaning",
    short_name: "Swept",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
