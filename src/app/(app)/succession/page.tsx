"use client";
import { useState } from "react";
import { Page, PageHead, PCard, PButton, Eyebrow, C } from "@/components/paper";
import { Switch } from "@/components/demo-ui";
import { useDemo, audit, notify } from "@/lib/demo";
import { successionSeed, peopleSeed, TOPICS, type Succession, type Person, type Topic, type TwinMode } from "@/lib/org";

const MODES: { mode: TwinMode; detail: string }[] = [
  { mode: "Founder present", detail: "You are here. Successors consult the twin; you can correct it any time." },
  { mode: "Founder absent", detail: "You are unreachable. The twin advises successors from your recorded judgment." },
  { mode: "Legacy active", detail: "Activated by the family council. The twin carries your guidance to the next generation." },
  { mode: "Paused", detail: "No one can consult the twin. Use if something looks wrong." },
];

export default function SuccessionPage() {
  const [s, setS] = useDemo<Succession>("succession", successionSeed);
  const [people] = useDemo<Person[]>("people", peopleSeed);
  const [rule, setRule] = useState("");
  const set = (patch: Partial<Succession>) => setS(x => ({ ...x, ...patch }));
  const council = people.filter(p => p.role === "Successor" && p.verified && p.active);
  const ready = s.approvals.length >= s.quorum;

  return (
    <Page>
      <PageHead eyebrow="14.03 · Succession" title="When you're not here." actions={<PButton href="/council">Family council</PButton>} />

      <PCard style={{ padding: 24, gap: 14 }}>
        <Eyebrow>Twin mode</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}>
          {MODES.map(m => (
            <button key={m.mode} onClick={() => { if (m.mode === "Legacy active" && !ready) return notify(`Legacy mode needs ${s.quorum} successor approvals first.`); set({ mode: m.mode }); audit(`Twin mode set to ${m.mode}`, "Succession"); }}
              style={{ textAlign: "left", padding: 14, borderRadius: 4, background: s.mode === m.mode ? C.pine : "#fff", color: s.mode === m.mode ? "#fff" : C.ink, boxShadow: "#0000001A 0 0 0 .5px" }}>
              <div style={{ fontWeight: 600 }}>{m.mode}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{m.detail}</div>
            </button>
          ))}
        </div>
      </PCard>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 }}>
        <PCard style={{ padding: 24, gap: 12 }}>
          <Eyebrow>Activation triggers</Eyebrow>
          {s.triggers.map(t => <Switch key={t.id} label={t.label} detail={t.detail} on={t.on} change={() => set({ triggers: s.triggers.map(x => x.id === t.id ? { ...x, on: !x.on } : x) })} />)}
          <label className="demo-muted">Absence threshold <input type="number" min={1} value={s.absenceDays} onChange={e => set({ absenceDays: Math.max(1, +e.target.value) })} style={{ width: 70, border: `1px solid ${C.line}`, borderRadius: 4, padding: 6, margin: "0 6px" }} /> days</label>
        </PCard>

        <PCard style={{ padding: 24, gap: 12 }}>
          <Eyebrow>Family council activation</Eyebrow>
          <p className="demo-muted">Legacy mode needs approval from {s.quorum} of {council.length} verified successors. Demo only — no legal verification happens.</p>
          <label className="demo-muted">Approvals required <input type="number" min={1} max={Math.max(1, council.length)} value={s.quorum} onChange={e => set({ quorum: Math.min(Math.max(1, +e.target.value), Math.max(1, council.length)) })} style={{ width: 60, border: `1px solid ${C.line}`, borderRadius: 4, padding: 6, marginLeft: 6 }} /></label>
          {!s.requested
            ? <button className="demo-button primary" onClick={() => { set({ requested: true, approvals: [] }); audit("Legacy activation requested", "Succession"); }}>Start activation request</button>
            : <>
              {council.map(p => {
                const ok = s.approvals.includes(p.id);
                return <div key={p.id} className="demo-row"><div><strong>{p.name}</strong><p>{p.relation}</p></div><button className={`demo-button ${ok ? "primary" : ""}`} onClick={() => { set({ approvals: ok ? s.approvals.filter(x => x !== p.id) : [...s.approvals, p.id] }); audit(`${p.name} ${ok ? "withdrew" : "gave"} activation approval`, "Succession"); }}>{ok ? "Approved" : "Approve"}</button></div>;
              })}
              <div className="demo-actions">
                <button className="demo-button primary" disabled={!ready} onClick={() => { set({ mode: "Legacy active", requested: false }); audit("Legacy mode activated by family council", "Succession"); notify("Legacy mode active (demo)."); }}>Activate legacy mode ({s.approvals.length}/{s.quorum})</button>
                <button className="demo-button" onClick={() => set({ requested: false, approvals: [] })}>Cancel request</button>
              </div>
            </>}
        </PCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 }}>
        <PCard style={{ padding: 24, gap: 12 }}>
          <Eyebrow>The twin never advises on</Eyebrow>
          {s.neverAdvise.map(r => <div key={r} className="demo-row"><div><strong>{r}</strong></div><button className="demo-button" onClick={() => set({ neverAdvise: s.neverAdvise.filter(x => x !== r) })}>Remove</button></div>)}
          <form className="demo-actions" onSubmit={e => { e.preventDefault(); if (!rule.trim()) return; set({ neverAdvise: [...s.neverAdvise, rule.trim()] }); audit(`Added boundary: ${rule.trim()}`, "Succession"); setRule(""); }}>
            <input aria-label="New boundary" value={rule} onChange={e => setRule(e.target.value)} placeholder="e.g. Closing a factory" style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 4, padding: 10 }} />
            <button className="demo-button" type="submit">Add</button>
          </form>
        </PCard>
        <PCard style={{ padding: 24, gap: 12 }}>
          <Eyebrow>Always decided by the family council</Eyebrow>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TOPICS.map((t: Topic) => { const on = s.councilTopics.includes(t); return <button key={t} onClick={() => set({ councilTopics: on ? s.councilTopics.filter(x => x !== t) : [...s.councilTopics, t] })} style={{ padding: "6px 10px", borderRadius: 4, fontSize: 13, background: on ? C.ink : "#fff", color: on ? "#fff" : C.body, boxShadow: "#0000001A 0 0 0 .5px" }}>{t}</button>; })}
          </div>
          <Eyebrow style={{ marginTop: 10 }}>Your letter to the next generation</Eyebrow>
          <textarea aria-label="Letter to successors" rows={5} value={s.letter} onChange={e => set({ letter: e.target.value })} style={{ border: `1px solid ${C.line}`, borderRadius: 4, padding: 12, fontSize: 15, lineHeight: 1.6 }} />
        </PCard>
      </div>
    </Page>
  );
}
