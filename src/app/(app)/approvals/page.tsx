"use client";
import { useDemo, readDemo, writeDemo, moduleSeeds, audit, notify, preferenceSeed, type RecordItem, approvalQueueSeed } from "@/lib/demo";
import { PButton } from "@/components/paper";

// 1:1 port of Paper "08 · Approvals" (6VO-0) + "S · 08 Approvals — Sent" (6ZC-0)

import { AnimatePresence, motion } from "framer-motion";
import { Check, Mail, History, Shield, BookOpen, X } from "lucide-react";
import { C } from "@/components/paper";
import { Reveal, ease } from "@/components/ui";

const steps = [
  { label: "Intl. Office asked", kind: "io" },
  { label: "Twin drafted", kind: "twin" },
  { label: "You decide", kind: "you" },
  { label: "Wollongong", kind: "uow" },
];

function Stat({ bg, label, value, unit, art, light }: { bg: string; label: string; value: string; unit?: string; art: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ flex: 1, height: 84, borderRadius: 4, background: bg, padding: "12px 14px", position: "relative", overflow: "hidden", color: light ? "#fff" : C.ink }}>
      <div style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 300, letterSpacing: "-0.02em", marginTop: 4 }}>
        {value}
        {unit && <span style={{ fontSize: 12 }}>{unit}</span>}
      </div>
      <div style={{ position: "absolute", right: 12, top: 14 }}>{art}</div>
    </div>
  );
}

export default function Approvals() {
  const [sent, setSent] = useDemo("approval-sent", false);
  const [declined, setDeclined] = useDemo("approval-declined", false);
  const [draft,setDraft] = useDemo("approval-draft", "Dear Professor,\n\nThank you for the visit. We would like to begin with one joint pathway in Computer Science for the first cohort, then review together before adding more programmes.\n\nDr. Sabur Khan");
  const [prefs] = useDemo("preferences",preferenceSeed);
  const [queue,setQueue] = useDemo<RecordItem[]>("approval-queue",approvalQueueSeed);
  const approve=()=>{if(prefs.paused||prefs.retired||!prefs.draft)return notify("Resume your twin and enable drafting in Settings first.");setSent(true);audit("Approved Wollongong reply — demo delivery only","Approvals");notify("Simulated send saved. No email was sent.");};

  return (
    <div style={{ padding: "48px 56px 48px 44px", maxWidth: 1360, display: "flex", flexDirection: "column", gap: 40 }}>
      <div className="demo-note">Demo approval queue · No messages are delivered externally. <a href="/actions" className="demo-link">All executive actions →</a></div>
      {queue.map(item=><div className="surface" style={{padding:20}} key={item.id}><strong>{item.title}</strong><p className="demo-muted" style={{whiteSpace:"pre-wrap",margin:"12px 0"}}>{item.body}</p><div className="demo-actions"><span>{item.status}</span>{item.status==="Pending"&&<><PButton onClick={()=>{if(prefs.paused||!prefs.draft)return notify("Enable drafting and resume twin first");setQueue(xs=>xs.map(x=>x.id===item.id?{...x,status:"Sent (demo)"}:x));if(item.owner)writeDemo(item.category,readDemo(item.category,moduleSeeds[item.category]??[]).map(x=>x.id===item.owner?{...x,status:item.category==="calendar"?"Scheduled (demo)":"Sent (demo)"}:x));audit(`Approved ${item.title} (demo)`,"Approvals");notify("Simulated delivery completed");}}>Approve demo action</PButton><PButton onClick={()=>{setQueue(xs=>xs.map(x=>x.id===item.id?{...x,status:"Declined"}:x));if(item.owner)writeDemo(item.category,readDemo(item.category,moduleSeeds[item.category]??[]).map(x=>x.id===item.owner?{...x,status:"Draft"}:x));audit(`Declined ${item.title}`,"Approvals");}}>Decline</PButton></>}</div></div>)}
      <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <span style={{ background: "#F6E7D2", color: "#8A5A12", borderRadius: 4, padding: "5px 9px", fontSize: 12, fontWeight: 600 }}>Expires in 22h · Extend</span>
            <span style={{ background: C.wash, color: C.pine, borderRadius: 4, padding: "5px 9px", fontSize: 12, fontWeight: 600 }}>Partnerships · needs your sign-off</span>
          </div>
          <div style={{ fontSize: 52, fontWeight: 500, letterSpacing: "-0.045em", lineHeight: "58px", color: C.ink }}>Reply to University of Wollongong</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 56, fontWeight: 200, lineHeight: "56px", color: C.ink }}>
            {sent ? 2 : 1}
            <span style={{ fontSize: 18, color: C.slate }}>/3</span>
          </div>
          <div style={{ fontSize: 13, color: C.body, marginTop: 8 }}>approvals today</div>
        </div>
      </Reveal>

      {/* Flow */}
      <Reveal delay={0.06} style={{ background: "linear-gradient(90deg, #E7E5EC, #E3DFD6)", borderRadius: 4, height: 130, display: "flex", alignItems: "center", padding: "0 40px" }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ display: "contents" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 140 }}>
              {s.kind === "io" && <div style={{ width: 56, height: 56, borderRadius: 99, background: "#3A3940", color: "#fff", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 600 }}>IO</div>}
              {s.kind === "twin" && <div style={{ width: 56, height: 56, borderRadius: 99, border: "2px solid #CDEE8C", backgroundImage: "url(/twin/thinking.png)", backgroundSize: "240%", backgroundPosition: "50% 8%", backgroundColor: "#1F5A47", filter: "hue-rotate(40deg) saturate(.6)" }} />}
              {s.kind === "you" && <div style={{ width: 60, height: 60, borderRadius: 99, border: `3px solid ${C.lime}`, backgroundImage: "url(/twin/portrait-white.png)", backgroundSize: "200%", backgroundPosition: "50% 10%", backgroundColor: "#fff", boxShadow: sent ? "none" : "0 0 0 6px rgba(212,242,106,.35)" }} />}
              {s.kind === "uow" && <div style={{ width: 56, height: 56, borderRadius: 4, background: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 17, color: "#1A2B4A", opacity: sent ? 1 : 0.9 }}>UOW</div>}
              <span style={{ fontSize: 13, fontWeight: s.kind === "you" ? 600 : 500, color: s.kind === "you" ? C.pine : s.kind === "uow" && !sent ? C.slate : C.ink }}>{s.label}</span>
            </div>
            {i < 3 && (
              <div style={{ flex: 1, height: 2, marginBottom: 26, background: i < 2 || sent ? C.pine : "transparent", borderTop: i === 2 && !sent ? "2px dashed #FFFFFF" : "none", transition: "background .6s" }} />
            )}
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.12} style={{ display: "flex", gap: 20 }}>
        {/* Draft */}
        <div style={{ flex: 1, background: "#fff", borderRadius: 4, boxShadow: "#0000000D 0 0 0 .5px, #0000000A 0 1px 2px", padding: 32, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 14, borderBottom: `1px solid ${C.line}` }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Re: DIU–UOW study pathway</span>
            <span style={{ fontSize: 13, color: C.slate }}>To: partnerships@uow.edu.au</span>
          </div>
          <textarea aria-label="Email draft" id="approval-email-draft" value={draft} onChange={e=>setDraft(e.target.value)} rows={8} disabled={sent||declined} style={{fontSize:16,lineHeight:"26px",color:C.ink,resize:"vertical",width:"100%"}} />
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ background: C.wash, color: C.pine, borderRadius: 4, padding: "5px 9px", fontSize: 12 }}>Your tone · 94% match</span>
            <span style={{ background: C.wash, color: C.pine, borderRadius: 4, padding: "5px 9px", fontSize: 12 }}>Rule: start with one</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Stat bg="linear-gradient(180deg,#145C44,#0B2F24)" light label="Tone match" value="94" unit="%" art={<svg width="100" height="20"><path d="M0 10 q6 -10 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" fill="none" stroke="#CDEE8C" strokeWidth="1.2" /></svg>} />
            <Stat bg="linear-gradient(135deg,#E8F3D2,#D6EE9A)" label="Rules applied" value="2" art={<svg width="70" height="54"><ellipse cx="35" cy="6" rx="32" ry="5" fill="none" stroke="#0E5A43" strokeOpacity=".5" /><ellipse cx="35" cy="18" rx="22" ry="4" fill="none" stroke="#0E5A43" strokeOpacity=".5" /><ellipse cx="35" cy="28" rx="12" ry="3" fill="none" stroke="#0E5A43" strokeOpacity=".5" /><circle cx="35" cy="44" r="4" fill="#0E5A43" /></svg>} />
            <Stat bg="linear-gradient(135deg,#F3DDB8,#E8B9A2)" label="Expires in" value="22" unit="h" art={<svg width="54" height="54"><circle cx="27" cy="27" r="24" fill="none" stroke="#111113" strokeWidth="1.2" strokeDasharray="130 151" /></svg>} />
          </div>
        </div>

        {/* Decision panel */}
        <div style={{ width: 440, flexShrink: 0, borderRadius: 4, padding: 24, background: "linear-gradient(180deg,#F5DFB9 0%,#EFC9A6 100%)", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.12em", color: "#6B5E50", marginBottom: 14 }}>IF YOU APPROVE</div>
          {[
            [Mail, "Simulated send from your demo address"],
            [History, "Logged to your local audit trail"],
          ].map(([I, t]) => {
            const Icon = I as typeof Mail;
            return (
              <div key={t as string} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, marginBottom: 12 }}>
                <Icon size={15} strokeWidth={1.6} /> {t as string}
              </div>
            );
          })}
          <div style={{ fontSize: 12, letterSpacing: "0.12em", color: "#6B5E50", margin: "22px 0 10px" }}>WHY IT WROTE THIS</div>
          {[
            [Shield, "Your decision: start with one", "Today"],
            [BookOpen, "Your book, 2025 · p. 42", "Tone"],
          ].map(([I, t, m]) => {
            const Icon = I as typeof Mail;
            return (
              <div key={t as string} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, padding: "12px 12px", borderRadius: 4, background: "#FFFFFF33", marginBottom: 6 }}>
                <Icon size={14} strokeWidth={1.6} /> <span style={{ flex: 1 }}>{t as string}</span>
                <span style={{ fontSize: 12, color: "#6B5E50" }}>{m as string}</span>
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          <AnimatePresence mode="wait">
            {sent || declined ? (
              <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} style={{ display: "flex", alignItems: "center", gap: 10, height: 46, padding: "0 14px", background: "#FFFFFF66", borderRadius: 4, fontSize: 15, fontWeight: 600 }}>
                <span style={{ width: 24, height: 24, borderRadius: 99, background: declined ? C.danger : C.pine, color: "#fff", display: "grid", placeItems: "center" }}>{declined ? <X size={13} /> : <Check size={13} />}</span>
                {declined ? "Declined · twin will learn from this" : "Demo sent · logged"}
                <button onClick={() => (setSent(false), setDeclined(false))} style={{ marginLeft: "auto", fontSize: 13, fontWeight: 500, color: C.pine }}>Undo</button>
              </motion.div>
            ) : (
              <motion.div key="act" exit={{ opacity: 0 }} style={{ display: "flex", gap: 8 }}>
                <button onClick={approve} className="active:scale-[0.98] hover:brightness-95" style={{ flex: 1, height: 46, background: C.lime, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 16, fontWeight: 600 }}>
                  <Check size={16} /> Approve &amp; send
                </button>
                <button onClick={() => document.getElementById("approval-email-draft")?.focus()} style={{ height: 46, padding: "0 16px", background: "#FFFFFF4D", border: "1px solid #FFFFFF80", borderRadius: 4, fontSize: 15, fontWeight: 600 }}>Edit</button>
                <button onClick={() => { setDeclined(true); audit("Declined Wollongong reply", "Approvals"); }} aria-label="Decline" style={{ width: 46, height: 46, border: "1px solid #E39A8E", borderRadius: 4, display: "grid", placeItems: "center", color: C.danger }}>
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </div>
  );
}
