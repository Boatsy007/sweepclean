import Image from "next/image";
import { servicePhotos } from "@/lib/photos";
import { serviceScenes } from "./Scenes";
import type { Service } from "@/lib/services";

/** Real photo for a service if we have one, otherwise its brand illustration. */
export function ServiceVisual({ service, className = "", sizes, priority = false }: { service: Pick<Service, "slug" | "icon">; className?: string; sizes: string; priority?: boolean }) {
  const photo = servicePhotos[service.slug];
  if (photo) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} placeholder="blur" className="object-cover" />
      </div>
    );
  }
  const Scene = serviceScenes[service.icon];
  return <Scene className={`block ${className}`} />;
}
