"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion } from "motion/react";
import trio from "@/public/images/perfumes/trio.jpg";
import shawlJamawar from "@/public/images/editorial/shawl-jamawar-macro.jpg";
import suitingStack from "@/public/images/editorial/suiting-stack-brown.jpg";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { pillars } from "@/lib/catalog";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

const CYCLE_MS = 5200;

/** Static imports give the hero blurred placeholders while the photos load. */
const HERO_IMAGES: Record<string, StaticImageData> = {
  perfumes: trio,
  shawls: shawlJamawar,
  fabrics: suitingStack,
};
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Hero — "three pillars". Every category is on screen from the first frame;
 * hovering (or the gentle autoplay) widens a pillar to reveal its tagline.
 */
export function HeroPillars() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [autoplay, setAutoplay] = useState(true);
  const [cycleKey, setCycleKey] = useState(0);
  const interacted = useRef(false);

  const stopAutoplay = useCallback(() => {
    interacted.current = true;
    setAutoplay(false);
  }, []);

  useEffect(() => {
    if (!autoplay || reduce) return;
    const desktop = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    if (!desktop.matches) return;
    const timer = window.setTimeout(
      () => {
        setActive((a) => (a === null ? 0 : (a + 1) % pillars.length));
        setCycleKey((k) => k + 1);
      },
      active === null ? 1900 : CYCLE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [autoplay, active, reduce]);

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-onyx-950"
      onMouseLeave={() => interacted.current && setActive(null)}
    >
      <h1 id="hero-title" className="sr-only">
        {site.name} — Perfumes, Shawls and Unstitched Fabrics. {site.tagline}.
      </h1>

      <div className="relative flex min-h-0 flex-1 flex-col pt-[9.25rem] sm:pt-[9.75rem] md:flex-row md:pt-0">
        {pillars.map((pillar, i) => {
          const isActive = active === i;
          const dimmed = active !== null && !isActive;
          const grow = active === null ? 1 : isActive ? 2.15 : 0.8;
          return (
            <motion.a
              key={pillar.id}
              href={`#${pillar.id}`}
              aria-label={`${pillar.title} — ${pillar.tagline}`}
              initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.25, delay: 0.15 + i * 0.14, ease: EASE }}
              onMouseEnter={() => {
                stopAutoplay();
                setActive(i);
              }}
              onFocus={() => {
                stopAutoplay();
                setActive(i);
              }}
              style={{ ["--grow" as string]: grow }}
              className={cn(
                "group relative isolate flex min-h-0 flex-1 overflow-hidden outline-none",
                "md:[flex-grow:var(--grow)] md:transition-[flex-grow] md:duration-[1100ms] md:ease-[var(--ease-luxe)]",
                "focus-visible:after:absolute focus-visible:after:inset-2 focus-visible:after:rounded-sm focus-visible:after:ring-1 focus-visible:after:ring-gold-300",
                i > 0 && "border-t border-gold-400/20 md:border-t-0 md:border-l",
              )}
            >
              <Image
                src={HERO_IMAGES[pillar.id] ?? pillar.image}
                alt=""
                fill
                preload
                placeholder="blur"
                quality={80}
                sizes="(min-width: 768px) 60vw, 100vw"
                className={cn(
                  "-z-20 object-cover transition-[transform,filter] duration-[1600ms] ease-[var(--ease-luxe)]",
                  isActive ? "scale-[1.02]" : "scale-[1.1]",
                  dimmed ? "brightness-[0.5] saturate-[0.7]" : "brightness-[0.82]",
                )}
                style={{ objectPosition: pillar.imagePosition }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-onyx-950 via-onyx-950/45 to-onyx-950/30 transition-opacity duration-700 md:via-onyx-950/30"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 -z-10 bg-[radial-gradient(120%_70%_at_50%_110%,rgba(202,168,101,0.28),transparent_60%)] transition-opacity duration-1000",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />

              {/* Urdu watermark */}
              <span
                aria-hidden="true"
                lang="ur"
                dir="rtl"
                className={cn(
                  "pointer-events-none absolute right-5 top-20 hidden font-urdu text-[7rem] leading-none text-gold-200 transition-[opacity,transform] duration-1000 md:block lg:text-[9rem]",
                  isActive ? "translate-y-0 opacity-25" : "translate-y-4 opacity-[0.08]",
                )}
              >
                {pillar.urdu}
              </span>

              <div className="@container relative mt-auto flex w-full flex-col p-5 pb-6 sm:p-8 md:p-10 lg:p-12">
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.75 + i * 0.14, ease: EASE }}
                  className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.4em] text-gold-300 sm:text-[11px]"
                >
                  <span className="font-caps text-sm tracking-[0.14em] text-gold-200">{pillar.numeral}</span>
                  <span aria-hidden="true" className="h-px w-8 bg-gold-300/60" />
                  {pillar.kicker}
                </motion.div>

                <motion.h2
                  initial={reduce ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.85 + i * 0.14, ease: EASE }}
                  className="mt-3 font-display text-[clamp(2.2rem,15cqi,5.25rem)] leading-[0.95] font-light tracking-[-0.01em]"
                >
                  <span className="text-metal [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">{pillar.title}</span>
                </motion.h2>

                {/* Mobile: always show a short line. Desktop: reveal on expand. */}
                <p className="mt-2 max-w-md text-[13px] leading-relaxed text-champagne-300 md:hidden">{pillar.cta} →</p>
                <div
                  className={cn(
                    "hidden md:grid md:transition-[grid-template-rows,opacity] md:duration-700 md:ease-[var(--ease-luxe)]",
                    isActive ? "md:grid-rows-[1fr] md:opacity-100" : "md:grid-rows-[0fr] md:opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="mt-5 max-w-md text-[15px] leading-relaxed text-champagne-200">{pillar.tagline}</p>
                    <span className="mt-6 inline-flex items-center gap-3 border-b border-gold-300/50 pb-1.5 text-[12px] font-semibold tracking-[0.22em] text-gold-200 uppercase">
                      {pillar.cta}
                      <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Autoplay progress */}
              {autoplay && isActive && !reduce && (
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-[2px] bg-champagne-100/10 md:block">
                  <motion.span
                    key={cycleKey}
                    className="block h-full origin-left bg-gradient-to-r from-gold-500 to-gold-200"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                  />
                </span>
              )}
            </motion.a>
          );
        })}
      </div>

      {/* Brand line — sits above the pillars */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-onyx-950/95 via-onyx-950/55 to-transparent" />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
        className="pointer-events-none absolute inset-x-0 top-[4.75rem] flex flex-col items-center px-6 text-center md:top-[6.25rem]"
      >
        <p aria-hidden="true" className="flex items-center gap-4 text-[10px] tracking-[0.5em] text-champagne-300 uppercase sm:text-[11px]">
          <span className="hairline-gold hidden h-px w-14 sm:block" />
          Perfumes · Shawls · Unstitched Fabrics
          <span className="hairline-gold hidden h-px w-14 sm:block" />
        </p>
        <p aria-hidden="true" className="mt-2 font-display text-xl font-light italic text-champagne-100 sm:text-2xl md:text-[1.7rem]">
          {site.tagline}
        </p>
      </motion.div>
    </section>
  );
}
