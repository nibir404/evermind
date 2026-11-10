import { ImageResponse } from "next/og";

// Home-screen icon for iOS/iPadOS. iOS applies its own corner mask, so the tile is square.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#D4F26A" }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <path d="M32 14c9.94 0 18 8.06 18 18s-8.06 18-18 18-18-8.06-18-18c0-6.2 3.14-11.67 7.92-14.9" fill="none" stroke="#0E2E25" strokeWidth="5" strokeLinecap="round" />
          <circle cx="32" cy="32" r="6.5" fill="#0E2E25" />
        </svg>
      </div>
    ),
    size,
  );
}
