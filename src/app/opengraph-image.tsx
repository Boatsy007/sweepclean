import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Swept Cleaning – house cleaning in Brisbane, Logan and the Gold Coast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Social share image – white with the full-colour logo, navy headline and a coastal blue accent line. */
export default async function OG() {
  const logo = await readFile(join(process.cwd(), "public/brand/swept-logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", color: "#061b49", padding: 72, flexDirection: "column", justifyContent: "space-between", fontFamily: "sans-serif", backgroundImage: "radial-gradient(900px 480px at 100% 0%, #f3f8f9 0%, #ffffff 70%)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={440} height={129} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>A beautifully clean home.</div>
          <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, color: "#527c91" }}>More time for you.</div>
          <div style={{ width: 260, height: 8, borderRadius: 8, background: "#527c91", opacity: 0.7, marginTop: 18 }} />
          <div style={{ fontSize: 32, marginTop: 30, color: "#3f4b6b" }}>House cleaning · Brisbane · Logan · Gold Coast · Tweed Heads</div>
        </div>
      </div>
    ),
    size,
  );
}
