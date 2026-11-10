"use client";

// 1:1 port of Paper "05.04 · Experience archive" (4UL-0)
import { useState } from "react";
import { useDemo } from "@/lib/demo";
import { Field, Modal } from "@/components/demo-ui";
import { Pencil } from "lucide-react";
import { Badge, C, Page, PageHead, PButton, Sub, Txt } from "@/components/paper";
import { Reveal } from "@/components/ui";

const xs = [
  { y: "2023–25", k: "Partnership", t: "Negotiating the Wollongong pathway", d: "Three years of talks on credit transfer and quality assurance before the board approved a 2+2 model.", l: "Accept junior terms first; parity follows proven outcomes.", s: "Verified", meta: ["People · Prof. Ellis, Registrar Rahman", "Org · DIU, University of Wollongong", "Outcome · Approved, first intake 2026", "Source · Board minutes, MoU draft v7"] },
  { y: "2021", k: "Students", t: "Handing the incubator to students", d: "Created a student-run board with real budget authority over seed grants.", l: "Responsibility given early builds founders faster than training.", s: "Confirmed", meta: ["People · Nadia Islam, 6 student directors", "Org · Daffodil Incubator", "Outcome · 14 startups funded per year", "Source · Incubator charter"] },
  { y: "2019", k: "Setback", t: "Closing the online MBA", d: "Enrolment targets were met but completion quality was not; programme closed after one intake.", l: "Measure growth by graduate outcomes, not enrolment.", s: "Confirmed", meta: ["People · Dean of Business, 42 students", "Org · DIU", "Outcome · Refunds issued; post-mortem shared", "Source · Internal memo, Dec 2019"] },
  { y: "2016", k: "People", t: "Appointing a young registrar", d: "Chose a 31-year-old over senior candidates; she later led accreditation.", l: "Character outlasts credentials.", s: "Inferred", meta: ["People · Registrar Rahman", "Org · DIU", "Outcome · Accreditation renewed 2019", "Source · HR committee minutes"] },
];

export default function Experiences() {
  const [items,setItems]=useDemo("experiences",xs);const [filter,setFilter]=useState(false);const [draft,setDraft]=useState<(typeof xs)[number]|null>(null);const [index,setIndex]=useState(-1);
  return (
    <Page gap={16}>
      <Reveal>
        <PageHead eyebrow="05.04 · Experience archive" title="The experiences that shaped you." actions={<><PButton onClick={()=>setFilter(!filter)}>{filter?"Show all":"Verified only"}</PButton><PButton variant="ink" onClick={()=>{setIndex(-1);setDraft({y:"2026",k:"Personal",t:"",d:"",l:"",s:"Confirmed",meta:["Source · Direct entry"]});}}>Add experience</PButton></>} />
      </Reveal>
      <Reveal delay={0.06} style={{ background: "#fff", borderRadius: 4, boxShadow: "#0000000D 0 0 0 .5px, #0000000A 0 1px 2px", padding: "4px 20px" }}>
        {items.map((e, i) => (!filter||e.s==="Verified")&&(
          <div key={e.t} className="group experience-row" style={{ display: "flex", gap: 30, padding: "22px 0", borderTop: i ? `1px solid ${C.line}` : "none" }}>
            <div style={{ width: 114, flexShrink: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em" }}>{e.y}</div>
              <Sub size={13}>{e.k}</Sub>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><Txt size={16} weight={600}>{e.t}</Txt><Badge kind={e.s} /></div>
              <Txt size={14} color={C.body}>{e.d}</Txt>
              <Txt size={14}><b>Lesson</b> · {e.l}</Txt>
            </div>
            <div style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: C.body }}>
              {e.meta.map((m, j) => <span key={m} style={{ color: j === 3 ? C.slate : C.body }}>{m}</span>)}
            </div>
            <button onClick={()=>{setIndex(i);setDraft({...e});}} aria-label={`Edit ${e.t}`} style={{ color: C.body }} className="opacity-60 transition group-hover:opacity-100"><Pencil size={15} /></button>
          </div>
        ))}
      </Reveal>
{draft&&<Modal title="Experience" onClose={()=>setDraft(null)}><form className="demo-form" onSubmit={e=>{e.preventDefault();setItems(old=>index<0?[draft,...old]:old.map((x,i)=>i===index?draft:x));setDraft(null);}}>{(["t","y","k","d","l"] as const).map((key,i)=><Field key={key} label={["Title","Year","Category","Experience","Lesson"][i]}><input required value={draft[key]} onChange={e=>setDraft({...draft,[key]:e.target.value})}/></Field>)}<button className="demo-button primary">Save experience</button></form></Modal>}
    </Page>
  );
}
