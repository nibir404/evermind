"use client";

// Paper "05.08 · Knowledge brain" (GLP-0) — List, Graph and 3D views over seed data.
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCw, Search, ZoomIn, ZoomOut, ChevronLeft, FileText } from "lucide-react";
import { BrainGraph } from "@/components/three";
import { typeColor, type NeuronType } from "@/components/three/brain-graph";
import { C, ditherBg } from "@/components/paper";
import { ease } from "@/components/ui";
import { brain, byId, typeLabel, type BrainItem } from "@/lib/brain";

type View = "List" | "Graph" | "3D";
const types: [NeuronType, string, string][] = [
  ["principle", "Principles", "38"],
  ["decision", "Decisions", "212"],
  ["memory", "Memories", "1,284"],
  ["person", "People", "146"],
  ["source", "Sources", "436"],
];
const glass = { background: "#FFFFFF0D", border: "1px solid #FFFFFF26", borderRadius: 4 } as const;
const statusColor: Record<BrainItem["status"], string> = { Verified: "#8FD8B0", Confirmed: "#D4F26A", Inferred: "#E9A23B", Unknown: "#A3A1A8" };

// Neurons labelled in the 3D field (index into the generated field).
const labels3d = [
  ["students-first", 5],
  ["wollongong", 21],
  ["strategy-2030", 24],
  ["convocation-24", 12],
  ["rahman", 18],
  ["careful-debt", 40],
  ["book-2025", 54],
] as const;

/* ---------------- List view ---------------- */
function ListView({ items, selected, onSelect }: { items: BrainItem[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div data-lenis-prevent style={{ ...glass, background: "#0B2A21CC", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2.4fr) 110px 110px minmax(0,1.4fr) 90px 120px", gap: 16, padding: "12px 20px", fontSize: 11, letterSpacing: "0.1em", color: "#FFFFFF80", position: "sticky", top: 0, background: "#0B2A21", zIndex: 1 }}>
        <span>NEURON</span>
        <span>TYPE</span>
        <span>STATUS</span>
        <span>SOURCE</span>
        <span>LINKS</span>
        <span>STRENGTH</span>
      </div>
      {items.map((b, i) => (
        <motion.button
          key={b.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.015, duration: 0.35, ease }}
          onClick={() => onSelect(b.id)}
          className="w-full text-left transition-colors hover:bg-white/5"
          style={{ display: "grid", gridTemplateColumns: "minmax(0,2.4fr) 110px 110px minmax(0,1.4fr) 90px 120px", gap: 16, alignItems: "center", padding: "14px 20px", borderTop: "1px solid #FFFFFF14", background: selected === b.id ? "#D4F26A14" : "transparent", boxShadow: selected === b.id ? "inset 0 0 0 1px #D4F26A55" : "none" }}
        >
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.label}</span>
            <span style={{ display: "block", fontSize: 12, color: "#FFFFFF80", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.summary}</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: typeColor[b.type] }} /> {typeLabel[b.type]}
          </span>
          <span style={{ fontSize: 12, color: statusColor[b.status] }}>● {b.status}</span>
          <span style={{ fontSize: 12, color: "#FFFFFFB3", display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <FileText size={12} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.source}</span>
          </span>
          <span style={{ fontSize: 13, color: "#FFFFFFB3" }}>{b.links.length}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ flex: 1, height: 4, background: "#FFFFFF1A", borderRadius: 4, overflow: "hidden" }}>
              <span style={{ display: "block", width: `${b.strength}%`, height: "100%", background: typeColor[b.type] }} />
            </span>
            <span style={{ fontSize: 12, color: "#FFFFFF99", width: 22 }}>{b.strength}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}

/* ---------------- Graph view (2D) ---------------- */
const centers: Record<NeuronType, [number, number]> = {
  principle: [330, 300],
  decision: [610, 190],
  memory: [560, 470],
  person: [820, 470],
  source: [860, 210],
};

function GraphView({ items, selected, onSelect, zoom }: { items: BrainItem[]; selected: string; onSelect: (id: string) => void; zoom: number }) {
  const pos = useMemo(() => {
    const out: Record<string, [number, number]> = {};
    (Object.keys(centers) as NeuronType[]).forEach((t) => {
      const group = brain.filter((b) => b.type === t);
      group.forEach((b, i) => {
        const a = (i / group.length) * Math.PI * 2 + (t.length % 3);
        const r = i === 0 ? 0 : 70 + (i % 2) * 46;
        out[b.id] = [centers[t][0] + Math.cos(a) * r, centers[t][1] + Math.sin(a) * r * 0.8];
      });
    });
    return out;
  }, []);
  const visible = new Set(items.map((i) => i.id));
  const sel = byId[selected];
  const near = new Set([selected, ...(sel?.links ?? [])]);
  const edges = brain.flatMap((b) => b.links.filter((l) => byId[l] && b.id < l).map((l) => [b.id, l] as const));
  const vb = { w: 1100 / zoom, h: 640 / zoom };

  return (
    <svg viewBox={`${(1100 - vb.w) / 2} ${(640 - vb.h) / 2} ${vb.w} ${vb.h}`} style={{ width: "100%", height: "100%" }}>
      {(Object.keys(centers) as NeuronType[]).map((t) => (
        <text key={t} x={centers[t][0]} y={centers[t][1] - 150} textAnchor="middle" fontSize="11" letterSpacing="1.4" fill="#FFFFFF55">
          {typeLabel[t].toUpperCase()}S
        </text>
      ))}
      {edges.map(([a, b]) => {
        const hot = near.has(a) && near.has(b) && (a === selected || b === selected);
        const dim = !visible.has(a) || !visible.has(b);
        return (
          <motion.line
            key={a + b}
            x1={pos[a][0]}
            y1={pos[a][1]}
            x2={pos[b][0]}
            y2={pos[b][1]}
            stroke={hot ? "#D4F26A" : "#8FD8B0"}
            strokeWidth={hot ? 1.6 : 0.8}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: dim ? 0.05 : hot ? 0.95 : 0.22 }}
            transition={{ duration: 0.8, ease }}
          />
        );
      })}
      {brain.map((b) => {
        const [x, y] = pos[b.id];
        const r = 4 + b.strength / 14;
        const active = b.id === selected;
        const show = visible.has(b.id);
        return (
          <g key={b.id} transform={`translate(${x} ${y})`} style={{ cursor: "pointer", opacity: show ? 1 : 0.15, transition: "opacity .3s" }} onClick={() => onSelect(b.id)}>
            <circle r={r * 2.4} fill={typeColor[b.type]} opacity={active ? 0.28 : 0.08} />
            {active && <circle r={r + 8} fill="none" stroke="#D4F26A" strokeWidth="1.2" />}
            <circle r={r} fill={typeColor[b.type]} />
            {(active || near.has(b.id) || b.strength > 80) && (
              <text x={r + 8} y={4} fontSize={active ? 13 : 11} fontWeight={active ? 600 : 400} fill={active ? "#D4F26A" : "#DDEFE4"}>
                {b.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- Page ---------------- */
export default function Brain() {
  const [selected, setSelected] = useState("students-first");
  const [view, setView] = useState<View>("3D");
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState<NeuronType | null>(null);
  const [q, setQ] = useState("");
  const node = byId[selected];
  const items = brain.filter((b) => (!filter || b.type === filter) && (!q || (b.label + b.summary).toLowerCase().includes(q.toLowerCase())));
  const labels = labels3d.filter(([id])=>items.some(x=>x.id===id)).map(([id, at]) => ({ id, at, label: byId[id].label, type: byId[id].type }));

  return (
    <div className="brain-screen" style={{ position: "fixed", inset: 0, zIndex: 50, color: "#fff", background: "radial-gradient(ellipse 50% 55% at 48% 50%, #1F5A47 0%, #0E2E25 75%), #0E2E25", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Stage */}
      <div className="brain-stage" style={{ position: "absolute", inset: view === "List" ? "120px 390px 110px 268px" : "100px 380px 110px 260px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.985 }} transition={{ duration: 0.4, ease }} style={{ width: "100%", height: "100%" }}>
            {view === "3D" && <BrainGraph labels={labels} selected={selected} onSelect={setSelected} zoom={zoom} />}
            {view === "Graph" && <GraphView items={items} selected={selected} onSelect={setSelected} zoom={zoom} />}
            {view === "List" && <ListView items={items} selected={selected} onSelect={setSelected} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="brain-heading" style={{ position: "absolute", left: 24, top: 24 }}>
        <Link href="/home" style={{ display: "flex", alignItems: "center", gap: 4, color: "#CDEE8C", fontSize: 11, letterSpacing: "0.1em" }}>
          <ChevronLeft size={12} /> 05.08 · KNOWLEDGE BRAIN
        </Link>
        <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.035em", marginTop: 8 }}>Everything you know</div>
      </div>
      <div className="brain-toolbar" style={{ position: "absolute", right: 24, top: 24, display: "flex", gap: 8 }}>
        <label style={{ ...glass, display: "flex", alignItems: "center", gap: 10, width: 240, height: 40, padding: "0 12px", fontSize: 14 }}>
          <Search size={15} color="#FFFFFF99" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the brain" className="placeholder:text-white/50" style={{ flex: 1, minWidth: 0, background: "transparent", outline: "none", color: "#fff" }} />
          <span style={{ fontSize: 11, color: "#FFFFFF80" }}>⌘K</span>
        </label>
        <Link href="/knowledge/add" className="hover:brightness-95" style={{ background: C.lime, color: C.ink, borderRadius: 4, height: 40, padding: "0 16px", display: "flex", alignItems: "center", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>Add knowledge</Link>
        <div style={{ ...glass, display: "flex", padding: 3, gap: 2 }}>
          {(["List", "Graph", "3D"] as View[]).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{ position: "relative", padding: "0 12px", height: 32, fontSize: 13, color: view === v ? C.ink : "#FFFFFFCC", fontWeight: view === v ? 600 : 400 }}>
              {view === v && <motion.span layoutId="viewpill" transition={{ type: "spring", stiffness: 500, damping: 40 }} style={{ position: "absolute", inset: 0, background: C.lime, borderRadius: 4 }} />}
              <span style={{ position: "relative" }}>{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reasoning path */}
      {view !== "List" && (
        <div className="brain-path" style={{ ...glass, position: "absolute", left: 330, top: 120, display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", fontSize: 13, borderColor: "#D4F26A66" }}>
          <span style={{ color: "#CDEE8C", fontSize: 11, letterSpacing: "0.1em" }}>PATH</span> Fee freeze 2020 <ArrowRight size={13} color="#FFFFFF99" /> Students first <ArrowRight size={13} color="#FFFFFF99" /> 2+2 scholarship
        </div>
      )}

      {/* Neuron types */}
      <div className="brain-types" style={{ position: "absolute", left: 24, top: 190, width: 220 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#FFFFFF99", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
          NEURON TYPES
          {filter && <button onClick={() => setFilter(null)} style={{ color: "#CDEE8C", letterSpacing: 0 }}>Show all</button>}
        </div>
        {types.map(([t, l, n]) => (
          <button key={t} onClick={() => setFilter(filter === t ? null : t)} className="w-full transition-colors hover:bg-white/5" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 4, background: filter === t ? "#FFFFFF14" : "transparent", fontSize: 14, opacity: filter && filter !== t ? 0.55 : 1 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: typeColor[t] }} />
            <span style={{ flex: 1, textAlign: "left" }}>{l}</span>
            <span style={{ color: "#FFFFFFB3", fontSize: 13 }}>{n}</span>
          </button>
        ))}
      </div>

      {/* Detail */}
      <AnimatePresence mode="wait">
        <motion.div className="brain-detail" key={node.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.4, ease }} style={{ position: "absolute", right: 24, top: 120, width: 340, background: ditherBg, color: C.ink, borderRadius: 4, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.wash, color: C.pine, borderRadius: 4, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: 9, background: C.pine }} /> {node.status === "Confirmed" ? "Confirmed by you" : node.status}
            </span>
            <span style={{ fontSize: 11, letterSpacing: "0.1em", color: C.slate }}>{typeLabel[node.type].toUpperCase()}</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{node.label}</div>
          <div style={{ fontSize: 14, lineHeight: "20px", color: C.body }}>{node.summary}</div>
          <div style={{ fontSize: 12, color: C.slate, display: "flex", gap: 6, alignItems: "center" }}>
            <FileText size={12} /> {node.source} · {node.date}
          </div>
          <div style={{ fontSize: 11, letterSpacing: "0.1em", color: C.slate, marginTop: 4 }}>STRONGEST CONNECTIONS · {node.links.length}</div>
          {node.links.slice(0, 5).map((id) => {
            const l = byId[id];
            if (!l) return null;
            return (
              <button key={id} onClick={() => setSelected(id)} className="text-left hover:opacity-70" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <span style={{ width: 8, height: 8, borderRadius: 9, flexShrink: 0, background: l.type === "memory" ? "#fff" : typeColor[l.type], border: l.type === "memory" ? "1px solid #C7D59E" : "none" }} />
                <span style={{ flex: 1 }}>{l.label}</span>
                <span style={{ color: C.slate, fontSize: 12 }}>{typeLabel[l.type]}</span>
              </button>
            );
          })}
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button onClick={()=>setView("List")} className="active:scale-[0.98]" style={{ flex: 1, height: 38, background: C.ink, color: "#fff", borderRadius: 4, fontSize: 14, fontWeight: 600 }}>Open neuron</button>
            <Link href="/memory/corrections" style={{ height: 38, padding: "0 14px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center" }}>Correct</Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls + growth */}
      {view !== "List" && (
        <div style={{ position: "absolute", left: 24, bottom: 34, display: "flex", gap: 6 }}>
          {[
            [RotateCw, () => setZoom(1)],
            [ZoomIn, () => setZoom((z) => Math.min(1.6, z + 0.15))],
            [ZoomOut, () => setZoom((z) => Math.max(0.7, z - 0.15))],
          ].map(([I, f], i) => {
            const Icon = I as typeof RotateCw;
            return (
              <button aria-label={["Reset view","Zoom in","Zoom out"][i]} key={i} onClick={f as () => void} style={{ ...glass, width: 40, height: 40, display: "grid", placeItems: "center" }}>
                <Icon size={15} />
              </button>
            );
          })}
        </div>
      )}
      <div className="brain-growth" style={{ ...glass, position: "absolute", left: view === "List" ? 24 : 172, right: 24, bottom: 24, height: 62, padding: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#FFFFFF99", marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
          <span>HOW YOUR MIND GREW · 1998 → TODAY</span>
          <span style={{ letterSpacing: 0 }}>{items.length} of {brain.length} shown</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 20 }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.span key={i} initial={{ height: 0 }} animate={{ height: 4 + i * 0.55 }} transition={{ delay: i * 0.02, duration: 0.6, ease }} style={{ width: 6, background: `color-mix(in oklab, #D4F26A ${30 + i * 2.3}%, #4E8A60)`, borderRadius: 1 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
