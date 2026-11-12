"use client";
import { Users } from "lucide-react";
import { C, PCard, Badge } from "./paper";
import type { FamilyAnswer } from "@/lib/org";

export function AnswerCard({ a, footer }: { a: FamilyAnswer; footer?: React.ReactNode }) {
  const council = a.status === "To council";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ alignSelf: "flex-end", background: C.ink, color: "#fff", padding: "10px 14px", borderRadius: 4, maxWidth: "80%", fontSize: 15 }}>{a.question}</div>
      <PCard dither={false} style={{ padding: 18, gap: 12, borderLeft: `3px solid ${council ? C.amber : a.status === "Flagged" ? C.danger : C.pine}` }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 12, color: C.slate }}>
          <span style={{ fontWeight: 600, color: C.ink }}>{a.topic}</span>
          {council ? <span style={{ display: "inline-flex", gap: 4, alignItems: "center", color: C.warning, fontWeight: 600 }}><Users size={13} /> Sent to family council · {a.reason}</span> : <span>Confidence {a.confidence}%</span>}
          {a.status === "Resolved" && <span style={{ color: C.pine, fontWeight: 600 }}>Council answered</span>}
          {a.status === "Flagged" && <span style={{ color: C.danger, fontWeight: 600 }}>Flagged as not what the founder would say</span>}
          <span>· {a.channel}{a.device ? ` · ${a.device}` : ""}</span>
        </div>
        <p style={{ whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.6, color: C.ink }}>{a.answer}</p>
        {a.resolution && <p style={{ background: C.wash, padding: 12, borderRadius: 4, fontSize: 14, color: C.ink }}><strong>Family council:</strong> {a.resolution}</p>}
        {a.sources.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {a.sources.map(s => <div key={s.title} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: C.body }}><Badge kind={s.status} /> {s.title} <span style={{ color: C.faint }}>· {s.source}</span></div>)}
          </div>
        )}
        {footer}
      </PCard>
    </div>
  );
}
