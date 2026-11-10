"use client";
import { useDemo, audit } from "@/lib/demo";

// 1:1 port of Paper "04.03 · Leadership philosophy" (4O9-0)
import { useState } from "react";
import { Field, Modal } from "@/components/demo-ui";
import { TriangleAlert } from "lucide-react";
import { Badge, Bell, C, Dot, Eyebrow, Page, PageHead, PButton, PCard, SrcTag, Sub, Txt } from "@/components/paper";
import { Reveal } from "@/components/ui";

const seed = [
  { k: "Management", q: "“Hire for character, train for skill.”", d: "Appointed a 31-year-old registrar at DIU in 2016 (Registrar Rahman), who later led accreditation.", src: ["Staff town hall · Jan 2024"], s: "Verified" },
  { k: "People", q: "“Give young leaders authority before they feel ready.”", d: "Student-run incubator board, founded 2021, now funds 14 startups a year.", src: ["Incubator charter", "Convocation 2024"], s: "Confirmed" },
  { k: "Conflict", q: "“Disagree in the room, never in the corridor.”", d: "Resolved the 2022 faculty dispute over semester restructuring with one open forum.", src: ["DIU board minutes · Aug 2022"], s: "Inferred" },
  { k: "Strategy", q: "“Partner with the best, then earn equality.”", d: "The University of Wollongong 2+2 pathway, negotiated over three years.", src: ["Wollongong MoU · 2025 speech"], s: "Verified" },
  { k: "Accountability", q: "“Failure is tuition, if you write down the lesson.”", d: "Closed the 2019 online MBA and published the post-mortem to staff.", src: ["Internal memo · Dec 2019"], s: "Inferred" },
];
const priorities: [string, string, number][] = [
  ["Graduate employability above 85% in six months", "Now 78% · target 85%", 78],
  ["Three international pathway partners", "1 of 3 · Wollongong signed", 33],
  ["Incubator self-funding by 2027", "61% of costs covered today", 61],
];

export default function Leadership() {
  const [items, setItems] = useDemo("leadership-principles", seed);
  const [adding,setAdding]=useState(false);const [principle,setPrinciple]=useState("");const [context,setContext]=useState("");
  const pending = items.filter((i) => i.s === "Inferred").length;
  const ok = items.length - pending;
  return (
    <Page>
      <Reveal>
        <PageHead eyebrow="04.03 · Leadership philosophy" title="What you believe about leading" actions={<><Bell /><PButton onClick={()=>setAdding(true)}>Add principle</PButton><PButton variant="lime" onClick={() => setItems((xs) => xs.map((x) => ({ ...x, s: x.s === "Inferred" ? "Verified" : x.s })))}>{pending ? `Verify ${pending} principles` : "All verified"}</PButton></>} />
      </Reveal>
      <Reveal delay={0.06} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <PCard style={{ flex: 1, padding: "20px 20px 4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12 }}>
            <Txt size={17} weight={600}>Principles · {items.length}</Txt>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.slate }}>
              <span style={{ display: "flex", gap: 2 }}>{Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ width: 6, height: 14, borderRadius: 1, background: i < ok ? C.pine : "#E3E2DE" }} />)}</span>
              {ok}/{items.length} verified or confirmed
            </span>
          </div>
          {items.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 20, padding: "16px 0", borderTop: `1px solid ${C.line}`, alignItems: "flex-start" }}>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 30, width: 130, flexShrink: 0 }}>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", color: C.slate, textTransform: "uppercase", paddingLeft: 22 }}>{p.k}</span>
                <Dot color={p.s === "Inferred" ? C.amber : C.pine} size={7} />
              </span>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>{p.q}</div>
                <Txt size={13} color={C.body}>{p.d}</Txt>
                <div style={{ display: "flex", gap: 6 }}>{p.src.map((s) => <SrcTag key={s}>{s}</SrcTag>)}</div>
              </div>
              <button disabled={p.s !== "Inferred"} onClick={() => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, s: "Verified" } : x)))} title={p.s === "Inferred" ? "Click to verify" : undefined}>
                <Badge kind={p.s} />
              </button>
            </div>
          ))}
        </PCard>
        <PCard style={{ width: 400, flexShrink: 0, padding: 20, gap: 16 }}>
          <Txt size={17} weight={600}>Values</Txt>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Access to education", "Integrity", "Self-reliance"].map((v) => <span key={v} style={{ background: C.wash, color: C.pine, borderRadius: 4, padding: "6px 10px", fontSize: 13, fontWeight: 600 }}>{v}</span>)}
            {["Long-term thinking", "Loyalty to people"].map((v) => <span key={v} style={{ background: "#F1F1EE", color: C.body, borderRadius: 4, padding: "6px 10px", fontSize: 13 }}>{v}</span>)}
          </div>
          <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 16 }}><Eyebrow>Strategic priorities 2025–30</Eyebrow></div>
          {priorities.map(([t, s, v]) => (
            <div key={t} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <svg width="28" height="28" style={{ flexShrink: 0 }}><circle cx="14" cy="14" r="11" fill="none" stroke="#E9E8E4" strokeWidth="2.5" /><circle cx="14" cy="14" r="11" fill="none" stroke={C.pine} strokeWidth="2.5" strokeDasharray={`${(v / 100) * 69} 69`} transform="rotate(-90 14 14)" /></svg>
              <div><Txt>{t}</Txt><Sub>{s}</Sub></div>
            </div>
          ))}
          {pending > 0 && (
            <div style={{ display: "flex", gap: 12, background: "#FBEFD9", borderRadius: 4, padding: 14 }}>
              <span style={{ width: 28, height: 28, background: "#fff", borderRadius: 4, display: "grid", placeItems: "center", flexShrink: 0 }}><TriangleAlert size={14} /></span>
              <div>
                <Txt size={13} weight={600}>{pending} principles await verification</Txt>
                <Sub size={12} color={C.body}>Inferred principles are shown to you only. Verify or edit them before the twin may cite them in drafts.</Sub>
              </div>
            </div>
          )}
        </PCard>
      </Reveal>
{adding&&<Modal title="Add leadership principle" onClose={()=>setAdding(false)}><form className="demo-form" onSubmit={e=>{e.preventDefault();setItems(xs=>[...xs,{k:"Personal",q:principle,d:context,src:["Direct entry"],s:"Confirmed"}]);audit("Added leadership principle","Intelligence");setAdding(false);setPrinciple("");setContext("");}}><Field label="Principle"><input required value={principle} onChange={e=>setPrinciple(e.target.value)}/></Field><Field label="Supporting context"><textarea required value={context} onChange={e=>setContext(e.target.value)}/></Field><button className="demo-button primary">Save principle</button></form></Modal>}
    </Page>
  );
}
