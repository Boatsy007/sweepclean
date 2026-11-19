"use client";

import { useEffect, useState } from "react";
import { takeThanksName } from "@/lib/thanksName";

/** ", Jane" after "Thanks" – read once from sessionStorage (never from the URL). */
export function ThanksName() {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    const n = takeThanksName();
    if (n) setName(n);
  }, []);
  return name ? <>, {name}</> : null;
}
