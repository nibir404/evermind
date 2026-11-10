"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { C } from "./paper";

export function DemoNotice() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fn = (e: Event) => setMessage((e as CustomEvent<string>).detail);
    window.addEventListener("evermind:notice", fn);
    return () => window.removeEventListener("evermind:notice", fn);
  }, []);
  useEffect(() => { if (message) { const t = setTimeout(() => setMessage(""), 6000); return () => clearTimeout(t); } }, [message]);
  return message ? <div role="status" className="demo-toast">{message}<button aria-label="Dismiss notification" onClick={() => setMessage("")}><X size={16}/></button></div> : null;
}
export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = dialog.current; d?.showModal(); return () => d?.close(); }, []);
  return <dialog ref={dialog} className="demo-dialog" aria-label={title} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}><div className="demo-dialog-head"><h2>{title}</h2><button aria-label="Close dialog" onClick={onClose}><X size={20}/></button></div>{children}</dialog>;
}
export function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="demo-field"><span>{label}</span>{children}</label>; }
export function Switch({ label, detail, on, change, disabled }: { label: string; detail?: string; on: boolean; change: () => void; disabled?: boolean }) {
  return <div className="demo-row"><div><strong>{label}</strong>{detail && <p>{detail}</p>}</div><button type="button" role="switch" aria-label={label} aria-checked={on} disabled={disabled} onClick={change} className="demo-switch" style={{ background: on ? C.pine : "#E3E2DE" }}><span style={{ transform: on ? "translateX(18px)" : "translateX(0)" }}/></button></div>;
}
export function Empty({ title = "Nothing here yet.", body = "Add a record to get started." }: { title?: string; body?: string }) { return <div className="demo-empty"><h3>{title}</h3><p>{body}</p></div>; }
