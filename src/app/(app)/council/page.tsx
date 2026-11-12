"use client";
import { useState } from "react";
import { Page, PageHead, PCard, PButton, Eyebrow, C } from "@/components/paper";
import { AnswerCard } from "@/components/family-answer";
import { useDemo, audit, notify, addRecord } from "@/lib/demo";
import { familyLogSeed, type FamilyAnswer } from "@/lib/org";

const FILTERS = ["Needs council", "All", "Flagged", "Resolved"] as const;

export default function Council() {
  const [log, setLog] = useDemo<FamilyAnswer[]>("family-log", familyLogSeed);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Needs council");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const shown = log.filter(a => filter === "All" || (filter === "Needs council" ? a.status === "To council" : a.status === filter));
  const update = (id: string, patch: Partial<FamilyAnswer>) => setLog(xs => xs.map(a => (a.id === id ? { ...a, ...patch } : a)));

  return (
    <Page>
      <PageHead eyebrow="14.02 · Family council" title="Decide together." actions={<PButton href="/succession">Succession rules</PButton>} />
      <div className="demo-note">Every question your successors ask, with the founder&apos;s evidence. Anything binding, out of scope or uncertain lands here for the family to decide together.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        {[["Questions asked", log.length], ["Waiting on council", log.filter(a => a.status === "To council").length], ["Flagged answers", log.filter(a => a.status === "Flagged").length], ["Via hologram", log.filter(a => a.channel === "Hologram").length]].map(([l, v]) => (
          <PCard key={l} style={{ padding: 18, gap: 6 }}><Eyebrow>{l}</Eyebrow><div style={{ fontSize: 34, fontWeight: 300 }}>{v}</div></PCard>
        ))}
      </div>
      <div className="demo-actions" role="tablist">
        {FILTERS.map(f => <button key={f} role="tab" aria-selected={filter === f} className={`demo-button ${filter === f ? "primary" : ""}`} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      {!shown.length && <p className="demo-muted">Nothing here.</p>}
      {shown.map(a => (
        <div key={a.id}>
          <div style={{ fontSize: 13, color: C.slate, marginBottom: 6 }}>{a.personName} · {a.relation} · {new Date(a.time).toLocaleString()}</div>
          <AnswerCard a={a} footer={
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {a.status === "To council" && <>
                <textarea aria-label="Council decision" rows={2} placeholder="Record the family council's decision…" value={drafts[a.id] ?? ""} onChange={e => setDrafts(d => ({ ...d, [a.id]: e.target.value }))} style={{ border: `1px solid ${C.line}`, borderRadius: 4, padding: 10, fontSize: 14 }} />
                <div className="demo-actions"><button className="demo-button primary" onClick={() => { const r = drafts[a.id]?.trim(); if (!r) return notify("Write the council's decision first."); update(a.id, { status: "Resolved", resolution: r }); audit(`Council resolved: ${a.question}`, "Succession"); }}>Record decision</button></div>
              </>}
              {a.status === "Answered" && <div className="demo-actions">
                <button className="demo-button danger" onClick={() => { update(a.id, { status: "Flagged" }); addRecord("knowledge", { id: crypto.randomUUID(), title: `Correction needed: ${a.question}`, body: `Flagged by the family council. The twin answered: ${a.answer}`, status: "Needs attention", category: "Correction", date: new Date().toISOString().slice(0, 10), source: "Family council" }); notify("Flagged. A correction task was added to Knowledge."); }}>Not what the founder would say</button>
              </div>}
            </div>
          } />
        </div>
      ))}
    </Page>
  );
}
