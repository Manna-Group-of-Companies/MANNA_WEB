"use client";

import * as React from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };

/**
 * Canvas particle field with proximity linking.
 * Cheap by design: capped particle count, DPR-aware, pauses when the tab or
 * the element itself is not visible, and disabled entirely under
 * prefers-reduced-motion.
 */
export function ParticleField({
  className,
  density = 0.00009,
  max = 90,
  linkDistance = 130,
}: {
  className?: string;
  density?: number;
  max?: number;
  linkDistance?: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let particles: P[] = [];
    let w = 0;
    let h = 0;
    const pointer = { x: -9999, y: -9999 };

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    /**
     * Linking is O(n²), so the particle budget scales with viewport size —
     * a phone gets roughly a third of the pairs a desktop does.
     */
    let budget = max;
    let linkDist = linkDistance;

    const seed = () => {
      if (w < 640) {
        budget = Math.min(max, 32);
        linkDist = Math.min(linkDistance, 92);
      } else if (w < 1024) {
        budget = Math.min(max, 58);
        linkDist = Math.min(linkDistance, 112);
      } else {
        budget = max;
        linkDist = linkDistance;
      }

      const count = Math.min(budget, Math.round(w * h * density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.8 + 0.7,
        a: Math.random() * 0.5 + 0.25,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const d = dpr();
      canvas.width = Math.floor(w * d);
      canvas.height = Math.floor(h * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      seed();
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // gentle repulsion from the pointer
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000 && d2 > 0.01) {
          const f = (1 - d2 / 14000) * 0.55;
          const d = Math.sqrt(d2);
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 147, 64, ${p.a})`;
        ctx.fill();
      }

      // link nearby particles
      const ld2 = linkDist * linkDist;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > ld2) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(244, 121, 32, ${(1 - d2 / ld2) * 0.16})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, density, max, linkDistance]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
