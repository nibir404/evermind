import { Sidebar } from "@/components/sidebar";
import { Spotlight } from "@/components/spotlight";
import { TabBar } from "@/components/tab-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell min-h-dvh" style={{ background: "#F5F5F7", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar />
      <main className="app-main">{children}</main>
      <Spotlight />
      <TabBar />
    </div>
  );
}
