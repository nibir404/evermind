"use client";

// 1:1 port of Paper "04a · Home — First day" (63T-0)
import { useState } from "react";
import { C, Check, Eyebrow, Link2, Page, PageHead, PCard, PButton, Sub, Txt } from "@/components/paper";
import { Reveal } from "@/components/ui";

type Item = { t: string; done?: boolean; s?: string; cta?: string; href?: string; primary?: boolean; locked?: boolean };
const seed: Item[] = [
  { t: "Verify identity and consent", done: true },
  { t: "Complete profile and professional context", done: true },
  { t: "Finish your intelligence interview", s: "4 of 10 topics · about 25 min left · saved as you go", cta: "Resume", href: "/onboarding", primary: true },
  { t: "Add 5 or more documents", s: "Board minutes, speeches and strategy plans teach it the most", cta: "Upload", href: "/knowledge/add" },
  { t: "Calibrate with 3 sample questions", s: "Unlocks after the interview", locked: true },
];

export default function FirstDay() {
  const [items, setItems] = useState(seed);
  const done = items.filter((i) => i.done).length;
  return (
    <Page>
      <Reveal>
        <PageHead eyebrow="03.01A · Overview · First day" title="Welcome, Dr. Sabur Khan. Your twin is new." />
      </Reveal>
      <Reveal delay={0.06} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <PCard style={{ flex: 1, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 16 }}>
            <Txt size={17} weight={600}>Make it think like you</Txt>
            <Sub size={13}>{done} of 5 done</Sub>
          </div>
          {items.map((it, i) => (
            <div key={it.t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderTop: `1px solid ${C.line}` }}>
              <Check on={!!it.done} muted={it.locked} onChange={() => !it.locked && setItems((xs) => xs.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: it.done ? C.slate : C.ink, textDecoration: it.done ? "line-through" : "none", fontWeight: it.primary ? 500 : 400 }}>{it.t}</div>
                {!it.done && it.s && <Sub>{it.s}</Sub>}
              </div>
              {!it.done && it.primary && <PButton variant="lime" href={it.href} style={{ height: 36, fontSize: 13 }}>{it.cta}</PButton>}
              {!it.done && !it.primary && it.cta && <Link2 href={it.href}>{it.cta}</Link2>}
              {it.locked && <span style={{ fontSize: 13, color: C.faint }}>Locked</span>}
            </div>
          ))}
        </PCard>
        <div style={{ width: 380, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <PCard style={{ padding: 24, gap: 14 }}>
            <Eyebrow>Intelligence readiness</Eyebrow>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 56, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: "56px" }}>18</span>
              <span style={{ fontSize: 15, color: C.slate }}>/ 100 · learning</span>
            </div>
            <div style={{ display: "flex", gap: 3, height: 6 }}>
              <div className="origin-left animate-[grow_1s_cubic-bezier(.32,.72,0,1)]" style={{ width: 60, background: C.pine, borderRadius: 4 }} />
              <div style={{ flex: 1, background: C.line, borderRadius: 4 }} />
            </div>
            <Txt size={13} color={C.body}>Not ready to advise yet. It will tell you &quot;I don&apos;t know&quot; until it has evidence.</Txt>
          </PCard>
          <a href="/ask?q=What%20do%20you%20know%20about%20me%20so%20far%3F" className="transition-transform hover:-translate-y-0.5" style={{ background: "radial-gradient(rgba(212,242,106,.18) 1px, transparent 1.4px) 0 0/7px 7px, #0B2F24", borderRadius: 4, padding: 24, display: "flex", flexDirection: "column", gap: 10, color: "#fff" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "#CDEE8C" }}>TRY IT ANYWAY</span>
            <span style={{ fontSize: 17 }}>&quot;What do you know about me so far?&quot;</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.lime }}>Ask your twin →</span>
          </a>
        </div>
      </Reveal>
    </Page>
  );
}
