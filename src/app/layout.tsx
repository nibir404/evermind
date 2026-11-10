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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description = "EverMind is an executive digital twin. It learns from your books, minutes and interviews, answers with sources, drafts for your approval, and never acts without you.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "EverMind — Your judgment, always in the room", template: "%s · EverMind" },
  description,
  applicationName: "EverMind",
  keywords: ["digital twin", "executive AI", "decision support", "knowledge management", "EverMind", "Daffodil"],
  authors: [{ name: "EverMind" }],
  creator: "EverMind",
  category: "productivity",
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { capable: true, title: "EverMind", statusBarStyle: "default" },
  openGraph: {
    type: "website",
    siteName: "EverMind",
    title: "EverMind — Your judgment, always in the room",
    description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "EverMind — Your judgment, always in the room",
    description,
  },
  // Seeded demo: keep it out of search results until a real launch.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0E2E25" },
  ],
  width: "device-width", initialScale: 1, viewportFit: "cover", interactiveWidget: "resizes-content",
};

/* The CSS pipeline rewrites backdrop-filter to only its -webkit- form, which Chrome
   and Android ignore. These rules ship unprocessed so frosted surfaces blur everywhere. */
const backdropCss = `
.glass,.home-callout-body,.book-media-replace,.spot-backdrop{backdrop-filter:blur(8px)}
.spot,.demo-toast,.chat-drawer,.glass-liquid{backdrop-filter:blur(20px) saturate(180%)}
.demo-dialog::backdrop{backdrop-filter:blur(8px)}
@media (max-width:767px){.tabbar,.sheet,.demo-dialog,.spot{backdrop-filter:blur(40px) saturate(180%) brightness(1.04)!important}}
@media (max-width:767px) and (prefers-reduced-transparency:reduce){.tabbar,.sheet,.demo-dialog,.spot{backdrop-filter:none!important}}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} antialiased`}>
      <head>
        <style id="backdrop-blur" dangerouslySetInnerHTML={{ __html: backdropCss }} />
      </head>
      <body className="min-h-dvh bg-canvas text-ink">
        <SmoothScroll>{children}</SmoothScroll><DemoNotice />
      </body>
    </html>
  );
}
