import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Swept Cleaning – house cleaning in Brisbane, Logan and the Gold Coast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const logo = await readFile(join(process.cwd(), "public/brand/swept-logo-white.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#4c0296", color: "white", padding: 72, flexDirection: "column", justifyContent: "space-between", fontFamily: "sans-serif" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={320} height={200} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>A beautifully clean home.</div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, color: "#e6daf6" }}>More time for you.</div>
          <div style={{ fontSize: 32, marginTop: 28, color: "#f5effc" }}>House cleaning · Brisbane · Logan · Gold Coast</div>
        </div>
      </div>
    ),
    size,
  );
}
