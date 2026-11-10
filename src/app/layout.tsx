import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { DemoNotice } from "@/components/demo-ui";
import { SmoothScroll } from "@/components/smooth-scroll";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "EverMind — Your judgment, always in the room",
  description: "A private executive digital twin that thinks the way you do and asks before it acts.",
};

export const viewport: Viewport = {
  themeColor: "#f5f5f7",
  width: "device-width", initialScale: 1, viewportFit: "cover", interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} antialiased`}>
      <body className="min-h-dvh bg-canvas text-ink">
        <SmoothScroll>{children}</SmoothScroll><DemoNotice />
      </body>
    </html>
  );
}
