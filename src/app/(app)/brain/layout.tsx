import type { Metadata } from "next";

export const metadata: Metadata = { title: "Knowledge brain" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
