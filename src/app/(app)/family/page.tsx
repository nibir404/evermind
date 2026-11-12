"use client";
import { useState } from "react";
import { ShieldCheck, ShieldAlert, Trash2, UserPlus } from "lucide-react";
import { Page, PageHead, PCard, PButton, C, Eyebrow } from "@/components/paper";
import { Modal, Field } from "@/components/demo-ui";
import { useDemo, audit, notify } from "@/lib/demo";
import { peopleSeed, TOPICS, RELATIONS, ALL_BUT_BINDING, type Person, type Relation, type Topic } from "@/lib/org";

export default function Family() {
  const [people, setPeople] = useDemo<Person[]>("people", peopleSeed);
  const [adding, setAdding] = useState(false);
  const update = (id: string, patch: Partial<Person>) => setPeople(xs => xs.map(p => (p.id === id ? { ...p, ...patch } : p)));
  const toggleTopic = (p: Person, t: Topic) => update(p.id, { topics: p.topics.includes(t) ? p.topics.filter(x => x !== t) : [...p.topics, t] });
  const successors = people.filter(p => p.role === "Successor");

  return (
    <Page>
      <PageHead
        eyebrow="14 · Family succession"
        title="Who carries this forward."
        actions={<><PButton href="/heir">Open successor portal</PButton><PButton variant="ink" onClick={() => setAdding(true)}><UserPlus size={16} /> Add successor</PButton></>}
      />
      <div className="demo-note">Only you and your verified bloodline successors can use your twin. Employees, advisers and outside parties have no access.</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
        {[["Successors", successors.length], ["Verified", successors.filter(p => p.verified).length], ["Awaiting verification", successors.filter(p => !p.verified).length], ["Generations", new Set(people.map(p => p.generation)).size]].map(([l, v]) => (
          <PCard key={l} style={{ padding: 18, gap: 6 }}><Eyebrow>{l}</Eyebrow><div style={{ fontSize: 34, fontWeight: 300 }}>{v}</div></PCard>
        ))}
      </div>

      {successors.map(p => (
        <PCard key={p.id} dither={false} style={{ padding: 22, gap: 16, opacity: p.active ? 1 : 0.55 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 44, height: 44, borderRadius: 4, background: C.wash, color: C.pine, display: "grid", placeItems: "center", fontWeight: 600 }}>{p.name.split(" ").map(s => s[0]).slice(0, 2).join("")}</div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>{p.name}</div>
              <div style={{ fontSize: 13, color: C.slate }}>{p.relation} · Generation {p.generation} · {p.email}</div>
              {p.note && <div style={{ fontSize: 13, color: C.body, marginTop: 4 }}>{p.note}</div>}
            </div>
            {p.verified
              ? <span style={{ display: "inline-flex", gap: 6, alignItems: "center", color: C.pine, background: C.wash, padding: "5px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}><ShieldCheck size={14} /> Bloodline verified</span>
              : <button className="demo-button" onClick={() => { update(p.id, { verified: true }); audit(`Verified ${p.name} as ${p.relation.toLowerCase()} (demo)`, "Family"); notify("Marked verified. In production this needs document review."); }}><ShieldAlert size={14} color={C.warning} /> Verify identity</button>}
          </div>

          <div>
            <p className="demo-kicker" style={{ marginBottom: 8 }}>May consult the twin about</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TOPICS.map(t => {
                const on = p.topics.includes(t);
                const binding = t === "Legal" || t === "Ownership";
                return (
                  <button key={t} disabled={binding} title={binding ? "Always decided by the family council" : undefined} onClick={() => toggleTopic(p, t)}
                    style={{ padding: "6px 10px", borderRadius: 4, fontSize: 13, background: binding ? "#F1F1EE" : on ? C.pine : "#fff", color: binding ? C.faint : on ? "#fff" : C.body, boxShadow: on ? "none" : "#0000001A 0 0 0 .5px", cursor: binding ? "not-allowed" : "pointer" }}>
                    {t}{binding && " · council"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="demo-actions">
            <label style={{ fontSize: 13, color: C.slate }}>Hologram PIN <input aria-label={`PIN for ${p.name}`} value={p.pin} maxLength={4} onChange={e => update(p.id, { pin: e.target.value.replace(/\D/g, "") })} style={{ width: 70, marginLeft: 6, border: `1px solid ${C.line}`, borderRadius: 4, padding: "6px 8px" }} /></label>
            <button className="demo-button" onClick={() => { update(p.id, { active: !p.active }); audit(`${p.active ? "Suspended" : "Restored"} access for ${p.name}`, "Family"); }}>{p.active ? "Suspend access" : "Restore access"}</button>
            <button className="demo-button danger" onClick={() => { if (confirm(`Remove ${p.name}? Their question history stays in the council log.`)) { setPeople(xs => xs.filter(x => x.id !== p.id)); audit(`Removed successor ${p.name}`, "Family"); } }}><Trash2 size={14} /> Remove</button>
          </div>
        </PCard>
      ))}

      {adding && <AddSuccessor onClose={() => setAdding(false)} onAdd={p => { setPeople(xs => [...xs, p]); audit(`Added successor ${p.name} (${p.relation})`, "Family"); setAdding(false); }} />}
    </Page>
  );
}

function AddSuccessor({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Person) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState<Relation>("Son");
  const generation = relation === "Son" || relation === "Daughter" ? 2 : 3;
  return (
    <Modal title="Add a successor" onClose={onClose}>
      <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={e => { e.preventDefault(); if (!name.trim()) return; onAdd({ id: crypto.randomUUID(), name: name.trim(), email: email.trim(), role: "Successor", relation, generation, verified: false, topics: generation === 2 ? [...ALL_BUT_BINDING] : ["Values"], pin: String(Math.floor(1000 + Math.random() * 9000)), active: true }); }}>
        <p className="demo-muted">Successors must be your direct bloodline descendants. They can&apos;t use the twin until their identity is verified.</p>
        <Field label="Full name"><input required value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="Email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Relation to you"><select value={relation} onChange={e => setRelation(e.target.value as Relation)}>{RELATIONS.map(r => <option key={r}>{r}</option>)}</select></Field>
        <button className="demo-button primary" type="submit">Add successor</button>
      </form>
    </Modal>
  );
}
