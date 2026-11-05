import { NextResponse } from "next/server";
import { leadChannels } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/lead-status – quick check that quote delivery is configured on this deployment.
 * Returns only true/false flags (no keys or addresses). /api/ is disallowed in robots.txt.
 */
export function GET() {
  const c = leadChannels();
  return NextResponse.json({ ready: c.email || c.webhook, channels: c }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
