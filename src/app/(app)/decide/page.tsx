"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/demo-ui";
import { addRecord, notify } from "@/lib/demo";

// 1:1 port of Paper "05 · Decision Studio" (662-0)
import { motion } from "framer-motion";
import { Search, X, Check, CircleHelp, FileText, ArrowUp } from "lucide-react";
import { C, Dot, Eyebrow, PButton, PCard, shadow } from "@/components/paper";
import { Reveal, ease } from "@/components/ui";

const evidence = [
  { label: "Verified evidence", dot: C.success, color: C.pine, n: 3, items: [["Wollongong accreditation renewed to 2031", "TEQSA register"], ["Intl. applications +22% YoY", "Admissions Q2"], ["Partnership budget approved", "DIU board minutes"]] },
  { label: "Confirmed preference", dot: "#7FA33A", color: "#3E5C12", n: 2, items: [["“Keep the product line very specific.”", "Your book, 2025"], ["Students first in every partnership", "Interview, session 2"]] },
  { label: "AI inference", dot: C.amber, color: C.warning, n: 3, items: [["One partner keeps QA load manageable", "Caucasus 2019 notes"], ["Incubator launch competes for staff in Q2", ""], ["Board prefers staged commitments", ""]] },
  { label: "Unknown", dot: C.faint, color: C.slate, n: 1, items: [["Faculty capacity to co-teach in 2027", ""]], ask: true },
];

const compare = [
  { t: "Accreditation", s: "delayed 2019", bg: "#F8E4E2", icon: <X size={14} color={C.danger} /> },
  { t: "Demand", s: "strong both", bg: "#E6F0E9", icon: <Check size={14} color={C.success} /> },
  { t: "Funding", s: "approved", bg: "#E6F0E9", icon: <Check size={14} color={C.success} /> },
  { t: "Faculty", s: "unknown", bg: "#F1F1EE", icon: <CircleHelp size={14} color={C.slate} /> },
];

const windows = [
  { q: "Q1 ’27", t: "Sign Wollongong", bar: C.pine },
  { q: "Q2 ’27", t: "First cohort", bar: C.pine },
  { q: "Q3 ’27 · BEST", t: "Add 2nd partner", best: true },
  { q: "Q4 ’27", t: "Review with board", bar: "#E9E8E4" },
];

const risks = [
  ["Accreditation lag", "High", C.danger],
  ["Faculty overload", "Medium", C.warning],
  ["Exchange-rate shift", "Low", C.success],
];

export default function Decide() {
  const router=useRouter();
  const [source,setSource]=useState<string|null>(null);
  const [search,setSearch]=useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "32px 32px 48px", maxWidth: 1360 }}>
      {source && <Modal title="Evidence source" onClose={()=>setSource(null)}><p>{source}</p><p className="demo-muted">Seeded source excerpt. Open the knowledge library to manage evidence.</p><div className="demo-actions"><PButton href="/knowledge">Open knowledge</PButton></div></Modal>}
      {search && <a className="demo-link" href="/decisions">Browse decision records matching your search →</a>}
      <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div style={{ color: C.slate, fontSize: 13, marginBottom: 6 }}>Decision Studio / Analysis</div>
          <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: "38px", color: C.ink }}>Decision analysis</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, width: 240, height: 40, padding: "0 12px", background: "#fff", borderRadius: 4, boxShadow: shadow, fontSize: 14, color: C.faint }}>
            <Search size={15} />
            <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")router.push("/decisions");}} placeholder="Search decisions" className="placeholder:text-[#A3A1A8]" style={{ flex: 1, outline: "none", background: "transparent", color: C.ink }} />
            <span style={{ fontSize: 11, background: "#F1F1EE", borderRadius: 4, padding: "2px 6px" }}>⌘K</span>
          </label>
          <PButton href="/ask">Discuss with twin</PButton>
          <PButton variant="lime" onClick={() => { addRecord("decisions", {id:crypto.randomUUID(),title:"Wollongong: start with one partner",body:"Review faculty capacity before adding a second partner in Q3 2027.",status:"Recorded",category:"Partnerships",date:"2026-11-10",source:"Decision analysis · seeded evidence"});notify("Decision saved to Decision Studio"); }}>Save as decision</PButton>
        </div>
      </Reveal>

      <Reveal delay={0.05} style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1, borderRadius: 4, boxShadow: shadow, padding: 24, display: "flex", flexDirection: "column", gap: 10, background: "radial-gradient(ellipse 60% 120% at 100% 100%, rgba(212,242,106,.25), transparent 60%), radial-gradient(ellipse 60% 120% at 0% 0%, rgba(143,216,176,.25), transparent 60%), radial-gradient(rgba(14,90,67,.14) .9px, transparent 1.1px) 0 0/6px 6px, #fff" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Eyebrow>Question</Eyebrow>
            <span style={{ color: C.slate, fontSize: 12 }}>· asked by Dr. Sabur Khan · 2 min ago</span>
          </div>
          <div style={{ fontSize: 17, color: C.body }}>Sign joint degrees with 3 Australian universities this year?</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: "52px", color: C.ink }}>Start with one.</span>
            <span style={{ fontSize: 14, color: C.body }}>Sign Wollongong first, add a 2nd partner in Q3 ’27.</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {["Confirmed · Keep the line specific", "Confirmed · Students first"].map((c) => (
              <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EAF5C8", color: "#3E5C12", borderRadius: 4, padding: "5px 10px", fontSize: 12, fontWeight: 600 }}>
                <Dot color="#3E5C12" size={6} /> {c}
              </span>
            ))}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", boxShadow: shadow, borderRadius: 4, padding: "5px 10px", fontSize: 12, color: C.body }}>
              <FileText size={12} /> Your book, 2025
            </span>
            <span style={{ fontSize: 12, color: C.slate }}>+5 sources</span>
          </div>
        </div>

        <PCard style={{ width: 360, flexShrink: 0, padding: 20, gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 17, fontWeight: 600 }}>Twin&apos;s confidence</span>
            <span style={{ background: "#EAF5C8", color: "#3E5C12", borderRadius: 4, padding: "3px 8px", fontSize: 11, fontWeight: 600, display: "flex", gap: 4, alignItems: "center" }}>
              <ArrowUp size={11} /> +6 since Mon
            </span>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <svg width="84" height="84" viewBox="0 0 84 84" style={{ flexShrink: 0 }}>
              <circle cx="42" cy="42" r="36" fill="none" stroke="#E9E8E4" strokeWidth="6" />
              <motion.circle
                cx="42"
                cy="42"
                r="36"
                fill="none"
                stroke={C.pine}
                strokeWidth="6"
                strokeLinecap="round"
                transform="rotate(-90 42 42)"
                strokeDasharray={2 * Math.PI * 36}
                initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 36 * 0.3 }}
                transition={{ duration: 1.4, ease }}
              />
              <text x="42" y="48" textAnchor="middle" fontFamily="var(--font-newsreader), Georgia, serif" fontSize="20" fill={C.ink}>70%</text>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 14, lineHeight: "20px", color: C.body }}>Driven by 3 verified facts and 2 confirmed preferences; held back by 1 unknown (faculty capacity).</div>
              <div style={{ display: "flex", gap: 3, height: 4 }}>
                <div style={{ flex: 3, background: C.pine, borderRadius: 4 }} />
                <div style={{ flex: 2, background: "#8FD8B0", borderRadius: 4 }} />
                <div style={{ flex: 1.5, background: C.amber, borderRadius: 4 }} />
                <div style={{ flex: 0.7, background: "#E9E8E4", borderRadius: 4 }} />
              </div>
            </div>
          </div>
        </PCard>
      </Reveal>

      <Reveal delay={0.1}>
        <PCard style={{ padding: 20, gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 17, fontWeight: 600 }}>Evidence stack</span>
            <span style={{ fontSize: 12, color: C.slate }}>9 items · click a source chip to open the evidence</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {evidence.map((col, ci) => (
              <motion.div
                key={col.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + ci * 0.06, duration: 0.5, ease }}
                style={{ flex: 1, background: "#F4F4F1", borderRadius: 4, padding: 14, display: "flex", flexDirection: "column", gap: 10, minHeight: 208 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: col.color }}>
                    <Dot color={col.dot} size={6} /> {col.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{col.n}</span>
                </div>
                {col.items.map(([t, src]) => (
                  <div key={t} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 14, lineHeight: "18px", color: C.ink }}>{t}</span>
                    {src && (
                      <button onClick={() => setSource(src+" — "+t)} className="transition hover:shadow-md" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", borderRadius: 4, padding: "4px 8px", fontSize: 11, color: C.body, boxShadow: "#0000000D 0 0 0 .5px" }}>
                        <FileText size={11} /> {src}
                      </button>
                    )}
                  </div>
                ))}
                {col.ask && (
                  <button onClick={() => {addRecord("tasks",{id:crypto.randomUUID(),title:"Ask the Dean about faculty capacity",body:"Confirm capacity to co-teach in 2027 before a second pathway is approved.",status:"Open",category:"High",date:"2026-11-10",source:"Decision Studio"});notify("Task created for faculty capacity review");}} style={{ alignSelf: "flex-start", background: "#fff", borderRadius: 4, padding: "6px 10px", fontSize: 13, fontWeight: 600, boxShadow: shadow }}>Ask the Dean</button>
                )}
              </motion.div>
            ))}
          </div>
        </PCard>
      </Reveal>

      <Reveal delay={0.15} style={{ display: "flex", gap: 16 }}>
        <PCard style={{ flex: 1, padding: 20, gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 17, fontWeight: 600 }}>vs. Caucasus University 2019</span>
            <span style={{ fontSize: 12, color: C.slate }}>3/4 match</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {compare.map((c) => (
              <div key={c.t} style={{ flex: 1, background: c.bg, borderRadius: 4, padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                {c.icon}
                <span style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>{c.t}</span>
                <span style={{ fontSize: 11, color: C.slate }}>{c.s}</span>
              </div>
            ))}
          </div>
        </PCard>
        <PCard style={{ flex: 1, padding: 20, gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 17, fontWeight: 600 }}>Recommended window</span>
            <span style={{ fontSize: 12, color: C.slate }}>Q3 ’27 · after first cohort</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {windows.map((w) => (
              <div key={w.q} style={{ flex: 1, background: w.best ? C.lime : "#F4F4F1", borderRadius: 4, padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ height: 3, background: w.best ? C.pine : w.bar, borderRadius: 4, marginBottom: 6 }} />
                <span style={{ fontSize: 11, color: w.best ? C.pine : C.slate, fontWeight: w.best ? 600 : 400 }}>{w.q}</span>
                <span style={{ fontSize: 13, fontWeight: w.best ? 600 : 400, color: C.ink }}>{w.t}</span>
              </div>
            ))}
          </div>
        </PCard>
        <PCard dither={false} style={{ width: 250, flexShrink: 0, padding: 20, gap: 12 }}>
          <span style={{ fontSize: 17, fontWeight: 600 }}>Risks</span>
          {risks.map(([r, l, c]) => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ width: 8, height: 8, borderRadius: 9, background: c }} />
              <span style={{ flex: 1 }}>{r}</span>
              <span style={{ fontSize: 11, color: C.slate }}>{l}</span>
            </div>
          ))}
        </PCard>
      </Reveal>
    </div>
  );
}
