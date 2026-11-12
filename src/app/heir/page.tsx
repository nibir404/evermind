"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUp, LogOut, Lock } from "lucide-react";
import { AnswerCard } from "@/components/family-answer";
import { C, PCard, Eyebrow, Avatar } from "@/components/paper";
import { Logo } from "@/components/sidebar";
import { useDemo, profileSeed, audit } from "@/lib/demo";
import { peopleSeed, successionSeed, familyLogSeed, answerForPerson, logAnswer, type Person, type FamilyAnswer } from "@/lib/org";

const SUGGESTED = [
  "How would Father handle a complaint from a parent?",
  "Should we take a loan to expand to a new campus?",
  "How should I choose a partner university?",
  "Can I sell some of my shares?",
];

export default function SuccessorPortal() {
  const [people] = useDemo<Person[]>("people", peopleSeed);
  const [sessionId, setSessionId] = useDemo<string>("heir-session", "");
  const me = people.find(p => p.id === sessionId && p.active);
  return (
    <div style={{ minHeight: "100dvh", background: C.canvas, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: `1px solid ${C.line}`, background: "#fff" }}>
        <Logo size={30} />
        <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: C.ink }}>EverMind · Family</div><div style={{ fontSize: 12, color: C.slate }}>For the founder&apos;s bloodline successors only</div></div>
        {me && <button className="demo-button" onClick={() => { audit(`${me.name} signed out of the successor portal`, "Succession"); setSessionId(""); }}><LogOut size={14} /> Sign out</button>}
        <Link href="/family" className="demo-button">Founder view</Link>
      </header>
      {me ? <Portal me={me} /> : <SignIn people={people} onIn={id => setSessionId(id)} />}
    </div>
  );
}

function SignIn({ people, onIn }: { people: Person[]; onIn: (id: string) => void }) {
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const family = people.filter(p => p.active);
  return (
    <div style={{ display: "grid", placeItems: "center", padding: "64px 16px" }}>
      <PCard style={{ padding: 32, gap: 18, width: "100%", maxWidth: 440 }}>
        <Lock size={22} color={C.pine} />
        <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em", color: C.ink }}>Family sign-in</div>
        <p className="demo-muted">Only verified members of the founder&apos;s bloodline can consult the twin. Demo: pick a family member and enter their PIN (shown on the Family page).</p>
        <form style={{ display: "flex", flexDirection: "column", gap: 12 }} onSubmit={e => {
          e.preventDefault();
          const p = family.find(x => x.id === id);
          if (!p) return setError("Choose who you are.");
          if (p.pin !== pin) return setError("That PIN doesn't match.");
          if (!p.verified && p.role !== "Owner") return setError("Your bloodline verification isn't complete yet. Ask the family council.");
          audit(`${p.name} signed in to the successor portal`, "Succession");
          onIn(p.id);
        }}>
          <select aria-label="Family member" value={id} onChange={e => { setId(e.target.value); setError(""); }} style={{ border: `1px solid ${C.line}`, borderRadius: 4, padding: 12, fontSize: 14 }}>
            <option value="">Who are you?</option>
            {family.map(p => <option key={p.id} value={p.id}>{p.name} · {p.relation}{!p.verified ? " (unverified)" : ""}</option>)}
          </select>
          <input aria-label="PIN" inputMode="numeric" maxLength={4} placeholder="4-digit PIN" value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, "")); setError(""); }} style={{ border: `1px solid ${C.line}`, borderRadius: 4, padding: 12, fontSize: 14, letterSpacing: "0.3em" }} />
          {error && <p role="alert" style={{ color: C.danger, fontSize: 13 }}>{error}</p>}
          <button className="demo-button primary" type="submit">Continue</button>
        </form>
      </PCard>
    </div>
  );
}

function Portal({ me }: { me: Person }) {
  const [succ] = useDemo("succession", successionSeed);
  const [profile] = useDemo("profile", profileSeed);
  const [log] = useDemo<FamilyAnswer[]>("family-log", familyLogSeed);
  const [q, setQ] = useState("");
  const mine = log.filter(a => a.personId === me.id);
  const ask = (text: string) => { const t = text.trim(); if (!t) return; logAnswer(answerForPerson(t, me)); setQ(""); };
  const first = profile.name.replace(/^Dr\.\s*/, "").split(" ")[0];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 16px 140px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, flexWrap: "wrap" }}>
        <div>
          <Eyebrow>Welcome, {me.name.split(" ")[0]} · {me.relation}</Eyebrow>
          <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.03em", color: C.ink, marginTop: 6 }}>What would {first} do?</div>
        </div>
        <span style={{ fontSize: 12, padding: "5px 10px", borderRadius: 4, background: succ.mode === "Paused" ? "#FBE9E7" : C.wash, color: succ.mode === "Paused" ? C.danger : C.pine, fontWeight: 600 }}>Twin: {succ.mode}</span>
      </div>

      <PCard style={{ padding: 22, gap: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar size={32} /><Eyebrow>A letter from {profile.name}</Eyebrow></div>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: C.ink, fontStyle: "italic" }}>&ldquo;{succ.letter}&rdquo;</p>
      </PCard>

      <div style={{ fontSize: 13, color: C.slate }}>Your access: {me.topics.join(" · ") || "none"}. Legal and ownership matters always go to the family council.</div>

      {mine.length === 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SUGGESTED.map(s => <button key={s} className="demo-button" onClick={() => ask(s)}>{s}</button>)}
        </div>
      )}

      {[...mine].reverse().map(a => <AnswerCard key={a.id} a={a} />)}

      <form onSubmit={e => { e.preventDefault(); ask(q); }} style={{ position: "fixed", left: 16, right: 16, bottom: 20, maxWidth: 828, margin: "0 auto", display: "flex", gap: 8, background: "#fff", padding: 8, borderRadius: 4, boxShadow: "#0000001A 0 0 0 .5px, #0000001F 0 12px 32px -12px" }}>
        <input aria-label="Ask the twin" value={q} onChange={e => setQ(e.target.value)} placeholder={`Ask how ${first} would decide…`} style={{ flex: 1, minWidth: 0, padding: "10px 12px", fontSize: 15, outline: "none" }} />
        <button type="submit" aria-label="Ask" style={{ width: 44, height: 44, borderRadius: 4, background: C.ink, color: "#fff", display: "grid", placeItems: "center" }}><ArrowUp size={18} /></button>
      </form>
    </div>
  );
}
