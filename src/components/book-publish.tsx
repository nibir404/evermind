"use client";
// Publish, export and share the whole biography.
// PDF uses the browser's print engine (Save as PDF) with a dedicated print layout.
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Check, Copy, FileDown, FileText, Link2, Mail, Printer, Share2 } from "lucide-react";
import { Modal } from "./demo-ui";
import { audit, download, notify, readDemo, useDemo } from "@/lib/demo";
import { chapterSeeds, chapterThree } from "@/lib/seed";

type Title = { n: number; title: string; status: string };
type Block = { id: string; type: "p" | "h2" | "quote" | "note"; html: string };
export type BookChapter = Title & { dek: string; blocks: Block[]; words: number; minutes: number };

const BOOK_TITLE = "The Book of Dr. Sabur Khan";
const escapeHtml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const toText = (html: string) => html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

/** Everything the book needs for one chapter, from saved edits or the sample text. */
function loadChapter(t: Title): BookChapter {
  const seed = t.n === 3 ? chapterThree.paragraphs : chapterSeeds[t.n]?.paragraphs ?? ["This chapter has not been written yet."];
  const dek = t.n === 3 ? chapterThree.dek : chapterSeeds[t.n]?.dek ?? "";
  let blocks: Block[] = seed.map((p, i) => ({ id: `${t.n}-${i}`, type: "p", html: escapeHtml(p) }));
  if (typeof window !== "undefined") {
    const legacy = readDemo<string[] | null>(`book-paragraphs:${t.n}`, null);
    if (legacy) blocks = legacy.map((p, i) => ({ id: `${t.n}-${i}`, type: "p", html: escapeHtml(p) }));
    blocks = readDemo<Block[]>(`book-blocks:${t.n}`, blocks);
  }
  const words = blocks.reduce((sum, b) => sum + toText(b.html).split(/\s+/).filter(Boolean).length, 0);
  return { ...t, dek, blocks, words, minutes: Math.max(1, Math.round(words / 220)) };
}

/** Chapters with reading time. Re-reads saved edits whenever the demo store changes. */
export function bookChapters(titles: Title[]): BookChapter[] {
  return titles.map(loadChapter);
}

function useChapters(titles: Title[]) {
  // Re-render when any demo key changes, then reload the chapters.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick((t) => t + 1);
    window.addEventListener("evermind:change", fn);
    return () => window.removeEventListener("evermind:change", fn);
  }, []);
  return useMemo(() => (tick >= 0 ? bookChapters(titles) : []), [titles, tick]);
}

/* ---------------- Formats ---------------- */
function asMarkdown(chs: BookChapter[]) {
  const md = (html: string) => html.replace(/<(b|strong)>(.*?)<\/\1>/gi, "**$2**").replace(/<(i|em)>(.*?)<\/\1>/gi, "_$2_").replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  return [`# ${BOOK_TITLE}`, "", ...chs.flatMap((c) => [`## Chapter ${c.n}. ${c.title}`, "", c.dek ? `_${c.dek}_\n` : "", ...c.blocks.map((b) => {
    const t = toText(md(b.html));
    return b.type === "h2" ? `### ${t}\n` : b.type === "quote" ? `> ${t}\n` : b.type === "note" ? `> **Memory:** ${t}\n` : `${t}\n`;
  })])].join("\n");
}
function asHtml(chs: BookChapter[], opts: { cover: boolean; toc: boolean }) {
  const body = chs.map((c) => `<section class="chapter"><p class="kicker">Chapter ${c.n}</p><h1>${escapeHtml(c.title)}</h1>${c.dek ? `<p class="dek">${escapeHtml(c.dek)}</p>` : ""}${c.blocks.map((b) => b.type === "h2" ? `<h2>${b.html}</h2>` : b.type === "quote" ? `<blockquote>${b.html}</blockquote>` : b.type === "note" ? `<aside>${b.html}</aside>` : `<p>${b.html}</p>`).join("")}</section>`).join("");
  const cover = opts.cover ? `<section class="cover"><h1>${BOOK_TITLE}</h1><p>A biography drawn from his book, board minutes and interviews.</p></section>` : "";
  const toc = opts.toc ? `<section class="toc"><h2>Contents</h2><ol>${chs.map((c) => `<li>${escapeHtml(c.title)}</li>`).join("")}</ol></section>` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${BOOK_TITLE}</title><style>body{font-family:Georgia,serif;max-width:680px;margin:48px auto;padding:0 24px;line-height:1.7;color:#111113;font-size:19px}h1{font-size:40px;line-height:1.1;margin:0 0 12px}h2{font-size:26px;margin:36px 0 12px}.kicker{font:12px system-ui;letter-spacing:.12em;text-transform:uppercase;color:#0E5A43}.dek{font-style:italic;color:#4A4752}blockquote{border-left:2px solid #0E5A43;margin:28px 0;padding-left:20px;font-style:italic;color:#0E5A43;font-size:22px}aside{background:#E2F0E8;color:#0E5A43;padding:12px 16px;font:15px/1.6 system-ui}.chapter,.toc{page-break-before:always}.cover{min-height:80vh;display:flex;flex-direction:column;justify-content:center}a{color:#0E5A43}</style></head><body>${cover}${toc}${body}</body></html>`;
}

/* ---------------- Print layout (PDF) ---------------- */
type PrintOpts = { only: "all" | "approved"; cover: boolean; toc: boolean };
export function BookPrint({ titles, approved }: { titles: Title[]; approved: number[] }) {
  const [opts] = useDemo<PrintOpts>("book-print-options", { only: "all", cover: true, toc: true });
  const all = useChapters(titles);
  const chs = opts.only === "approved" ? all.filter((c) => approved.includes(c.n)) : all;
  // Read the date on the client only, so prerendering stays deterministic.
  const today = useSyncExternalStore(() => () => {}, () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), () => "");
  return (
    <div className="book-print" aria-hidden="true">
      {opts.cover && (
        <section className="bp-cover">
          <p className="bp-kicker">A biography</p>
          <h1>{BOOK_TITLE}</h1>
          <p className="bp-dek">Drawn from his 2025 book, fourteen sets of board minutes and four interviews with his twin.</p>
          <p className="bp-meta">EverMind · {today}</p>
        </section>
      )}
      {opts.toc && (
        <section className="bp-toc">
          <h2>Contents</h2>
          <ol>{chs.map((c) => <li key={c.n}><span>{c.title}</span><span>{c.minutes} min</span></li>)}</ol>
        </section>
      )}
      {chs.map((c) => (
        <section key={c.n} className="bp-chapter">
          <p className="bp-kicker">Chapter {c.n}</p>
          <h1>{c.title}</h1>
          {c.dek && <p className="bp-dek">{c.dek}</p>}
          {c.blocks.map((b) => {
            const html = { __html: b.html };
            return b.type === "h2" ? <h2 key={b.id} dangerouslySetInnerHTML={html} /> : b.type === "quote" ? <blockquote key={b.id} dangerouslySetInnerHTML={html} /> : b.type === "note" ? <aside key={b.id} dangerouslySetInnerHTML={html} /> : <p key={b.id} dangerouslySetInnerHTML={html} />;
          })}
        </section>
      ))}
    </div>
  );
}

function Opt({ on, onClick, title, sub }: { on: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onClick} className={`flex flex-1 items-start gap-3 rounded-[4px] border p-3 text-left transition ${on ? "border-pine bg-pine-wash" : "border-[#D9D7D2] hover:border-[#BDBAB4]"}`}>
      <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border ${on ? "border-pine bg-pine" : "border-[#8A8792]"}`}>{on && <span className="size-1.5 rounded-full bg-white" />}</span>
      <span><span className="block text-[14px] font-medium">{title}</span><span className="mt-0.5 block text-[12px] text-[#6B6873]">{sub}</span></span>
    </button>
  );
}
function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-2.5 text-[14px]">
      {label}
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onClick} className="relative h-6 w-10 rounded-full transition" style={{ background: on ? "#0E5A43" : "#8A8792" }}>
        <span className="absolute top-0.5 size-5 rounded-full bg-white transition-all" style={{ left: on ? 18 : 2 }} />
      </button>
    </label>
  );
}

/* ---------------- Publish / export / share sheet ---------------- */
export function BookPublish({ initialTab, titles, approved, onClose }: { initialTab: "publish" | "share"; titles: Title[]; approved: number[]; onClose: () => void }) {
  const [tab, setTab] = useState<"publish" | "export" | "share">(initialTab);
  const [opts, setOpts] = useDemo<PrintOpts>("book-print-options", { only: "all", cover: true, toc: true });
  const [access, setAccess] = useDemo<"private" | "link" | "family">("book-share-access", "private");
  const [copied, setCopied] = useState(false);
  const all = useChapters(titles);
  const chs = opts.only === "approved" ? all.filter((c) => approved.includes(c.n)) : all;
  const words = chs.reduce((s, c) => s + c.words, 0);
  const link = typeof window !== "undefined" ? `${window.location.origin}/book?shared=1` : "/book?shared=1";
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const printPdf = () => {
    if (!chs.length) return notify("No chapters to publish. Approve a chapter or include drafts.");
    audit(`Published biography as PDF (${chs.length} chapters)`, "Book");
    onClose();
    // Let the sheet close before the print dialog opens.
    setTimeout(() => window.print(), 250);
  };
  const exportAs = (kind: "docx" | "md" | "html" | "json") => {
    if (!chs.length) return notify("No chapters to export.");
    const base = "the-book-of-dr-sabur-khan";
    if (kind === "md") download(`${base}.md`, asMarkdown(chs), true);
    if (kind === "html") download(`${base}.html`, asHtml(chs, opts), true);
    if (kind === "json") download(`${base}.json`, { title: BOOK_TITLE, exported: new Date().toISOString(), chapters: chs.map(({ n, title, dek, blocks, words }) => ({ n, title, dek, words, approved: approved.includes(n), blocks })) });
    if (kind === "docx") {
      // Word opens HTML saved as .doc with formatting intact.
      const blob = new Blob(["﻿", asHtml(chs, opts)], { type: "application/msword" });
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${base}.doc`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    audit(`Exported biography as ${kind.toUpperCase()}`, "Book");
    notify(`Exported ${chs.length} chapters`);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); audit("Copied biography link", "Book"); }
    catch { notify("Couldn’t copy. Select the link and copy it manually."); }
  };
  const nativeShare = async () => {
    try { await navigator.share({ title: BOOK_TITLE, text: "A biography drawn from his book, board minutes and interviews.", url: link }); audit("Shared biography", "Book"); }
    catch { /* user cancelled */ }
  };

  return (
    <Modal title="Publish your book" onClose={onClose}>
      <div className="seg mb-5" role="tablist" aria-label="Publish options">
        {(["publish", "export", "share"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{{ publish: "PDF", export: "Export", share: "Share" }[t]}</button>
        ))}
      </div>

      {tab !== "share" && (
        <div className="mb-5 flex flex-col gap-2">
          <p className="text-[13px] font-medium text-[#4A4752]">Include</p>
          <div className="flex gap-2" role="radiogroup" aria-label="Chapters to include">
            <Opt on={opts.only === "all"} onClick={() => setOpts((o) => ({ ...o, only: "all" }))} title="All chapters" sub={`${all.length} chapters, drafts marked`} />
            <Opt on={opts.only === "approved"} onClick={() => setOpts((o) => ({ ...o, only: "approved" }))} title="Approved only" sub={`${all.filter((c) => approved.includes(c.n)).length} chapters ready`} />
          </div>
        </div>
      )}

      {tab === "publish" && (
        <>
          <div className="mb-4 flex gap-4 rounded-[4px] bg-[#F5F5F3] p-4">
            <div className="grid h-[104px] w-[78px] shrink-0 place-items-center rounded-[2px] bg-white p-2 text-center font-serif text-[10px] leading-tight shadow-soft">{BOOK_TITLE}</div>
            <div className="min-w-0 text-[13px] text-[#4A4752]">
              <p className="text-[15px] font-semibold text-ink">{chs.length} chapters · {words.toLocaleString()} words</p>
              <p className="mt-1">About {Math.max(1, Math.round(words / 250))} pages, A4, serif type.</p>
              <ol className="mt-2 list-inside list-decimal">{chs.slice(0, 4).map((c) => <li key={c.n} className="truncate">{c.title}</li>)}{chs.length > 4 && <li className="list-none text-mute">and {chs.length - 4} more</li>}</ol>
            </div>
          </div>
          <Toggle on={opts.cover} onClick={() => setOpts((o) => ({ ...o, cover: !o.cover }))} label="Cover page" />
          <Toggle on={opts.toc} onClick={() => setOpts((o) => ({ ...o, toc: !o.toc }))} label="Table of contents" />
          <p className="mt-3 text-[13px] text-[#6B6873]">Your browser’s print window opens. Choose <b>Save as PDF</b> as the destination.</p>
          <div className="demo-actions" style={{ marginTop: 20 }}>
            <button className="demo-button" onClick={onClose}>Cancel</button>
            <button className="demo-button primary" onClick={printPdf}><Printer size={16} />Download PDF</button>
          </div>
        </>
      )}

      {tab === "export" && (
        <div className="flex flex-col gap-2">
          {([["docx", "Word document", ".doc · keeps headings, quotes and formatting", FileText], ["md", "Markdown", ".md · for editors, Notion or GitHub", FileDown], ["html", "Web page", ".html · a single file you can host", FileDown], ["json", "Data (JSON)", ".json · every block, for backup or import", FileDown]] as const).map(([k, title, sub, Icon]) => (
            <button key={k} onClick={() => exportAs(k)} className="flex items-center gap-3 rounded-[4px] border border-[#D9D7D2] p-3 text-left transition hover:border-[#BDBAB4] hover:bg-[#F5F5F3]">
              <span className="grid size-9 shrink-0 place-items-center rounded-[4px] bg-pine-wash text-pine"><Icon size={17} /></span>
              <span className="min-w-0 flex-1"><span className="block text-[14px] font-medium">{title}</span><span className="block text-[12px] text-[#6B6873]">{sub}</span></span>
              <span className="text-[13px] font-medium text-pine">Download</span>
            </button>
          ))}
        </div>
      )}

      {tab === "share" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-medium text-[#4A4752]">Who can read it</p>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label="Who can read the book">
              <Opt on={access === "private"} onClick={() => { setAccess("private"); audit("Book set to private", "Book"); }} title="Only you" sub="Nobody else can open the link." />
              <Opt on={access === "family"} onClick={() => { setAccess("family"); audit("Book shared with family", "Book"); }} title="Family and beneficiaries" sub="Ayesha Khan and verified beneficiaries, read only." />
              <Opt on={access === "link"} onClick={() => { setAccess("link"); audit("Book shared with anyone with the link", "Book"); }} title="Anyone with the link" sub="Read only. Approved chapters only." />
            </div>
          </div>
          <div className="flex gap-2">
            <label className="demo-search" style={{ flex: 1, minWidth: 0 }}>
              <Link2 size={16} />
              <input data-bare readOnly value={link} aria-label="Share link" onFocus={(e) => e.currentTarget.select()} />
            </label>
            <button className="demo-button primary" onClick={copy} disabled={access === "private"}>{copied ? <><Check size={16} />Copied</> : <><Copy size={16} />Copy link</>}</button>
          </div>
          {access === "private" && <p className="-mt-2 text-[13px] text-[#6B6873]">Choose who can read it to turn on the link.</p>}
          <div className="flex flex-wrap gap-2">
            {canShare && <button className="demo-button" onClick={nativeShare} disabled={access === "private"}><Share2 size={16} />Share…</button>}
            <a className={`demo-button ${access === "private" ? "pointer-events-none opacity-45" : ""}`} aria-disabled={access === "private"} href={`mailto:?subject=${encodeURIComponent(BOOK_TITLE)}&body=${encodeURIComponent(`I’d like to share this biography with you:\n${link}`)}`} onClick={() => audit("Opened email to share biography", "Book")}><Mail size={16} />Email</a>
            <button className="demo-button" onClick={() => setTab("publish")}><Printer size={16} />Send a PDF instead</button>
          </div>
          <p className="text-[12px] text-[#6B6873]">Demo: the link opens this workspace on this device. Sharing settings are recorded in the audit trail.</p>
        </div>
      )}
    </Modal>
  );
}


