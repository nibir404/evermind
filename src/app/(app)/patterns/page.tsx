"use client";

// 1:1 port of Paper "04.04 · Decision patterns" (4PB-0) — plus the patterns list
import { motion } from "framer-motion";
import { Badge, Bell, C, Eyebrow, Page, PageHead, PButton, PCard, SrcTag, Sub, Txt } from "@/components/paper";
import { Reveal, ease } from "@/components/ui";

const patterns = [
  { t: "Never decides on the day", d: "Final answer usually comes the next morning, often handwritten.", n: "31 of 38 board decisions", s: "Confirmed", src: "Interview · session 1" },
  { t: "Starts with one partner, then scales", d: "Wollongong first; Caucasus 2019 showed three at once was too many.", n: "6 partnerships", s: "Verified", src: "Caucasus 2019 notes" },
  { t: "Students win close calls", d: "When options are within 10%, picks the one better for students.", n: "12 of 14 close calls", s: "Confirmed", src: "Your book, 2025 · p. 42" },
  { t: "Asks for a recovery plan before cutting", d: "Under-performing units get one quarter to present a plan.", n: "4 companies", s: "Inferred", src: "Group reviews 2021–26" },
];

export default function Patterns() {
  return (
    <Page gap={16}>
      <Reveal>
        <PageHead eyebrow="04.04 · Decision patterns" title="How you tend to decide" actions={<><Bell /><PButton href="/audit">Change history</PButton><PButton variant="lime" href="/memory/corrections">Correct a pattern</PButton></>} />
      </Reveal>
      <Reveal delay={0.05} style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1, borderRadius: 4, padding: 20, boxShadow: "#0000000D 0 0 0 .5px, #0000000A 0 1px 2px", background: "radial-gradient(ellipse 50% 100% at 0% 0%, rgba(214,232,250,.6), transparent 60%), radial-gradient(ellipse 50% 100% at 60% 100%, rgba(236,246,214,.7), transparent 60%), radial-gradient(rgba(14,90,67,.14) .9px, transparent 1.1px) 0 0/6px 6px, #fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><Eyebrow>Risk tolerance</Eyebrow><Badge kind="Verified" /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, margin: "14px 0 10px" }}>
            <svg width="140" height="80" viewBox="0 0 140 80">
              <path d="M10 72 A60 60 0 0 1 130 72" fill="none" stroke="#E9E8E4" strokeWidth="9" strokeLinecap="round" />
              <motion.path d="M10 72 A60 60 0 0 1 130 72" fill="none" stroke={C.pine} strokeWidth="9" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 0.68 }} transition={{ duration: 1.2, ease }} />
              <motion.line x1="70" y1="72" x2="70" y2="28" stroke={C.ink} strokeWidth="2" style={{ originX: "70px", originY: "72px" }} initial={{ rotate: -90 }} animate={{ rotate: 0.68 * 180 - 90 }} transition={{ duration: 1.2, ease }} />
              <circle cx="70" cy="72" r="5" fill={C.ink} />
            </svg>
            <div>
              <div style={{ fontSize: 40, fontWeight: 300 }}>68<span style={{ fontSize: 13, color: C.slate }}>/100</span></div>
              <Sub size={13} color={C.body}>Moderate-high</Sub>
            </div>
          </div>
          <Txt size={13} color={C.body}>Bold on education bets, cautious on debt and reputation.</Txt>
        </div>
        <PCard style={{ flex: 1, padding: 20, gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><Eyebrow>Time horizon</Eyebrow><Badge kind="Confirmed" /></div>
          <div style={{ fontSize: 40, fontWeight: 300 }}>5–10 <span style={{ fontSize: 13, color: C.slate }}>yrs typical</span></div>
          <div style={{ position: "relative", height: 10 }}>
            <div style={{ position: "absolute", inset: 0, background: "#E9E8E4", borderRadius: 4 }} />
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease }} style={{ position: "absolute", left: "30%", width: "36%", top: 0, bottom: 0, background: C.pine, borderRadius: 4, transformOrigin: "left" }} />
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease, delay: 0.3 }} style={{ position: "absolute", left: "66%", width: "26%", top: 0, bottom: 0, background: "#8FD8B0", borderRadius: 4, transformOrigin: "left" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.slate }}><span>0</span><span>5</span><span>10</span><span>15+ yrs</span></div>
          <Txt size={13} color={C.body}>15+ years for partnerships such as Wollongong.</Txt>
        </PCard>
      </Reveal>
      <Reveal delay={0.1}>
        <PCard style={{ padding: "20px 20px 4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12 }}>
            <Txt size={17} weight={600}>Patterns · {patterns.length}</Txt>
            <Sub size={12}>Learned from 418 recorded decisions</Sub>
          </div>
          {patterns.map((p) => (
            <div key={p.t} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 0", borderTop: `1px solid ${C.line}` }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <Txt weight={600}>{p.t}</Txt>
                <Txt size={13} color={C.body}>{p.d}</Txt>
                <div><SrcTag>{p.src}</SrcTag></div>
              </div>
              <span style={{ fontSize: 13, color: C.body, width: 180, textAlign: "right" }}>{p.n}</span>
              <Badge kind={p.s} />
            </div>
          ))}
        </PCard>
      </Reveal>
    </Page>
  );
}
