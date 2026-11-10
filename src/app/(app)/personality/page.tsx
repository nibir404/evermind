"use client";
import { useDemo, preferenceSeed } from "@/lib/demo";

// 1:1 port of Paper "04.02 · Personality & communication" (4N7-0)
import { useState } from "react";
import { Field, Modal } from "@/components/demo-ui";
import { Info } from "lucide-react";
import { Badge, Bell, C, Dot, Page, PageHead, PButton, PCard, SrcTag, Sub, Txt } from "@/components/paper";
import { Reveal } from "@/components/ui";

const seed: { t: string; k: string; src: string; icon: "file" | "mail"; s: string }[] = [
  { t: "Opens with a personal acknowledgement before business", k: "Leadership comms", src: "212 staff emails", icon: "mail", s: "Confirmed" },
  { t: "Prefers Bangla with staff, English with partners and boards", k: "Languages", src: "Onboarding interview", icon: "file", s: "Confirmed" },
  { t: "Uses student stories to make a strategic point", k: "Tone", src: "38 speeches · Wollongong signing 2025", icon: "file", s: "Confirmed" },
  { t: "Avoids public criticism; raises concerns one-to-one", k: "Known preference", src: "DIU board minutes · 6", icon: "file", s: "Confirmed" },
  { t: "Replies to founders within a day, in under 80 words", k: "Response length", src: "Incubator inbox · 340 threads", icon: "mail", s: "Inferred" },
  { t: "Becomes more formal when money is discussed", k: "Formality", src: "Finance committee emails", icon: "mail", s: "Inferred" },
  { t: "Signs off with first name only to students", k: "Leadership comms", src: "Student council emails", icon: "mail", s: "Inferred" },
];

function Slider({ label, value, onChange, left, right, mid, status }: { label: string; value: number; onChange: (v: number) => void; left: string; right: string; mid: string; status: string }) {
  const amber = status === "Inferred";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Txt>{label}</Txt>
        <Badge kind={status} />
      </div>
      <div style={{ position: "relative", height: 16 }}>
        <div style={{ position: "absolute", top: 7, left: 0, right: 0, height: 3, borderRadius: 4, background: amber ? "linear-gradient(90deg,#F4E6C8,#E0A84F)" : "linear-gradient(90deg,#DDE9E2,#0E5A43)" }} />
        <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(+e.target.value)} className="peer absolute inset-0 w-full cursor-pointer opacity-0" aria-label={label} />
        <div style={{ position: "absolute", top: 0, left: `calc(${value}% - 8px)`, width: 16, height: 16, borderRadius: 3, background: "#fff", border: `2.5px solid ${amber ? C.amber : C.pine}`, pointerEvents: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.slate }}>
        <span>{left}</span>
        <span style={{ color: C.ink, fontWeight: 600 }}>{mid}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}

export default function Personality() {
  const [items, setItems] = useDemo("personality-traits", seed);
  const [prefs,setPrefs]=useDemo("preferences",preferenceSeed);
  const formality=prefs.formality,direct=prefs.directness,len=prefs.length;
  const setFormality=(v:number)=>setPrefs(p=>({...p,formality:v}));
  const setDirect=(v:number)=>setPrefs(p=>({...p,directness:v}));
  const setLen=(v:number)=>setPrefs(p=>({...p,length:v}));
  const [editing,setEditing]=useState<number|null>(null);const [text,setText]=useState("");
  const confirmed = items.filter((i) => i.s === "Confirmed").length;
  const pending = 7 - confirmed;
  const fl = formality < 33 ? "Casual" : formality < 70 ? "Warm-formal" : "Ceremonial";
  const dl = direct < 40 ? "Diplomatic" : direct < 85 ? "Direct" : "Blunt";
  const ll = len < 34 ? "3–5 sentences" : len < 67 ? "2 paragraphs" : "Detailed";
  return (
    <Page>
      <Reveal>
        <PageHead eyebrow="04.02 · Personality & communication" title="The way you speak, as the twin hears it" actions={<><Bell /><PButton onClick={() => (setFormality(60), setDirect(72), setLen(25), setItems(seed))}>Reset to defaults</PButton><PButton variant="lime" onClick={() => setItems((xs) => xs.map((x) => ({ ...x, s: "Confirmed" })))}>{pending ? `Confirm ${pending} traits` : "All confirmed"}</PButton></>} />
      </Reveal>
      <Reveal delay={0.06} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <PCard style={{ flex: 1, padding: "20px 20px 4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12 }}>
            <Txt size={17} weight={600}>Traits the twin uses · 7</Txt>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.slate }}>
              <span style={{ display: "flex", gap: 2 }}>{Array.from({ length: 7 }).map((_, i) => <span key={i} style={{ width: 5, height: 14, borderRadius: 1, background: i < confirmed ? C.pine : "#E3E2DE" }} />)}</span>
              {confirmed}/7 confirmed
            </span>
          </div>
          {items.map((it, i) => (
            <div key={it.t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderTop: `1px solid ${C.line}` }}>
              <Dot color={it.s === "Confirmed" ? C.pine : C.amber} size={7} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <Txt>{it.t}</Txt>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Sub size={12}>{it.k}</Sub><SrcTag icon={it.icon}>{it.src}</SrcTag></div>
              </div>
              <Badge kind={it.s} />
              <span style={{ width: 96, textAlign: "right", fontSize: 13 }}>
                {it.s === "Inferred" ? (
                  <button onClick={() => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, s: "Confirmed" } : x)))} style={{ color: C.pine, fontWeight: 600 }}>Confirm</button>
                ) : (
                  <button onClick={()=>{setEditing(i);setText(it.t);}} style={{ color: C.body }}>Edit</button>
                )}
              </span>
            </div>
          ))}
        </PCard>
        <PCard style={{ width: 400, flexShrink: 0, padding: 20, gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Txt size={17} weight={600}>Voice settings</Txt>
            <Sub size={12}>Applied to every draft</Sub>
          </div>
          <Slider label="Formality" value={formality} onChange={setFormality} left="Casual" right="Ceremonial" mid={`${fl} · ${formality}`} status="Confirmed" />
          <Slider label="Directness" value={direct} onChange={setDirect} left="Diplomatic" right="Blunt" mid={`${dl} · ${direct}`} status="Confirmed" />
          <Slider label="Response length" value={len} onChange={setLen} left="Brief" right="Detailed" mid={ll} status="Inferred" />
          <div>
            <Txt>Languages</Txt>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <span style={{ background: C.wash, color: C.pine, borderRadius: 4, padding: "6px 10px", fontSize: 13, fontWeight: 600 }}>English</span>
              <span style={{ background: C.wash, color: C.pine, borderRadius: 4, padding: "6px 10px", fontSize: 13, fontWeight: 600 }}>Bangla</span>
              <span style={{ background: "#F1F1EE", color: C.body, borderRadius: 4, padding: "6px 10px", fontSize: 13 }}>Arabic · read only</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, background: "#F1F1EE", borderRadius: 4, padding: 14, fontSize: 12, lineHeight: "17px", color: C.body }}>
            <span style={{ width: 28, height: 28, background: "#fff", borderRadius: 4, display: "grid", placeItems: "center", flexShrink: 0 }}><Info size={14} /></span>
            Personality here describes observed habits, not a psychometric measurement. It should never be used to assess you or others.
          </div>
        </PCard>
      </Reveal>
      {editing!==null&&<Modal title="Edit personality trait" onClose={()=>setEditing(null)}><form className="demo-form" onSubmit={e=>{e.preventDefault();setItems(xs=>xs.map((x,i)=>i===editing?{...x,t:text.trim(),s:"Confirmed"}:x));setEditing(null);}}><Field label="Trait"><textarea required value={text} onChange={e=>setText(e.target.value)}/></Field><button className="demo-button primary">Save trait</button></form></Modal>}
    </Page>
  );
}
