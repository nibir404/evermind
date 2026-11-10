"use client";

// 1:1 port of Paper "05.01 · Memory graph" (4RF-0)
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge, C, Eyebrow, Link2, Page, PageHead, PButton, Txt } from "@/components/paper";
import { Reveal, ease } from "@/components/ui";

type K = "person" | "decision" | "org" | "exp" | "me";
type N = { id: string; l: string; k: K; x: number; y: number; detail?: string; src?: string; links?: [string, string][]; status?: string };
const nodes: N[] = [
  { id: "me", l: "Dr. Khan", k: "me", x: 430, y: 330 },
  { id: "rahman", l: "Registrar Rahman", k: "person", x: 100, y: 120, detail: "Appointed at 31 in 2016. Later led accreditation.", src: "HR committee minutes", links: [["DIU board", "reports to"], ["Dr. Sabur Khan", "appointed by"]], status: "Verified" },
  { id: "board", l: "DIU board", k: "org", x: 220, y: 190, detail: "Chaired by Dr. Sabur Khan since 2002.", src: "DIU charter", links: [["Dr. Sabur Khan", "chaired by"], ["Wollongong 2+2 pathway", "approved"]], status: "Verified" },
  { id: "sem", l: "Semester restructure", k: "decision", x: 430, y: 140, detail: "Trimester model adopted after one open faculty forum, Aug 2022.", src: "DIU board minutes · Aug 2022", links: [["Dr. Sabur Khan", "decided"], ["DIU board", "approved by"]], status: "Verified" },
  { id: "uow", l: "Univ. of Wollongong", k: "org", x: 760, y: 120, detail: "Partner since 2021. Accreditation renewed to 2031.", src: "UOW registrar reply", links: [["Wollongong 2+2 pathway", "partner"]], status: "Verified" },
  { id: "w22", l: "Wollongong 2+2 pathway", k: "decision", x: 630, y: 200, detail: "Approved 12 Mar 2025. DIU students complete two years in Dhaka and two at the University of Wollongong.", src: "DIU board minutes, item 4.2", links: [["Dr. Sabur Khan", "decided"], ["University of Wollongong", "partner"], ["Prof. Ellis, DVC", "negotiated with"], ["DIU board", "approved by"], ["MBA closure, 2019", "informed by"]], status: "Verified" },
  { id: "ellis", l: "Prof. Ellis, DVC", k: "person", x: 760, y: 300, detail: "Deputy Vice-Chancellor, Wollongong. Negotiated the pathway over three years.", src: "Email · 84 threads", links: [["Wollongong 2+2 pathway", "negotiated"]], status: "Confirmed" },
  { id: "inc", l: "Incubator", k: "org", x: 250, y: 470, detail: "Student-run board since 2021. Funds 14 startups a year.", src: "Incubator charter", links: [["Dr. Sabur Khan", "founded by"], ["Demo day 2024", "hosted"]], status: "Verified" },
  { id: "nadia", l: "Nadia, founder", k: "person", x: 110, y: 550, detail: "Student founder, cohort 3. Mentored by Dr. Khan.", src: "Incubator records", links: [["Incubator", "member"]], status: "Confirmed" },
  { id: "demo", l: "Demo day 2024", k: "exp", x: 430, y: 550, detail: "Five term sheets in six days.", src: "Incubator records", links: [["Incubator", "hosted by"]], status: "Confirmed" },
  { id: "mba", l: "MBA closure, 2019", k: "exp", x: 620, y: 470, detail: "Closed after one intake; post-mortem shared with staff.", src: "Internal memo · Dec 2019", links: [["Quality-first growth", "led to"]], status: "Confirmed" },
  { id: "qfg", l: "Quality-first growth", k: "decision", x: 750, y: 550, detail: "Growth measured by graduate outcomes, not enrolment.", src: "Strategy plan 2030", links: [["MBA closure, 2019", "informed by"]], status: "Inferred" },
];
const edges: [string, string, string?][] = [["me", "board", "chairs"], ["board", "rahman"], ["me", "sem"], ["me", "w22", "decided"], ["w22", "uow", "with"], ["w22", "ellis", "led to"], ["me", "inc", "founded"], ["inc", "nadia"], ["inc", "demo", "mentored"], ["me", "mba", "experienced"], ["mba", "demo", "informed"], ["mba", "qfg"]];
const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));

function Shape({ n, active }: { n: N; active: boolean }) {
  if (n.k === "me") return <circle r="26" fill={C.ink} />;
  const ring = active ? <rect x={-15} y={-15} width={30} height={30} rx={3} fill="none" stroke={C.lime} strokeWidth="3" /> : null;
  if (n.k === "decision") return <>{ring}<rect x={-12} y={-12} width={24} height={24} rx={2} fill={C.ink} /></>;
  const fill = n.k === "org" ? C.pine : n.k === "exp" ? "#CDEE8C" : "#fff";
  return (
    <>
      {active && <circle r="20" fill="none" stroke={C.lime} strokeWidth="3" />}
      <circle r="15" fill={fill} stroke={n.k === "person" ? C.ink : "none"} strokeWidth="1.5" />
    </>
  );
}

export default function MemoryGraph() {
  const [sel, setSel] = useState("w22");
  const n = pos[sel];
  const [query,setQuery]=useState("");const [kind,setKind]=useState("All");const visible=nodes.filter(x=>(kind==="All"||x.k===kind)&&x.l.toLowerCase().includes(query.toLowerCase()));
  return (
    <Page gap={16}>
      <Reveal>
        <PageHead eyebrow="05.01 · Memory graph" title="Everything connected, in one view." actions={<><PButton href="/memories">List view</PButton><PButton variant="ink" href="/memory/corrections?new=1">Add memory</PButton></>} />
      </Reveal>
      <Reveal delay={0.05} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8 }} data-nowrap>
            <input aria-label="Search graph" placeholder="Search people, decisions, organisations…" value={query} onChange={e=>setQuery(e.target.value)} className="demo-input"/><select aria-label="Filter node type" value={kind} onChange={e=>setKind(e.target.value)}>{["All","person","decision","org","exp"].map(x=><option key={x}>{x}</option>)}</select>
          </div>
          <div style={{ background: "#fff", borderRadius: 4, boxShadow: "#0000000D 0 0 0 .5px, #0000000A 0 1px 2px", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.body }}>
              <div style={{ display: "flex", gap: 18 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 9, border: `1.5px solid ${C.ink}` }} />Person</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, background: C.ink }} />Decision</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 9, background: C.pine }} />Organisation</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 9, background: "#CDEE8C" }} />Experience</span>
              </div>
              <span style={{ color: C.slate }}>{visible.length} seeded nodes · focused on {n.l}</span>
            </div>
            <svg viewBox="0 0 860 600" style={{ width: "100%", height: "auto", marginTop: 10 }}>
              {edges.filter(([a,b])=>visible.some(x=>x.id===a)&&visible.some(x=>x.id===b)).map(([a, b, l]) => {
                const hot = (a === sel || b === sel) && (a === "me" || b === "me" || true);
                const A = pos[a], B = pos[b];
                return (
                  <g key={a + b}>
                    <motion.line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={hot ? C.pine : "#D6D5D1"} strokeWidth={hot ? 2 : 1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease }} />
                    {l && <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 6} fontSize="11" fill={C.slate} textAnchor="middle">{l}</text>}
                  </g>
                );
              })}
              {visible.map((x) => (
                <g key={x.id} transform={`translate(${x.x} ${x.y})`} style={{ cursor: x.k === "me" ? "default" : "pointer" }} onClick={() => x.k !== "me" && setSel(x.id)}>
                  <Shape n={x} active={x.id === sel} />
                  <text y={x.k === "me" ? 46 : 34} textAnchor="middle" fontSize="12.5" fontWeight={x.id === sel || x.k === "me" ? 600 : 400} fill={C.ink}>{x.l}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} style={{ width: 380, flexShrink: 0, background: "#fff", borderRadius: 4, boxShadow: "#0000000D 0 0 0 .5px, #0000000A 0 1px 2px", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><Eyebrow>Selected · {n.k === "exp" ? "Experience" : n.k === "org" ? "Organisation" : n.k[0].toUpperCase() + n.k.slice(1)}</Eyebrow><Badge kind={n.status ?? "Verified"} /></div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{n.l}</div>
            <Txt color={C.body}>{n.detail}</Txt>
            <span style={{ fontSize: 12, color: C.slate }}>Source · {n.src}</span>
            <Eyebrow style={{ marginTop: 8 }}>Connections · {n.links?.length}</Eyebrow>
            {n.links?.map(([a, b]) => (
              <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: `1px solid ${C.line}`, fontSize: 14 }}>
                <span>{a}</span><span style={{ color: C.slate }}>{b}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14 }}><Link2 href={`/memory/corrections?title=${encodeURIComponent(n.l)}`}>Review memory →</Link2></div>
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </Page>
  );
}
