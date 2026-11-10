"use client";
// iOS-style tab bar for phones (< 768px): five labelled tabs, "More" opens a sheet with every section.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Ellipsis, LayoutGrid, MessageCircle, AudioLines, Search, X, ChevronRight } from "lucide-react";
import { destinations, openSpotlight } from "./spotlight";
import { useDemo, approvalQueueSeed, type RecordItem } from "@/lib/demo";
import { ease } from "./ui";

const tabs = [
  { href: "/home", label: "Home", Icon: LayoutGrid },
  { href: "/ask", label: "Ask", Icon: MessageCircle },
  { href: "/talk", label: "Talk", Icon: AudioLines },
  { href: "/approvals", label: "Approvals", Icon: CheckCircle2 },
] as const;

export function TabBar() {
  const path = usePathname();
  const [more, setMore] = useState(false);
  const [queue] = useDemo<RecordItem[]>("approval-queue", approvalQueueSeed);
  const [sent] = useDemo("approval-sent", false);
  const [declined] = useDemo("approval-declined", false);
  const badge = queue.filter((q) => q.status === "Pending").length + (!sent && !declined ? 1 : 0);
  const inMore = !tabs.some((t) => path.startsWith(t.href));
  // Full-screen experiences (Ask, Talk, Knowledge brain) have their own Back button, like a player view.
  const immersive = path.startsWith("/talk") || path.startsWith("/brain") || path.startsWith("/ask");
  useEffect(() => {
    if (!more) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMore(false);
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [more]);

  if (immersive) return null;
  return (
    <>
      <nav className="tabbar" aria-label="Main">
        {tabs.map(({ href, label, Icon }) => {
          const on = path.startsWith(href);
          return (
            <Link key={href} href={href} className="tabbar-item" aria-current={on ? "page" : undefined}>
              {on && <motion.span layoutId="tab-lens" className="tabbar-lens" transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.8 }} />}
              <span className="tabbar-icon">
                <Icon size={23} strokeWidth={on ? 2.2 : 1.7} />
                {href === "/approvals" && badge > 0 && <span className="tabbar-badge" aria-label={`${badge} waiting`}>{badge}</span>}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
        <button className="tabbar-item" aria-current={inMore ? "page" : undefined} aria-expanded={more} onClick={() => setMore(true)}>
          {inMore && <motion.span layoutId="tab-lens" className="tabbar-lens" transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.8 }} />}
          <span className="tabbar-icon"><Ellipsis size={23} strokeWidth={inMore ? 2.2 : 1.7} /></span>
          <span>More</span>
        </button>
      </nav>

      <AnimatePresence>
        {more && (
          <>
            <motion.div className="sheet-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMore(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="All sections"
              className="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.38, ease }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 600) setMore(false); }}
            >
              <div className="sheet-grabber" aria-hidden="true" />
              <div className="sheet-head">
                <h2>All sections</h2>
                <button aria-label="Close" onClick={() => setMore(false)}><X size={18} /></button>
              </div>
              <button className="sheet-search" onClick={() => { setMore(false); setTimeout(openSpotlight, 200); }}>
                <Search size={17} /> Search modules and records
              </button>
              <div className="sheet-body">
                {destinations.map(([group, items]) => (
                  <section key={group}>
                    <h3>{group}</h3>
                    <div className="sheet-list">
                      {items.map(([label, href]) => (
                        <Link key={href} href={href} onClick={() => setMore(false)} aria-current={path === href ? "page" : undefined}>
                          <span>{label}</span>
                          <ChevronRight size={16} />
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
