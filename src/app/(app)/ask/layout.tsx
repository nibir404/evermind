import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ask your twin" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
