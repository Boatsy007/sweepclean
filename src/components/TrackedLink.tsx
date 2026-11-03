"use client";
import Link from "next/link";
import { track } from "@/lib/analytics";
import type { ComponentProps } from "react";

/** Link that fires a `cta_click` event with a location label. */
export function TrackedLink({ cta, ...props }: ComponentProps<typeof Link> & { cta: string }) {
  return <Link {...props} onClick={(e) => { track("cta_click", { cta, href: String(props.href) }); props.onClick?.(e); }} />;
}
