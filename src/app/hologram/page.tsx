"use client";
// Hologram mode: full-screen, black background, no UI chrome. Runs on hologram boxes,
// transparent / Pepper's-ghost kiosks and 3D displays that take a browser or HDMI feed.
// Open with /hologram?device=<device id>. Only verified family members allowed on the device can use it.
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
const noop = () => () => {};
import dynamic from "next/dynamic";
import { Mic, Keyboard, Delete } from "lucide-react";
import { useDemo, profileSeed, audit } from "@/lib/demo";
import { peopleSeed, devicesSeed, answerForPerson, logAnswer, type Person, type Device } from "@/lib/org";

const TwinAvatar = dynamic(() => import("@/components/twin-avatar"), { ssr: false });

type Rec = { lang: string; interimResults: boolean; continuous: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void; onend: () => void; onerror: () => void; start: () => void; stop: () => void };

export default function Hologram() {
  const [people] = useDemo<Person[]>("people", peopleSeed);
  const [devices, setDevices] = useDemo<Device[]>("devices", devicesSeed);
  const [profile] = useDemo("profile", profileSeed);
  const deviceId = useSyncExternalStore(noop, () => new URLSearchParams(window.location.search).get("device") ?? "dev-home", () => "dev-home");
  const [user, setUser] = useState<Person | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const [heard, setHeard] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const rec = useRef<Rec | null>(null);
  const idle = useRef<ReturnType<typeof setTimeout>>(undefined);

  const device = devices.find(d => d.id === deviceId);
  const first = profile.name.replace(/^Dr\.\s*/, "").split(" ")[0];

  // Heartbeat so the fleet page shows this device online.
  useEffect(() => {
    if (!device || device.status === "Disabled") return;
    setDevices(xs => xs.map(d => (d.id === deviceId ? { ...d, status: "Online", lastSeen: new Date().toISOString() } : d)));
  }, [deviceId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto sign-out after 2 minutes of inactivity — the device is physical and shared.
  const touch = () => { clearTimeout(idle.current); idle.current = setTimeout(() => { setUser(null); setCaption(""); setHeard(""); }, 120000); };
  useEffect(() => () => clearTimeout(idle.current), []);

  const say = (line: string) => {
    setCaption(line);
    if (!("speechSynthesis" in window)) { setSpeaking(true); setTimeout(() => setSpeaking(false), Math.min(9000, line.length * 55)); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(line.replace(/\n+/g, " "));
    u.rate = 0.95; u.pitch = 0.9;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    speechSynthesis.speak(u);
  };

  const signIn = (p: string) => {
    const person = people.find(x => x.pin === p && x.active);
    if (!person) { setError("PIN not recognised."); setPin(""); return; }
    if (!device?.allowed.includes(person.id)) { setError("You're not allowed on this device."); setPin(""); audit(`Hologram ${device?.name}: refused ${person.name} (not allowed on device)`, "Devices"); return; }
    if (person.role !== "Owner" && !person.verified) { setError("Bloodline verification isn't complete."); setPin(""); return; }
    setUser(person); setPin(""); setError(""); touch();
    audit(`Hologram ${device.name}: ${person.name} identified`, "Devices");
    say(`Hello ${person.name.split(" ")[0]}. What would you like to ask?`);
  };

  const ask = (q: string) => {
    if (!user || !q.trim()) return;
    touch(); setHeard(q);
    const a = answerForPerson(q, user, "Hologram", device?.name);
    logAnswer(a);
    say(a.answer);
  };

  const listen = () => {
    const W = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const R = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!R) { setTyping(true); return; }
    if (listening) { rec.current?.stop(); return; }
    speechSynthesis?.cancel();
    const r = new R(); rec.current = r;
    r.lang = "en-US"; r.interimResults = true; r.continuous = false;
    let final = "";
    r.onresult = e => { const res = e.results[e.results.length - 1]; setHeard(res[0].transcript); if (res.isFinal) final = res[0].transcript; };
    r.onend = () => { setListening(false); if (final) ask(final); };
    r.onerror = () => setListening(false);
    setListening(true); setHeard(""); r.start();
  };

  if (!device) return <Screen><p style={{ color: "#888" }}>Unknown device “{deviceId}”. Register it on the Devices page.</p></Screen>;
  if (device.status === "Disabled") return <Screen><p style={{ color: "#888", fontSize: 18 }}>This device has been switched off by the family.</p></Screen>;

  return (
    <Screen>
      <div style={{ position: "absolute", inset: 0, opacity: user ? 1 : 0.35, transition: "opacity 1.2s" }}>
        <TwinAvatar speaking={speaking} zoom={1.1} />
      </div>

      {!user ? (
        <div style={{ position: "absolute", bottom: "8vh", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <p style={{ color: "#cfe9dc", fontSize: 20, letterSpacing: "0.02em" }}>Family members only · enter your PIN</p>
          <div aria-live="polite" style={{ display: "flex", gap: 12, height: 18 }}>{[0, 1, 2, 3].map(i => <span key={i} style={{ width: 14, height: 14, borderRadius: 9, border: "1px solid #6fbf98", background: pin.length > i ? "#6fbf98" : "transparent" }} />)}</div>
          {error && <p role="alert" style={{ color: "#ff8a80" }}>{error}</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,64px)", gap: 10 }}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map(k => k === "" ? <span key="blank" /> : (
              <button key={k} aria-label={k === "del" ? "Delete" : k} onClick={() => { setError(""); if (k === "del") return setPin(p => p.slice(0, -1)); const next = (pin + k).slice(0, 4); setPin(next); if (next.length === 4) signIn(next); }}
                style={{ height: 56, borderRadius: 4, border: "1px solid #1f3a2e", color: "#e6f5ec", fontSize: 22, background: "#06100c", display: "grid", placeItems: "center" }}>
                {k === "del" ? <Delete size={20} /> : k}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", bottom: "6vh", left: 16, right: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {heard && <p style={{ color: "#8fbfa6", fontSize: 16, textAlign: "center" }}>“{heard}”</p>}
          {caption && <p aria-live="polite" style={{ color: "#f2fff7", fontSize: "clamp(18px,2.2vw,26px)", lineHeight: 1.45, textAlign: "center", maxWidth: 900, whiteSpace: "pre-wrap", textShadow: "0 0 18px #0e5a43" }}>{caption}</p>}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button aria-label={listening ? "Stop listening" : "Speak"} onClick={listen} style={{ width: 72, height: 72, borderRadius: 40, background: listening ? "#D4F26A" : "#0E5A43", color: listening ? "#000" : "#fff", display: "grid", placeItems: "center", boxShadow: listening ? "0 0 0 10px #d4f26a33" : "none", transition: "all .2s" }}><Mic size={28} /></button>
            <button aria-label="Type instead" onClick={() => setTyping(t => !t)} style={{ width: 44, height: 44, borderRadius: 30, border: "1px solid #1f3a2e", color: "#8fbfa6", display: "grid", placeItems: "center" }}><Keyboard size={18} /></button>
          </div>
          {typing && <form onSubmit={e => { e.preventDefault(); ask(text); setText(""); }} style={{ display: "flex", gap: 8, width: "min(600px,100%)" }}><input aria-label="Type a question" autoFocus value={text} onChange={e => setText(e.target.value)} placeholder={`Ask how ${first} would decide…`} style={{ flex: 1, background: "#06100c", border: "1px solid #1f3a2e", color: "#fff", borderRadius: 4, padding: 12 }} /><button style={{ color: "#D4F26A", padding: "0 12px" }}>Ask</button></form>}
          <button onClick={() => { speechSynthesis?.cancel(); setUser(null); setCaption(""); setHeard(""); }} style={{ color: "#5d7a6c", fontSize: 13 }}>{user.name} · end session</button>
        </div>
      )}
      <div style={{ position: "absolute", top: 14, left: 16, color: "#2f4a3d", fontSize: 12 }}>{device.name} · EverMind</div>
    </Screen>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return <main style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden", display: "grid", placeItems: "center", fontFamily: "system-ui, -apple-system, sans-serif" }}>{children}</main>;
}
