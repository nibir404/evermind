"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, Check, CircleHelp, FileText, ArrowUp, ArrowRight, AlertTriangle, CalendarClock, Gavel, UserRound, Sparkles } from "lucide-react";
import { Modal } from "@/components/demo-ui";
import { addRecord, notify, audit, useDemo } from "@/lib/demo";
import { C, Dot, PButton, PCard, shadow } from "@/components/paper";
import { Reveal, ease } from "@/components/ui";

// Decision analysis: verdict first, then what you can act on, then the context behind it.

type Steps = { dean: boolean; saved: boolean; review: boolean; mitigated: boolean };
const stepsSeed: Steps = { dean: false, saved: false, review: false, mitigated: false };

const evidence = [
  { key: "verified", label: "Verified evidence", dot: C.success, color: C.pine, weight: 3, items: [["Wollongong accreditation renewed to 2031", "TEQSA register"], ["Intl. applications +22% YoY", "Admissions Q2"], ["Partnership budget approved", "DIU board minutes"]] },
  { key: "confirmed", label: "Confirmed preference", dot: "#7FA33A", color: "#3E5C12", weight: 2, items: [["“Keep the product line very specific.”", "Your book, 2025"], ["Students first in every partnership", "Interview, session 2"]] },
  { key: "inferred", label: "AI inference", dot: C.amber, color: C.warning, weight: 1.5, items: [["One partner keeps QA load manageable", "Caucasus 2019 notes"], ["Incubator launch competes for staff in Q2", ""], ["Board prefers staged commitments", ""]] },
  { key: "unknown", label: "Unknown", dot: C.faint, color: C.slate, weight: 0.7, items: [["Faculty capacity to co-teach in 2027", ""]] },
];

const options = [
  { name: "Sign all three now", total: 41, s: [35, 30, 95, 20] },
  { name: "Start with one", total: 78, s: [92, 75, 60, 80], rec: true },
  { name: "Wait until 2028", total: 52, s: [60, 88, 15, 95] },
];
const criteria = ["Fits your principles", "Low risk", "Speed", "Faculty load"];

const milestones = [
  { q: "Q1 ’27", t: "Sign Wollongong", x: 12 },
  { q: "Q2 ’27", t: "First cohort", x: 37 },
  { q: "Q3 ’27", t: "Add 2nd partner", x: 62, best: true },
  { q: "Q4 ’27", t: "Board review", x: 87 },
];

const LEVELS = ["Low", "Medium", "High"] as const;

export default function Decide() {
  const router = useRouter();
  const [source, setSource] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [steps, setSteps] = useDemo<Steps>("decide-steps", stepsSeed);
  const done = (k: keyof Steps) => setSteps(s => ({ ...s, [k]: true }));

  const confidence = 70 + (steps.dean ? 12 : 0) + (steps.mitigated ? 4 : 0);
  const trend = [52, 55, 58, 61, 64, 64, 70, ...(steps.dean ? [82] : []), ...(steps.mitigated ? [confidence] : [])];

  const risks = [
    { r: "Accreditation lag", l: steps.mitigated ? 0 : 1, i: 2, m: "Start the TEQSA check in Q1, before signing." },
    { r: "Faculty overload", l: steps.dean ? 0 : 1, i: 1, m: steps.dean ? "Dean confirmed capacity." : "Waiting on the Dean." },
    { r: "Exchange-rate shift", l: 0, i: 0, m: "Fees fixed in BDT for the first cohort." },
  ];
  const riskColor = (l: number, i: number) => (l + i >= 3 ? C.danger : l + i >= 2 ? C.warning : C.success);

  const actions = [
    { k: "dean" as const, icon: <UserRound size={16} />, title: "Ask the Dean about faculty capacity", why: "The only unknown. Resolving it raises confidence by 12 pts.", tag: "Blocking", cta: "Create request", run: () => { addRecord("tasks", { id: crypto.randomUUID(), title: "Ask the Dean about faculty capacity", body: "Confirm capacity to co-teach in 2027 before a second pathway is approved.", status: "Open", category: "High", date: "2026-11-10", source: "Decision Studio" }); done("dean"); notify("Request sent to the Dean (demo). Marked as answered so you can see the effect."); } },
    { k: "mitigated" as const, icon: <AlertTriangle size={16} />, title: "Start the accreditation check now", why: "Highest risk. In 2019 accreditation slipped 7 months.", tag: "High risk", cta: "Add mitigation", run: () => { addRecord("tasks", { id: crypto.randomUUID(), title: "Start TEQSA accreditation check for Wollongong", body: "Begin in Q1 2027 so the 2019 delay is not repeated.", status: "Open", category: "High", date: "2026-11-10", source: "Decision Studio · risk" }); done("mitigated"); notify("Mitigation task added."); } },
    { k: "saved" as const, icon: <Gavel size={16} />, title: "Decide: start with Wollongong", why: "Records your decision and the evidence behind it.", tag: "Your call", cta: "Approve & save", primary: true, run: () => { addRecord("decisions", { id: crypto.randomUUID(), title: "Wollongong: start with one partner", body: "Review faculty capacity before adding a second partner in Q3 2027.", status: "Recorded", category: "Partnerships", date: "2026-11-10", source: "Decision analysis · seeded evidence" }); audit("Approved: start with one partner (Wollongong)", "Decisions"); done("saved"); notify("Decision saved to Decision Studio."); } },
    { k: "review" as const, icon: <CalendarClock size={16} />, title: "Hold a board review for Q4 ’27", why: "Check the first cohort before a 2nd partner.", tag: "Follow-up", cta: "Add to calendar", run: () => { addRecord("calendar", { id: crypto.randomUUID(), title: "Board review · partnership pathway", body: "Review first Wollongong cohort before approving a 2nd partner.", status: "Hold", category: "Board", date: "2027-10-15", source: "Decision Studio" }); done("review"); notify("Calendar hold added (demo)."); } },
  ];
  const remaining = actions.filter(a => !steps[a.k]).length;

  return (
    <div className="decide-page" style={{ display: "flex", flexDirection: "column", gap: 16, padding: "32px 32px 48px", maxWidth: 1360 }}>
      {source && <Modal title="Evidence source" onClose={() => setSource(null)}><p>{source}</p><p className="demo-muted">Seeded source excerpt. Open the knowledge library to manage evidence.</p><div className="demo-actions"><PButton href="/knowledge">Open knowledge</PButton></div></Modal>}
      {search && <a className="demo-link" href="/decisions">Browse decision records matching your search →</a>}

      <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: C.slate, fontSize: 13, marginBottom: 6 }}>Decision Studio / Analysis</div>
          <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: "38px", color: C.ink }}>Decision analysis</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, width: 240, height: 40, padding: "0 12px", background: "#fff", borderRadius: 4, boxShadow: shadow, fontSize: 14, color: C.faint }}>
            <Search size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === "Enter") router.push("/decisions"); }} placeholder="Search decisions" className="placeholder:text-[#A3A1A8]" style={{ flex: 1, minWidth: 0, outline: "none", background: "transparent", color: C.ink }} />
          </label>
          <PButton href="/ask">Discuss with twin</PButton>
        </div>
      </Reveal>

      {/* ── 1. Verdict ─────────────────────────────────────────── */}
      <Reveal delay={0.05}>
        <div className="decide-hero" style={{ borderRadius: 4, boxShadow: shadow, overflow: "hidden", display: "grid", gridTemplateColumns: "minmax(0,1fr) 380px", background: "#fff" }}>
          <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 14, background: "radial-gradient(ellipse 60% 120% at 100% 100%, rgba(212,242,106,.3), transparent 60%), radial-gradient(ellipse 60% 120% at 0% 0%, rgba(143,216,176,.28), transparent 60%), radial-gradient(rgba(14,90,67,.14) .9px, transparent 1.1px) 0 0/6px 6px, #fff" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ background: C.ink, color: "#fff", fontSize: 11, letterSpacing: "0.08em", padding: "4px 8px", borderRadius: 4, fontWeight: 600 }}>TWIN&apos;S RECOMMENDATION</span>
              <span style={{ color: C.slate, fontSize: 12 }}>asked by Dr. Sabur Khan · 2 min ago</span>
              {steps.saved && <span style={{ background: C.wash, color: C.pine, fontSize: 12, fontWeight: 600, padding: "4px 8px", borderRadius: 4, display: "inline-flex", gap: 4, alignItems: "center" }}><Check size={12} /> Decided</span>}
            </div>
            <div style={{ fontSize: 18, color: C.body }}>Sign joint degrees with 3 Australian universities this year?</div>
            <div style={{ fontSize: "clamp(48px,6vw,76px)", fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1, color: C.ink }}>Start with one.</div>
            <div style={{ fontSize: 17, color: C.ink, maxWidth: 560, lineHeight: 1.45 }}>Sign <strong>Wollongong</strong> first. Add a 2nd partner in <strong>Q3 ’27</strong>, once the first cohort has run.</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {["Confirmed · Keep the line specific", "Confirmed · Students first"].map(c => (
                <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EAF5C8", color: "#3E5C12", borderRadius: 4, padding: "5px 10px", fontSize: 12, fontWeight: 600 }}><Dot color="#3E5C12" size={6} /> {c}</span>
              ))}
              <button onClick={() => setSource("Your book, 2025 — p. 42")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", boxShadow: shadow, borderRadius: 4, padding: "5px 10px", fontSize: 12, color: C.body }}><FileText size={12} /> Your book, 2025</button>
              <span style={{ fontSize: 12, color: C.slate }}>+5 sources</span>
            </div>
          </div>

          <div className="decide-confidence" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, borderLeft: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Twin&apos;s confidence</span>
              <span style={{ background: "#EAF5C8", color: "#3E5C12", borderRadius: 4, padding: "3px 8px", fontSize: 11, fontWeight: 600, display: "flex", gap: 4, alignItems: "center" }}><ArrowUp size={11} /> +{confidence - 64} since Mon</span>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Gauge value={confidence} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Sparkline data={trend} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.faint, marginTop: 4 }}><span>Mon</span><span>Today</span></div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", gap: 3, height: 8 }}>
                {evidence.map(e => <motion.div key={e.key} initial={{ flexGrow: 0 }} animate={{ flexGrow: e.key === "unknown" && steps.dean ? 0.001 : e.weight }} transition={{ duration: 0.8, ease }} style={{ flexBasis: 0, background: e.key === "unknown" ? "#E3E2DE" : e.dot, borderRadius: 4 }} />)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginTop: 10, fontSize: 12, color: C.body }}>
                {evidence.map(e => <span key={e.key} style={{ display: "flex", alignItems: "center", gap: 6 }}><Dot color={e.key === "unknown" ? "#C9C7C2" : e.dot} size={7} />{e.label.replace(" evidence", "").replace(" preference", "")} · {e.key === "unknown" && steps.dean ? 0 : e.items.length}</span>)}
              </div>
            </div>
            <p style={{ fontSize: 13, lineHeight: "19px", color: C.slate }}>{steps.dean ? "Faculty capacity confirmed. No unknowns left." : "Held back by 1 unknown: faculty capacity in 2027."}</p>
          </div>
        </div>
      </Reveal>

      {/* ── 2. Actions ─────────────────────────────────────────── */}
      <Reveal delay={0.08}>
        <div style={{ borderRadius: 4, background: C.ink, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontSize: 17, fontWeight: 600 }}><Sparkles size={16} color={C.lime} /> Your next steps</span>
            <span style={{ display: "flex", alignItems: "center", gap: 10, color: "#BDBBC2", fontSize: 13 }}>
              {remaining ? `${remaining} of ${actions.length} need you` : "All done"}
              <span style={{ width: 120, height: 4, background: "#2C2C30", borderRadius: 4, overflow: "hidden" }}><motion.span animate={{ width: `${((actions.length - remaining) / actions.length) * 100}%` }} style={{ display: "block", height: "100%", background: C.lime }} /></span>
            </span>
          </div>
          <div className="decide-actions" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10 }}>
            {actions.map((a, i) => {
              const ok = steps[a.k];
              return (
                <div key={a.k} style={{ background: ok ? "#1B1B1E" : "#fff", borderRadius: 4, padding: 14, display: "flex", flexDirection: "column", gap: 8, outline: a.primary && !ok ? `2px solid ${C.lime}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, color: ok ? "#8A8891" : C.ink }}><span style={{ width: 22, height: 22, borderRadius: 4, background: ok ? C.pine : C.field, color: ok ? "#fff" : C.ink, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>{ok ? <Check size={13} /> : i + 1}</span>{a.icon}</span>
                    {!ok && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: a.tag === "Blocking" || a.tag === "High risk" ? "#FBE9E7" : a.tag === "Your call" ? "#EAF5C8" : C.field, color: a.tag === "Blocking" || a.tag === "High risk" ? C.danger : a.tag === "Your call" ? "#3E5C12" : C.slate }}>{a.tag}</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: ok ? "#8A8891" : C.ink, textDecoration: ok ? "line-through" : "none" }}>{a.title}</span>
                  <span style={{ fontSize: 12, lineHeight: "17px", color: ok ? "#6B6873" : C.slate, flex: 1 }}>{a.why}</span>
                  {ok ? <span style={{ fontSize: 12, color: C.lime, fontWeight: 600 }}>Done</span> : (
                    <button onClick={a.run} className="transition active:scale-[0.97]" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, background: a.primary ? C.lime : C.ink, color: a.primary ? C.ink : "#fff", borderRadius: 4, padding: "8px 12px", fontSize: 13, fontWeight: 600 }}>{a.cta} <ArrowRight size={13} /></button>
                  )}
                </div>
              );
            })}
          </div>
          {Object.values(steps).some(Boolean) && <button onClick={() => setSteps(stepsSeed)} style={{ alignSelf: "flex-end", color: "#8A8891", fontSize: 12 }}>Reset demo steps</button>}
        </div>
      </Reveal>

      {/* ── 3. Options compared ────────────────────────────────── */}
      <Reveal delay={0.1}>
        <PCard style={{ padding: 20, gap: 16 }}>
          <SectionHead title="Options compared" note="Scored against your principles and record · for context" />
          <div className="decide-options" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10 }}>
            {options.map(o => (
              <div key={o.name} style={{ borderRadius: 4, padding: 16, background: o.rec ? "#F4FADF" : "#F4F4F1", outline: o.rec ? `1.5px solid ${C.pine}` : "none", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{o.name}</span>
                  <span style={{ fontSize: 26, fontWeight: 300, color: o.rec ? C.pine : C.slate }}>{o.total}</span>
                </div>
                {o.rec && <span style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 600, background: C.pine, color: "#fff", padding: "2px 7px", borderRadius: 4 }}>RECOMMENDED</span>}
                {criteria.map((c, i) => (
                  <div key={c} style={{ display: "grid", gridTemplateColumns: "110px 1fr 26px", gap: 8, alignItems: "center", fontSize: 12, color: C.body }}>
                    <span>{c}</span>
                    <span style={{ height: 6, background: "#E6E5E0", borderRadius: 4, overflow: "hidden" }}><motion.span initial={{ width: 0 }} whileInView={{ width: `${o.s[i]}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: i * 0.05 }} style={{ display: "block", height: "100%", borderRadius: 4, background: o.s[i] >= 70 ? C.pine : o.s[i] >= 45 ? C.amber : C.danger }} /></span>
                    <span style={{ textAlign: "right", color: C.slate }}>{o.s[i]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </PCard>
      </Reveal>

      {/* ── 4. Evidence ────────────────────────────────────────── */}
      <Reveal delay={0.12}>
        <PCard style={{ padding: 20, gap: 14 }}>
          <SectionHead title="Evidence stack" note="9 items · tap a source to open it" />
          <div className="decide-evidence" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10 }}>
            {evidence.map((col, ci) => {
              const unknownOpen = col.key === "unknown" && !steps.dean;
              const resolved = col.key === "unknown" && steps.dean;
              return (
                <motion.div key={col.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + ci * 0.06, duration: 0.5, ease }}
                  style={{ background: unknownOpen ? "#FFF8EC" : "#F4F4F1", border: unknownOpen ? `1.5px dashed ${C.amber}` : "1.5px solid transparent", borderRadius: 4, padding: 14, display: "flex", flexDirection: "column", gap: 10, minHeight: 200 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: col.color }}><Dot color={col.dot} size={6} /> {col.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{resolved ? 0 : col.items.length}</span>
                  </div>
                  {col.items.map(([t, src]) => (
                    <div key={t} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 14, lineHeight: "18px", color: resolved ? C.slate : C.ink, textDecoration: resolved ? "line-through" : "none" }}>{t}</span>
                      {src && <button onClick={() => setSource(src + " — " + t)} className="transition hover:shadow-md" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", borderRadius: 4, padding: "4px 8px", fontSize: 11, color: C.body, boxShadow: "#0000000D 0 0 0 .5px" }}><FileText size={11} /> {src}</button>}
                    </div>
                  ))}
                  {unknownOpen && <span style={{ marginTop: "auto", fontSize: 12, color: C.warning, fontWeight: 600 }}>Action needed · see step 1 above</span>}
                  {resolved && <span style={{ marginTop: "auto", fontSize: 12, color: C.pine, fontWeight: 600, display: "flex", gap: 4, alignItems: "center" }}><Check size={12} /> Dean confirmed capacity</span>}
                </motion.div>
              );
            })}
          </div>
        </PCard>
      </Reveal>

      {/* ── 5. Context: precedent · timing · risk ─────────────── */}
      <Reveal delay={0.15} className="decide-context" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr) minmax(0,1fr)", gap: 16 }}>
        <PCard style={{ padding: 20, gap: 14 }}>
          <SectionHead title="vs. Caucasus University 2019" note="Precedent" />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Gauge value={steps.dean ? 100 : 75} size={64} label={`${steps.dean ? 4 : 3}/4`} />
            <p style={{ fontSize: 13, color: C.body, lineHeight: "19px" }}>Same shape of deal. Last time, accreditation slipped 7 months.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              { t: "Accreditation", s: steps.mitigated ? "check started" : "delayed 2019", ok: steps.mitigated ? true : false },
              { t: "Demand", s: "strong both", ok: true },
              { t: "Funding", s: "approved", ok: true },
              { t: "Faculty", s: steps.dean ? "confirmed" : "unknown", ok: steps.dean ? true : null },
            ].map(c => (
              <div key={c.t} style={{ background: c.ok === true ? "#E6F0E9" : c.ok === false ? "#F8E4E2" : "#F1F1EE", borderRadius: 4, padding: 10, display: "flex", flexDirection: "column", gap: 2 }}>
                {c.ok === true ? <Check size={13} color={C.success} /> : c.ok === false ? <X size={13} color={C.danger} /> : <CircleHelp size={13} color={C.slate} />}
                <span style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{c.t}</span>
                <span style={{ fontSize: 11, color: C.slate }}>{c.s}</span>
              </div>
            ))}
          </div>
        </PCard>

        <PCard style={{ padding: 20, gap: 14 }}>
          <SectionHead title="Recommended window" note="Q3 ’27 · after first cohort" />
          <div style={{ position: "relative", height: 150, marginTop: 6 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 46, height: 4, background: "#E9E8E4", borderRadius: 4 }} />
            <motion.div initial={{ width: 0 }} whileInView={{ width: "62%" }} viewport={{ once: true }} transition={{ duration: 1, ease }} style={{ position: "absolute", left: 0, top: 46, height: 4, background: C.pine, borderRadius: 4 }} />
            <div style={{ position: "absolute", left: "50%", width: "25%", top: 30, height: 36, background: "rgba(212,242,106,.55)", borderRadius: 4 }} />
            <div style={{ position: "absolute", left: "1%", top: 0, fontSize: 11, color: C.danger, fontWeight: 600 }}>▼ Today</div>
            {milestones.map(m => (
              <div key={m.q} style={{ position: "absolute", left: `${m.x}%`, top: 38, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "24%" }}>
                <span style={{ width: m.best ? 20 : 14, height: m.best ? 20 : 14, marginTop: m.best ? -3 : 0, borderRadius: 20, background: m.best ? C.pine : "#fff", border: `3px solid ${m.best ? C.lime : C.pine}` }} />
                <span style={{ fontSize: 11, color: m.best ? C.pine : C.slate, fontWeight: m.best ? 700 : 400 }}>{m.q}{m.best ? " · BEST" : ""}</span>
                <span style={{ fontSize: 13, color: C.ink, fontWeight: m.best ? 600 : 400, textAlign: "center", lineHeight: "16px" }}>{m.t}</span>
              </div>
            ))}
          </div>
        </PCard>

        <PCard dither={false} style={{ padding: 20, gap: 12 }}>
          <SectionHead title="Risks" note="Likelihood × impact" />
          <div style={{ display: "grid", gridTemplateColumns: "18px repeat(3,1fr)", gridTemplateRows: "repeat(3,30px) 16px", gap: 3, fontSize: 10, color: C.faint }}>
            {[2, 1, 0].map(l => (
              <div key={l} style={{ display: "contents" }}>
                <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", textAlign: "center" }}>{LEVELS[l][0]}</span>
                {[0, 1, 2].map(i => {
                  const here = risks.filter(r => r.l === l && r.i === i);
                  return <div key={i} style={{ background: l + i >= 3 ? "#FBE9E7" : l + i >= 2 ? "#FBF1DF" : "#EEF4EF", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>{here.map(r => <motion.span layoutId={r.r} key={r.r} title={r.r} style={{ width: 10, height: 10, borderRadius: 9, background: riskColor(r.l, r.i) }} />)}</div>;
                })}
              </div>
            ))}
            <span />
            {LEVELS.map(x => <span key={x} style={{ textAlign: "center" }}>{x}</span>)}
          </div>
          {risks.map(r => (
            <div key={r.r} style={{ display: "flex", gap: 8, fontSize: 13 }}>
              <span style={{ width: 8, height: 8, borderRadius: 9, background: riskColor(r.l, r.i), marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span>{r.r}</span><span style={{ fontSize: 11, color: C.slate }}>{LEVELS[Math.min(2, Math.max(r.l, r.i))]}</span></div><div style={{ fontSize: 11, color: C.slate }}>{r.m}</div></div>
            </div>
          ))}
        </PCard>
      </Reveal>
    </div>
  );
}

function SectionHead({ title, note }: { title: string; note?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
      <span style={{ fontSize: 17, fontWeight: 600 }}>{title}</span>
      {note && <span style={{ fontSize: 12, color: C.slate }}>{note}</span>}
    </div>
  );
}

function Gauge({ value, size = 96, label }: { value: number; size?: number; label?: string }) {
  const r = size / 2 - 6;
  const len = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }} role="img" aria-label={label ?? `${value}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E9E8E4" strokeWidth="7" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.pine} strokeWidth="7" strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeDasharray={len} initial={{ strokeDashoffset: len }} animate={{ strokeDashoffset: len * (1 - value / 100) }} transition={{ duration: 1.2, ease }} />
      <text x={size / 2} y={size / 2 + size * 0.08} textAnchor="middle" fontSize={size * 0.24} fill={C.ink}>{label ?? `${value}%`}</text>
    </svg>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const w = 200, h = 54, min = 45, max = 100;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min)) * h] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" role="img" aria-label={`Confidence trend from ${data[0]}% to ${data[data.length - 1]}%`} style={{ overflow: "visible" }}>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill="rgba(14,90,67,.08)" />
      <motion.path d={line} fill="none" stroke={C.pine} strokeWidth="2" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease }} />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill={C.lime} stroke={C.pine} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
