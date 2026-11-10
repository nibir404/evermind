"use client";
import { useDemo, profileSeed } from "@/lib/demo";

// 1:1 port of Paper "04 · Home" (5Y7-0)
import { useRouter } from "next/navigation";
import { useState } from "react";
import { C, Chip, Dot, Eyebrow, Page, PageHead, PButton, PCard, Row, shadow } from "@/components/paper";
import { Reveal } from "@/components/ui";
import Link from "next/link";

const attention = [
  { dot: C.warning, title: "Reply to Prof. Rahman on 2+2 intake numbers", meta: "Approval · Draft prepared by twin · expires in 6h", cta: "Review", href: "/approvals" },
  { dot: C.warning, title: "Confirm 2 inferred traits", meta: "Communication style · Risk profile", cta: "Confirm", href: "/intelligence" },
  { dot: C.faint, title: "Farhana Akter requested access", meta: "Executive assistant · Decisions + calendar", cta: "Decide", href: "/access" },
];
const learned = [
  ["Knowledge", "Strategy plan 2030 processed · 18 memories, 4 decisions"],
  ["Decision", "Recorded: Defer Sylhet expansion to 2027"],
  ["Principle", "\"Employability is the core metric\" — confirmed by you"],
];
const recent = [
  { meta: "8 Nov · Analysis saved", title: "Chattogram campus: proceed with partner, not alone", foot: "Based on 3 past decisions · 2 principles", color: C.pine },
  { meta: "4 Nov · Recorded", title: "Defer Sylhet expansion to 2027", foot: "Outcome review due March 2027", color: C.warning },
  { meta: "29 Oct · Outcome reviewed", title: "Incubator seed fund doubled to ৳4 crore", foot: "Met expectations · pattern updated", color: C.success },
];
const prompts = ["Should we open a Chattogram campus?", "How did I handle the 2021 merger?", "Draft my convocation note"];

export default function Home() {
  const [profile] = useDemo("profile", profileSeed);
  const router = useRouter();
  const [q, setQ] = useState("");
  const ask = (text = q) => router.push(`/ask${text ? `?q=${encodeURIComponent(text)}` : ""}`);

  return (
    <Page>
      <Reveal>
        <PageHead
          eyebrow="03.01 · Overview · Tuesday, 10 November"
          title={`Good morning, ${profile.name}`}
          actions={
            <>
              <Link href="/notifications" aria-label="Notifications" style={{ alignItems: "center", background: "#fff", borderRadius: 4, boxShadow: shadow, display: "flex", height: 40, justifyContent: "center", position: "relative", width: 40 }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" fill="none" stroke="#4A4752" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ background: C.danger, borderRadius: 4, height: 6, position: "absolute", right: 10, top: 9, width: 6 }} />
              </Link>
              <PButton href="/decisions">New decision</PButton>
              <PButton variant="lime" href="/knowledge/add">Add knowledge</PButton>
            </>
          }
        />
      </Reveal>

      <Reveal delay={0.06} style={{ display: "flex", gap: 16 }}>
        <PCard style={{ flex: 1, gap: 16, padding: 24 }}>
          <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-[4px] opacity-60" style={{ background: C.success }} />
              <Dot color={C.success} />
            </span>
            <div style={{ color: C.pine, fontSize: 13, fontWeight: 600, lineHeight: "16px" }}>Twin online · Advise mode (L1)</div>
          </div>
          <div style={{ color: C.ink, fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: "30px" }}>What would you like to think through?</div>
          <form
            onSubmit={(e) => (e.preventDefault(), ask())}
            className="focus-within:ring-2 focus-within:ring-[#D4F26A]"
            style={{ alignItems: "center", background: C.field, borderRadius: 4, boxShadow: shadow, display: "flex", gap: 12, height: 52, paddingLeft: 16, paddingRight: 8 }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask your twin, or describe a decision…"
              className="placeholder:text-[#A3A1A8]"
              style={{ flex: 1, background: "transparent", outline: "none", color: C.ink, fontSize: 15, lineHeight: "20px" }}
            />
            <button type="submit" className="active:scale-95" style={{ alignItems: "center", background: C.ink, borderRadius: 4, display: "flex", height: 36, paddingInline: 14, color: "#fff", fontSize: 13, fontWeight: 600 }}>
              Ask
            </button>
          </form>
          <div className="home-prompts" style={{ display: "flex", gap: 8 }}>
            {prompts.map((p) => (
              <Chip key={p} onClick={() => ask(p)}>{p}</Chip>
            ))}
          </div>
        </PCard>

        <PCard style={{ flexShrink: 0, gap: 14, padding: 24, width: 380 }}>
          <Eyebrow>Intelligence readiness</Eyebrow>
          <div style={{ alignItems: "baseline", display: "flex", gap: 6 }}>
            <div style={{ color: C.ink, fontSize: 56, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: "56px" }}>72</div>
            <div style={{ color: C.slate, fontSize: 15, lineHeight: "20px" }}>/ 100 · ready to advise</div>
          </div>
          <div style={{ display: "flex", gap: 3, height: 6 }}>
            <div className="origin-left animate-[grow_1s_cubic-bezier(.32,.72,0,1)]" style={{ background: C.pine, borderRadius: 4, width: 180 }} />
            <div className="origin-left animate-[grow_1.2s_cubic-bezier(.32,.72,0,1)]" style={{ background: C.amber, borderRadius: 4, width: 70 }} />
            <div style={{ background: C.line, borderRadius: 4, flex: 1 }} />
          </div>
          <div style={{ color: C.body, fontSize: 13, lineHeight: "18px" }}>71% verified or confirmed · 29% inferred. Confirming communication style adds about 6 points.</div>
          <Link href="/intelligence" style={{ color: C.pine, fontSize: 13, fontWeight: 600, lineHeight: "16px" }}>Open intelligence profile →</Link>
        </PCard>
      </Reveal>

      <Reveal delay={0.12} style={{ display: "flex", gap: 16 }}>
        <PCard style={{ flex: 1, gap: 4, padding: 20 }}>
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", paddingBottom: 10 }}>
            <div style={{ color: C.ink, fontSize: 17, fontWeight: 600, lineHeight: "22px" }}>Needs your attention</div>
            <div style={{ color: C.slate, fontSize: 13 }}>3 open</div>
          </div>
          {attention.map((a) => (
            <Row key={a.title}>
              <Dot color={a.dot} />
              <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 2 }}>
                <div style={{ color: C.ink, fontSize: 14, lineHeight: "18px" }}>{a.title}</div>
                <div style={{ color: C.slate, fontSize: 12, lineHeight: "16px" }}>{a.meta}</div>
              </div>
              <Link href={a.href} className="hover:underline" style={{ color: C.pine, flexShrink: 0, fontSize: 13, fontWeight: 600, textAlign: "right", width: 64 }}>{a.cta}</Link>
            </Row>
          ))}
        </PCard>

        <PCard style={{ flexShrink: 0, gap: 4, padding: 20, width: 380 }}>
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", paddingBottom: 10 }}>
            <div style={{ color: C.ink, fontSize: 17, fontWeight: 600, lineHeight: "22px" }}>Learned this week</div>
            <Link href="/activity" style={{ color: C.pine, fontSize: 13, fontWeight: 600 }}>Activity →</Link>
          </div>
          {learned.map(([k, v]) => (
            <Row key={k} style={{ alignItems: "flex-start" }}>
              <div style={{ color: C.slate, flexShrink: 0, fontSize: 12, lineHeight: "16px", width: 84 }}>{k}</div>
              <div style={{ color: C.ink, flex: 1, fontSize: 14, lineHeight: "18px" }}>{v}</div>
            </Row>
          ))}
        </PCard>
      </Reveal>

      <Reveal delay={0.18} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Eyebrow>Recent decisions</Eyebrow>
          <Link href="/decide" style={{ color: C.pine, fontSize: 13, fontWeight: 600 }}>Decision Studio →</Link>
        </div>
        <div className="home-recent" style={{ display: "flex", gap: 16 }}>
          {recent.map((r) => (
            <Link key={r.title} href="/decide" className="flex-1 transition-transform duration-300 hover:-translate-y-0.5">
              <PCard style={{ gap: 6, padding: "16px 20px", height: "100%" }}>
                <div style={{ color: C.slate, fontSize: 12, lineHeight: "16px" }}>{r.meta}</div>
                <div style={{ color: C.ink, fontSize: 15, fontWeight: 500, lineHeight: "20px" }}>{r.title}</div>
                <div style={{ color: r.color, fontSize: 12, lineHeight: "16px" }}>{r.foot}</div>
              </PCard>
            </Link>
          ))}
        </div>
      </Reveal>
    </Page>
  );
}
