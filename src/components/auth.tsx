"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { C, shadow } from "@/components/paper";

export const glow =
  "radial-gradient(ellipse 70% 50% at 0% 0%, rgba(214,232,250,.7), transparent 60%), radial-gradient(ellipse 70% 60% at 100% 100%, rgba(236,246,214,.8), transparent 60%), #F9FBF8";

export function Brand({ size = 32 }: { size?: number }) {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 600, color: C.ink }}>
      <span style={{ width: size, height: size, borderRadius: 4, background: C.pine, display: "grid", placeItems: "center" }}>
        <span style={{ width: size * 0.36, height: size * 0.36, borderRadius: 3, background: C.lime }} />
      </span>
      EverMind
    </Link>
  );
}

/** Dither "sphere" of dots — the identity motif from Paper. */
export function DotSphere({ size = 300, scan = false }: { size?: number; scan?: boolean }) {
  const n = 19;
  const dots: React.ReactNode[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const dx = (x - (n - 1) / 2) / ((n - 1) / 2);
      const dy = (y - (n - 1) / 2) / ((n - 1) / 2);
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 1) continue;
      const shade = 1 - Math.sqrt(Math.max(0, (dx + 0.25) ** 2 + (dy + 0.3) ** 2)) / 1.4;
      const r = 1.6 + shade * 2.6;
      const col = shade > 0.7 ? "#0E5A43" : shade > 0.5 ? "#2F8F5B" : shade > 0.3 ? "#6CC193" : "#BFE3CD";
      dots.push(<circle key={`${x}-${y}`} cx={x * 15 + 10} cy={y * 15 + 10} r={r} fill={col} />);
    }
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <motion.svg viewBox="0 0 290 290" width={size} height={size} animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
        {dots}
      </motion.svg>
      {scan && (
        <motion.div
          style={{ position: "absolute", left: -20, right: -20, height: 2, background: "#D4F26A" }}
          animate={{ top: ["15%", "85%", "15%"] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

export function StepBar({ label, total, current }: { label: string; total: number; current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: C.slate }}>
      <span>{label}</span>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{ width: 28, height: 3, borderRadius: 4, background: i < current - 1 ? C.pine : i === current - 1 ? C.lime : "#E3E2DE" }} />
        ))}
      </div>
    </div>
  );
}

export function AuthTop({ right }: { right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 32px" }}>
      <Brand />
      {right}
    </div>
  );
}

export function Field({ label, icon, value, placeholder, type = "text", focus }: { label?: string; icon?: React.ReactNode; value?: string; placeholder?: string; type?: string; focus?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <span style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{label}</span>}
      <span
        className="focus-within:shadow-[0_0_0_1.5px_#0E5A43]"
        style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 14px", background: "#fff", borderRadius: 4, boxShadow: focus ? `0 0 0 1.5px ${C.pine}` : shadow }}
      >
        {icon}
        <input type={type} defaultValue={value} placeholder={placeholder} className="placeholder:text-[#A3A1A8]" style={{ flex: 1, outline: "none", fontSize: 14, color: C.ink, background: "transparent" }} />
      </span>
    </label>
  );
}

export function BigButton({ children, variant = "lime", href, onClick }: { children: React.ReactNode; variant?: "lime" | "ink" | "white"; href?: string; onClick?: () => void }) {
  const v = { lime: { background: C.lime, color: C.ink }, ink: { background: C.ink, color: "#fff" }, white: { background: "#fff", color: C.ink, boxShadow: shadow } }[variant];
  const s: React.CSSProperties = { ...v, height: 46, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 15, fontWeight: 600, width: "100%" };
  const cls = "transition hover:brightness-[0.97] active:scale-[0.99]";
  return href ? (
    <Link href={href} style={s} className={cls}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} style={s} className={cls}>
      {children}
    </button>
  );
}

export function MiniStat({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, background: "linear-gradient(100deg,#fff 58%,rgba(255,255,255,0) 100%), radial-gradient(rgba(14,90,67,.16) .9px, transparent 1.1px) 0 0/6px 6px #fff", borderRadius: 4, boxShadow: shadow, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
      {children}
    </div>
  );
}

export function SplitAuth({ left, children }: { left: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="auth-layout" style={{ display: "flex", minHeight: "100dvh", padding: 16, gap: 16, background: C.canvas, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ width: "46%", borderRadius: 4, background: glow, boxShadow: shadow, padding: 32, display: "flex", flexDirection: "column" }}>{left}</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }} className="auth-form" style={{ width: 440, display: "flex", flexDirection: "column", gap: 16 }}>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export const Kicker = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 11, letterSpacing: "0.12em", fontWeight: 600, color: C.pine, textTransform: "uppercase" }}>{children}</div>
);
export const H1 = ({ children, size = 38 }: { children: React.ReactNode; size?: number }) => (
  <div style={{ fontSize: size, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.18, color: C.ink }}>{children}</div>
);
