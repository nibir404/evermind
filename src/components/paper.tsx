// Exact design primitives exported from the Paper file ("Ever Mind").
import Link from "next/link";

export const C = {
  canvas: "#F5F5F7",
  ink: "#111113",
  body: "#4A4752",
  slate: "#6B6873",
  faint: "#A3A1A8",
  line: "#E9E8E4",
  pine: "#0E5A43",
  wash: "#E2F0E8",
  lime: "#D4F26A",
  success: "#2F8F5B",
  warning: "#B7791F",
  danger: "#C2413A",
  amber: "#E0A84F",
  field: "#F4F5F2",
};

export const shadow =
  "#0000000D 0px 0px 0px 0.5px, #0000000A 0px 1px 2px, #0000000D 0px 10px 28px -12px";

export const ditherBg =
  "linear-gradient(100deg, rgb(255, 255, 255) 58%, rgba(255, 255, 255, 0) 100%) 0% 0% / 100% 100%, radial-gradient(rgba(14, 90, 67, 0.16) 0.9px, transparent 1.1px) 0% 0% / 6px 6px rgb(255, 255, 255)";

type Div = React.HTMLAttributes<HTMLDivElement>;

/** Card with soft shadow + subtle dither texture (Paper default surface). */
export function PCard({ style, dither = true, ...p }: Div & { dither?: boolean }) {
  return (
    <div
      {...p}
      className={`paper-card ${p.className??""}`}
      style={{ background: dither ? ditherBg : "#fff", borderRadius: 4, boxShadow: shadow, display: "flex", flexDirection: "column", ...style }}
    />
  );
}

export function Eyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ color: C.slate, fontSize: 11, letterSpacing: "0.08em", lineHeight: "14px", textTransform: "uppercase", ...style }}>{children}</div>
  );
}

export function Dot({ color, size = 8 }: { color: string; size?: number }) {
  return <div style={{ background: color, borderRadius: 4, width: size, height: size, flexShrink: 0 }} />;
}

export function PButton({
  children,
  variant = "white",
  href,
  onClick,
  style,
}: {
  children: React.ReactNode;
  variant?: "white" | "lime" | "ink" | "pine";
  href?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const v = {
    white: { background: "#fff", color: C.ink, boxShadow: shadow },
    lime: { background: C.lime, color: C.ink },
    ink: { background: C.ink, color: "#fff" },
    pine: { background: C.pine, color: "#fff" },
  }[variant];
  const s: React.CSSProperties = {
    ...v,
    alignItems: "center",
    borderRadius: 4,
    display: "inline-flex",
    gap: 8,
    height: 40,
    paddingInline: 16,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "18px",
    whiteSpace: "nowrap",
    cursor: "pointer",
    ...style,
  };
  const cls = "transition-[filter,transform] duration-200 hover:brightness-[0.97] active:scale-[0.97]";
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

export function Chip({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="transition hover:bg-white active:scale-[0.97]"
      style={{ borderRadius: 4, boxShadow: shadow, padding: "6px 10px", color: C.body, fontSize: 13, lineHeight: "16px", whiteSpace: "nowrap" }}
    >
      {children}
    </button>
  );
}

export function Row({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ alignItems: "center", borderTop: `1px solid ${C.line}`, display: "flex", gap: 12, paddingBlock: 12, ...style }}>{children}</div>
  );
}

export function PageHead({ eyebrow, title, actions }: { eyebrow: string; title: string; actions?: React.ReactNode }) {
  return (
    <div className="paper-page-head" style={{ alignItems: "end", display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div style={{ color: C.ink, fontSize: 40, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: "48px" }}>{title}</div>
      </div>
      {actions && <div style={{ alignItems: "center", display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}

/** Content column as positioned in Paper (left 112, width 1296 inside 1440). */
export function Page({ children, gap = 20 }: { children: React.ReactNode; gap?: number }) {
  return <div className="paper-page" style={{ display: "flex", flexDirection: "column", gap, padding: "32px 32px 48px 32px", maxWidth: 1360 }}>{children}</div>;
}

/** Small portrait crop of Dr. Sabur Khan (as used in Paper). */
export function Avatar({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 4,
        backgroundColor: "#1F5A47",
        backgroundImage: "url(/twin/thinking.png)",
        backgroundSize: "260%",
        backgroundPosition: "50% 8%",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

export function SourceChip({ children, tone = "success" }: { children: React.ReactNode; tone?: "success" | "amber" | "slate" }) {
  const dot = { success: C.success, amber: C.amber, slate: C.faint }[tone];
  return (
    <span style={{ alignItems: "center", background: "#F1F1EE", borderRadius: 4, display: "inline-flex", gap: 6, padding: "6px 10px", color: C.body, fontSize: 12, lineHeight: "14px", whiteSpace: "nowrap" }}>
      <Dot color={dot} size={6} /> {children}
    </span>
  );
}

/* ---------- more primitives used across modules ---------- */

export function Badge({ kind }: { kind: "Verified" | "Confirmed" | "Inferred" | "Unknown" | string }) {
  const m: Record<string, [string, string, string]> = {
    Verified: ["#E2F0E8", C.pine, C.success],
    Confirmed: ["#EAF5C8", "#3E5C12", "#3E5C12"],
    Inferred: ["#FBEFD9", C.warning, C.amber],
    Unknown: ["#F1F1EE", C.slate, C.faint],
  };
  const [bg, fg, dot] = m[kind] ?? m.Unknown;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: bg, color: fg, borderRadius: 4, padding: "3px 8px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
      <span style={{ width: 5, height: 5, borderRadius: 9, background: dot }} /> {kind}
    </span>
  );
}

export function SrcTag({ children, icon = "file" }: { children: React.ReactNode; icon?: "file" | "mail" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", boxShadow: "#0000001A 0 0 0 .5px", borderRadius: 4, padding: "3px 8px", fontSize: 12, color: C.body, whiteSpace: "nowrap" }}>
      {icon === "file" ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 3H6v18h12V7z M14 3v4h4" /></svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
      )}
      {children}
    </span>
  );
}

export function Search({ placeholder, width = 220, value, onChange }: { placeholder: string; width?: number; value?: string; onChange?:(value:string)=>void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, width, height: 40, padding: "0 12px", background: "#fff", borderRadius: 4, boxShadow: shadow, fontSize: 14, color: C.faint }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
      <input aria-label={placeholder} value={value} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder} className="placeholder:text-[#A3A1A8]" style={{ flex: 1, minWidth: 0, outline: "none", background: "transparent", color: C.ink }} />
      <span style={{ fontSize: 11, background: "#F1F1EE", borderRadius: 4, padding: "2px 6px" }}>⌘K</span>
    </label>
  );
}

export function Bell() {
  return (
    <a href="/notifications" aria-label="Notifications" style={{ alignItems: "center", background: "#fff", borderRadius: 4, boxShadow: shadow, display: "flex", height: 40, justifyContent: "center", position: "relative", width: 40 }}>
      <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" fill="none" stroke="#4A4752" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span style={{ background: C.danger, borderRadius: 4, height: 6, position: "absolute", right: 10, top: 9, width: 6 }} />
    </a>
  );
}

export function Toggle({ on, onChange, disabled }: { on: boolean; onChange?: () => void; disabled?: boolean }) {
  return (
    <button role="switch" aria-checked={on} disabled={disabled} onClick={onChange} style={{ width: 32, height: 18, borderRadius: 4, background: on ? C.pine : "#E6E5E1", position: "relative", transition: "background .25s", flexShrink: 0, opacity: disabled ? 0.6 : 1 }}>
      <span style={{ position: "absolute", top: 2, left: on ? 16 : 2, width: 14, height: 14, borderRadius: 3, background: "#fff", transition: "left .25s cubic-bezier(.32,.72,0,1)" }} />
    </button>
  );
}

export function Filters({ items, active, onChange }: { items: string[]; active: string; onChange: (s: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {items.map((i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="transition-colors"
          style={{ height: 32, padding: "0 14px", borderRadius: 4, fontSize: 13, whiteSpace: "nowrap", background: active === i ? C.ink : "#fff", color: active === i ? "#fff" : C.body, fontWeight: active === i ? 600 : 400, boxShadow: active === i ? "none" : shadow }}
        >
          {i}
        </button>
      ))}
    </div>
  );
}

export function Check({ on, onChange, muted }: { on: boolean; onChange?: () => void; muted?: boolean }) {
  return (
    <button onClick={onChange} style={{ width: 24, height: 24, borderRadius: 4, flexShrink: 0, border: on ? "none" : `1.5px solid ${muted ? "#D6D5D1" : C.pine}`, background: on ? C.pine : "transparent", display: "grid", placeItems: "center", transition: "all .25s" }}>
      {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
    </button>
  );
}

export function Bar({ value, color = C.pine, width = 120 }: { value: number; color?: string; width?: number | string }) {
  return (
    <div style={{ width, height: 4, background: "#EDEDEA", borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
      <div className="origin-left animate-[grow_1s_cubic-bezier(.32,.72,0,1)]" style={{ width: `${value}%`, height: "100%", background: color }} />
    </div>
  );
}

export const H = ({ children, size = 17 }: { children: React.ReactNode; size?: number }) => (
  <div style={{ color: C.ink, fontSize: size, fontWeight: 600, lineHeight: "22px" }}>{children}</div>
);
export const Sub = ({ children, color = C.slate, size = 12 }: { children: React.ReactNode; color?: string; size?: number }) => (
  <div style={{ color, fontSize: size, lineHeight: "16px" }}>{children}</div>
);
export const Txt = ({ children, size = 14, color = C.ink, weight = 400 }: { children: React.ReactNode; size?: number; color?: string; weight?: number }) => (
  <div style={{ color, fontSize: size, lineHeight: `${size + 5}px`, fontWeight: weight }}>{children}</div>
);
export const Link2 = ({ children, href = "#", color = C.pine }: { children: React.ReactNode; href?: string; color?: string }) => (
  <a href={href} className="hover:underline" style={{ color, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{children}</a>
);
