"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { FabricCollection } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { weaveLayer, weaves, type Weave } from "@/lib/weaves";

const EASE = [0.22, 1, 0.36, 1] as const;
const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/* Brushed brass, lit from above */
const BRUSH_H = "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 3px)";
const BRASS_BAR = `${BRUSH_H}, linear-gradient(180deg, #f6e7bb 0%, #caa865 34%, #86662f 68%, #b8924b 100%)`;
const BRASS_POST =
  "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 3px), linear-gradient(90deg, #5c461f 0%, #b8924b 22%, #f4e8c7 44%, #caa865 60%, #6f5527 100%)";
const BRASS_PLATE = `${BRUSH_H}, linear-gradient(180deg, #f4e3b4 0%, #d6b979 45%, #a9873f 100%)`;
const LATTICE =
  "repeating-linear-gradient(45deg, rgba(202,168,101,0.34) 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, rgba(202,168,101,0.34) 0 1px, transparent 1px 9px)";
const CONE =
  "conic-gradient(from 158deg at 50% 0%, transparent 0deg, rgba(255,226,176,0.09) 10deg, rgba(255,232,190,0.15) 22deg, rgba(255,226,176,0.09) 34deg, transparent 44deg)";

/** Lighting baked into each fold: the wrap over the bar, the crease beneath it, a hem shadow and rounded sides. */
const FOLD_LIGHT = [
  "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 7%, rgba(0,0,0,0.55) 10%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 64%, rgba(0,0,0,0.5) 100%)",
  "linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0) 24%, rgba(255,255,255,0.22) 50%, rgba(0,0,0,0) 76%, rgba(0,0,0,0.65))",
].join(", ");

/** Cloth hangs at slightly different lengths, like real yardage over a bar. */
const DROP = [0.95, 0.84, 1, 0.88, 0.93, 0.82, 0.91];

/** Pinking-shears edge for the swatch on each tag. */
const PINKED = "conic-gradient(from -45deg at 50% 100%, transparent, #000 1deg 89deg, transparent 90deg)";

/** "activate": a click, tap or Enter on a shelf. "navigate": arrow keys moving through the rack. */
export type RackSource = "activate" | "navigate";

type Props = {
  collections: FabricCollection[];
  value: number;
  shade: number;
  onSelect: (collection: number, shade: number, source: RackSource) => void;
};

/**
 * Boutique unstitched rack: a walnut-and-brass cabinet where each shelf holds one
 * collection, its shades draped over a brass bar with a swatch tag pinned beside them.
 * It is the tablist that drives the inspection stage beside (or below) it.
 */
export function BoutiqueRack({ collections, value, shade, onSelect }: Props) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.2 });
  const lit = inView || !!reduce;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = collections.length;

  const onKey = (e: React.KeyboardEvent) => {
    const cols = window.matchMedia("(min-width: 640px)").matches ? 2 : 1;
    const map: Record<string, number> = {
      ArrowRight: value + 1,
      ArrowLeft: value - 1,
      ArrowDown: value + cols,
      ArrowUp: value - cols,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key]! + n) % n;
    onSelect(next, 0, "navigate");
    refs.current[next]?.focus();
  };

  return (
    <div ref={root} className="relative">
      <div
        className="relative rounded-[26px] p-[1.5px] shadow-[0_60px_90px_-55px_rgba(15,12,10,0.95)]"
        style={{ background: "linear-gradient(160deg, #f4e8c7, #b8924b 28%, #5c461f 52%, #dcc183 78%, #94733a)" }}
      >
        <div className="relative overflow-hidden rounded-[25px] bg-walnut-950">
          <Cornice lit={lit} />

          <div className="relative flex">
            <Lattice className="hidden sm:block" />

            <div
              role="tablist"
              aria-label="Fabric collections"
              onKeyDown={onKey}
              className="relative grid flex-1 grid-cols-1 px-2.5 pt-3 pb-2 sm:grid-cols-2 sm:gap-x-4 sm:px-3"
            >
              {/* Centre pilaster between the two bays */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-4 -translate-x-1/2 shadow-[0_0_14px_rgba(0,0,0,0.8)] sm:block" style={{ background: BRASS_POST }} />

              {/* Downlight cones */}
              <Cone lit={lit} delay={0.1} className="inset-x-0 sm:right-1/2" />
              <Cone lit={lit} delay={0.35} className="hidden sm:left-1/2 sm:block" />

              {collections.map((c, i) => (
                <RackSlot
                  key={c.id}
                  collection={c}
                  index={i}
                  active={i === value}
                  shade={shade}
                  lit={lit}
                  onPick={(s) => onSelect(i, s, "activate")}
                  buttonRef={(node) => {
                    refs.current[i] = node;
                  }}
                />
              ))}
            </div>

            <Lattice className="hidden sm:block" />
          </div>

          {/* Plinth */}
          <div aria-hidden="true" className="relative h-5 bg-[linear-gradient(180deg,#1a1511,#0b0907)] sm:h-7">
            <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: BRASS_BAR }} />
            <span className="absolute inset-x-[34%] top-1/2 h-px bg-gold-500/40" />
          </div>
        </div>
      </div>

      {/* Floor shadow */}
      <span aria-hidden="true" className="absolute inset-x-[8%] -bottom-5 -z-10 h-10 rounded-[50%] bg-walnut-950/30 blur-2xl" />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Cornice({ lit }: { lit: boolean }) {
  return (
    <div className="relative z-30 flex h-14 items-center justify-center bg-[linear-gradient(180deg,#1d1713,#0f0c0a)] sm:h-[70px]">
      <span aria-hidden="true" lang="ur" dir="rtl" className="absolute left-6 hidden font-urdu text-xl text-gold-400/45 sm:block">
        کپڑا
      </span>
      <span className="relative rounded-[3px] px-5 py-1.5 shadow-[0_8px_16px_-8px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(0,0,0,0.25)] sm:px-7 sm:py-2" style={{ background: BRASS_PLATE }}>
        <span className="mr-[-0.55em] font-caps text-[12px] font-semibold tracking-[0.55em] text-walnut-900 [text-shadow:0_1px_0_rgba(255,255,255,0.45)] sm:text-[14px]">
          Unstitched
        </span>
      </span>
      <span aria-hidden="true" className="absolute right-6 hidden font-caps text-[10px] tracking-[0.4em] text-gold-400/50 sm:block">
        NAWAB · EST.
      </span>

      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: BRASS_BAR }} />

      {/* Spot fixtures */}
      {["left-1/2 sm:left-1/4", "hidden sm:block left-3/4"].map((pos, i) => (
        <span key={pos} aria-hidden="true" className={cn("absolute -bottom-[11px] -translate-x-1/2", pos)}>
          <span className="block h-3 w-4 rounded-b-[6px] shadow-[0_3px_6px_rgba(0,0,0,0.7)]" style={{ background: BRASS_POST }} />
          <motion.span
            className="absolute -bottom-1 left-1/2 block size-2 -translate-x-1/2 rounded-full bg-[#fff2d4] shadow-[0_0_12px_4px_rgba(255,226,170,0.6)]"
            initial={false}
            animate={{ opacity: lit ? 1 : 0.15 }}
            transition={{ duration: 0.4, delay: lit ? 0.1 + i * 0.25 : 0 }}
          />
        </span>
      ))}
    </div>
  );
}

function Lattice({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("w-4 shrink-0 border-x border-gold-500/25", className)} style={{ background: `${LATTICE}, #0c0a08` }} />;
}

function Cone({ lit, delay, className }: { lit: boolean; delay: number; className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-y-0 z-20 mix-blend-screen", className)}
      style={{ background: CONE }}
      initial={false}
      animate={{ opacity: lit ? 1 : 0 }}
      transition={{ duration: 1.4, delay: lit ? delay : 0, ease: "easeOut" }}
    />
  );
}

/* ------------------------------------------------------------------ */

type SlotProps = {
  collection: FabricCollection;
  index: number;
  active: boolean;
  shade: number;
  lit: boolean;
  onPick: (shade: number) => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
};

function RackSlot({ collection, index, active, shade, lit, onPick, buttonRef }: SlotProps) {
  const reduce = useReducedMotion();
  const weave = weaves[collection.weave];
  const shown = active ? shade : 0;
  const tagShade = collection.shades[shown] ?? collection.shades[0]!;

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      role="tab"
      id={`fabric-tab-${collection.id}`}
      aria-selected={active}
      aria-controls="fabric-panel"
      tabIndex={active ? 0 : -1}
      onClick={(e) => {
        const hit = (e.target as HTMLElement).closest<HTMLElement>("[data-shade]");
        onPick(hit ? Number(hit.dataset.shade) : active ? shade : 0);
      }}
      initial={false}
      animate={{ opacity: lit ? 1 : 0.3 }}
      transition={{ duration: 0.9, delay: lit ? 0.2 + index * 0.09 : 0 }}
      className={cn(
        "group relative flex h-[126px] cursor-pointer text-left outline-none sm:h-[150px] lg:h-[176px] xl:h-[clamp(136px,17.5vh,170px)]",
        active ? "z-10" : "z-0 hover:z-[5]",
      )}
    >
      {/* Niche: back wall + its own downlight */}
      <span aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#14100d,#0a0806)] shadow-[inset_0_18px_22px_-14px_rgba(0,0,0,0.95)]">
        <span
          className={cn(
            "absolute inset-x-[6%] top-0 h-full bg-[radial-gradient(52%_62%_at_50%_0%,rgba(255,220,160,0.2),transparent_78%)] transition-opacity duration-700",
            active ? "opacity-100" : "opacity-55 group-hover:opacity-100",
          )}
        />
      </span>

      {/* Hover rim glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[6px] opacity-0 shadow-[inset_0_0_0_1px_rgba(220,193,131,0.55),inset_0_0_26px_rgba(202,168,101,0.22),0_0_26px_rgba(202,168,101,0.22)] transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      {/* Active frame glides between shelves */}
      {active && (
        <motion.span
          layoutId="rack-active"
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[3px] z-20 rounded-[9px] shadow-[inset_0_0_0_1px_#dcc183,0_0_0_3px_rgba(202,168,101,0.2),0_0_44px_rgba(202,168,101,0.42)]"
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
        />
      )}

      {/* Focus ring */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-1 z-20 rounded-[6px] ring-gold-200 group-focus-visible:ring-2" />

      {/* The cloth and its tag: pulled forward on hover, popped out when chosen */}
      <motion.span
        className="relative z-10 flex h-full w-full"
        initial={false}
        animate={active && !reduce ? { y: [0, -9, -3], scale: [1, 1.05, 1.025] } : { y: 0, scale: 1 }}
        transition={active ? { duration: 0.75, ease: EASE, times: [0, 0.4, 1] } : { duration: 0.45, ease: EASE }}
      >
        <span className="flex h-full w-full gap-2.5 px-2.5 pt-2.5 pb-[15px] transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:-translate-y-1 group-hover:scale-[1.02] sm:gap-3 sm:px-3 sm:pt-3 sm:pb-[17px]">
          <Tag collection={collection} index={index} hex={tagShade.hex} weave={weave} active={active} />
          <Folds collection={collection} weave={weave} active={active} shade={shade} />
        </span>

        {/* One-off light sweep when a shelf is chosen */}
        {active && !reduce && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <motion.span
              className="absolute inset-y-0 w-1/3 bg-[linear-gradient(100deg,transparent,rgba(255,236,196,0.28),transparent)]"
              initial={{ x: "-120%" }}
              animate={{ x: "320%" }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </motion.span>
        )}
      </motion.span>

      {/* Brass shelf lip */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[5] h-[7px] shadow-[0_7px_12px_rgba(0,0,0,0.75)]" style={{ background: BRASS_BAR }} />
    </motion.button>
  );
}

function Tag({ collection, index, hex, weave, active }: { collection: FabricCollection; index: number; hex: string; weave: Weave; active: boolean }) {
  return (
    <span
      className={cn(
        "relative flex w-[92px] shrink-0 origin-top flex-col overflow-hidden rounded-[4px] bg-ivory-50 shadow-[0_12px_20px_-10px_rgba(0,0,0,0.9)] transition-[rotate,box-shadow] duration-500 ease-[var(--ease-luxe)] sm:w-[86px] lg:w-[108px] xl:w-[100px]",
        active ? "shadow-[0_0_0_1.5px_#caa865,0_14px_24px_-10px_rgba(0,0,0,0.9)]" : "-rotate-[1.5deg] group-hover:rotate-0",
      )}
    >
      {/* Pinked swatch of the shade on show */}
      <span
        aria-hidden="true"
        className="relative isolate block h-[29%] shrink-0 transition-[background-color] duration-500 sm:h-[38%] xl:h-[31%]"
        style={{
          backgroundColor: hex,
          maskImage: PINKED,
          maskSize: "7px 100%",
          maskPosition: "50% 0",
          maskRepeat: "repeat-x",
          WebkitMaskImage: PINKED,
          WebkitMaskSize: "7px 100%",
          WebkitMaskPosition: "50% 0",
          WebkitMaskRepeat: "repeat-x",
        }}
      >
        <span className="absolute inset-0" style={weaveLayer(weave)} />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_40%,rgba(0,0,0,0.12))]" />
      </span>
      {/* Brass pin */}
      <span aria-hidden="true" className="absolute top-1.5 left-1/2 size-[7px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff6dc,#caa865_45%,#6f5527)] shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />

      <span className="flex min-h-0 flex-1 flex-col justify-end px-2 pt-1 pb-2 sm:px-2 lg:px-2.5 lg:pb-2.5">
        <span className="flex items-center gap-1.5 font-caps text-[9px] tracking-[0.18em] text-gold-700 max-sm:hidden lg:text-[10px]">
          {NUMERALS[index] ?? index + 1}
          {active && <span className="size-1.5 rounded-full bg-gold-500 shadow-[0_0_0_2.5px_rgba(202,168,101,0.25)]" />}
        </span>
        <span className="mt-0.5 font-display text-[15px] leading-[1.02] text-ink-900 sm:text-[14px] lg:text-[17px] xl:text-[15px]">{collection.name}</span>
        <span className="mt-1 text-[9px] leading-tight font-semibold tracking-[0.14em] text-ink-500 uppercase lg:text-[9.5px]">{collection.line}</span>
      </span>
    </span>
  );
}

function Folds({ collection, weave, active, shade }: { collection: FabricCollection; weave: Weave; active: boolean; shade: number }) {
  return (
    <span aria-hidden="true" className="relative min-w-0 flex-1">
      {/* Brass bar on two brackets */}
      <span className="absolute inset-x-0 top-[8%] h-[6px] rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.65)]" style={{ background: BRASS_BAR }} />
      <span className="absolute top-[8%] left-0 h-[14px] w-[5px] -translate-y-1 rounded-[2px]" style={{ background: BRASS_POST }} />
      <span className="absolute top-[8%] right-0 h-[14px] w-[5px] -translate-y-1 rounded-[2px]" style={{ background: BRASS_POST }} />

      <span className="absolute inset-x-[6%] top-[calc(8%-3px)] bottom-0 flex">
        {collection.shades.map((s, i) => {
          const chosen = active && i === shade;
          return (
            <span
              key={s.name}
              data-shade={i}
              title={s.name}
              className={cn(
                "relative h-full min-w-0 flex-1 transition-transform duration-500 ease-[var(--ease-luxe)]",
                i > 0 && "-ml-[5px]",
                chosen ? "-translate-y-[5px]" : "hover:-translate-y-[3px]",
              )}
              style={{ zIndex: chosen ? 20 : i }}
            >
              <span
                className="absolute inset-x-0 top-0 isolate overflow-hidden rounded-t-[7px] rounded-b-[2px] shadow-[-7px_10px_14px_-6px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.07] transition-[background-color] duration-500"
                style={{
                  height: `${(DROP[i % DROP.length] ?? 0.9) * 100}%`,
                  backgroundColor: s.hex,
                  backgroundImage: FOLD_LIGHT,
                  backgroundBlendMode: "soft-light, soft-light",
                }}
              >
                <span className="absolute inset-0" style={weaveLayer(weave)} />
                <span className="absolute inset-x-0 top-[8px] h-[5px] bg-gradient-to-b from-black/30 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black/20" />
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15" />
              </span>
              {chosen && (
                <motion.span
                  layoutId="rack-shade"
                  className="absolute -bottom-[9px] left-1/2 h-[2px] w-3/5 -translate-x-1/2 rounded-full bg-gold-300 shadow-[0_0_8px_rgba(220,193,131,0.8)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </span>
          );
        })}
      </span>
    </span>
  );
}
