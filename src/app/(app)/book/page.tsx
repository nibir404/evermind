"use client";
import { useDemo, audit, notify } from "@/lib/demo";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Bold,
  Check,
  GripVertical,
  Image as ImageIcon,
  Italic,
  Link2,
  MessageSquare,
  Pencil,
  Quote,
  Sparkles,
  Heading,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
} from "lucide-react";
import { chapterThree, chapters } from "@/lib/seed";
import { ease } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

export default function Book() {
  const [editing, setEditing] = useState(false);
  const [chapter,setChapter] = useDemo("book-chapter",3);
  const [titles,setTitles] = useDemo("book-titles",chapters);
  const ch = {...chapterThree, title:titles.find(c=>c.n===chapter)?.title??chapterThree.title, kicker:`Chapter ${chapter}`};
  const [legacyParas] = useDemo<string[]>("book-paragraphs:"+chapter,()=>chapter===3?chapterThree.paragraphs:[`This chapter explores ${ch.title.toLowerCase()} through the experiences and values recorded in the seeded source library.`,"Add a memory or write a paragraph to develop this chapter."]);
  const [blocks,setBlocks] = useDemo<Block[]>("book-blocks:"+chapter,()=>legacyParas.map((t,i)=>({id:`b${chapter}-${i}`,type:"p",html:escapeHtml(t)})));
  const [comments,setComments] = useDemo<BookComment[]>("book-comments:"+chapter,[]);
  const [dragId,setDragId] = useState<string|null>(null);
  const [overId,setOverId] = useState<string|null>(null);
  const [menuFor,setMenuFor] = useState<string|null>(null);
  const [approved,setApproved] = useDemo<number[]>("book-approved",[1,2]);
  const [suggestion, setSuggestion] = useState(true);
  const [saved, setSaved] = useState(true);
  const plate = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plate.current) return;
    const tween = gsap.fromTo(
      plate.current.querySelector("[data-parallax]"),
      { yPercent: -8, scale: 1.08 },
      { yPercent: 8, scale: 1, ease: "none", scrollTrigger: { trigger: plate.current, start: "top bottom", end: "bottom top", scrub: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [editing]);

  const saveTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const markEdited = () => {
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(true), 600);
  };
  const updateBlock = (id:string, patch:Partial<Block>) => { setBlocks(xs=>xs.map(b=>b.id===id?{...b,...patch}:b)); markEdited(); };
  const insertAfter = (id:string|null, block:Omit<Block,"id">) => { const nb={...block,id:uid()}; setBlocks(xs=>{ if(!id) return [...xs,nb]; const i=xs.findIndex(b=>b.id===id); return [...xs.slice(0,i+1),nb,...xs.slice(i+1)]; }); markEdited(); return nb.id; };
  const removeBlock = (id:string) => { const removed=blocks.find(b=>b.id===id); setBlocks(xs=>xs.filter(b=>b.id!==id)); markEdited(); if(removed) notifyUndo("Block deleted", ()=>setBlocks(xs=>{ const i=blocks.findIndex(b=>b.id===id); const copy=[...xs]; copy.splice(i,0,removed); return copy; })); };
  const moveBlock = (id:string, to:number) => { setBlocks(xs=>{ const from=xs.findIndex(b=>b.id===id); if(from<0) return xs; const copy=[...xs]; const [b]=copy.splice(from,1); copy.splice(Math.max(0,Math.min(copy.length,to)),0,b); return copy; }); markEdited(); };
  useEffect(() => {
    const fn = (e: Event) => { const { id, type } = (e as CustomEvent<{ id: string; type: BlockType }>).detail; updateBlock(id, { type }); };
    window.addEventListener("evermind:block-type", fn);
    return () => window.removeEventListener("evermind:block-type", fn);
  });
  const dropOn = (targetId:string) => { if(!dragId||dragId===targetId) return; moveBlock(dragId, blocks.findIndex(b=>b.id===targetId)); setDragId(null); setOverId(null); audit("Reordered a paragraph","Book"); };

  return (
    <div className="book-screen min-h-dvh bg-[#FBFBFA]">
      {/* Reading bar — no progress line */}
      <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between gap-4 px-5 md:px-8">
        <div className="flex items-center gap-4">
          <span className="truncate font-serif text-[18px]">The Book of Dr. Sabur Khan</span>
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.span key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[13px] text-mute">
                <span className={`size-2 rounded-full ${saved ? "bg-success" : "bg-warning"}`} />
                {saved ? "Saved" : "Saving…"}
              </motion.span>
            ) : (
              <motion.span key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[13px] text-mute">
                Chapter {chapter} of {titles.length} · Demo biography
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing((e) => !e)}
            className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-white px-3 text-[13px] shadow-soft transition active:scale-95"
          >
            {editing ? <Check size={15} strokeWidth={1.8} /> : <Pencil size={14} strokeWidth={1.8} />}
            {editing ? "Done" : "Edit"}
          </button>
          {!editing && <button onClick={()=>{setApproved(xs=>xs.includes(chapter)?xs.filter(x=>x!==chapter):[...xs,chapter]);audit(`Updated approval of chapter ${chapter}`,"Book");}} className="inline-flex h-9 items-center rounded-[4px] bg-ink px-4 text-[13px] font-semibold text-white">{approved.includes(chapter)?"Approved ✓":"Approve chapter"}</button>}
        </div>
      </header>

      <div className="book-mobile-chapters"><label>Chapter <select value={chapter} onChange={e=>setChapter(Number(e.target.value))}>{titles.map(c=><option key={c.n} value={c.n}>{c.n} · {c.title}</option>)}</select></label><button onClick={()=>{const n=titles.length+1;setTitles(xs=>[...xs,{n,title:"Untitled chapter",status:"Draft"}]);setChapter(n);}}>+ New chapter</button></div>
      <div className="flex">
        {/* Chapters — Notion-like */}
        <AnimatePresence>
          {editing && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="sticky top-16 hidden h-[calc(100dvh-64px)] shrink-0 overflow-hidden border-r border-line lg:block"
            >
              <div className="w-[260px] p-4">
                {titles.map((c) => (
                  <button onClick={()=>setChapter(c.n)} key={c.n} className={`flex items-center justify-between rounded-[4px] px-3 py-2 text-[14px] ${c.n === chapter ? "bg-pine-wash font-semibold text-pine" : "text-slate hover:bg-white"}`}>
                    <span className="truncate">{c.n} · {c.title}</span>
                    {approved.includes(c.n) && <Check size={13} className="text-success" />}
                  </button>
                ))}
                <button onClick={()=>{const n=titles.length+1;setTitles(xs=>[...xs,{n,title:"Untitled chapter",status:"Draft"}]);setChapter(n);}} className="mt-2 px-3 text-[14px] text-mute hover:text-ink">+ New chapter</button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <article className="mx-auto w-full min-w-0 max-w-[1040px] px-5 pb-40 pt-12 md:px-8 md:pt-20">
          <div className="mx-auto max-w-[680px]">
            <p className="mb-4 text-[12px] uppercase tracking-[0.12em] text-pine">{ch.kicker}</p>
            <h1
              contentEditable={editing}
              suppressContentEditableWarning
              onBlur={e=>{const title=e.currentTarget.textContent?.trim()||ch.title;setTitles(xs=>xs.map(x=>x.n===chapter?{...x,title}:x));markEdited();}}
              className="mb-6 font-serif text-[40px] leading-[1.05] md:text-[64px] tracking-[-0.02em] outline-none"
            >
              {ch.title}
            </h1>
            <p className="mb-8 font-serif text-[22px] italic leading-relaxed text-slate">{ch.dek}</p>
            <div className="mb-14 flex items-center gap-3 text-[13px] text-mute">
              <span className="size-11 shrink-0 rounded-[4px]" style={{ backgroundColor: "#1F5A47", backgroundImage: "url(/twin/thinking.png)", backgroundSize: "260%", backgroundPosition: "50% 8%" }} />
              <span>
                {approved.includes(chapter)?"Approved chapter":"Draft · awaiting your approval"}
                <br />
                Drawn from 4 interviews, 14 board minutes and his 2025 book
              </span>
            </div>
          </div>

          {!editing && (
            <figure ref={plate} className="mb-16 overflow-hidden rounded-[4px]">
              <div className="relative h-[420px] overflow-hidden rounded-[4px]" style={{ background: "radial-gradient(ellipse 50% 70% at 50% 40%, #1F5A47 0%, #0E2E25 100%)" }}>
                <div data-parallax className="absolute inset-0" style={{ backgroundImage: "url(/twin/thinking.png)", backgroundSize: "auto 150%", backgroundPosition: "50% 6%", backgroundRepeat: "no-repeat" }} />
              </div>
              <figcaption className="mt-3 text-[12px] text-mute">Daffodil campus, Ashulia. He keeps the agenda folded in his jacket until the next morning.</figcaption>
            </figure>
          )}

          <div className="relative mx-auto max-w-[680px]">
            {blocks.map((b, i) => (
              <div
                key={b.id}
                className={`group relative ${overId===b.id && dragId!==b.id ? "before:absolute before:-top-1 before:left-0 before:right-0 before:h-0.5 before:rounded before:bg-pine" : ""} ${dragId===b.id ? "opacity-40" : ""}`}
                onDragOver={editing ? (e) => { e.preventDefault(); setOverId(b.id); } : undefined}
                onDrop={editing ? (e) => { e.preventDefault(); dropOn(b.id); } : undefined}
              >
                {editing && (
                  <div className="absolute -left-10 top-1.5 flex items-center opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                    <button
                      draggable
                      onDragStart={(e) => { setDragId(b.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", b.id); }}
                      onDragEnd={() => { setDragId(null); setOverId(null); }}
                      onClick={() => setMenuFor(menuFor === b.id ? null : b.id)}
                      onKeyDown={(e) => { if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); moveBlock(b.id, i - 1); } if (e.altKey && e.key === "ArrowDown") { e.preventDefault(); moveBlock(b.id, i + 1); } }}
                      aria-label="Drag to reorder, or click for block options. Alt+Arrow keys move the block."
                      title="Drag to move · click for options"
                      className="grid h-7 w-6 cursor-grab place-items-center rounded-[4px] text-[#8A8792] hover:bg-[#F1F1EE] active:cursor-grabbing"
                    >
                      <GripVertical size={16} />
                    </button>
                  </div>
                )}
                {menuFor === b.id && editing && (
                  <BlockMenu
                    type={b.type}
                    onClose={() => setMenuFor(null)}
                    onType={(type) => { updateBlock(b.id, { type }); setMenuFor(null); }}
                    onDuplicate={() => { insertAfter(b.id, { type: b.type, html: b.html }); setMenuFor(null); }}
                    onUp={() => { moveBlock(b.id, i - 1); setMenuFor(null); }}
                    onDown={() => { moveBlock(b.id, i + 1); setMenuFor(null); }}
                    onDelete={() => { removeBlock(b.id); setMenuFor(null); }}
                  />
                )}
                <RichBlock
                  block={b}
                  first={i === 0}
                  editing={editing}
                  onChange={(html) => updateBlock(b.id, { html })}
                  onEnter={() => insertAfter(b.id, { type: "p", html: "" })}
                  onBackspaceEmpty={() => blocks.length > 1 && removeBlock(b.id)}
                />
                {comments.filter((c) => c.block === b.id).map((c) => (
                  <div key={c.id} className="mb-6 -mt-4 flex items-start gap-2 rounded-[4px] border-l-2 border-[#E0A84F] bg-[#FBF6EC] px-3 py-2 text-[13px] 2xl:absolute 2xl:-right-[300px] 2xl:top-0 2xl:mt-0 2xl:w-[260px]">
                    <MessageSquare size={13} className="mt-0.5 shrink-0 text-[#8A5A12]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[#4A4752]">“{c.quote}”</p>
                      <p className="mt-1 text-ink">{c.note}</p>
                    </div>
                    <button aria-label="Resolve comment" title="Resolve" onClick={() => { setComments((xs) => xs.filter((x) => x.id !== c.id)); audit("Resolved a book comment", "Book"); }} className="shrink-0 text-[#8A5A12] hover:text-ink"><Check size={14} /></button>
                  </div>
                ))}
              </div>
            ))}

            {!editing && (
              <blockquote className="my-12">
                <p className="font-serif text-[30px] italic leading-snug text-pine">“{ch.quote}”</p>
                <footer className="mt-3 text-[11px] uppercase tracking-[0.08em] text-mute">{ch.quoteSource}</footer>
              </blockquote>
            )}

            <p className="mb-7 font-serif text-[21px] leading-[1.7]">{ch.closing}</p>

            {editing && <SlashLine onInsert={(block)=>insertAfter(null, block)}/>}
            {editing && <FormatBar onComment={(blockId, quote, note) => { setComments((xs) => [...xs, { id: uid(), block: blockId, quote, note }]); audit(`Book comment: ${note}`, "Book"); notify("Comment added"); }} />}

            {!editing && (
              <button onClick={()=>{setChapter(chapter<titles.length?chapter+1:1);window.scrollTo({top:0,behavior:"smooth"});}} className="group mt-20 flex w-full items-center justify-between py-6">
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.08em] text-mute">Next · Chapter {chapter<titles.length?chapter+1:1}</span>
                  <span className="font-serif text-[24px]">{titles.find(x=>x.n===(chapter<titles.length?chapter+1:1))?.title}</span>
                </span>
                <ArrowRight className="transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </button>
            )}

            {/* Twin suggestion in the margin */}
            <AnimatePresence>
              {editing && suggestion && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.5, ease }}
                  className="surface relative mb-8 w-full p-4 2xl:absolute 2xl:-right-[320px] 2xl:top-40 2xl:mb-0 2xl:w-[280px]"
                >
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-pine">
                    <Sparkles size={12} /> Twin suggestion
                  </p>
                  <p className="font-serif text-[16px] leading-relaxed">“The silence is not doubt — it is a seat he saves for the quietest voice.”</p>
                  <div className="mt-3 flex gap-4 text-[13px]">
                    <button
                      className="font-semibold text-pine"
                      onClick={() => {
                        setBlocks((bs) => bs.map((b, i) => (i === 1 ? { ...b, html: b.html.replace(/It is not doubt\..*?least,/, "The silence is not doubt — it is a seat he saves for the quietest voice,") } : b)));
                        setSuggestion(false);
                        markEdited();
                      }}
                    >
                      Accept
                    </button>
                    <button className="text-mute" onClick={() => setSuggestion(false)}>
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </article>
      </div>
    </div>
  );
}

/* ---------------- Rich-text blocks ---------------- */
type BlockType = "p" | "h2" | "quote" | "note";
type Block = { id: string; type: BlockType; html: string };
type BookComment = { id: string; block: string; quote: string; note: string };
const uid = () => Math.random().toString(36).slice(2, 10);
const escapeHtml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Keep only the formatting the editor can produce: bold, italic, links, line breaks. */
function sanitize(html: string) {
  if (typeof document === "undefined") return html;
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const allowed = new Set(["B", "STRONG", "I", "EM", "A", "BR"]);
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (!allowed.has(el.tagName)) { walk(el); el.replaceWith(...el.childNodes); return; }
        const href = el.tagName === "A" ? el.getAttribute("href") ?? "" : "";
        [...el.attributes].forEach((a) => el.removeAttribute(a.name));
        if (el.tagName === "A") {
          if (/^https?:\/\//i.test(href)) { el.setAttribute("href", href); el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener noreferrer"); }
          else { el.replaceWith(...el.childNodes); return; }
        }
        walk(el);
      } else if (child.nodeType !== Node.TEXT_NODE) child.remove();
    });
  };
  walk(tpl.content);
  return tpl.innerHTML;
}

const blockClass: Record<BlockType, string> = {
  p: "mb-7 font-serif text-[21px] leading-[1.7]",
  h2: "mb-5 mt-12 font-serif text-[32px] leading-tight tracking-[-0.01em]",
  quote: "my-10 border-l-2 border-pine pl-6 font-serif text-[26px] italic leading-snug text-pine",
  note: "mb-7 rounded-[4px] bg-pine-wash px-4 py-3 text-[15px] leading-relaxed text-pine",
};

function RichBlock({ block, first, editing, onChange, onEnter, onBackspaceEmpty }: { block: Block; first: boolean; editing: boolean; onChange: (html: string) => void; onEnter: () => void; onBackspaceEmpty: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  // Only write HTML into the DOM when it changes from outside, so typing never jumps the caret.
  useEffect(() => { if (ref.current && ref.current.innerHTML !== block.html) ref.current.innerHTML = sanitize(block.html); }, [block.html, editing]);
  const dropCap = !editing && first && block.type === "p" ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[68px] first-letter:leading-[0.9] first-letter:text-pine" : "";
  return (
    <div
      ref={ref}
      data-block={block.id}
      role={editing ? "textbox" : undefined}
      aria-multiline={editing || undefined}
      aria-label={editing ? `${block.type === "h2" ? "Heading" : block.type === "quote" ? "Quote" : block.type === "note" ? "Memory note" : "Paragraph"}` : undefined}
      contentEditable={editing}
      suppressContentEditableWarning
      data-placeholder={editing ? (block.type === "h2" ? "Heading" : "Write, or type / for commands") : undefined}
      onBlur={(e) => { const html = sanitize(e.currentTarget.innerHTML); if (html !== block.html) onChange(html); }}
      onKeyDown={(e) => {
        if (!editing) return;
        const mod = e.metaKey || e.ctrlKey;
        if (mod && e.key.toLowerCase() === "b") { e.preventDefault(); document.execCommand("bold"); }
        if (mod && e.key.toLowerCase() === "i") { e.preventDefault(); document.execCommand("italic"); }
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onChange(sanitize(e.currentTarget.innerHTML)); onEnter(); setTimeout(() => focusBlockAfter(block.id), 0); }
        if (e.key === "Backspace" && !e.currentTarget.textContent) { e.preventDefault(); onBackspaceEmpty(); }
      }}
      className={`${blockClass[block.type]} outline-none transition-colors ${dropCap} ${editing ? "-mx-2 rounded-[4px] px-2 hover:bg-white focus:bg-white focus:shadow-soft empty:before:text-[#8A8792] empty:before:content-[attr(data-placeholder)]" : ""} [&_a]:text-pine [&_a]:underline [&_a]:underline-offset-2`}
    />
  );
}
function focusBlockAfter(id: string) {
  const els = [...document.querySelectorAll<HTMLElement>("[data-block]")];
  const next = els[els.findIndex((el) => el.dataset.block === id) + 1];
  next?.focus();
}

function BlockMenu({ type, onClose, onType, onDuplicate, onUp, onDown, onDelete }: { type: BlockType; onClose: () => void; onType: (t: BlockType) => void; onDuplicate: () => void; onUp: () => void; onDown: () => void; onDelete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.focus();
    const off = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, [onClose]);
  const item = "flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] hover:bg-canvas focus:bg-canvas outline-none";
  return (
    <div ref={ref} role="menu" className="surface absolute -left-10 top-9 z-30 w-[220px] p-1.5 shadow-lift">
      <p className="eyebrow px-2.5 py-1.5">Turn into</p>
      {(["p", "h2", "quote", "note"] as BlockType[]).map((t) => (
        <button key={t} role="menuitem" className={item} onClick={() => onType(t)}>
          {t === "p" ? <Pencil size={15} /> : t === "h2" ? <Heading size={15} /> : t === "quote" ? <Quote size={15} /> : <ImageIcon size={15} />}
          <span className="flex-1">{{ p: "Paragraph", h2: "Heading", quote: "Quote", note: "Memory note" }[t]}</span>
          {type === t && <Check size={14} className="text-pine" />}
        </button>
      ))}
      <div className="my-1 h-px bg-[#EDECE8]" />
      <button role="menuitem" className={item} onClick={onUp}><ArrowUp size={15} />Move up<kbd className="ml-auto text-[11px] text-mute">⌥↑</kbd></button>
      <button role="menuitem" className={item} onClick={onDown}><ArrowDown size={15} />Move down<kbd className="ml-auto text-[11px] text-mute">⌥↓</kbd></button>
      <button role="menuitem" className={item} onClick={onDuplicate}><Copy size={15} />Duplicate</button>
      <button role="menuitem" className={`${item} text-danger`} onClick={onDelete}><Trash2 size={15} />Delete</button>
    </div>
  );
}

/** Rewrites a passage in the founder's voice. Deterministic for the demo, but always about the selected text. */
function twinRewrite(text: string) {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return t;
  const sentences = t.split(/(?<=[.!?])\s+/);
  const tightened = sentences.map((s) => s
    .replace(/\b(rarely|usually|often|quietly)\s+/gi, "")
    .replace(/\bin the meeting itself\b/gi, "in the room")
    .replace(/\bthan anyone expects\b/gi, "than most would")
    .replace(/\s{2,}/g, " ")).join(" ");
  return tightened === t ? `${t.replace(/[.!?]$/, "")}, and he says so plainly.` : tightened;
}

function notifyUndo(message: string, undo: () => void) {
  window.dispatchEvent(new CustomEvent("evermind:undo", { detail: { message, undo } }));
  notify(`${message}. Press ⌘Z or use Undo from the block menu to restore.`);
  lastUndo = undo;
}
let lastUndo: (() => void) | null = null;

function ToolButton({ label, shortcut, Icon, on = false, run }: { label: string; shortcut?: string; Icon: typeof Bold; on?: boolean; run: () => void }) {
  return <button aria-label={label} title={shortcut ? `${label} (${shortcut})` : label} aria-pressed={on} onClick={run} className={`grid size-8 place-items-center rounded-[4px] ${on ? "bg-white/20" : "hover:bg-white/10"}`}><Icon size={15} strokeWidth={2} /></button>;
}

function FormatBar({ onComment }: { onComment: (blockId: string, quote: string, note: string) => void }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [mode, setMode] = useState<"tools" | "link" | "comment">("tools");
  const [value, setValue] = useState("");
  const [active, setActive] = useState({ bold: false, italic: false });
  const range = useRef<Range | null>(null);
  const blockId = useRef<string>("");
  useEffect(() => {
    const onSel = () => {
      if (mode !== "tools") return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return setPos(null);
      const host = (sel.anchorNode as HTMLElement | null)?.parentElement?.closest<HTMLElement>("[data-block]");
      if (!host || host.contentEditable !== "true") return setPos(null);
      const r = sel.getRangeAt(0).getBoundingClientRect();
      if (!r.width) return setPos(null);
      range.current = sel.getRangeAt(0).cloneRange();
      blockId.current = host.dataset.block ?? "";
      setActive({ bold: document.queryCommandState("bold"), italic: document.queryCommandState("italic") });
      setPos({ x: r.left + r.width / 2, y: r.top });
    };
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && !e.shiftKey && lastUndo && !(document.activeElement as HTMLElement)?.isContentEditable) { e.preventDefault(); lastUndo(); lastUndo = null; notify("Restored"); } };
    document.addEventListener("selectionchange", onSel);
    window.addEventListener("scroll", onSel, true);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("selectionchange", onSel); window.removeEventListener("scroll", onSel, true); window.removeEventListener("keydown", onKey); };
  }, [mode]);
  const restore = () => { const sel = window.getSelection(); if (range.current && sel) { sel.removeAllRanges(); sel.addRange(range.current); } };
  const commit = () => { const el = document.querySelector<HTMLElement>(`[data-block="${blockId.current}"]`); el?.focus(); el?.blur(); el?.focus(); };
  const close = () => { setMode("tools"); setValue(""); setPos(null); };
  const toggleBold = () => { document.execCommand("bold"); setActive((a) => ({ ...a, bold: !a.bold })); commit(); };
  const toggleItalic = () => { document.execCommand("italic"); setActive((a) => ({ ...a, italic: !a.italic })); commit(); };
  const makeQuote = () => { window.dispatchEvent(new CustomEvent("evermind:block-type", { detail: { id: blockId.current, type: "quote" } })); close(); };
  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.18, ease }}
          onMouseDown={(e) => { if (mode === "tools") e.preventDefault(); }}
          style={{ position: "fixed", left: pos.x, top: pos.y - 52, translateX: "-50%" }}
          className="z-50 flex items-center gap-0.5 rounded-[6px] bg-ink p-1 text-white shadow-lift"
          role="toolbar"
          aria-label="Format selection"
        >
          {mode === "tools" ? (
            <>
              <ToolButton label="Bold" shortcut="⌘B" Icon={Bold} on={active.bold} run={toggleBold} />
              <ToolButton label="Italic" shortcut="⌘I" Icon={Italic} on={active.italic} run={toggleItalic} />
              <ToolButton label="Turn into quote" Icon={Quote} run={makeQuote} />
              <ToolButton label="Add link" Icon={Link2} run={() => setMode("link")} />
              <span className="mx-1 h-4 w-px bg-white/20" />
              <button onClick={() => { const text = window.getSelection()?.toString() ?? ""; const next = twinRewrite(text); if (!next || next === text) return notify("Nothing to rewrite"); document.execCommand("insertText", false, next); commit(); notify("Rewritten in your voice. Press ⌘Z to undo."); audit("Twin rewrote a passage", "Book"); }} className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[4px] px-2 text-[13px] text-lime hover:bg-white/10">
                <Sparkles size={14} /> Rewrite with twin
              </button>
              <button onClick={() => setMode("comment")} className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[4px] px-2 text-[13px] hover:bg-white/10">
                <MessageSquare size={14} /> Comment
              </button>
            </>
          ) : (
            <form
              className="flex items-center gap-1 p-0.5"
              onSubmit={(e) => {
                e.preventDefault();
                const v = value.trim();
                if (!v) return close();
                if (mode === "link") {
                  if (!/^https?:\/\//i.test(v)) return notify("Enter a link starting with http:// or https://");
                  restore(); document.execCommand("createLink", false, v); commit();
                } else {
                  onComment(blockId.current, range.current?.toString() ?? "", v);
                }
                close();
              }}
            >
              <input
                autoFocus
                data-bare
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); close(); } }}
                placeholder={mode === "link" ? "https://" : "Add a comment"}
                aria-label={mode === "link" ? "Link address" : "Comment"}
                className="h-8 w-[240px] rounded-[4px] bg-white/10 px-2.5 text-[13px] text-white outline-none placeholder:text-white/50"
              />
              <button type="submit" className="h-8 rounded-[4px] bg-lime px-3 text-[13px] font-semibold text-ink">{mode === "link" ? "Link" : "Add"}</button>
              <button type="button" onClick={close} className="h-8 rounded-[4px] px-2 text-[13px] text-white/70 hover:text-white">Cancel</button>
            </form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SlashLine({ onInsert }: { onInsert: (block: Omit<Block, "id">) => void }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const items: { icon: typeof Quote; label: string; hint: string; make: () => Omit<Block, "id"> }[] = [
    { icon: Heading, label: "Heading", hint: "Section title", make: () => ({ type: "h2", html: "" }) },
    { icon: Quote, label: "Pull quote from a source", hint: "Verified quote", make: () => ({ type: "quote", html: escapeHtml(chapterThree.quote) }) },
    { icon: ImageIcon, label: "Memory note", hint: "Linked memory", make: () => ({ type: "note", html: "Memory: Daffodil campus, Ashulia. He keeps the agenda folded in his jacket until the next morning." }) },
    { icon: Sparkles, label: "Ask twin to write a paragraph", hint: "Drafted from sources", make: () => ({ type: "p", html: "He builds institutions that outlast their founders, keeping students at the centre of every decision." }) },
  ];
  const shown = items.filter((x) => x.label.toLowerCase().includes(text.slice(1).toLowerCase()));
  const choose = (i: number, el: HTMLElement) => { const it = shown[i]; if (!it) return; onInsert(it.make()); el.textContent = ""; setText(""); setOpen(false); setCursor(0); };
  return (
    <div className="relative mt-2">
      <p
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="New paragraph. Type / for commands"
        data-placeholder="Write a new paragraph, or type / for commands"
        onInput={(e) => { const t = e.currentTarget.textContent ?? ""; setText(t); setOpen(t.startsWith("/")); setCursor(0); }}
        onKeyDown={(e) => {
          if (open) {
            if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(shown.length - 1, c + 1)); return; }
            if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); return; }
            if (e.key === "Enter") { e.preventDefault(); choose(cursor, e.currentTarget); return; }
            if (e.key === "Escape") { setOpen(false); return; }
          }
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (text.trim()) onInsert({ type: "p", html: escapeHtml(text.trim()) }); e.currentTarget.textContent = ""; setText(""); }
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="rounded-[4px] font-serif text-[21px] leading-[1.7] outline-none empty:before:text-[#8A8792] empty:before:content-[attr(data-placeholder)]"
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease }}
            role="listbox"
            className="surface absolute left-0 top-full z-20 mt-1 w-[320px] p-1.5 shadow-lift"
          >
            <p className="eyebrow px-2.5 py-2">Insert</p>
            {!shown.length && <p className="px-2.5 py-2 text-[14px] text-mute">No matching command</p>}
            {shown.map(({ icon: I, label, hint }, i) => (
              <button role="option" aria-selected={i === cursor} onMouseEnter={() => setCursor(i)} onMouseDown={(e) => e.preventDefault()} onClick={(e) => choose(i, (e.currentTarget.closest(".relative")?.querySelector("[contenteditable]") as HTMLElement))} key={label} className={`flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] ${i === cursor ? "bg-canvas" : ""}`}>
                <I size={16} strokeWidth={1.6} className={label.startsWith("Ask") ? "text-pine" : "text-slate"} />
                <span className="flex-1">{label}</span>
                <span className="text-[12px] text-mute">{hint}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
