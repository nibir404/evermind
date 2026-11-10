"use client";
import { useDemo, writeDemo, answerDemo, audit, notify, preferenceSeed, profileSeed } from "@/lib/demo";
import Link from "next/link";

// 1:1 port of Paper "06 · Ask your twin" (6CN-0)
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Mic, Paperclip, Plus, ThumbsDown, ThumbsUp, ArrowUp, Trash2 } from "lucide-react";
import { Confirm } from "@/components/confirm";
import { Avatar, C, Dot, Eyebrow, PCard, SourceChip } from "@/components/paper";
import { ease } from "@/components/ui";

type Msg = { role: "you" | "twin"; text?: string; rich?: boolean };

const seedThreads: Record<string, string[]> = {
  Today: ["Group portfolio this week", "Wollongong pathway MoU"],
  Yesterday: ["DIU board agenda", "Incubator cohort 4 shortlist"],
  "This week": ["ICT company behind plan", "Brief for Rafiq (EA)"],
};

function PortfolioVisual() {
  return (
    <PCard style={{ padding: 18, gap: 14, marginTop: 4 }}>
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
    </PCard>
  );
}

function TwinReply({ rich, text, open, onToggle }: { rich?: boolean; text?: string; open?: boolean; onToggle?: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} style={{ display: "flex", gap: 14 }}>
      <Avatar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        {rich ? (
          <>
            <p style={{ fontSize: 16, lineHeight: "26px", color: C.ink }}>
              <b style={{ fontWeight: 600 }}>38 concerns are on track. Two need you.</b> The ICT company is a quarter behind plan, and the Wollongong MoU is waiting for your signature.
            </p>
            <PortfolioVisual />
            <p style={{ fontSize: 16, lineHeight: "26px", color: C.ink }}>
              I&apos;d sign the MoU this week; their registrar is waiting. For the ICT company, ask for a recovery plan before the board meets, as you usually do.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <SourceChip>UOW registrar reply</SourceChip>
              <SourceChip>48 weekly reports</SourceChip>
              <SourceChip tone="amber">Inferred · your usual approach</SourceChip>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 16, lineHeight: "26px", color: C.ink }}>{text}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <SourceChip tone="amber">Inferred · decision pattern</SourceChip>
            </div>
          </>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: C.faint }}>
          <button aria-label="Copy answer" onClick={() => { navigator.clipboard.writeText(text ?? "38 concerns are on track. Two need you.").then(() => notify("Answer copied")).catch(() => notify("Clipboard is unavailable")); }}><Copy size={14}/></button>
          <button aria-label="Helpful answer" onClick={() => { audit("Marked answer helpful", "Chat"); notify("Feedback saved"); }}><ThumbsUp size={14}/></button>
          <Link aria-label="Correct answer" href="/memory/corrections"><ThumbsDown size={14}/></Link>
          <button onClick={onToggle} style={{ color: open ? C.ink : C.pine, fontSize: 13, fontWeight: 600 }}>{open ? "Hide reasoning" : "Show reasoning"}</button>
        </div>
      </div>
    </motion.div>
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
  const thinking = false;
  const [reasoning, setReasoning] = useState<number | null>(null);
  const [threads, setThreads] = useDemo("chat-threads", () => initialQ ? {...seedThreads, Today:[short(initialQ),...seedThreads.Today]} : seedThreads);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const removeThread = () => {
    if (!toDelete) return;
    setThreads(t => Object.fromEntries(Object.entries(t).map(([g,xs])=>[g,xs.filter(x=>x!==toDelete)])));
    writeDemo("chat:"+toDelete, []);
    if(active===toDelete) setActive("");
    audit("Deleted demo conversation", "Chat"); setToDelete(null);
  };
  const end = useRef<HTMLDivElement>(null);
  const send = (q = input) => {
    const t=q.trim(); if(!t) return;
    if(prefs.paused || prefs.retired || !prefs.advise) return notify("Your twin is paused or advice is disabled. Update Boundaries in Settings.");
    const next:Msg[]=[...msgs,{role:"you",text:t},{role:"twin",text:answerDemo(t)}];
    if(!active){const title=short(t)+" · "+Date.now().toString().slice(-4); writeDemo("chat:"+title,next);setThreads(xs=>({...xs,Today:[title,...(xs.Today??[])]}));setActive(title);} else setMsgs(next);
    setInput(""); audit("Asked twin: "+t.slice(0,80),"Chat");
  };
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, thinking]);

  return (
    <div className="ask-screen" style={{ display: "flex", gap: 16, height: "100dvh", padding: "16px 16px 16px 8px" }}>
      {/* History */}
      <div className="ask-history" style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4, paddingTop: 0 }}>
        <button
          onClick={() => { writeDemo("chat:", []); setActive(""); setReasoning(null); }}
          className="active:scale-[0.98]"
          style={{ display: "flex", alignItems: "center", gap: 10, height: 40, padding: "0 14px", background: "#fff", borderRadius: 4, boxShadow: "#0000000D 0px 0px 0px 0.5px, #0000000A 0px 1px 2px", fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 20 }}
        >
          <Plus size={15} strokeWidth={1.8} /> New chat
        </button>
        {Object.entries(threads).map(([g, items]) => (
          <div key={g} style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
            <Eyebrow style={{ padding: "0 12px 8px" }}>{g}</Eyebrow>
            <AnimatePresence initial={false}>
              {items.map((t) => (
                <motion.div
                  key={t}
                  layout
                  exit={{ opacity: 0, height: 0, x: -12 }}
                  transition={{ duration: 0.3, ease }}
                  className="group relative"
                >
                  <button
                    onClick={() => { setActive(t); setReasoning(null); }}
                    className="w-full text-left transition-colors hover:bg-white/70"
                    style={{ padding: "9px 36px 9px 12px", borderRadius: 4, fontSize: 14, color: active === t ? C.pine : C.ink, background: active === t ? C.wash : "transparent", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {t}
                  </button>
                  <button
                    onClick={() => setToDelete(t)}
                    aria-label={`Delete ${t}`}
                    className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-[4px] text-[#6B6873] opacity-0 transition hover:bg-[#F8E6E4] hover:text-[#C2413A] focus:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 size={14} strokeWidth={1.7} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="ask-conversation" style={{ flex: 1, background: "#fff", borderRadius: 4, boxShadow: "#0000000D 0px 0px 0px 0.5px, #0000000A 0px 1px 2px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="ask-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <span style={{ fontSize: 14, color: C.body }}>{active || "New chat"}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, background: C.ink, color: "#fff", borderRadius: 4, padding: "5px 10px", fontSize: 12 }}>
            <Dot color={C.lime} size={6} /> AI twin · demo of {profile.name}
          </span>
        </div>

        <div className="ask-mobile-history"><select aria-label="Conversation" value={active} onChange={e=>{setActive(e.target.value);setReasoning(null);}}><option value="">New chat</option>{Object.values(threads).flat().map(t=><option key={t}>{t}</option>)}</select><button onClick={()=>{writeDemo("chat:",[]);setActive("");}}>New chat</button></div>
        <div data-lenis-prevent style={{ flex: 1, overflowY: "auto",minHeight:0 }}>
          <div className="ask-messages" style={{ maxWidth: 720, margin: "0 auto", padding: "24px 0 40px", display: "flex", flexDirection: "column", gap: 28 }}>
            {msgs.length === 0 && (
              <div style={{ textAlign: "center", paddingTop: 120 }}>
                <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.03em", color: C.ink }}>What would you like to think through?</div>
                <div style={{ marginTop: 8, color: C.slate, fontSize: 15 }}>Answers use only sources you&apos;ve shared.</div>
              </div>
            )}
            {msgs.map((m, i) =>
              m.role === "you" ? (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ background: "#F1F1EE", borderRadius: 4, padding: "12px 16px", fontSize: 15, lineHeight: "22px", color: C.ink, maxWidth: "75%" }}>{m.text}</div>
                </motion.div>
              ) : (
                <TwinReply key={i} rich={m.rich} text={m.text} open={reasoning === i} onToggle={() => setReasoning((r) => (r === i ? null : i))} />
              ),
            )}
            <AnimatePresence>
              {thinking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <Avatar />
                  <span style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map((d) => (
                      <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2 }} style={{ width: 6, height: 6, borderRadius: 9, background: C.pine }} />
                    ))}
                  </span>
                  <span style={{ color: C.slate, fontSize: 13 }}>Checking your memories…</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={end} />
          </div>
        </div>

        <div className="ask-composer" style={{ maxWidth: 720, width: "100%", margin: "0 auto", paddingBottom: 18 }}>
          <div className="focus-within:shadow-[0_0_0_2px_#D4F26A]" style={{ border: "1px solid #E4E3DF", borderRadius: 4, padding: "14px 14px 12px 16px", display: "flex", flexDirection: "column", gap: 12, transition: "box-shadow .2s" }}>
            <textarea
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask your twin anything…"
              className="placeholder:text-[#A3A1A8]"
              style={{ resize: "none", outline: "none", fontSize: 15, color: C.ink, background: "transparent" }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link aria-label="Attach knowledge" href="/knowledge/add"><Paperclip size={16} color={C.slate}/></Link>
              <span style={{ background: "#F1F1EE", borderRadius: 4, padding: "4px 10px", fontSize: 12, color: C.body }}>Use my sources</span>
              <div style={{ flex: 1 }} />
              <Link aria-label="Talk to twin" href="/talk"><Mic size={16} color={C.slate}/></Link>
              <button onClick={() => send()} aria-label="Send" className="active:scale-95" style={{ width: 32, height: 32, borderRadius: 4, background: input.trim() ? C.ink : "#C9C8C4", color: "#fff", display: "grid", placeItems: "center", transition: "background .2s" }}>
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: C.slate, marginTop: 10 }}>Answers use only sources you&apos;ve shared. Labels show what&apos;s verified, inferred or unknown.</div>
        </div>
      </div>
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
      className="ask-reasoning"
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
