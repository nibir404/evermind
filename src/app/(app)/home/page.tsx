"use client";
// Home: the most important things first, as visuals. Every number is live from the demo store.
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bell, CalendarDays, Mic, Scale, ShieldCheck } from "lucide-react";
import { C, Page } from "@/components/paper";
import { Reveal, ease } from "@/components/ui";
import { useDemo, profileSeed, moduleSeeds, approvalQueueSeed, type RecordItem } from "@/lib/demo";

const concerns = { Education: 24, ICT: 18, Health: 4 };
const atRisk = [
  { area: "Education", note: "Employability below target in 2 departments", href: "/knowledge" },
  { area: "ICT", note: "One company two quarters behind plan", href: "/decide" },
];

const fmtDay = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

export default function Home() {
  const [profile] = useDemo("profile", profileSeed);
  const [queue] = useDemo<RecordItem[]>("approval-queue", approvalQueueSeed);
  const [sent] = useDemo("approval-sent", false);
  const [declined] = useDemo("approval-declined", false);
  const [calendar] = useDemo<RecordItem[]>("calendar", moduleSeeds.calendar);
  const [decisions] = useDemo<RecordItem[]>("decisions", moduleSeeds.decisions);
  const [tasks] = useDemo<RecordItem[]>("tasks", moduleSeeds.tasks);
  const [access] = useDemo<RecordItem[]>("access", moduleSeeds.access);
  const router = useRouter();
  const [q, setQ] = useState("");
  const ask = (text = q) => router.push(`/ask${text ? `?q=${encodeURIComponent(text)}` : ""}`);

  const pending = queue.filter((x) => x.status === "Pending");
  const approvalCount = pending.length + (!sent && !declined ? 1 : 0);
  const nextApproval = !sent && !declined ? { title: "Reply to University of Wollongong", meta: "Partnerships · expires in 22h" } : pending[0] ? { title: pending[0].title, meta: `${pending[0].category} · waiting for you` } : null;
  const upcoming = [...calendar].filter((c) => c.date >= "2026-11-10").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const openTasks = tasks.filter((t) => t.status !== "Completed");
  const highTasks = openTasks.filter((t) => t.category === "High");
  const requests = access.filter((a) => a.status === "Pending");
  const recent = [...decisions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const onTrack = Object.values(concerns).reduce((a, b) => a + b, 0) - atRisk.length;
  const firstName = profile.name.replace(/^Dr\.\s*/, "").split(" ").slice(-1)[0];
  const today = new Date("2026-11-10T09:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <Page gap={24}>
      {/* Header */}
      <Reveal className="home-head" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: C.slate, fontSize: 14 }}>{today}</div>
          <h1 style={{ fontSize: 40, lineHeight: "46px", fontWeight: 600, letterSpacing: "-0.035em", marginTop: 4 }}>Good morning, Dr. {firstName}.</h1>
          <p style={{ color: C.slate, fontSize: 15, marginTop: 6 }}>
            {approvalCount} {approvalCount === 1 ? "thing needs" : "things need"} your sign-off. Everything else is on track.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/notifications" aria-label="Notifications" className="home-icon-btn"><Bell size={18} /><span className="home-badge" /></Link>
          <Link href="/decide" className="home-btn"><Scale size={16} />New decision</Link>
          <Link href="/talk" className="home-btn primary"><Mic size={16} />Talk to your twin</Link>
        </div>
      </Reveal>

      <div className="home-grid">
        {/* Hero: the twin, with the three numbers that matter */}
        <Reveal delay={0.05} className="home-hero">
          <div className="home-figure" aria-hidden="true" />
          <Callout style={{ left: "3%", top: "36%" }} dot={C.amber} value={String(approvalCount)} unit="" label="Waiting for your approval" sub={nextApproval?.meta} href="/approvals" tag="Needs you" tone="amber" lineDir="right" />
          <Callout style={{ right: "3%", top: "8%" }} dot={C.pine} value="92" unit="%" label="Decisions match your principles" sub="Last 30 days · 41 decisions" href="/patterns" tag="Aligned" tone="pine" lineDir="left" />
          <Callout style={{ right: "3%", top: "50%" }} dot={C.pine} value="72" unit="/100" label="Twin readiness" sub="Confirm 2 traits to add 6 points" href="/intelligence" tone="pine" lineDir="left" />
          <form onSubmit={(e) => { e.preventDefault(); ask(); }} className="home-ask">
            <input data-bare value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask your twin, or describe a decision…" aria-label="Ask your twin" />
            <button type="submit">Ask</button>
          </form>
        </Reveal>

        {/* Group pulse */}
        <Reveal delay={0.1} className="home-tile home-pulse">
          <Link href="/brain" className="home-tile-link" aria-label="Open group pulse" />
          <div className="home-tile-head"><span>Group pulse · {onTrack + atRisk.length} concerns</span><ArrowUpRight size={16} /></div>
          <div><span className="home-num">{onTrack}</span><span className="home-unit">on track</span></div>
          <Globe />
          <div className="home-pulse-legend">
            {Object.entries(concerns).map(([k, v]) => <span key={k}><b>{v}</b> {k}</span>)}
          </div>
        </Reveal>

        {/* Next approval */}
        <Reveal delay={0.14} className="home-tile home-approval">
          <div className="home-tile-head"><span>Next approval</span><span>{approvalCount} waiting</span></div>
          {nextApproval ? (
            <>
              <div style={{ fontSize: 20, lineHeight: "25px", letterSpacing: "-0.01em", color: C.ink }}>{nextApproval.title}</div>
              <div style={{ fontSize: 13, color: "#5A3B12" }}>{nextApproval.meta}</div>
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <Link href="/approvals" className="home-btn primary sm">Review</Link>
                <Link href="/actions" className="home-btn sm ghost">All actions</Link>
              </div>
            </>
          ) : (
            <div style={{ marginTop: "auto", fontSize: 18, color: C.ink }}>You’re all caught up.</div>
          )}
        </Reveal>

        {/* Today */}
        <Reveal delay={0.18} className="home-tile home-today">
          <div className="home-tile-head"><span><CalendarDays size={14} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />Coming up</span><Link href="/calendar">See all</Link></div>
          {upcoming.map((e, i) => (
            <Link key={e.id} href="/calendar" className="home-event">
              <span className="home-event-day"><b>{fmtDay(e.date).split(" ")[1]}</b>{fmtDay(e.date).split(" ")[0]}</span>
              <span style={{ minWidth: 0 }}>
                <span className="home-event-title">{e.title}</span>
                <span className="home-event-meta">{e.body.split(" · ")[0]} · {e.category}</span>
              </span>
              {i === 0 && <span className="home-chip">Next</span>}
            </Link>
          ))}
        </Reveal>
      </div>

      {/* Second row: what needs attention, decisions, signals */}
      <div className="home-row">
        <Reveal delay={0.22} className="home-panel">
          <div className="home-panel-head"><h2>Needs your attention</h2><span>{atRisk.length + requests.length + highTasks.length} open</span></div>
          {atRisk.map((r) => (
            <Link key={r.note} href={r.href} className="home-line">
              <span className="home-dot" style={{ background: C.warning }} aria-hidden="true" />
              <span><b>{r.area}</b> · {r.note}</span>
              <span className="home-tag warn">At risk</span>
            </Link>
          ))}
          {requests.map((r) => (
            <Link key={r.id} href="/access" className="home-line">
              <span className="home-dot" style={{ background: C.slate }} aria-hidden="true" />
              <span><b>{r.title}</b> requested access · {r.category}</span>
              <span className="home-tag">Decide</span>
            </Link>
          ))}
          {highTasks.slice(0, 2).map((t) => (
            <Link key={t.id} href="/tasks" className="home-line">
              <span className="home-dot" style={{ background: C.pine }} aria-hidden="true" />
              <span><b>{t.title}</b> · due {fmtDay(t.date)}</span>
              <span className="home-tag">Task</span>
            </Link>
          ))}
        </Reveal>

        <Reveal delay={0.26} className="home-panel">
          <div className="home-panel-head"><h2>Recent decisions</h2><Link href="/decisions">Decision Studio</Link></div>
          {recent.map((d) => (
            <Link key={d.id} href="/decisions" className="home-decision">
              <span className="home-decision-bar" style={{ background: d.status === "Deferred" ? C.amber : d.status === "Draft" || d.status === "In review" ? C.faint : C.success }} />
              <span style={{ minWidth: 0 }}>
                <span className="home-event-title">{d.title}</span>
                <span className="home-event-meta">{fmtDay(d.date)} · {d.status} · {d.category}</span>
              </span>
            </Link>
          ))}
        </Reveal>

        <Reveal delay={0.3} className="home-panel home-signals">
          <div className="home-panel-head"><h2>This week</h2><Link href="/activity">Activity</Link></div>
          <Spark label="Questions answered" value="128" points={[12, 18, 15, 22, 19, 26, 16]} />
          <Spark label="Open tasks" value={String(openTasks.length)} points={[7, 6, 8, 6, 5, 6, openTasks.length]} />
          <div className="home-safe"><ShieldCheck size={16} /> Nothing was sent without your approval.</div>
        </Reveal>
      </div>
    </Page>
  );
}

function Callout({ style, dot, value, unit, label, sub, href, tag, tone, lineDir }: { style: React.CSSProperties; dot: string; value: string; unit: string; label: string; sub?: string; href: string; tag?: string; tone: "amber" | "pine"; lineDir: "left" | "right" }) {
  return (
    <Link href={href} className={`home-callout ${lineDir}`} style={style}>
      <span className="home-hotspot" style={{ ["--dot" as string]: dot }} aria-hidden="true" />
      <span className="home-callout-body">
        <span className="home-callout-num">{value}<small>{unit}</small>{tag && <em className={tone}>{tag}</em>}</span>
        <span className="home-callout-label">{label}</span>
        {sub && <span className="home-callout-sub">{sub}</span>}
      </span>
    </Link>
  );
}

function Globe() {
  return (
    <svg className="home-globe" viewBox="0 0 220 220" aria-hidden="true">
      <g fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth=".8">
        <circle cx="110" cy="110" r="96" />
        <ellipse cx="110" cy="110" rx="96" ry="60" /><ellipse cx="110" cy="110" rx="96" ry="22" />
        <ellipse cx="110" cy="110" rx="60" ry="96" /><ellipse cx="110" cy="110" rx="22" ry="96" />
      </g>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ originX: "110px", originY: "110px" }}>
        <circle cx="160" cy="62" r="5" fill="#E0A84F" /><circle cx="160" cy="62" r="11" fill="none" stroke="#E0A84F" strokeOpacity=".6" />
        <circle cx="66" cy="146" r="5" fill="#F08A80" /><circle cx="66" cy="146" r="11" fill="none" stroke="#F08A80" strokeOpacity=".6" />
      </motion.g>
      <circle cx="110" cy="110" r="4" fill="#D4F26A" />
    </svg>
  );
}

function Spark({ label, value, points }: { label: string; value: string; points: number[] }) {
  const max = Math.max(...points), min = Math.min(...points);
  const d = points.map((p, i) => `${(i / (points.length - 1)) * 120},${32 - ((p - min) / (max - min || 1)) * 28}`).join(" ");
  return (
    <div className="home-spark">
      <div><span className="home-spark-num">{value}</span><span className="home-spark-label">{label}</span></div>
      <svg width="120" height="36" viewBox="0 0 120 36" aria-hidden="true">
        <motion.polyline points={d} fill="none" stroke={C.pine} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease }} />
      </svg>
    </div>
  );
}
