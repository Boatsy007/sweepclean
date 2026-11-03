import { ImageResponse } from "next/og";

export const alt = "Swept Cleaning – house cleaning from Brisbane to Tweed Heads";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PETAL = "M56 47 C 44 40, 33 29, 36 16.5 C 38.5 7, 51 5.5, 54 13 C 56.5 19.5, 50 27, 56 47 Z";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#5b35d5", color: "white", padding: 72, flexDirection: "column", justifyContent: "space-between", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="120" height="120" viewBox="0 0 100 100">
            {[0, 60, 120, 180, 240, 300].map((r) => <path key={r} d={PETAL} fill="white" transform={`rotate(${r} 50 50)`} />)}
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1 }}>swept</div>
            <div style={{ fontSize: 26, letterSpacing: 10, marginTop: 6 }}>CLEANING</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>A beautifully clean home.</div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, color: "#e4dcff" }}>More time for you.</div>
          <div style={{ fontSize: 32, marginTop: 28, color: "#f3f0ff" }}>Weekly · Fortnightly · Monthly — Brisbane to Tweed Heads</div>
        </div>
      </div>
    ),
    size,
  );
}
