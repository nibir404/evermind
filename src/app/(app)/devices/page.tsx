"use client";
import { useState } from "react";
import { MonitorSmartphone, Power, ExternalLink, Plus } from "lucide-react";
import { Page, PageHead, PCard, PButton, Eyebrow, C } from "@/components/paper";
import { Modal, Field } from "@/components/demo-ui";
import { useDemo, audit, notify } from "@/lib/demo";
import { devicesSeed, peopleSeed, type Device, type Person } from "@/lib/org";

const KINDS: Device["kind"][] = ["Life-size hologram", "Desktop 3D display", "Transparent kiosk", "Browser screen"];
const tone = { Online: C.success, Offline: C.faint, Disabled: C.danger };

export default function Devices() {
  const [devices, setDevices] = useDemo<Device[]>("devices", devicesSeed);
  const [people] = useDemo<Person[]>("people", peopleSeed);
  const [adding, setAdding] = useState(false);
  const update = (id: string, patch: Partial<Device>) => setDevices(xs => xs.map(d => (d.id === id ? { ...d, ...patch } : d)));

  return (
    <Page>
      <PageHead eyebrow="14.04 · Hologram devices" title="Your twin, in the room." actions={<PButton variant="ink" onClick={() => setAdding(true)}><Plus size={16} /> Register device</PButton>} />
      <div className="demo-note">Each device runs hologram mode: open its link full-screen on the hologram box, transparent kiosk or 3D display. Only the family members you allow can sign in on it, by PIN.</div>

      {devices.map(d => (
        <PCard key={d.id} dither={false} style={{ padding: 22, gap: 14 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 44, height: 44, borderRadius: 4, background: "#0b0f0d", color: "#D4F26A", display: "grid", placeItems: "center" }}><MonitorSmartphone size={20} /></div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>{d.name}</div>
              <div style={{ fontSize: 13, color: C.slate }}>{d.kind} · {d.location} · firmware {d.firmware}</div>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: C.body }}><span style={{ width: 8, height: 8, borderRadius: 8, background: tone[d.status] }} />{d.status} · last seen {new Date(d.lastSeen).toLocaleString()}</span>
          </div>

          <div>
            <Eyebrow style={{ marginBottom: 8 }}>Who may use this device</Eyebrow>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {people.filter(p => p.active).map(p => {
                const on = d.allowed.includes(p.id);
                return <button key={p.id} onClick={() => update(d.id, { allowed: on ? d.allowed.filter(x => x !== p.id) : [...d.allowed, p.id] })} style={{ padding: "6px 10px", borderRadius: 4, fontSize: 13, background: on ? C.pine : "#fff", color: on ? "#fff" : C.body, boxShadow: "#0000001A 0 0 0 .5px" }}>{p.name.split(" ")[0]} · {p.relation}</button>;
              })}
            </div>
          </div>

          <div className="demo-actions">
            <a className="demo-button primary" href={`/hologram?device=${d.id}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Open hologram mode</a>
            <button className="demo-button" onClick={() => { navigator.clipboard?.writeText(`${location.origin}/hologram?device=${d.id}`); notify("Device link copied."); }}>Copy device link</button>
            <button className={`demo-button ${d.status === "Disabled" ? "" : "danger"}`} onClick={() => { const off = d.status !== "Disabled"; update(d.id, { status: off ? "Disabled" : "Offline" }); audit(`${off ? "Switched off" : "Re-enabled"} ${d.name}`, "Devices"); }}><Power size={14} /> {d.status === "Disabled" ? "Re-enable" : "Switch off remotely"}</button>
            <button className="demo-button" onClick={() => { update(d.id, { firmware: "1.4.2" }); notify(d.firmware === "1.4.2" ? "Already up to date." : "Update pushed (demo)."); }}>Push update</button>
          </div>
        </PCard>
      ))}

      {adding && <AddDevice onClose={() => setAdding(false)} onAdd={d => { setDevices(xs => [...xs, d]); audit(`Registered device ${d.name}`, "Devices"); setAdding(false); }} />}
    </Page>
  );
}

function AddDevice({ onClose, onAdd }: { onClose: () => void; onAdd: (d: Device) => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [kind, setKind] = useState<Device["kind"]>("Transparent kiosk");
  return (
    <Modal title="Register a hologram device" onClose={onClose}>
      <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={e => { e.preventDefault(); if (!name.trim()) return; onAdd({ id: `dev-${crypto.randomUUID().slice(0, 8)}`, name: name.trim(), location: location.trim() || "Unassigned", kind, status: "Offline", allowed: ["u-owner"], requireId: true, lastSeen: new Date().toISOString(), firmware: "1.4.2" }); }}>
        <Field label="Device name"><input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Factory office hologram" /></Field>
        <Field label="Location"><input value={location} onChange={e => setLocation(e.target.value)} /></Field>
        <Field label="Hardware type"><select value={kind} onChange={e => setKind(e.target.value as Device["kind"])}>{KINDS.map(k => <option key={k}>{k}</option>)}</select></Field>
        <p className="demo-muted">Every device requires a family PIN. Hologram mode signs out after 2 minutes without activity.</p>
        <button className="demo-button primary" type="submit">Register</button>
      </form>
    </Modal>
  );
}
