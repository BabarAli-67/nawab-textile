"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./preloader.css";

/** A short beat at "100" before the curtains part. */
const HOLD_MS = 110;
/** Curtains (60 + 820 ms) and the hero settling (60 + 1000 ms), then unmount. */
const EXIT_MS = 1100;
const EXIT_REDUCED_MS = 450;
/** Used only if the browser can't report the counter's CSS animation. */
const FALLBACK_MS = 1250;

type Phase = "loading" | "exit" | "done";

/** Lets visitors without JavaScript skip the preloader entirely. */
const NO_SCRIPT = `<style>#nawab-preloader{display:none!important}html{overflow:auto!important}#top{transform:none!important}body>header{opacity:1!important;transform:none!important}</style>`;

/**
 * Opening curtain for the first page load. The intro is pure CSS and starts at
 * first paint; this component waits for the counter to land on 100, parts the
 * curtains, then removes itself so nothing is left behind.
 */
export function Preloader() {
  const [phase, setPhase] = useState<Phase>("loading");
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (phase !== "loading") return;
    let cancelled = false;
    let timer = 0;

    const running = counter.current?.getAnimations?.() ?? [];
    const counted: Promise<unknown> = running.length
      ? Promise.all(running.map((a) => a.finished)).catch(() => undefined)
      : new Promise((resolve) => window.setTimeout(resolve, Math.max(0, FALLBACK_MS - performance.now())));

    counted.then(() => {
      if (!cancelled) timer = window.setTimeout(() => setPhase("exit"), HOLD_MS);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setPhase("done"), reduce ? EXIT_REDUCED_MS : EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div id="nawab-preloader" className="npl-root" data-phase={phase} role="status">
      <span className="sr-only">Loading Nawab Textile</span>

      <div aria-hidden="true" className="npl-panel npl-left">
        <span className="npl-folds" />
        <span className="npl-corner npl-tl" />
        <span className="npl-corner npl-bl" />
        <span className="npl-thread">
          <span className="npl-line" />
          <span className="npl-spark" />
        </span>
        <span className="npl-seam" />
        <span className="npl-shade" />
      </div>

      <div aria-hidden="true" className="npl-panel npl-right">
        <span className="npl-folds" />
        <span className="npl-corner npl-tr" />
        <span className="npl-corner npl-br" />
        <span className="npl-thread">
          <span className="npl-line" />
          <span className="npl-spark" />
        </span>
        <span className="npl-seam" />
        <span className="npl-shade" />
      </div>

      <span aria-hidden="true" className="npl-grain" />

      <div aria-hidden="true" className="npl-stage">
        <span className="npl-glow" />
        <svg className="npl-ring" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="pl-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8a6a2f" />
              <stop offset="0.35" stopColor="#d4af37" />
              <stop offset="0.55" stopColor="#f6e7b8" />
              <stop offset="0.8" stopColor="#d4af37" />
              <stop offset="1" stopColor="#8a6a2f" />
            </linearGradient>
          </defs>
          {/* The thread splits at 9 o'clock, wraps the emblem both ways and rejoins at 3 o'clock */}
          <path className="npl-arc" d="M1 50A49 49 0 0 1 99 50" pathLength={1} stroke="url(#pl-gold)" />
          <path className="npl-arc" d="M1 50A49 49 0 0 0 99 50" pathLength={1} stroke="url(#pl-gold)" />
        </svg>
        <span className="npl-emblem">
          <Image src="/images/brand/logo-emblem.png" alt="" width={158} height={158} quality={90} preload />
        </span>

        <div className="npl-meta">
          <span ref={counter} className="npl-count" />
          <span className="npl-rule" />
          <p className="npl-whispers">
            <span>Perfumes</span>
            <i className="npl-dot">•</i>
            <span>Shawls</span>
            <i className="npl-dot">•</i>
            <span>Unstitched Fabrics</span>
          </p>
        </div>
      </div>

      <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT }} />
    </div>
  );
}
