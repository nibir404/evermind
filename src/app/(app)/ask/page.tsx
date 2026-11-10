"use client";
import { useDemo, writeDemo, answerDemo, audit, notify, preferenceSeed, profileSeed } from "@/lib/demo";
import Link from "next/link";

// 1:1 port of Paper "06 · Ask your twin" (6CN-0)
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Mic, Plus, ThumbsDown, ThumbsUp, ArrowUp, Trash2, RotateCcw, PanelLeft, SquarePen, Search, Menu, ChevronLeft } from "lucide-react";
import { Confirm } from "@/components/confirm";
import { C, Eyebrow, SourceChip } from "@/components/paper";
import { ease } from "@/components/ui";

type Msg = { role: "you" | "twin"; text?: string; rich?: boolean };

const seedThreads: Record<string, string[]> = {
  Today: ["Group portfolio this week", "Wollongong pathway MoU"],
  Yesterday: ["DIU board agenda", "Incubator cohort 4 shortlist"],
  "This week": ["ICT company behind plan", "Brief for Rafiq (EA)"],
};

function PortfolioVisual() {
  return (
    <div className="chat-card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Eyebrow>48 group concerns · this week</Eyebrow>
        <span style={{ color: C.success, fontSize: 12 }}>↑ 3 since last week</span>
      </div>
      <div style={{ display: "flex", gap: 3, height: 8 }}>
        {[
          [C.pine, 38],
          ["#8FD8B0", 8],
          [C.amber, 2],
        ].map(([c, n], i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease, delay: 0.1 * i }}
            style={{ background: c as string, borderRadius: 4, flex: n as number, transformOrigin: "left" }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, fontSize: 13, color: C.body }}>
        {[
          [C.pine, "On track 38"],
          ["#8FD8B0", "Watching 8"],
          [C.amber, "Needs you 2"],
        ].map(([c, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: 9, background: c }} /> {l}
          </span>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { l: "ICT company · Q3 revenue", v: 68, c: C.amber, note: "68% of plan", nc: C.warning },
          { l: "Wollongong MoU · signature", v: 90, c: C.pine, note: "9 of 10 steps", nc: C.slate },
        ].map((r) => (
          <div key={r.l} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}>
            <span style={{ width: 7, height: 7, borderRadius: 9, background: C.amber }} />
            <span style={{ flex: 1, color: C.ink }}>{r.l}</span>
            <div style={{ width: 140, height: 4, background: "#EDEDEA", borderRadius: 4, overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${r.v}%` }} transition={{ duration: 1, ease, delay: 0.3 }} style={{ height: "100%", background: r.c }} />
            </div>
            <span style={{ width: 90, textAlign: "right", color: r.nc, fontSize: 13 }}>{r.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const suggestions = [
  { title: "Brief me on the group", sub: "what needs me this week", q: "How is the group portfolio this week, and what needs me?" },
  { title: "Wollongong pathway", sub: "should we add a second partner?", q: "Should we sign with all three Australian universities?" },
  { title: "Draft a reply", sub: "to the scholarship committee", q: "Draft a reply to the scholarship committee about the shortlist" },
  { title: "My principles", sub: "on partnerships", q: "What is my principle on partnerships?" },
];

/** Reveals text word by word, like a streamed answer. */
function useStream(text: string, on: boolean) {
  const words = text.split(/(\s+)/);
  const [n, setN] = useState(on ? 0 : words.length);
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setN((x) => { if (x >= words.length) { clearInterval(t); return x; } return x + 2; }), 28);
    return () => clearInterval(t);
  }, [on, words.length]);
  return { shown: words.slice(0, n).join(""), done: n >= words.length };
}

function TwinMark() {
  return <span className="chat-mark" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 64 64"><path d="M32 14c9.94 0 18 8.06 18 18s-8.06 18-18 18-18-8.06-18-18c0-6.2 3.14-11.67 7.92-14.9" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /><circle cx="32" cy="32" r="7" fill="currentColor" /></svg></span>;
}

function TwinReply({ rich, text, fresh, onReasoning, onRegenerate }: { rich?: boolean; text?: string; fresh?: boolean; onReasoning: () => void; onRegenerate?: () => void }) {
  const body = text ?? "";
  const [main, sourceLine] = body.split("\n\nSource: ");
  const { shown, done } = useStream(main, !!fresh && !rich);
  const [rated, setRated] = useState<"up" | "down" | null>(null);
  return (
    <motion.div className="chat-twin" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }}>
      <TwinMark />
      <div className="chat-twin-body">
        {rich ? (
          <>
            <p><b>38 concerns are on track. Two need you.</b> The ICT company is a quarter behind plan, and the Wollongong MoU is waiting for your signature.</p>
            <PortfolioVisual />
            <p>I&apos;d sign the MoU this week; their registrar is waiting. For the ICT company, ask for a recovery plan before the board meets, as you usually do.</p>
            <div className="chat-sources"><SourceChip>UOW registrar reply</SourceChip><SourceChip>48 weekly reports</SourceChip><SourceChip tone="amber">Inferred · your usual approach</SourceChip></div>
          </>
        ) : (
          <>
            <p style={{ whiteSpace: "pre-wrap" }}>{shown}{!done && <span className="chat-caret" aria-hidden="true" />}</p>
            {done && <div className="chat-sources">{sourceLine ? <SourceChip>{sourceLine.replace(/\. Seeded evidence.*$/, "")}</SourceChip> : <SourceChip tone="slate">No matching source · unknown</SourceChip>}</div>}
          </>
        )}
        {(rich || done) && (
          <div className="chat-actions">
            <button aria-label="Copy" title="Copy" onClick={() => navigator.clipboard.writeText(rich ? "38 concerns are on track. Two need you." : main).then(() => notify("Copied")).catch(() => notify("Clipboard is unavailable"))}><Copy size={15} /></button>
            <button aria-label="Good answer" title="Good answer" aria-pressed={rated === "up"} onClick={() => { setRated("up"); audit("Marked answer helpful", "Chat"); }}><ThumbsUp size={15} /></button>
            <button aria-label="Bad answer" title="Bad answer" aria-pressed={rated === "down"} onClick={() => { setRated("down"); audit("Marked answer unhelpful", "Chat"); notify("Thanks. You can correct the memory it used."); }}><ThumbsDown size={15} /></button>
            {onRegenerate && <button aria-label="Regenerate" title="Regenerate" onClick={onRegenerate}><RotateCcw size={15} /></button>}
            <button className="chat-why" onClick={onReasoning}>Why this answer</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Composer({ value, onChange, onSend, busy, autoFocus }: { value: string; onChange: (v: string) => void; onSend: () => void; busy: boolean; autoFocus?: boolean }) {
  const ta = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const el = ta.current; if (!el) return; el.style.height = "auto"; el.style.height = Math.min(200, el.scrollHeight) + "px"; }, [value]);
  return (
    <form className="chat-composer" onSubmit={(e) => { e.preventDefault(); onSend(); }}>
      <textarea
        ref={ta}
        data-bare
        autoFocus={autoFocus}
        value={value}
        rows={1}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); onSend(); } }}
        placeholder="Ask your twin"
        aria-label="Message your twin"
      />
      <div className="chat-composer-row">
        <Link className="chat-icon-btn" aria-label="Add a source" title="Add a source" href="/knowledge/add"><Plus size={18} /></Link>
        <span className="chat-pill">Uses your sources</span>
        <span style={{ flex: 1 }} />
        <Link className="chat-icon-btn" aria-label="Talk instead" title="Talk instead" href="/talk"><Mic size={18} /></Link>
        <button type="submit" className="chat-send" aria-label="Send" disabled={!value.trim() || busy}><ArrowUp size={18} strokeWidth={2.4} /></button>
      </div>
    </form>
  );
}

function AskInner() {
  const params = useSearchParams();
  const initialQ = params.get("q");
  const short = (q: string) => (q.length > 34 ? q.slice(0, 34) + "…" : q);
  const [active, setActive] = useState(initialQ ? short(initialQ) : "Group portfolio this week");
  const [prefs] = useDemo("preferences", preferenceSeed);
  const [profile] = useDemo("profile", profileSeed);
  const [msgs, setMsgs] = useDemo<Msg[]>("chat:" + active, () => initialQ && active === short(initialQ) ? [{role:"you",text:initialQ},{role:"twin",text:answerDemo(initialQ)}] : active === "Group portfolio this week" ? [{role:"you",text:"How is the group portfolio this week, and what needs me?"},{role:"twin",rich:true}] : active ? [{role:"you",text:active},{role:"twin",text:answerDemo(active)}] : []);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [fresh, setFresh] = useState<number | null>(null);
  const [reasoning, setReasoning] = useState<number | null>(null);
  const [threads, setThreads] = useDemo("chat-threads", () => initialQ ? {...seedThreads, Today:[short(initialQ),...seedThreads.Today]} : seedThreads);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [sidebar, setSidebar] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [filter, setFilter] = useState("");
  const firstName = profile.name.replace(/^Dr\.\s*/, "").split(" ").slice(-1)[0];
  const removeThread = () => {
    if (!toDelete) return;
    setThreads(t => Object.fromEntries(Object.entries(t).map(([g,xs])=>[g,xs.filter(x=>x!==toDelete)])));
    writeDemo("chat:"+toDelete, []);
    if(active===toDelete) setActive("");
    audit("Deleted demo conversation", "Chat"); setToDelete(null);
  };
  const end = useRef<HTMLDivElement>(null);
  const open = (t: string) => { setActive(t); setReasoning(null); setFresh(null); setDrawer(false); };
  const newChat = () => { writeDemo("chat:", []); open(""); };
  const send = (q = input) => {
    const t = q.trim(); if (!t || busy) return;
    if (prefs.paused || prefs.retired || !prefs.advise) return notify("Your twin is paused or advice is disabled. Update Boundaries in Settings.");
    const asked: Msg[] = [...msgs, { role: "you", text: t }];
    let key = active;
    if (!active) { key = short(t) + " · " + Date.now().toString().slice(-4); setThreads(xs => ({ ...xs, Today: [key, ...(xs.Today ?? [])] })); }
    writeDemo("chat:" + key, asked); if (!active) setActive(key);
    setInput(""); setBusy(true); audit("Asked twin: " + t.slice(0, 80), "Chat");
    setTimeout(() => { writeDemo("chat:" + key, [...asked, { role: "twin", text: answerDemo(t) }]); setFresh(asked.length); setBusy(false); }, 900);
  };
  const regenerate = (i: number) => { const q = msgs[i - 1]?.text; if (!q) return; setMsgs(msgs.slice(0, i)); setBusy(true); setTimeout(() => { setMsgs([...msgs.slice(0, i), { role: "twin", text: answerDemo(q) }]); setFresh(i); setBusy(false); }, 700); };
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, busy]);

  const list = (
    <>
      <div className="chat-side-top">
        <button className="chat-icon-btn" aria-label="Close sidebar" title="Close sidebar" onClick={() => { setSidebar(false); setDrawer(false); }}><PanelLeft size={18} /></button>
        <button className="chat-icon-btn" aria-label="New chat" title="New chat" onClick={newChat}><SquarePen size={18} /></button>
      </div>
      <label className="chat-side-search"><Search size={15} /><input data-bare value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search chats" aria-label="Search chats" /></label>
      <div className="chat-side-list" data-lenis-prevent>
        {Object.entries(threads).map(([g, items]) => {
          const shown = items.filter((t) => t.toLowerCase().includes(filter.toLowerCase()));
          if (!shown.length) return null;
          return (
            <div key={g}>
              <p className="chat-side-group">{g}</p>
              <AnimatePresence initial={false}>
                {shown.map((t) => (
                  <motion.div key={t} layout exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease }} className="chat-thread">
                    <button onClick={() => open(t)} aria-current={active === t ? "page" : undefined}>{t}</button>
                    <button className="chat-thread-del" aria-label={`Delete ${t}`} onClick={() => setToDelete(t)}><Trash2 size={14} /></button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <div className="chat-side-foot"><span className="chat-live" /> Twin of {profile.name} · demo</div>
    </>
  );

  return (
    <div className={`chat ${sidebar ? "" : "chat-collapsed"}`}>
      <aside className="chat-side" aria-label="Chats">{list}</aside>
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="chat-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.aside className="chat-drawer glass-liquid" aria-label="Chats" initial={{ x: "-104%" }} animate={{ x: 0 }} exit={{ x: "-104%" }} transition={{ type: "spring", stiffness: 380, damping: 36 }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.5, right: 0 }} onDragEnd={(_, i) => { if (i.offset.x < -80 || i.velocity.x < -500) setDrawer(false); }}>{list}</motion.aside>
          </>
        )}
      </AnimatePresence>

      <section className="chat-main">
        <header className="chat-top">
          {!sidebar && <button className="chat-icon-btn chat-desk-only" aria-label="Open sidebar" title="Open sidebar" onClick={() => setSidebar(true)}><PanelLeft size={18} /></button>}
          <Link className="chat-icon-btn chat-phone-only" aria-label="Back to Home" href="/home"><ChevronLeft size={22} /></Link>
          <button className="chat-icon-btn chat-mobile-only" aria-label="Chats" onClick={() => setDrawer(true)}><Menu size={20} /></button>
          <span className="chat-title">{active || "New chat"}</span>
          <button className="chat-icon-btn" aria-label="New chat" title="New chat" onClick={newChat}><SquarePen size={18} /></button>
        </header>

        {msgs.length === 0 && !busy ? (
          <div className="chat-empty">
            <h1>What’s on your mind, Dr. {firstName}?</h1>
            <Composer value={input} onChange={setInput} onSend={() => send()} busy={busy} autoFocus />
            <div className="chat-suggest">
              {suggestions.map((s) => (
                <button key={s.title} onClick={() => send(s.q)}><b>{s.title}</b><span>{s.sub}</span></button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="chat-scroll" data-lenis-prevent>
              <div className="chat-thread-col">
                {msgs.map((m, i) =>
                  m.role === "you" ? (
                    <motion.div key={i} className="chat-you" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}><div>{m.text}</div></motion.div>
                  ) : (
                    <TwinReply key={i + (m.text ?? "")} rich={m.rich} text={m.text} fresh={fresh === i} onReasoning={() => setReasoning(i)} onRegenerate={m.rich ? undefined : () => regenerate(i)} />
                  ),
                )}
                {busy && (
                  <div className="chat-twin" aria-live="polite">
                    <TwinMark />
                    <span className="chat-thinking"><span /><span /><span /> Checking your sources</span>
                  </div>
                )}
                <div ref={end} />
              </div>
            </div>
            <div className="chat-bottom">
              <Composer value={input} onChange={setInput} onSend={() => send()} busy={busy} />
              <p className="chat-disclaimer">Answers use only sources you’ve shared, and say when something is inferred or unknown.</p>
            </div>
          </>
        )}
      </section>

      <Confirm
        open={!!toDelete}
        title="Delete this chat?"
        body={toDelete ? `"${toDelete}" will be removed from your history. Memories your twin learned from it are kept.` : undefined}
        onConfirm={removeThread}
        onCancel={() => setToDelete(null)}
      />
      <AnimatePresence>
        {reasoning !== null && <ReasoningPanel rich={!!msgs[reasoning]?.rich} onClose={() => setReasoning(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ReasoningPanel({ rich, onClose }: { rich: boolean; onClose: () => void }) {
  const steps = rich
    ? ["Read 48 weekly reports", "Flagged items below plan", "Applied \"ask for a recovery plan\"", "Wrote it in your voice"]
    : ["Matched words against local knowledge and decisions", "Returned the closest source, or an explicit unknown", "No live AI model was called"];
  const claims: [string, "Verified" | "Inferred" | "Unknown"][] = rich
    ? [["38 concerns on plan", "Verified"], ["MoU awaits your signature", "Verified"], ["Ask ICT for a recovery plan", "Inferred"], ["Whether the delay affects the bond", "Unknown"]]
    : [["Source match requires your review", "Inferred"], ["Facts outside the local source library", "Unknown"]];
  const pct = rich ? 87 : 64;
  const col = { Verified: [C.success, C.success], Inferred: [C.amber, C.warning], Unknown: ["transparent", C.slate] } as const;
  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 376, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease }}
      className="ask-reasoning chat-reasoning"
      style={{ flexShrink: 0, overflow: "hidden", background: "#fff", borderRadius: 4, boxShadow: "#0000000D 0px 0px 0px 0.5px, #0000000A 0px 1px 2px" }}
    >
      <div style={{ width: 376, height: "100%", padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 17, fontWeight: 600 }}>How your twin answered</span>
          <button onClick={onClose} aria-label="Close" style={{ color: C.slate, fontSize: 18 }}>×</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="23" fill="none" stroke="#E9E8E4" strokeWidth="5" />
            <motion.circle cx="28" cy="28" r="23" fill="none" stroke={C.pine} strokeWidth="5" strokeLinecap="round" transform="rotate(-90 28 28)" strokeDasharray={2 * Math.PI * 23} initial={{ strokeDashoffset: 2 * Math.PI * 23 }} animate={{ strokeDashoffset: 2 * Math.PI * 23 * (1 - pct / 100) }} transition={{ duration: 1.1, ease, delay: 0.2 }} />
          </svg>
          <div>
            <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em" }}>{pct}% grounded</div>
            <div style={{ fontSize: 13, color: C.slate }}>in sources you&apos;ve approved</div>
          </div>
        </div>
        <Eyebrow>Steps</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: -6 }}>
          {steps.map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08, duration: 0.4, ease }} style={{ display: "flex", gap: 20, fontSize: 14 }}>
              <span style={{ color: C.slate, fontSize: 12, width: 8 }}>{i + 1}</span> {t}
            </motion.div>
          ))}
        </div>
        <div style={{ height: 1, background: C.line }} />
        <Eyebrow>Claims · {claims.length}</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: -6 }}>
          {claims.map(([t, k]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: k === "Unknown" ? C.slate : C.ink }}>
              <span style={{ width: 7, height: 7, borderRadius: 9, background: col[k][0], border: k === "Unknown" ? `1px solid ${C.faint}` : "none" }} />
              <span style={{ flex: 1 }}>{t}</span>
              <span style={{ fontSize: 12, color: col[k][1] }}>{k}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/memory/corrections" className="active:scale-[0.98]" style={{ flex: 1, height: 38, background: C.ink, color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 600, display: "grid", placeItems: "center" }}>Correct a claim</a>
          <a href="/knowledge/add" style={{ flex: 1, height: 38, borderRadius: 4, fontSize: 13, fontWeight: 600, display: "grid", placeItems: "center", boxShadow: "0 0 0 1px #E4E3DF" }}>Teach the unknown</a>
        </div>
      </div>
    </motion.aside>
  );
}

export default function Ask() {
  return (
    <Suspense>
      <AskInner />
    </Suspense>
  );
}
