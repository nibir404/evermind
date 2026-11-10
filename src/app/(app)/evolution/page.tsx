"use client";
import { download, useDemo, audit } from "@/lib/demo";

// 1:1 port of Paper "04.05 · Intelligence evolution" (4QD-0)
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge, C, Eyebrow, Page, PageHead, PButton, PCard, Sub, Txt } from "@/components/paper";
import { Reveal, ease } from "@/components/ui";

const shifts = [
  ["2025", "From \"build everything ourselves\" to \"partner with the best\"", "Supporting decision: Wollongong 2+2 pathway approved by DIU board", "Your note: \"Wollongong taught me equality is earned, not negotiated.\"", "Verified"],
  ["2021", "Students as founders, not only graduates", "Supporting decision: launch of the student-run incubator board", "Source · Incubator charter, convocation 2021", "Confirmed"],
  ["2019", "Growth by quality, not enrolment numbers", "Supporting decision: closing the online MBA after one intake", "Source · Internal memo, Dec 2019", "Inferred"],
  ["2016", "Trusting young leaders with real authority", "Supporting decision: appointing a 31-year-old registrar", "Source · HR committee minutes, 2016", "Confirmed"],
];
const periods: Record<string, string[]> = {
  "2015 – 2018": ["New campuses", "Enrolment", "Debt-funded expansion", "23 recorded"],
  "2019 – 2021": ["Quality programmes", "Graduate outcomes", "Self-funded", "32 recorded"],
  "2022 – 2025": ["Partnerships", "Employability", "Equity-light pilots", "41 recorded"],
};
const series = [
  { k: "Partnerships", c: "#1F6B50", v: [5, 5, 7, 7, 8, 10, 12, 14, 16, 19, 21, 22] },
  { k: "Employability", c: "#3D9A6A", v: [8, 8, 9, 10, 11, 13, 15, 17, 18, 19, 20, 21] },
  { k: "Student founders", c: "#9ADBB8", v: [2, 2, 3, 3, 5, 8, 10, 12, 13, 14, 15, 15] },
  { k: "Campus growth", c: "#D4F26A", v: [18, 18, 17, 16, 15, 12, 10, 8, 6, 5, 4, 4] },
  { k: "Enrolment", c: "#E2AE5C", v: [17, 17, 16, 15, 14, 10, 8, 6, 5, 4, 3, 2] },
];

function Stream() {
  const W = 1220, H = 150, n = 12, x = (i: number) => (i / (n - 1)) * W;
  const tot = Array.from({ length: n }, (_, i) => series.reduce((s, r) => s + r.v[i], 0));
  const max = Math.max(...tot);
  const paths = series.map((s, si) => {
    const top = Array.from({ length: n }, (_, i) => H - (tot[i] / max) * H + series.slice(0, si).reduce((sum, row) => sum + row.v[i] / max * H, 0));
    const bot = top.map((t, i) => t + (s.v[i] / max) * H);
    const curve = (ys: number[]) => ys.map((y, i) => (i ? `C${x(i - 0.5)},${ys[i - 1]} ${x(i - 0.5)},${y} ${x(i)},${y}` : `M0,${y}`)).join(" ");
    const back = bot.slice().reverse().map((y, j) => { const i = n - 1 - j; return j ? `C${x(i + 0.5)},${bot[i + 1]} ${x(i + 0.5)},${y} ${x(i)},${y}` : `L${x(i)},${y}`; }).join(" ");
    return { d: `${curve(top)} ${back} Z`, c: s.c };
  });
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: "100%", height: "auto" }}>
      {paths.map((p, i) => <motion.path key={i} d={p.d} fill={p.c} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08, duration: 0.6, ease }} />)}
      {[4, 7, 10].map((i) => <line key={i} x1={x(i)} x2={x(i)} y1={0} y2={H} stroke="#fff" strokeWidth="1.5" />)}
      {Array.from({ length: n }).map((_, i) => <text key={i} x={x(i)} y={H + 18} fontSize="11" fontFamily="ui-monospace,monospace" textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fill={C.slate}>{2015 + i}</text>)}
    </svg>
  );
}

export default function Evolution() {
  const [a, setA] = useState("2015 – 2018");
  const [b, setB] = useState("2022 – 2025");
  const [annotations,setAnnotations]=useDemo<string[]>("evolution-annotations",[]);
  const rows = ["Growth", "Success metric", "Risk", "Decisions"];
  const sel = (v: string, on: (s: string) => void) => (
    <select value={v} onChange={(e) => on(e.target.value)} style={{ flex: 1, height: 34, padding: "0 10px", border: `1px solid ${C.ink}33`, borderRadius: 4, fontSize: 13, background: "#fff" }}>
      {Object.keys(periods).map((p) => <option key={p}>{p}</option>)}
    </select>
  );
  return (
    <Page gap={16}>
      <Reveal>
        <PageHead eyebrow="04.05 · Intelligence evolution" title="How your thinking has moved." actions={<><PButton onClick={() => download("intelligence-evolution.json", {shifts, periods, series})}>Export</PButton><PButton variant="ink" onClick={()=>{const note=window.prompt("Add an annotation to your evolution timeline");if(note?.trim()){setAnnotations(xs=>[note.trim(),...xs]);audit("Added evolution annotation","Intelligence");}}}>Add annotation</PButton></>} />
      </Reveal>
      <Reveal delay={0.05} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <PCard dither={false} style={{ flex: 1, padding: "20px 20px 4px" }}>
          <Eyebrow style={{ paddingBottom: 14 }}>Shifts in thinking</Eyebrow>
          {shifts.map(([y, t, d, s, k]) => (
            <div key={y} style={{ display: "flex", gap: 30, padding: "16px 0", borderTop: `1px solid ${C.line}` }}>
              <span style={{ fontSize: 24, fontWeight: 300, width: 60 }}>{y}</span>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <Txt size={16} weight={600}>{t}</Txt>
                <Txt size={13} color={C.body}>{d}</Txt>
                <Sub>{s}</Sub>
              </div>
              <Badge kind={k} />
            </div>
          ))}
        </PCard>
        <PCard dither={false} style={{ width: 420, flexShrink: 0, padding: 20, gap: 12 }}>
          <Eyebrow>Compare periods</Eyebrow>
          <div style={{ display: "flex", gap: 8 }}>{sel(a, setA)}{sel(b, setB)}</div>
          {rows.map((r, i) => (
            <div key={r} style={{ display: "flex", gap: 10, padding: "12px 0", borderTop: `1px solid ${C.line}`, fontSize: 14 }}>
              <span style={{ width: 100, fontSize: 12, color: C.slate }}>{r}</span>
              <span style={{ flex: 1 }}>{periods[a][i]}</span>
              <span style={{ flex: 1 }}>{periods[b][i]}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14 }}><Eyebrow>Annotations · 2</Eyebrow></div>
          <Txt>&quot;The MBA closure changed how I measure growth.&quot;</Txt>
          <Sub>Dr. Sabur Khan · 9 Sep 2025 · on 2019</Sub>
        </PCard>
      </Reveal>
      <Reveal delay={0.1}>
        <PCard dither={false} style={{ padding: 20, gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Eyebrow>What you prioritise · 2015 → 2026</Eyebrow>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.body }}>
              {series.map((s) => <span key={s.k} style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: 9, background: s.c }} />{s.k}</span>)}
            </div>
          </div>
          <Stream />
        </PCard>
      </Reveal>
{annotations.map((note,i)=><PCard key={i} style={{padding:20}}><Eyebrow>Your annotation</Eyebrow><p>{note}</p></PCard>)}
    </Page>
  );
}
