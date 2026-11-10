"use client";

// 1:1 port of Paper "07 · Talk to your twin (3D)" (6KP-0) + "S · 07 Talk — Thinking" (6NN-0)
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const TwinAvatar=dynamic(()=>import("@/components/twin-avatar"),{ssr:false,loading:()=> <div className="demo-note">Loading 3D avatar…</div>});
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Mic, Captions, X, RotateCw, ZoomIn, ZoomOut, ShieldCheck, UserRound, CircleHelp, Scale } from "lucide-react";
import { useDemo, answerDemo, addRecord, preferenceSeed, profileSeed, notify } from "@/lib/demo";
import { C } from "@/components/paper";
import { ease } from "@/components/ui";

type State = "greeting" | "thinking" | "speaking";


const transcriptSeed = [
  { who: "You", text: "Should we sign with all three Australian universities?", dim: true },
  { who: "Twin", text: "Not all at once. Keep the line specific, start with one." },
  { who: "You", text: "Which one first?", strong: true },
];

export default function Talk() {
  const [transcript,setTranscript]=useDemo<{who:string;text:string;dim?:boolean;strong?:boolean}[]>("talk-transcript",transcriptSeed);
  const [question,setQuestion]=useState("");const [prefs]=useDemo("preferences",preferenceSeed);const [profile]=useDemo("profile",profileSeed);const [showSources,setShowSources]=useState(true);
  const [state, setState] = useState<State>("speaking");
  const [captions, setCaptions] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [touchControls,setTouchControls]=useState(false);
  useEffect(()=>{if(!touchControls)return;const timer=setTimeout(()=>setTouchControls(false),2500);return()=>clearTimeout(timer);},[touchControls]);
  const [secs, setSecs] = useState(134);


  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const ask = () => {if(!question.trim())return notify("Type a question to try the demo conversation.");if(prefs.paused||prefs.retired||!prefs.advise)return notify("Resume the twin and enable advice in Settings.");setTranscript(xs=>[...xs,{who:"You",text:question},{who:"Twin",text:answerDemo(question)}]);setQuestion("");setState("speaking");};

  const mm = String(Math.floor(secs / 60)).padStart(2, "0") + ":" + String(secs % 60).padStart(2, "0");
  const glass = { background: "#FFFFFF14", border: "1px solid #FFFFFF26", borderRadius: 4, backdropFilter: "blur(12px)" } as const;

  return (
    <div className="talk-screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        overflow: "hidden",
        color: "#fff",
        background: "radial-gradient(ellipse 45% 60% at 50% 45%, #1F5A47 0%, #0E2E25 70%), #0E2E25",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* dither texture top-left */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 560, height: 520, backgroundImage: "radial-gradient(rgba(143,216,176,0.22) 1.2px, transparent 1.6px)", backgroundSize: "9px 9px", maskImage: "radial-gradient(ellipse at 0% 0%, black 20%, transparent 70%)" }} />

      {/* Top bar */}
      <Link href="/home" className="hover:bg-white/15" style={{ ...glass, position: "absolute", left: 24, top: 28, display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", fontSize: 14 }}>
        <ChevronLeft size={16} /> Back
      </Link>
      <div className="talk-identity" style={{ position: "absolute", left: "50%", top: 24, transform: "translateX(-50%)", textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{profile.name}&apos;s twin</div>
        <div style={{ fontSize: 12, color: "#FFFFFFB3", display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: 9, background: C.lime }} /> Seeded demo · {state === "thinking" ? "thinking" : "speaking"} · {mm}
        </div>
      </div>
      <div className="talk-top-actions" style={{ position: "absolute", right: 24, top: 28, display: "flex", gap: 8 }}>
        <button onClick={() => setCaptions((c) => !c)} style={{ ...glass, background: captions ? "#FFFFFF1F" : "#FFFFFF0A", padding: "8px 12px", fontSize: 13 }}>Captions</button>
        <button onClick={()=>setShowSources(!showSources)} style={{ background: "#fff", color: C.ink, borderRadius: 4, padding: "8px 12px", fontSize: 13, fontWeight: 500 }}>Sources · 3</button>
      </div>
      <div className="talk-hint" style={{ ...glass, position: "absolute", left: "50%", top: 92, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", fontSize: 12, borderColor: "#8FD8B066" }}>
        <RotateCw size={14} color="#8FD8B0" /> Drag to orbit · 360°
      </div>

      {/* Transcript */}
      <div className="talk-transcript" style={{ position: "absolute", left: 56, top: 240, width: 300, display: "flex", flexDirection: "column", gap: 24 }}>
        {transcript.slice(-3).map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: t.who === "Twin" ? "#8FD8B0" : t.strong ? C.lime : "#8FD8B099", marginBottom: 6 }}>{t.who.toUpperCase()}</div>
            <div style={{ fontSize: 16, lineHeight: "23px", color: t.dim ? "#FFFFFF80" : t.strong ? "#fff" : "#FFFFFFE6" }}>{t.text}</div>
          </motion.div>
        ))}
      </div>

      <div className={`talk-stage ${touchControls ? "show-controls" : ""}`} onPointerDown={e=>{if(e.pointerType!=="mouse")setTouchControls(true);}}>
        <TwinAvatar speaking={state==="speaking"} zoom={zoom}/>
      </div>

      {/* View controls */}
      <div className="talk-zoom" style={{ ...glass, position: "absolute", left: "calc(50% + 280px)", top: 330, width: 48, padding: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 4, background: C.lime, color: C.ink, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>¾</div>
        <span style={{ fontSize: 11 }}>Front</span>
        <button onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))} aria-label="Zoom in" style={{ padding: 8 }}><ZoomIn size={15} /></button>
        <button onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))} aria-label="Zoom out" style={{ padding: 8 }}><ZoomOut size={15} /></button>
      </div>

      {/* Sources */}
      <div className="talk-sources" hidden={!showSources} style={{ position: "absolute", right: 48, top: 218, width: 280, display: showSources ? "flex" : "none", flexDirection: "column", gap: 12 }}>
        <motion.div initial={{ opacity: 0, rotate: -1, y: 10 }} animate={{ opacity: 1, rotate: -1, y: 0 }} transition={{ delay: 0.5, duration: 0.6, ease }} style={{ background: "#fff", color: C.ink, borderRadius: 4, padding: 14, boxShadow: "0 20px 40px -20px rgba(0,0,0,.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, fontWeight: 600 }}>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}><ShieldCheck size={14} color={C.pine} /> Your book, 2025</span>
            <span style={{ color: C.slate, fontWeight: 400, fontSize: 12 }}>p. 42</span>
          </div>
          <div style={{ marginTop: 12, height: 3, background: "#E9E8E4", borderRadius: 4 }} />
          <div style={{ marginTop: 6, height: 6, width: "70%", background: "#CDEE8C", borderRadius: 4 }} />
          <div style={{ marginTop: 6, height: 3, width: "55%", background: "#E9E8E4", borderRadius: 4 }} />
        </motion.div>
        <div style={{ ...glass, padding: "12px 14px", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}><UserRound size={14} color="#8FD8B0" /> Interview · partnerships</div>
        <div style={{ border: "1px solid #FFFFFF33", borderRadius: 4, padding: "12px 14px", fontSize: 13, display: "flex", gap: 8, alignItems: "center", color: "#FFFFFFCC" }}><CircleHelp size={14} /> Faculty capacity · unknown</div>
      </div>

      {/* Caption + controls */}
      <div className="talk-controls" style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <form onSubmit={e=>{e.preventDefault();ask();}} className="talk-question"><input aria-label="Demo conversation question" placeholder="Type a question for your twin…" value={question} onChange={e=>setQuestion(e.target.value)}/><button type="submit">Ask</button></form>
        <AnimatePresence mode="wait">
          {captions && (
            <motion.div key={state} initial={{ opacity: 0, y: 8, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(6px)" }} transition={{ duration: 0.5, ease }} style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", textShadow: "0 2px 20px rgba(0,0,0,.4)" }}>
              {state === "thinking" ? "Checking your book and interviews…" : (transcript.at(-1)?.text??"Ask a question to begin.")}
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ display: "flex", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.94 }} onClick={ask} aria-label="Ask typed question" style={{ width: 52, height: 52, borderRadius: 4, background: "#FFFFFF1F", display: "grid", placeItems: "center" }}><Mic size={18} /></motion.button>
          <motion.button whileTap={{ scale: 0.94 }} onClick={() => setCaptions((c) => !c)} aria-label="Captions" style={{ width: 52, height: 52, borderRadius: 4, background: "#FFFFFF1F", display: "grid", placeItems: "center" }}><Captions size={18} /></motion.button>
          <button onClick={()=>{addRecord("decisions",{id:crypto.randomUUID(),title:"Talk session decision",body:transcript.map(t=>`${t.who}: ${t.text}`).join("\n"),date:new Date().toISOString().slice(0,10),status:"Draft",category:"Conversation",source:"Seeded Talk session"});notify("Conversation saved to Decisions");}} className="active:scale-95" style={{ height: 52, padding: "0 24px", borderRadius: 4, background: "#fff", color: C.ink, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}><Scale size={16} /> Save as decision</button>
          <Link href="/home" aria-label="End" className="active:scale-95" style={{ width: 52, height: 52, borderRadius: 4, background: C.danger, display: "grid", placeItems: "center" }}><X size={18} /></Link>
        </div>
      </div>
    </div>
  );
}
