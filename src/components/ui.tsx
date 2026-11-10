"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";

export const ease = [0.32, 0.72, 0, 1] as const;

export function Reveal({ children, delay = 0, className, ...rest }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease, delay }}
      className={`${className ?? ""} ${rest.style?.display === "flex" && rest.style?.flexDirection !== "column" ? "paper-layout-row" : ""}`} 
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <Reveal className="mb-10 flex items-end justify-between gap-6">
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="display text-[44px] leading-[1.05]">{title}</h1>
      </div>
      {action}
    </Reveal>
  );
}

type BtnProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "lime" | "ghost";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
};

const styles = {
  primary: "bg-ink text-white hover:bg-black",
  secondary: "bg-white text-ink shadow-soft hover:bg-white/80",
  lime: "bg-lime text-pine-deep hover:brightness-95",
  ghost: "text-pine hover:bg-pine-wash/60",
};

export function Button({ children, variant = "primary", href, onClick, className = "", type = "button" }: BtnProps) {
  const cls = `inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] px-4 text-[14px] font-medium transition-all duration-200 active:scale-[0.97] ${styles[variant]} ${className}`;
  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", dither = false }: { children: React.ReactNode; className?: string; dither?: boolean }) {
  return <div className={`surface ${dither ? "dither" : ""} ${className}`}>{children}</div>;
}

export function Pill({ children, tone = "pine" }: { children: React.ReactNode; tone?: "pine" | "lime" | "mute" | "warn" | "danger" }) {
  const t = {
    pine: "bg-pine-wash text-pine",
    lime: "bg-lime text-pine-deep",
    mute: "bg-canvas text-slate",
    warn: "bg-[#FBF1DE] text-warning",
    danger: "bg-[#F8E6E4] text-danger",
  }[tone];
  return <span className={`inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-[4px] px-2 text-[12px] font-medium ${t}`}>{children}</span>;
}
