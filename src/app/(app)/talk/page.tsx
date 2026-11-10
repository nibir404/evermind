"use client";

// 1:1 port of Paper "07 · Talk to your twin (3D)" (6KP-0) + "S · 07 Talk — Thinking" (6NN-0)
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const TwinAvatar = dynamic(() => import("@/components/twin-avatar"), {
  ssr: false,
  loading: () => <div className="demo-note">Loading 3D avatar…</div>,
});
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Mic,
  X,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Scale,
} from "lucide-react";
import { useDemo, answerDemo, addRecord, preferenceSeed, profileSeed, notify, moduleSeeds, type RecordItem } from "@/lib/demo";
import { C } from "@/components/paper";
import { ease } from "@/components/ui";

type State = "greeting" | "thinking" | "speaking";

const transcriptSeed = [
  { who: "You", text: "Should we sign with all three Australian universities?", dim: true },
  { who: "Twin", text: "Not all at once. Keep the line specific, start with one." },
  { who: "You", text: "Which one first?", strong: true },
];

const samplePrompts = [
  "Which one first?",
  "Should we sign with all three Australian universities?",
  "How should we handle faculty capacity in 2027?",
  "What is our core principle on student employability?",
  "Should we expand the Ashulia campus this year?",
];

export default function Talk() {
  const [transcript, setTranscript] = useDemo<{ who: string; text: string; dim?: boolean; strong?: boolean }[]>(
    "talk-transcript",
    transcriptSeed,
  );
  const [prefs] = useDemo("preferences", preferenceSeed);
  const [profile] = useDemo("profile", profileSeed);
  const [showSources, setShowSources] = useState(true);
  const [calendar] = useDemo<RecordItem[]>("calendar", moduleSeeds.calendar ?? []);
  const upcoming = [...calendar].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const [state, setState] = useState<State>("speaking");
  const [zoom, setZoom] = useState(1);
  const [angle, setAngle] = useState(0);
  const [reset, setReset] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);
  const [secs, setSecs] = useState(134);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const triggerVoiceTurn = (queryText?: string) => {
    if (prefs.paused || prefs.retired || !prefs.advise) {
      return notify("Resume the twin and enable advice in Settings first.");
    }
    const q = queryText || samplePrompts[promptIdx % samplePrompts.length];
    setPromptIdx((i) => i + 1);
    setIsListening(true);
    setState("thinking");

    setTimeout(() => {
      setIsListening(false);
      setTranscript((xs) => [...xs, { who: "You", text: q }, { who: "Twin", text: answerDemo(q) }]);
      setState("speaking");
    }, 900);
  };

  const handleMicClick = () => {
    if (typeof window !== "undefined") {
      interface SpeechRecognitionEvent {
        results?: { [index: number]: { [index: number]: { transcript: string } } };
      }
      interface SpeechRecognitionInstance {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: (e: SpeechRecognitionEvent) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      }
      type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = "en-US";
          setIsListening(true);
          setState("thinking");
          rec.onresult = (e: SpeechRecognitionEvent) => {
            const spoken = e.results?.[0]?.[0]?.transcript;
            if (spoken) {
              setTranscript((xs) => [...xs, { who: "You", text: spoken }, { who: "Twin", text: answerDemo(spoken) }]);
              setState("speaking");
            } else {
              triggerVoiceTurn();
            }
            setIsListening(false);
          };
          rec.onerror = () => {
            triggerVoiceTurn();
          };
          rec.onend = () => {
            setIsListening(false);
          };
          rec.start();
          return;
        } catch {
          // fallback
        }
      }
    }
    triggerVoiceTurn();
  };

  const mm = String(Math.floor(secs / 60)).padStart(2, "0") + ":" + String(secs % 60).padStart(2, "0");
  const glass = { background: "#FFFFFF14", border: "1px solid #FFFFFF26", borderRadius: 4, backdropFilter: "blur(12px)" } as const;

  return (
    <div
      className="talk-screen"
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
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 560,
          height: 520,
          backgroundImage: "radial-gradient(rgba(143,216,176,0.22) 1.2px, transparent 1.6px)",
          backgroundSize: "9px 9px",
          maskImage: "radial-gradient(ellipse at 0% 0%, black 20%, transparent 70%)",
        }}
      />

      {/* Top bar */}
      <Link
        href="/home"
        className="hover:bg-white/15"
        style={{ ...glass, position: "absolute", left: 24, top: 28, display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", fontSize: 14 }}
      >
        <ChevronLeft size={16} /> Back
      </Link>
      <div
        className="talk-identity"
        style={{ position: "absolute", left: "50%", top: 24, transform: "translateX(-50%)", textAlign: "center" }}
      >
        <div style={{ fontSize: 16, fontWeight: 600 }}>{profile.name}&apos;s twin</div>
        <div style={{ fontSize: 12, color: "#FFFFFFB3", display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: 9, background: C.lime }} /> Seeded demo · {state === "thinking" ? "thinking" : "speaking"} · {mm}
        </div>
      </div>
      <div className="talk-top-actions" style={{ position: "absolute", right: 24, top: 28, display: "flex", gap: 8 }}>
        <button
          onClick={() => setShowSources(!showSources)}
          style={{ background: "#fff", color: C.ink, borderRadius: 4, padding: "8px 12px", fontSize: 13, fontWeight: 500 }}
        >
          Upcoming · 3
        </button>
      </div>
      <div
        className="talk-hint"
        style={{ ...glass, position: "absolute", left: "50%", top: 92, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", fontSize: 12, borderColor: "#8FD8B066" }}
      >
        <RotateCw size={14} color="#8FD8B0" /> Drag to orbit · 360°
      </div>

      {/* Transcript */}
      <div
        className="talk-transcript"
        style={{ position: "absolute", left: 56, top: 240, width: 300, display: "flex", flexDirection: "column", gap: 24 }}
      >
        {transcript.slice(-3).map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: t.who === "Twin" ? "#8FD8B0" : t.strong ? C.lime : "#8FD8B099", marginBottom: 6 }}>
              {t.who.toUpperCase()}
            </div>
            <div style={{ fontSize: 16, lineHeight: "23px", color: t.dim ? "#FFFFFF80" : t.strong ? "#fff" : "#FFFFFFE6" }}>
              {t.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3D Model Stage */}
      <div className="talk-stage">
        <TwinAvatar speaking={state === "speaking"} zoom={zoom} angle={angle} reset={reset} />
      </div>

      {/* View controls, bottom right */}
      <div
        className="talk-zoom"
        style={{
          ...glass,
          position: "absolute",
          right: 48,
          bottom: 36,
          height: 52,
          padding: "0 7px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          zIndex: 30,
        }}
      >
        <button
          onClick={() => { setAngle(0); setReset((r) => r + 1); }}
          title="Reset to front view"
          aria-label="Front view"
          className="transition hover:brightness-95 active:scale-95"
          style={{ height: 38, padding: "0 12px", borderRadius: 4, background: C.lime, color: C.ink, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}
        >
          Front
        </button>
        <button
          onClick={() => setAngle((a) => a - Math.PI / 4)}
          title="Rotate avatar left"
          aria-label="Rotate avatar left"
          className="rounded p-2 transition hover:bg-white/10 active:scale-90"
          style={{ color: "#8FD8B0" }}
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => setAngle((a) => a + Math.PI / 4)}
          title="Rotate avatar right"
          aria-label="Rotate avatar right"
          className="rounded p-2 transition hover:bg-white/10 active:scale-90"
          style={{ color: "#8FD8B0" }}
        >
          <RotateCw size={16} />
        </button>
        <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.18)", margin: "0 4px" }} />
        <button
          onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
          title="Zoom in"
          aria-label="Zoom in"
          className="rounded p-2 transition hover:bg-white/10 active:scale-90"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
          title="Zoom out"
          aria-label="Zoom out"
          className="rounded p-2 transition hover:bg-white/10 active:scale-90"
        >
          <ZoomOut size={16} />
        </button>
      </div>

      {/* Upcoming events */}
      <div
        className="talk-sources"
        hidden={!showSources}
        style={{ position: "absolute", right: 48, top: 218, width: 280, display: showSources ? "flex" : "none", flexDirection: "column", gap: 10 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 11, letterSpacing: "0.12em", color: "#8FD8B0" }}>UPCOMING</span>
          <Link href="/calendar" style={{ fontSize: 13, color: "#FFFFFFCC", textDecoration: "underline", textUnderlineOffset: 3 }}>See all</Link>
        </div>
        {upcoming.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease }}
            style={i === 0
              ? { background: "#fff", color: C.ink, borderRadius: 4, padding: 14 }
              : { ...glass, padding: "12px 14px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12, color: i === 0 ? C.slate : "#FFFFFFB3" }}>
              <span>{new Date(e.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} · {e.body.split(" · ")[0]}</span>
              <span>{e.category}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 14, fontWeight: i === 0 ? 600 : 500, lineHeight: "19px" }}>{e.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div
        className="talk-controls"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 36,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          zIndex: 25,
          pointerEvents: "auto",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleMicClick}
            aria-label="Speak with twin"
            title={isListening ? "Listening…" : "Tap to speak"}
            className="transition"
            style={{
              width: 52,
              height: 52,
              borderRadius: 4,
              background: isListening ? C.lime : "#FFFFFF1F",
              color: isListening ? C.ink : "#fff",
              display: "grid",
              placeItems: "center",
              boxShadow: isListening ? "0 0 0 4px rgba(212,242,106,0.3)" : "none",
            }}
          >
            <Mic size={20} className={isListening ? "animate-pulse" : ""} />
          </motion.button>
          <button
            onClick={() => {
              addRecord("decisions", {
                id: crypto.randomUUID(),
                title: "Talk session decision",
                body: transcript.map((t) => `${t.who}: ${t.text}`).join("\n"),
                date: new Date().toISOString().slice(0, 10),
                status: "Draft",
                category: "Conversation",
                source: "Seeded Talk session",
              });
              notify("Conversation saved to Decisions");
            }}
            className="transition hover:brightness-95 active:scale-95"
            style={{
              height: 52,
              padding: "0 24px",
              borderRadius: 4,
              background: "#fff",
              color: C.ink,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <Scale size={16} /> Save as decision
          </button>
          <Link
            href="/home"
            aria-label="End conversation"
            title="End session"
            className="transition hover:brightness-95 active:scale-95"
            style={{
              width: 52,
              height: 52,
              borderRadius: 4,
              background: C.danger,
              color: "#fff",
              display: "grid",
              placeItems: "center",
            }}
          >
            <X size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
