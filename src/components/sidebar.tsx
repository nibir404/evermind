"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ProfileAvatar } from "./workspace-hub";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// Icons exactly as drawn in the Paper sidebar.
const icons = {
  home: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" {...stroke} />
      <rect x="14" y="3" width="7" height="5" rx="1.5" {...stroke} />
      <rect x="14" y="12" width="7" height="9" rx="1.5" {...stroke} />
      <rect x="3" y="16" width="7" height="5" rx="1.5" {...stroke} />
    </>
  ),
  ask: <path d="M21 11.5a8.4 8.4 0 01-12.3 7.5L3 21l1.9-5.4A8.5 8.5 0 1121 11.5z" {...stroke} />,
  talk: <path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4" {...stroke} />,
  decide: <path d="M12 3v18M7 21h10M4 7h16M6 7l-3 7a3 3 0 006 0zM18 7l-3 7a3 3 0 006 0z" {...stroke} />,
  brain: (
    <>
      <circle cx="12" cy="5" r="2" {...stroke} />
      <circle cx="5" cy="19" r="2" {...stroke} />
      <circle cx="19" cy="19" r="2" {...stroke} />
      <circle cx="12" cy="13" r="2" {...stroke} />
      <path d="M12 7v4M10.5 14.5l-4 3M13.5 14.5l4 3" {...stroke} />
    </>
  ),
  book: <path d="M2 4h6a4 4 0 014 4v13a3 3 0 00-3-3H2zM22 4h-6a4 4 0 00-4 4v13a3 3 0 013-3h7z" {...stroke} />,
  approvals: <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z M9 12l2 2 4-4" {...stroke} />,
};

const nav: { href: string; label: string; icon: keyof typeof icons }[] = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/ask", label: "Ask", icon: "ask" },
  { href: "/talk", label: "Talk", icon: "talk" },
  { href: "/decide", label: "Decide", icon: "decide" },
  { href: "/brain", label: "Knowledge brain", icon: "brain" },
  { href: "/book", label: "Book", icon: "book" },
  { href: "/approvals", label: "Approvals", icon: "approvals" },
];

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
      <rect width="64" height="64" rx="18" fill="#D4F26A" />
      <path d="M32 14c9.94 0 18 8.06 18 18s-8.06 18-18 18-18-8.06-18-18c0-6.2 3.14-11.67 7.92-14.9" fill="none" stroke="#0E2E25" strokeWidth="5" strokeLinecap="round" />
      <circle cx="32" cy="32" r="6.5" fill="#0E2E25" />
    </svg>
  );
}

function Item({ href, label, icon, active }: { href: string; label: string; icon: keyof typeof icons; active: boolean }) {
  return (
    <Link href={href} aria-label={label} className="group relative grid place-items-center" style={{ width: 40, height: 40, color: active ? "#0E5A43" : "#4A4752" }}>
      {active && (
        <motion.span layoutId="nav-pill" className="absolute inset-0" style={{ background: "#E2F0E8", borderRadius: 4 }} transition={{ type: "spring", stiffness: 500, damping: 40 }} />
      )}
      <svg width="18" height="18" viewBox="0 0 24 24" className="relative">
        {icons[icon]}
      </svg>
      <span className="pointer-events-none absolute left-12 z-50 whitespace-nowrap rounded-[4px] bg-[#111113] px-2 py-1 text-[12px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
    </Link>
  );
}

export function Sidebar() {
  const path = usePathname();
  return (
    <aside
      className="app-sidebar fixed z-40"
      style={{
        alignItems: "center",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        backgroundColor: "#FFFFFFB8",
        borderRadius: 4,
        boxShadow: "#0000000F 0px 0px 0px 0.5px, #0000000A 0px 8px 32px -12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        left: 16,
        top: 16,
        bottom: 16,
        paddingBlock: 14,
        width: 64,
      }}
    >
      <div className="app-sidebar-nav" style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 6 }}>
        <Link href="/home" aria-label="EverMind" className="app-sidebar-logo">
          <Logo />
        </Link>
        <div className="app-sidebar-logo" style={{ height: 14 }} />
        {nav.map((n) => (
          <Item key={n.href} {...n} active={path.startsWith(n.href)} />
        ))}
      </div>
      <div className="app-sidebar-foot" style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 6 }}>
        <ProfileAvatar />
      </div>
    </aside>
  );
}
