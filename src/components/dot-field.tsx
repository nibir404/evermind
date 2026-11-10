"use client";
import { useEffect, useRef } from "react";

/**
 * Dot-grid texture that reacts to the cursor: dots near the pointer swell,
 * brighten and get pushed slightly away, then ease back when it leaves.
 * Falls back to a static grid when the user prefers reduced motion.
 */
export default function DotField({
  spacing = 9,
  radius = 1.2,
  color = "143,216,176",
  baseAlpha = 0.22,
  reach = 140,
  className,
  style,
}: {
  spacing?: number;
  radius?: number;
  /** "r,g,b" */
  color?: string;
  baseAlpha?: number;
  /** Cursor influence radius in px */
  reach?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0;
    // Pointer in canvas space; strength eases in and out.
    const target = { x: -9999, y: -9999, on: 0 };
    const p = { x: -9999, y: -9999, on: 0 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const reach2 = reach * reach;
      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          const dx = x - p.x, dy = y - p.y;
          const d2 = dx * dx + dy * dy;
          let k = 0;
          if (p.on > 0.01 && d2 < reach2) {
            const f = 1 - Math.sqrt(d2) / reach;
            k = f * f * p.on; // smooth falloff
          }
          const push = k * 6;
          const len = Math.sqrt(d2) || 1;
          const px = x + (dx / len) * push;
          const py = y + (dy / len) * push;
          ctx.beginPath();
          ctx.arc(px, py, radius * (1 + k * 1.4), 0, Math.PI * 2);
          ctx.fillStyle = k > 0.35
            ? `rgba(212,242,106,${Math.min(0.9, baseAlpha + k * 0.75)})` // lime near the cursor
            : `rgba(${color},${baseAlpha + k * 0.6})`;
          ctx.fill();
        }
      }
    };

    const tick = () => {
      p.x += (target.x - p.x) * 0.18;
      p.y += (target.y - p.y) * 0.18;
      p.on += (target.on - p.on) * 0.12;
      draw();
      const settled = Math.abs(target.on - p.on) < 0.005 && Math.abs(target.x - p.x) < 0.3 && Math.abs(target.y - p.y) < 0.3;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf && !reduced) raf = requestAnimationFrame(tick); };

    // Listen on window so the field reacts even when other UI sits on top of it.
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x > -reach && y > -reach && x < r.width + reach && y < r.height + reach;
      if (p.on < 0.01 && inside) { p.x = x; p.y = y; }
      target.x = x; target.y = y; target.on = inside ? 1 : 0;
      kick();
    };
    const onLeave = () => { target.on = 0; kick(); };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [spacing, radius, color, baseAlpha, reach]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={{ display: "block", pointerEvents: "none", ...style }} />;
}
