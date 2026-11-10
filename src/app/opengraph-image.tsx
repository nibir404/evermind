import { ImageResponse } from "next/og";

// Link preview for Slack, iMessage, LinkedIn, X and others.
export const alt = "EverMind: an executive digital twin that thinks like you and never acts without you.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, color: "#fff", background: "radial-gradient(ellipse 70% 80% at 75% 40%, #1F5A47 0%, #0E2E25 75%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="16" fill="#D4F26A" />
            <path d="M32 14c9.94 0 18 8.06 18 18s-8.06 18-18 18-18-8.06-18-18c0-6.2 3.14-11.67 7.92-14.9" fill="none" stroke="#0E2E25" strokeWidth="5" strokeLinecap="round" />
            <circle cx="32" cy="32" r="6.5" fill="#0E2E25" />
          </svg>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}>EverMind</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.04em", maxWidth: 900 }}>Your judgment, always in the room.</div>
          <div style={{ fontSize: 30, color: "#CFE6DA", maxWidth: 860 }}>An executive digital twin that thinks like you, shows its sources, and never acts without you.</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#D4F26A" }}>
          <span>Advise</span><span style={{ color: "#8FD8B0" }}>·</span><span>Draft for approval</span><span style={{ color: "#8FD8B0" }}>·</span><span>Every answer sourced</span>
        </div>
      </div>
    ),
    size,
  );
}
