"use client";
import { useDemo, preferenceSeed } from "@/lib/demo";

// 1:1 port of Paper "03.03 · Notifications" (5HT-0)

import { AnimatePresence, motion } from "framer-motion";
import { C, Dot, Link2, Page, PageHead, PButton, PCard, Sub, Toggle, Txt } from "@/components/paper";
import { Reveal, ease } from "@/components/ui";

type N = { id: number; k: string; c: string; t: string; s: string; a?: string; ac?: string; href?: string; read?: boolean };
const seed: N[] = [
  { id: 1, k: "SECURITY", c: C.danger, t: "New sign-in from Singapore · Chrome on Windows", s: "12 min ago · Not you? Revoke the session now.", a: "Revoke", ac: C.danger, href: "/security" },
  { id: 2, k: "APPROVAL", c: C.warning, t: "Draft reply to Prof. Rahman is ready", s: "38 min ago · expires today at 15:42", a: "Review", href: "/approvals" },
  { id: 3, k: "STAKEHOLDER", c: C.warning, t: "Farhana Akter requested access", s: "1 h ago · Executive assistant · Decisions + calendar", a: "Decide", href: "/access" },
  { id: 4, k: "FAILED", c: C.danger, t: "Board pack Sept.pptx could not be read", s: "Yesterday · password-protected file", a: "Re-upload", href: "/knowledge/add" },
  { id: 5, k: "KNOWLEDGE", c: C.pine, t: "Strategy plan 2030 ready for review", s: "Today · 18 memories need your confirmation", a: "Review", href: "/memories" },
  { id: 6, k: "ACTION", c: "", t: "Calendar hold sent to DIU registrar", s: "Yesterday · read", read: true },
];

export default function Notifications() {
  const [items, setItems] = useDemo("notification-items", seed);
  const [settings,setSettings]=useDemo("preferences",preferenceSeed);
  const keys=["approvals","stakeholders","knowledge","actions"] as const;
  const prefs:[string,string,boolean][]=[["Approvals","In-app · Email",settings.approvals],["Stakeholder requests","In-app",settings.stakeholders],["Knowledge processing","Daily digest",settings.knowledge],["Completed actions","In-app",settings.actions]];
  return (
    <Page>
      <Reveal>
        <PageHead eyebrow="03.03 · Overview · Notifications" title="Notifications" actions={<PButton onClick={() => setItems((xs) => xs.map((x) => ({ ...x, read: true })))}>Mark all as read</PButton>} />
      </Reveal>
      <Reveal delay={0.06} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <PCard style={{ flex: 1, padding: "8px 20px" }}>
          <AnimatePresence initial={false}>
            {items.map((n, i) => (
              <motion.div key={n.id} layout exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderTop: i ? `1px solid ${C.line}` : "none", opacity: n.read ? 0.6 : 1 }}>
                <span style={{ width: 8 }}>{!n.read && n.c && <Dot color={n.c} />}</span>
                <span style={{ width: 96, fontSize: 11, letterSpacing: "0.1em", color: n.k === "SECURITY" ? C.danger : C.slate }}>{n.k}</span>
                <div style={{ flex: 1 }}>
                  <Txt weight={n.read ? 400 : 600} color={n.read ? C.body : C.ink}>{n.t}</Txt>
                  <Sub>{n.s}</Sub>
                </div>
                {n.a && !n.read && (
                  <span onClick={() => setItems((xs) => xs.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}>
                    <Link2 href={n.href} color={n.ac ?? C.pine}>{n.a}</Link2>
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </PCard>
        <PCard style={{ width: 380, flexShrink: 0, padding: 20, gap: 16 }}>
          <Txt size={17} weight={600}>Preferences</Txt>
          {prefs.map(([l, m, on], i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}>
              <span style={{ flex: 1 }}>{l}</span>
              <span style={{ fontSize: 12, color: C.slate }}>{on ? m : "Off"}</span>
              <Toggle on={on} onChange={() => setSettings(p=>({...p,[keys[i]]:!p[keys[i]]}))} />
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", fontSize: 14 }}>
            <span style={{ flex: 1 }}>Security alerts</span>
            <span style={{ fontSize: 12, color: C.slate }}>Always on · locked</span>
          </div>
        </PCard>
      </Reveal>
    </Page>
  );
}
