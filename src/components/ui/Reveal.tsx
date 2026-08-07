"use client";

import { motion, type Variants } from "framer-motion";
import * as React from "react";
import {
  blurReveal,
  fadeLeft,
  fadeRight,
  fadeUp,
  imageReveal,
  scaleIn,
  stagger,
  viewportOnce,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const PRESETS = {
  up: fadeUp,
  left: fadeLeft,
  right: fadeRight,
  scale: scaleIn,
  blur: blurReveal,
  image: imageReveal,
} satisfies Record<string, Variants>;

export type RevealPreset = keyof typeof PRESETS;

type RevealProps = {
  children: React.ReactNode;
  preset?: RevealPreset;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span" | "header";
};

/**
 * Scroll-triggered entrance. Framer Motion respects the user's
 * reduced-motion preference globally via <MotionConfig reducedMotion="user">.
 */
export function Reveal({
  children,
  preset = "up",
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={PRESETS[preset]}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Parent that staggers direct <RevealItem> children into view. */
export function RevealGroup({
  children,
  className,
  gap = 0.08,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  preset = "up",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  preset?: RevealPreset;
  as?: "div" | "li" | "article" | "span";
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag className={className} variants={PRESETS[preset]}>
      {children}
    </MotionTag>
  );
}

/** Word-by-word text reveal for headlines. */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  as: Tag = "h2",
  highlight,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Words matching this list get the brand gradient. */
  highlight?: string[];
}) {
  const words = text.split(" ");
  const hl = new Set((highlight ?? []).map((w) => w.toLowerCase()));

  return (
    <Tag className={cn("[perspective:800px]", className)}>
      <motion.span
        className="inline"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={cn(
                "inline-block",
                hl.has(word.replace(/[^\w]/g, "").toLowerCase()) && "text-gradient-brand",
                wordClassName,
              )}
              variants={{
                hidden: { y: "115%", opacity: 0, rotateX: -40 },
                show: {
                  y: "0%",
                  opacity: 1,
                  rotateX: 0,
                  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
