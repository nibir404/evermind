"use client";

// 1:1 port of Paper "05.02 · Memories" (4SH-0)
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Badge, C, Page, PageHead, PButton, Sub, Txt, shadow } from "@/components/paper";
import { Confirm } from "@/components/confirm";
import { Reveal, ease } from "@/components/ui";

import { memorySeed as seed } from "@/lib/memories";
import { useDemo } from "@/lib/demo";
const cats = ["All categories", "Governance", "Partnerships", "Students"];

export default function Memories() {
  const [items, setItems] = useDemo("memories",seed);
  const [cat, setCat] = useState(cats[0]);
  const [del, setDel] = useState<string | null>(null);
  const [query,setQuery]=useState("");
  const [status,setStatus]=useState("Any");
  const [newest,setNewest]=useState(true);
  const list = items.filter(i => (cat === cats[0] || i.cat === cat) && (status === "Any" || i.s === status) && (i.t+i.d).toLowerCase().includes(query.toLowerCase()));
  if(!newest) list.reverse();
  const cols = "minmax(0,3.6fr) 1fr 1fr 1.4fr 1fr 90px";
  return (
    <Page gap={16}>
      <Reveal>
        <PageHead eyebrow="05.02 · Memories" title="What the twin remembers." actions={<><PButton href="/memory/graph">Graph view</PButton><PButton variant="ink" href="/memory/corrections?new=1">Add memory</PButton></>} />
      </Reveal>
      <Reveal delay={0.05} style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}><input aria-label="Search memories" placeholder="Search memories" value={query} onChange={e=>setQuery(e.target.value)} className="demo-search" style={{width:"100%"}}/></div>
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{ height: 40, padding: "0 12px", borderRadius: 4, fontSize: 13, background: cat === c ? C.wash : "#fff", color: cat === c ? C.pine : C.ink, boxShadow: cat === c ? `0 0 0 1px ${C.pine}` : shadow, whiteSpace: "nowrap" }}>{c}</button>
        ))}
        <select aria-label="Memory status" value={status} onChange={e=>setStatus(e.target.value)}>{["Any","Verified","Confirmed","Inferred","Unknown"].map(x=><option key={x}>{x}</option>)}</select>
        <PButton onClick={()=>setNewest(!newest)}>{newest?"Newest first":"Oldest first"}</PButton>
      </Reveal>
      <Reveal className="memory-table" delay={0.1} style={{ background: "#fff", borderRadius: 4, boxShadow: "#0000000D 0 0 0 .5px, #0000000A 0 1px 2px", padding: "8px 20px" }}>
        <div className="memory-table-head" style={{ display: "grid", gridTemplateColumns: cols, gap: 16, padding: "12px 0", fontSize: 11, letterSpacing: "0.1em", color: C.slate }}>
          <span>MEMORY</span><span>DATE</span><span>CATEGORY</span><span>SOURCE</span><span>STATUS</span><span style={{ textAlign: "right" }}>ACTIONS</span>
        </div>
        <AnimatePresence initial={false}>
          {list.map((m) => (
            <motion.div className="memory-table-row" key={m.t} layout exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease }} style={{ display: "grid", gridTemplateColumns: cols, gap: 16, padding: "16px 0", borderTop: `1px solid ${C.line}`, alignItems: "flex-start", fontSize: 14 }}>
              <Link href={`/memory/detail?title=${encodeURIComponent(m.t)}`} className="hover:opacity-70"><Txt weight={600}>{m.t}</Txt><Sub size={13} color={C.body}>{m.d}</Sub></Link>
              <span>{m.date}</span><span>{m.cat}</span><span>{m.src}</span>
              <span><Badge kind={m.s} /></span>
              <span style={{ display: "flex", gap: 14, justifyContent: "flex-end", color: C.body }}>
                <Link href={`/memory/detail?title=${encodeURIComponent(m.t)}`} aria-label="Open"><ExternalLink size={15} /></Link>
                <Link href={`/memory/corrections?title=${encodeURIComponent(m.t)}`} aria-label="Edit"><Pencil size={15} /></Link>
                <button aria-label="Delete" onClick={() => setDel(m.t)} className="hover:text-[#C2413A]"><Trash2 size={15} /></button>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </Reveal>
      <Confirm open={!!del} title="Delete this memory?" body={`"${del}" will be removed. Your twin will no longer use it in answers or drafts.`} onCancel={() => setDel(null)} onConfirm={() => (setItems((xs) => xs.filter((x) => x.t !== del)), setDel(null))} />
    </Page>
  );
}
