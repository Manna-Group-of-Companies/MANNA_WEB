"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * 3D card tilt that follows the pointer, with a moving specular sheen.
 * Disabled on coarse pointers so touch devices don't get a stuck transform.
 */
export function Tilt({
  children,
  className,
  max = 8,
  scale = 1.015,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const fine = useMediaQuery("(pointer: fine)");

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const config = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), config);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), config);

  const glareX = useTransform(mx, (v) => `${v * 100}%`);
  const glareY = useTransform(my, (v) => `${v * 100}%`);
  // Motion template keeps the gradient tracking the pointer; reading .get()
  // during render would freeze it at the first frame.
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 55%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  if (!fine) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("relative [perspective:1100px]", className)}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: sheen }}
        />
      )}
    </motion.div>
  );
}

/** Lightweight spotlight-follow effect for cards that shouldn't rotate. */
export function Spotlight({
  children,
  className,
  size = 380,
}: {
  children: React.ReactNode;
  className?: string;
  size?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: -9999, y: -9999 });
  const fine = useMediaQuery("(pointer: fine)");

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!fine) return;
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setPos({ x: -9999, y: -9999 })}
      className={cn("group relative", className)}
    >
      {fine && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, rgba(244,121,32,0.15), transparent 62%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
