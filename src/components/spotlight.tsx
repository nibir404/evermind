"use client";
// Spotlight-style command palette. ⌘K / Ctrl+K anywhere, or the search button in the sidebar.
// Finds every module and every record in the demo store.
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, FileText, Search } from "lucide-react";
import { moduleSeeds, readDemo, type RecordItem } from "@/lib/demo";
import { ease } from "./ui";

export const destinations: [group: string, items: [label: string, href: string, keywords?: string][]][] = [
  ["Overview", [["Home", "/home"], ["Activity", "/activity"], ["Notifications", "/notifications"], ["First day guide", "/first-day"]]],
  ["Think & decide", [["Ask your twin", "/ask", "chat question"], ["Talk to your twin", "/talk", "voice avatar 3d"], ["Decision analysis", "/decide"], ["Decision Studio", "/decisions"], ["Decision patterns", "/patterns"]]],
  ["My intelligence", [["Intelligence profile", "/intelligence"], ["Personality", "/personality"], ["Leadership", "/leadership"], ["Evolution", "/evolution"], ["Book", "/book", "biography editor chapter"]]],
  ["Knowledge & memory", [["Knowledge brain", "/brain", "graph 3d"], ["Knowledge sources", "/knowledge"], ["Add knowledge", "/knowledge/add", "upload import"], ["Memories", "/memories"], ["Memory graph", "/memory/graph"], ["Experience archive", "/memory/experiences"], ["Memory corrections", "/memory/corrections"]]],
  ["Executive actions", [["Actions overview", "/actions"], ["Approvals", "/approvals", "sign-off"], ["Tasks", "/tasks", "todo"], ["Calendar", "/calendar", "events meetings"], ["Email", "/email", "drafts"], ["Delegation rules", "/rules"]]],
  ["Governance", [["Boardroom", "/boardroom", "meeting observer"], ["Access & sharing", "/access", "permissions"], ["Security", "/security"], ["Audit trail", "/audit", "history log"], ["Digital Legacy", "/legacy"], ["Legacy activation", "/legacy/activation"]]],
  ["Account", [["Profile", "/settings"], ["Preferences", "/settings/preferences", "tone voice"], ["Boundaries", "/settings/boundaries"], ["Notifications settings", "/settings/notifications"], ["Security & passkeys", "/settings/security"], ["Your data", "/settings/data", "export reset"], ["Integrations", "/settings/integrations"], ["Billing", "/settings/billing", "plan"], ["Help", "/support"]]],
];

const recordRoutes: Record<string, string> = { knowledge: "/knowledge", decisions: "/decisions", tasks: "/tasks", calendar: "/calendar", email: "/email", boardroom: "/boardroom", access: "/access", legacy: "/legacy", rules: "/rules", support: "/support" };

type Hit = { key: string; label: string; detail: string; href: string; group: string; kind: "page" | "record" };

export function openSpotlight() { window.dispatchEvent(new Event("evermind:spotlight")); }

export function Spotlight() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = () => { setQ(""); setCursor(0); setOpen(true); };
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => { if (!o) { setQ(""); setCursor(0); } return !o; }); } };
    const onOpen = show;
    window.addEventListener("keydown", onKey);
    window.addEventListener("evermind:spotlight", onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("evermind:spotlight", onOpen); };
  }, []);

  const hits = useMemo<Hit[]>(() => {
    if (!open) return [];
    const term = q.trim().toLowerCase();
    const pages: Hit[] = destinations.flatMap(([group, items]) => items.map(([label, href, kw]) => ({ key: href, label, detail: group, href, group: "Go to", kind: "page" as const, _s: `${label} ${group} ${kw ?? ""}`.toLowerCase() })))
      .filter((h) => !term || h._s.includes(term));
    if (!term) return pages.slice(0, 8);
    const records: Hit[] = Object.entries(recordRoutes).flatMap(([mod, href]) =>
      readDemo<RecordItem[]>(mod, moduleSeeds[mod] ?? []).filter((r) => `${r.title} ${r.body} ${r.category}`.toLowerCase().includes(term)).map((r) => ({ key: `${mod}:${r.id}`, label: r.title, detail: `${mod[0].toUpperCase() + mod.slice(1)} · ${r.status}`, href, group: "Records", kind: "record" as const })),
    );
    return [...pages.slice(0, 6), ...records.slice(0, 8)];
  }, [q, open]);

  const go = (h?: Hit) => { if (!h) return; setOpen(false); router.push(h.href); };
  useEffect(() => { list.current?.querySelector(`[data-i="${cursor}"]`)?.scrollIntoView({ block: "nearest" }); }, [cursor]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="spot-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <motion.div role="dialog" aria-modal="true" aria-label="Search EverMind" className="spot" initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.25, ease }}>
            <div className="spot-field">
              <Search size={20} />
              <input
                ref={input}
                autoFocus
                data-bare
                value={q}
                onChange={(e) => { setQ(e.target.value); setCursor(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(hits.length - 1, c + 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
                  if (e.key === "Enter") { e.preventDefault(); go(hits[cursor]); }
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Search modules, decisions, people, emails…"
                aria-label="Search"
                role="combobox"
                aria-expanded="true"
                aria-controls="spot-list"
                aria-activedescendant={hits[cursor] ? `spot-${cursor}` : undefined}
              />
              <kbd>esc</kbd>
            </div>
            <div className="spot-list" id="spot-list" role="listbox" ref={list}>
              {!hits.length && <p className="spot-empty">No results for “{q}”.</p>}
              {hits.map((h, i) => {
                const header = i === 0 || hits[i - 1].group !== h.group ? h.group : null;
                return (
                  <div key={h.key}>
                    {header && <p className="spot-group">{header}</p>}
                    <button id={`spot-${i}`} data-i={i} role="option" aria-selected={i === cursor} className="spot-item" onMouseMove={() => setCursor(i)} onClick={() => go(h)}>
                      <span className="spot-icon">{h.kind === "record" ? <FileText size={15} /> : <Search size={15} />}</span>
                      <span className="spot-label">{h.label}</span>
                      <span className="spot-detail">{h.detail}</span>
                      {i === cursor && <CornerDownLeft size={14} className="spot-enter" />}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="spot-foot"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>↵</kbd> to open</span><span><kbd>⌘</kbd><kbd>K</kbd> anywhere</span></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
