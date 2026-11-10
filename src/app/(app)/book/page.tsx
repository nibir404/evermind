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
} from "lucide-react";
import { chapterThree, chapters } from "@/lib/seed";
import { ease } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

export default function Book() {
  const [editing, setEditing] = useState(false);
  const [chapter,setChapter] = useDemo("book-chapter",3);
  const [titles,setTitles] = useDemo("book-titles",chapters);
  const ch = {...chapterThree, title:titles.find(c=>c.n===chapter)?.title??chapterThree.title, kicker:`Chapter ${chapter}`};
  const [paras,setParas] = useDemo<string[]>("book-paragraphs:"+chapter,()=>chapter===3?chapterThree.paragraphs:[`This chapter explores ${ch.title.toLowerCase()} through the experiences and values recorded in the seeded source library.`,"Add a memory or write a paragraph to develop this chapter."]);
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

  const markEdited = () => {
    setSaved(true);
  };

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
            {paras.map((p, i) => (
              <div key={i} className="group relative">
                {editing && (
                  <GripVertical size={16} className="absolute -left-8 top-2 text-[#C7C7CC] opacity-0 transition group-hover:opacity-100" />
                )}
                                <p
                  contentEditable={editing}
                  suppressContentEditableWarning
                  onBlur={e=>{const text=e.currentTarget.textContent??"";setParas(xs=>xs.map((x,j)=>j===i?text:x));markEdited();}}
                  className={`mb-7 font-serif text-[21px] leading-[1.7] outline-none transition-colors ${
                    !editing && i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[68px] first-letter:leading-[0.9] first-letter:text-pine" : ""
                  } ${editing ? "-mx-2 rounded-[4px] px-2 hover:bg-white focus:bg-white focus:shadow-soft" : ""}`}
                >
                  {p}
                </p>
              </div>
            ))}

            {!editing && (
              <blockquote className="my-12">
                <p className="font-serif text-[30px] italic leading-snug text-pine">“{ch.quote}”</p>
                <footer className="mt-3 text-[11px] uppercase tracking-[0.08em] text-mute">{ch.quoteSource}</footer>
              </blockquote>
            )}

            <p className="mb-7 font-serif text-[21px] leading-[1.7]">{ch.closing}</p>

            {editing && <SlashLine onInsert={text=>{setParas(xs=>[...xs,text]);markEdited();}}/>}
            {editing && <FormatBar />}

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
                        setParas((ps) => ps.map((p, i) => (i === 1 ? p.replace(/It is not doubt\..*?least,/, "The silence is not doubt — it is a seat he saves for the quietest voice,") : p)));
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

function FormatBar() {
  const items = [Bold, Italic, Quote, Link2];
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onSel = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return setPos(null);
      const node = sel.anchorNode?.parentElement;
      if (!node?.closest("[contenteditable=true]")) return setPos(null);
      const r = sel.getRangeAt(0).getBoundingClientRect();
      if (!r.width) return setPos(null);
      setPos({ x: r.left + r.width / 2, y: r.top });
    };
    document.addEventListener("selectionchange", onSel);
    window.addEventListener("scroll", onSel, true);
    return () => {
      document.removeEventListener("selectionchange", onSel);
      window.removeEventListener("scroll", onSel, true);
    };
  }, []);
  const exec = (index: number) => {const selected=window.getSelection()?.toString()??"";let text=index===0?`**${selected}**`:index===1?`_${selected}_`:`> ${selected}`;if(index===3){const url=window.prompt("Source URL (https://)");if(!url)return;if(!/^https?:\/\//.test(url))return notify("Enter an http or https URL");text=`[${selected}](${url})`;}document.execCommand("insertText",false,text);};
  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.18, ease }}
          onMouseDown={(e) => e.preventDefault()}
          style={{ position: "fixed", left: pos.x, top: pos.y - 52, translateX: "-50%" }}
          className="z-50 flex items-center gap-0.5 rounded-[4px] bg-ink p-1 text-white shadow-lift"
        >
          {items.map((I, i) => (
            <button key={i} aria-label={["Bold","Italic","Quote","Link"][i]} onClick={() => exec(i)} className="grid size-8 place-items-center rounded-[4px] hover:bg-white/10">
              <I size={15} strokeWidth={2} />
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-white/20" />
          <button onClick={()=>{document.execCommand("insertText",false,"He gives the quietest person room to speak before deciding.");notify("Demo rewrite inserted");}} className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[4px] px-2 text-[13px] text-lime hover:bg-white/10">
            <Sparkles size={14} /> Rewrite with twin
          </button>
          <button onClick={()=>{const passage=window.getSelection()?.toString();const note=window.prompt("Comment on this passage");if(note){audit(`Book comment: ${note} — ${passage}`,"Book");notify("Comment saved in audit notes");}}} className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[4px] px-2 text-[13px] hover:bg-white/10">
            <MessageSquare size={14} /> Comment
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SlashLine({onInsert}:{onInsert:(text:string)=>void}) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const items = [
    { icon: Quote, label: "Pull quote from a source" },
    { icon: ImageIcon, label: "Memory note" },
    { icon: Sparkles, label: "Ask twin to write a paragraph" },
    { icon: Heading, label: "Heading" },
  ];
  return (
    <div className="relative mt-2">
      <p
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Type / for commands"
        onInput={(e) => {
          const t = e.currentTarget.textContent ?? "";
          setText(t);
          setOpen(t.startsWith("/"));
        }}
        onKeyDown={(e) => {if(e.key === "Escape")setOpen(false);if(e.key==="Enter"&&!e.shiftKey&&!text.startsWith("/")){e.preventDefault();if(text.trim())onInsert(text.trim());e.currentTarget.textContent="";setText("");}}}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="font-serif text-[21px] leading-[1.7] outline-none empty:before:text-mute empty:before:content-[attr(data-placeholder)]"
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease }}
            className="surface absolute left-0 top-full z-20 mt-1 w-[300px] p-1.5 shadow-lift"
          >
            <p className="eyebrow px-2.5 py-2">Insert</p>
            {items
              .filter((x) => x.label.toLowerCase().includes(text.slice(1).toLowerCase()))
              .map(({ icon: I, label }, i) => (
                <button onMouseDown={e=>e.preventDefault()} onClick={()=>{onInsert(label.startsWith("Pull")?chapterThree.quote:label.startsWith("Ask")?"He builds institutions that outlast their founders, keeping students at the centre of every decision.":label.startsWith("Memory")?"Memory: Daffodil campus, Ashulia. Add a source in the knowledge library.":"New section");setOpen(false);}} key={label} className={`flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left text-[14px] ${i === 0 ? "bg-canvas" : "hover:bg-canvas"}`}>
                  <I size={16} strokeWidth={1.6} className={label.startsWith("Ask") ? "text-pine" : "text-slate"} /> {label}
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
