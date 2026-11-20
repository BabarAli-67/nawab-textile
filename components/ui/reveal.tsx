"use client";

import { motion, type HTMLMotionProps } from "motion/react";

/** Fades content up once it scrolls into view. */
export function Reveal({
  delay = 0,
  y = 24,
  children,
  ...rest
}: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionEyebrow({ numeral, label, urdu }: { numeral: string; label: string; urdu?: string }) {
  return (
    <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.42em] text-accent">
      <span className="font-caps text-sm tracking-[0.2em]">{numeral}</span>
      <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
      <span className="font-medium">{label}</span>
      {urdu && (
        <span lang="ur" dir="rtl" className="font-urdu text-base normal-case tracking-normal opacity-80">
          {urdu}
        </span>
      )}
    </div>
  );
}
