"use client";
import { download, useDemo, type AuditEvent, auditSeed } from "@/lib/demo";

// 1:1 port of Paper "03.02 · Activity center" (5GR-0)
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { C, Dot, Eyebrow, Filters, Page, PageHead, PButton, PCard, Search, Sub } from "@/components/paper";
import { Reveal, ease } from "@/components/ui";

type Ev = { id: string; day: string; time: string; title: string; meta: string; status: string; color: string; kind: string; detail: [string, string, string?][] };
const events: Ev[] = [
  { id: "e1", day: "Today", time: "09:42", title: "Approval requested: reply to Prof. Rahman", meta: "Twin · using Email draft permission (L2)", status: "Pending", color: C.warning, kind: "Approvals", detail: [["Actor", "Your twin"], ["Triggered by", "Email from Prof. Rahman, 09:31"], ["Permission", "Prepare drafts (L2) · needs approval"], ["Sources", "2+2 MoU · Intake sheet 2026", C.pine], ["Expires", "Today, 15:42", C.warning]] },
  { id: "e2", day: "Today", time: "08:15", title: "Processed Strategy plan 2030.pdf", meta: "System · 18 memories, 4 decisions, 1 duplicate skipped", status: "Done", color: C.success, kind: "Knowledge", detail: [["Actor", "System"], ["File", "Strategy plan 2030.pdf · 64 pages"], ["Extracted", "18 memories · 4 decisions", C.pine], ["Skipped", "1 duplicate"]] },
  { id: "e3", day: "Today", time: "07:58", title: "Farhana Akter asked about Q4 board agenda", meta: "Stakeholder · answered from 2 verified sources", status: "Answered", color: C.slate, kind: "Conversations", detail: [["Actor", "Farhana Akter"], ["Answered from", "Board agenda · Q4 calendar", C.pine], ["Permission", "Decisions + calendar"]] },
  { id: "e4", day: "Yesterday", time: "18:20", title: "Calendar hold sent to DIU registrar", meta: "Twin · approved by you at 17:55", status: "Completed", color: C.success, kind: "Actions", detail: [["Actor", "Your twin"], ["Approved", "By you at 17:55"], ["Sent to", "registrar@diu.edu.bd"]] },
  { id: "e5", day: "Yesterday", time: "14:03", title: "Access expired for Tanvir Hasan (advisor)", meta: "Policy · 30-day limit you set on 9 Oct", status: "Permission", color: C.slate, kind: "Permissions", detail: [["Actor", "Policy"], ["Rule", "30-day advisor limit"], ["Set on", "9 Oct 2026"]] },
  { id: "e6", day: "Yesterday", time: "11:47", title: "Could not read Board pack Sept.pptx", meta: "System · file is password-protected", status: "Failed", color: C.danger, kind: "Knowledge", detail: [["Actor", "System"], ["Reason", "Password-protected", C.danger], ["Fix", "Re-upload without a password"]] },
];
const counts = ["All · 48", "Knowledge · 14", "Conversations · 19", "Approvals · 6", "Actions · 5", "Permissions · 4"];

function Heatmap() {
  const rows = 7, cols = 24;
  const val = (r: number, c: number) => Math.max(0, 1 - Math.hypot((c - 11) / 5, (r - 2.4) / 2.2)) + (c === 16 && r < 3 ? 0.5 : 0);
  return (
    <svg width={cols * 20 + 10} height={rows * 17 + 6}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const v = val(r, c);
          const fill = r === 1 && c === 11 ? C.lime : v > 0.8 ? C.pine : v > 0.6 ? C.success : v > 0.35 ? "#6CC193" : v > 0.12 ? "#BFE3CD" : "#E9E8E4";
          const x = c * 20 + (r % 2) * 10 + 10, y = r * 17 + 10;
          return <polygon key={`${r}${c}`} points={[0, 1, 2, 3, 4, 5].map((k) => `${x + 9 * Math.cos((Math.PI / 3) * k + Math.PI / 6)},${y + 9 * Math.sin((Math.PI / 3) * k + Math.PI / 6)}`).join(" ")} fill={fill} />;
        }),
      )}
    </svg>
  );
}

export default function Activity() {
  const [f, setF] = useState(counts[0]);
  const [sel, setSel] = useState("e1");
  const [query,setQuery]=useState("");const [logs]=useDemo<AuditEvent[]>("audit",auditSeed);
  const live:Ev[]=logs.map(x=>({id:x.id,day:"Today",time:new Date(x.time).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),title:x.title,meta:`Local demo · ${x.kind}`,status:"Recorded",color:C.pine,kind:x.kind,detail:[["Time",x.time],["Module",x.kind],["Storage","This browser"]]}));
  const all=[...live,...events];const list=all.filter(e=>(f.startsWith("All")||f.startsWith(e.kind))&&(e.title+e.meta).toLowerCase().includes(query.toLowerCase()));
  const ev = all.find((e) => e.id === sel) ?? events[0];
  return (
    <Page>
      <Reveal>
        <PageHead eyebrow="03.02 · Overview · Activity" title="Everything your twin did" actions={<><Search placeholder="Search activity" value={query} onChange={setQuery}/><PButton onClick={() => download("activity.json", all)}>Export</PButton></>} />
      </Reveal>
      <Reveal delay={0.05} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Filters items={counts} active={f} onChange={setF} />
        <span style={{ fontSize: 13, color: C.body }}>Local demo history</span>
      </Reveal>
      <Reveal delay={0.1} style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
        <PCard style={{ flex: 1, padding: 20, gap: 2 }}>
          {["Today", "Yesterday"].map((d) => {
            const xs = list.filter((e) => e.day === d);
            if (!xs.length) return null;
            return (
              <div key={d}>
                <Eyebrow style={{ margin: "6px 0 10px" }}>{d}</Eyebrow>
                <AnimatePresence initial={false}>
                  {xs.map((e) => (
                    <motion.button layout key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(e.id)} className="w-full text-left transition-colors hover:bg-[#F7F7F5]" style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 12px", borderRadius: 4, background: sel === e.id ? "#F1F1EE" : "transparent" }}>
                      <span style={{ fontSize: 13, color: C.body, width: 40 }}>{e.time}</span>
                      <Dot color={e.color} />
                      <span style={{ flex: 1 }}>
                        <span style={{ display: "block", fontSize: 14, color: C.ink }}>{e.title}</span>
                        <Sub>{e.meta}</Sub>
                      </span>
                      <span style={{ fontSize: 12, color: e.color === C.slate ? C.body : e.color }}>{e.status}</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            );
          })}
        </PCard>
        <AnimatePresence mode="wait">
          <motion.div key={ev.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} style={{ width: 380, flexShrink: 0, display: "flex" }}>
            <PCard style={{ flex: 1, padding: 20, gap: 12 }}>
              <Eyebrow>Event detail</Eyebrow>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{ev.title}</div>
              {ev.detail.map(([k, v, c]) => (
                <div key={k} style={{ display: "flex", fontSize: 13 }}>
                  <span style={{ width: 110, color: C.slate }}>{k}</span>
                  <span style={{ color: c ?? C.ink }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
                <PButton variant="lime" href="/approvals" style={{ flex: 1, justifyContent: "center" }}>Review draft</PButton>
                <PButton href="/audit">Audit log</PButton>
              </div>
            </PCard>
          </motion.div>
        </AnimatePresence>
      </Reveal>
      <Reveal delay={0.15}>
        <PCard dither={false} style={{ padding: 20, flexDirection: "row", alignItems: "center", gap: 40 }}>
          <div>
            <Eyebrow>When you&apos;re asked</Eyebrow>
            <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", margin: "10px 0 6px" }}>Tue 10:00</div>
            <Sub size={13}>busiest hour</Sub>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 10, color: C.slate, paddingTop: 2 }}>{"MTWTFSS".split("").map((d, i) => <span key={i} style={{ height: 14 }}>{d}</span>)}</div>
            <Heatmap />
          </div>
        </PCard>
      </Reveal>
    </Page>
  );
}
