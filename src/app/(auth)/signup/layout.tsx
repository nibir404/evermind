import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create your twin" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
