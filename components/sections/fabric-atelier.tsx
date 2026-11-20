"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUp, ChevronLeft, ChevronRight, Ruler, Scissors, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { BoutiqueRack, type RackSource } from "@/components/ui/boutique-rack";
import { WhatsAppIcon, StarMark } from "@/components/ui/icons";
import { Reveal, SectionEyebrow } from "@/components/ui/reveal";
import { boxes, fabricCollections, type FabricCollection, type Shade } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { whatsappLink } from "@/lib/site";
import { SHEEN, weaveLayer, weaves, type Weave } from "@/lib/weaves";

const EASE = [0.22, 1, 0.36, 1] as const;
const UNROLL = [0.65, 0, 0.35, 1] as const;
const ZOOM = 3;
const LENS = 190;
/** From this width the rack and the inspection stage sit side by side; below it they stack. */
const SPLIT_QUERY = "(min-width: 1280px)";

const slide = {
  enter: (d: number) => ({ opacity: 0, x: 18 * d }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: -14 * d }),
};

export function FabricAtelier() {
  const reduce = useReducedMotion();
  const [collectionIndex, setCollectionIndex] = useState(0);
  const [shadeIndex, setShadeIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const count = fabricCollections.length;
  const collection = fabricCollections[collectionIndex]!;
  const shade = collection.shades[shadeIndex] ?? collection.shades[0]!;
  const weave = weaves[collection.weave];
  const prev = fabricCollections[(collectionIndex - 1 + count) % count]!;
  const next = fabricCollections[(collectionIndex + 1) % count]!;

  const rackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const showBack = useBackToRack(rackRef, stageRef);
  const scrollTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);

  const select = (i: number, s: number) => {
    if (i !== collectionIndex) setDirection(i > collectionIndex ? 1 : -1);
    setCollectionIndex(i);
    setShadeIndex(s);
  };

  /** Stacked layout only: after a shelf is chosen, bring the inspection stage into view. */
  const onRackSelect = (i: number, s: number, source: RackSource) => {
    select(i, s);
    if (source !== "activate" || window.matchMedia(SPLIT_QUERY).matches) return;
    window.clearTimeout(scrollTimer.current);
    // A short beat lets the shelf pop out before the page moves.
    scrollTimer.current = window.setTimeout(() => {
      const stage = stageRef.current;
      if (!stage) return;
      const top = stage.getBoundingClientRect().top;
      if (top > 72 && top < window.innerHeight * 0.4) return;
      stage.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 180);
  };

  const step = (delta: 1 | -1) => {
    setDirection(delta);
    setCollectionIndex((collectionIndex + delta + count) % count);
    setShadeIndex(0);
  };

  const backToRack = () => {
    rackRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    document.getElementById(`fabric-tab-${collection.id}`)?.focus({ preventScroll: true });
  };

  const message = `Assalam-o-Alaikum Nawab, I'm interested in the ${collection.name} (${collection.line}) unstitched fabric in the shade "${shade.name}". Please share availability and price.`;

  return (
    <section id="fabrics" aria-labelledby="fabrics-title" className="theme-ivory relative isolate overflow-x-clip bg-background py-24 text-foreground md:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_100%_0%,rgba(202,168,101,0.16),transparent_70%)]" />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end">
          <Reveal>
            <SectionEyebrow numeral="III" label="Unstitched Fabrics" urdu="کپڑا" />
            <h2 id="fabrics-title" className="mt-6 font-display text-5xl leading-[0.95] font-light text-ink-950 sm:text-6xl lg:text-7xl">
              Cloth worth <em className="font-normal text-gold-700">the tailor&rsquo;s time.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-[15px] leading-relaxed text-ink-600 md:ml-auto">
              Men&rsquo;s unstitched suiting and super-fine cottons, sold by the suit length and signed on the selvedge. Pull a cloth from the
              rack, pick a shade from the card, then lean in — the weave is the whole story.
            </p>
          </Reveal>
        </div>

        {/* Atelier: the rack and the inspection stage share one view on wide screens */}
        <div className="mt-12 grid gap-10 md:mt-16 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] xl:items-start xl:gap-10 2xl:gap-14">
          <div ref={rackRef} className="scroll-mt-24 xl:sticky xl:top-24 split-short:top-[84px]">
            <Reveal>
              <BoutiqueRack collections={fabricCollections} value={collectionIndex} shade={shadeIndex} onSelect={onRackSelect} />
            </Reveal>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.26em] text-ink-500 uppercase">
                <span aria-hidden="true" className="h-px w-8 bg-gold-600/50" />
                <span className="hidden sm:inline">Hover a shelf · click a cloth to lay it out</span>
                <span className="sm:hidden">Tap a cloth to lay it out</span>
              </p>
              <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.26em] text-ink-500 uppercase">
                On the table
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`${collection.id}-${shade.name}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2 font-display text-lg tracking-normal text-ink-950 normal-case"
                  >
                    <span aria-hidden="true" className="size-3 rounded-full ring-1 ring-ink-900/20" style={{ backgroundColor: shade.hex }} />
                    {collection.name} · {shade.name}
                  </motion.span>
                </AnimatePresence>
                <ArrowDown aria-hidden="true" className="size-3.5 text-gold-600 xl:hidden" />
                <ArrowRight aria-hidden="true" className="hidden size-3.5 text-gold-600 xl:block" />
              </p>
            </div>
          </div>

          {/* Inspection stage — synced to the rack */}
          <div
            ref={stageRef}
            id="fabric-panel"
            role="tabpanel"
            aria-labelledby={`fabric-tab-${collection.id}`}
            className="scroll-mt-20 xl:sticky xl:top-24 split-short:top-[84px]"
          >
            <Reveal delay={0.1}>
              <div className="relative rounded-[28px] bg-ivory-50 p-4 shadow-[0_40px_80px_-50px_rgba(27,24,21,0.6)] ring-1 ring-ink-900/10 sm:p-6 split-short:p-5">
                {/* Phones: arrows get their own row so the collection line keeps its width */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                      <motion.div
                        key={collection.id}
                        custom={direction}
                        variants={slide}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <span className="rounded-full bg-gold-600/12 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-gold-700 uppercase">{collection.label}</span>
                          <span className="text-[10px] tracking-[0.22em] text-ink-500 uppercase">
                            {collection.line} · {weave.name}
                          </span>
                        </div>
                        <h3 className="mt-2.5 font-display text-4xl leading-none font-light text-ink-950 sm:text-5xl xl:text-[2.75rem] split-short:mt-2 split-short:text-[2.15rem]">{collection.name}</h3>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="self-end sm:self-auto">
                    <FabricStepper index={collectionIndex} count={count} prev={prev.name} next={next.name} onStep={step} />
                  </div>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={collection.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 text-[14px] leading-relaxed text-ink-600 xl:min-h-[4.7em] split-short:mt-2 split-short:min-h-0 split-short:text-[13px] split-short:leading-normal"
                  >
                    {collection.description}
                  </motion.p>
                </AnimatePresence>

                <Inspector
                  collection={collection}
                  shade={shade}
                  weave={weave}
                  className="mt-4 aspect-[4/3.2] sm:aspect-[16/10] xl:aspect-auto xl:h-[clamp(190px,27vh,320px)] split-short:mt-3 split-short:h-[clamp(168px,24.5vh,210px)]"
                />

                <div className="mt-5 grid items-end gap-x-6 gap-y-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] split-short:mt-3 split-short:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] split-short:gap-x-4">
                  <ShadeCard key={collection.id} shades={collection.shades} weave={weave} value={shadeIndex} onChange={setShadeIndex} />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.dl
                      key={collection.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="grid grid-cols-2 gap-x-4 gap-y-3 self-center"
                    >
                      {[
                        ["Composition", collection.composition],
                        ["Feel", collection.feel],
                        ["Season", collection.season],
                        ["Ideal for", collection.idealFor],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-[9.5px] font-semibold tracking-[0.24em] text-ink-500 uppercase">{k}</dt>
                          <dd className="mt-1 text-[13px] leading-snug text-ink-900">{v}</dd>
                        </div>
                      ))}
                    </motion.dl>
                  </AnimatePresence>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink-900/10 pt-4 split-short:mt-3 split-short:pt-3">
                  <a
                    href={whatsappLink(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-3 rounded-full bg-ink-900 px-6 text-[12px] font-semibold tracking-[0.2em] text-ivory-50 uppercase shadow-[0_14px_30px_-14px_rgba(27,24,21,0.8)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon className="size-5 text-gold-300" />
                    Inquire about this fabric
                  </a>
                  <span className="flex items-center gap-2 text-[12px] text-ink-500">
                    <Ruler className="size-4 text-gold-600" strokeWidth={1.5} /> {collection.length}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Signature boxes */}
        <Reveal className="mt-24 md:mt-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.36em] text-gold-700 uppercase">
                <StarMark className="size-3.5" /> The signature box
              </p>
              <h3 className="mt-4 font-display text-4xl leading-tight font-light text-ink-950 sm:text-5xl">Every suit arrives dressed for the occasion.</h3>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-ink-600">
              Our collections are boxed in hard-cover cases — ready to gift for Eid, weddings and the people who matter.
            </p>
          </div>
        </Reveal>
        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-5">
          {boxes.map((box, i) => (
            <Reveal key={box.src} delay={i * 0.06} className="w-[72%] shrink-0 snap-center sm:w-auto">
              <figure className="group">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-ivory-200 ring-1 ring-ink-900/5">
                  <Image
                    src={box.src}
                    alt={`${box.name} — ${box.note} presentation box`}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 70vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
                  />
                </div>
                <figcaption className="mt-3">
                  <span className="block font-display text-xl text-ink-900">{box.name}</span>
                  <span className="text-[10px] tracking-[0.24em] text-ink-500 uppercase">{box.note}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Tailor band */}
        <div className="mt-20 grid overflow-hidden rounded-[28px] bg-ink-900 text-champagne-100 md:mt-28 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative min-h-[300px] lg:min-h-[460px]">
            <Image src="/images/editorial/tailor-cut.jpg" alt="A tailor cutting dark suiting with shears" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ink-900/60" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <Scissors className="size-6 text-gold-300" strokeWidth={1.25} />
            <blockquote className="mt-6 font-display text-3xl leading-snug font-light sm:text-4xl">
              “From unstitched yardage to a silhouette that is <em className="text-gilt">entirely yours.</em>”
            </blockquote>
            <ol className="mt-8 space-y-4 text-[14px] text-champagne-300">
              {["Choose your cloth from a collection", "Pick a shade from the card", "Message us — we confirm stock, lengths and delivery"].map((step, i) => (
                <li key={step} className="flex items-baseline gap-4">
                  <span className="font-caps text-gold-300">0{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <BackToRack visible={showBack} onClick={backToRack} />
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** Stacked layout only: show "Back to the rack" while the stage is on screen and the rack has scrolled away. */
function useBackToRack(rack: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>) {
  const [state, setState] = useState({ rackInView: true, stageInView: false, split: false });

  useEffect(() => {
    const rackEl = rack.current;
    const stageEl = stage.current;
    if (!rackEl || !stageEl) return;
    const media = window.matchMedia(SPLIT_QUERY);
    const onMedia = () => setState((old) => ({ ...old, split: media.matches }));
    onMedia();
    media.addEventListener("change", onMedia);
    // The rack only counts as in view while it reaches below the top third of the screen.
    const rackIO = new IntersectionObserver(([entry]) => setState((old) => ({ ...old, rackInView: !!entry?.isIntersecting })), {
      rootMargin: "-35% 0px 0px 0px",
    });
    const stageIO = new IntersectionObserver(([entry]) => setState((old) => ({ ...old, stageInView: !!entry?.isIntersecting })), {
      rootMargin: "0px 0px -20% 0px",
    });
    rackIO.observe(rackEl);
    stageIO.observe(stageEl);
    return () => {
      media.removeEventListener("change", onMedia);
      rackIO.disconnect();
      stageIO.disconnect();
    };
  }, [rack, stage]);

  return !state.split && state.stageInView && !state.rackInView;
}

function BackToRack({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onClick}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-4 z-40 flex items-center sm:left-1/2 sm:-translate-x-1/2 gap-2.5 rounded-full bg-ink-900/92 py-2.5 pr-5 pl-2.5 text-[11px] font-semibold tracking-[0.2em] whitespace-nowrap text-ivory-50 uppercase shadow-[0_18px_40px_-14px_rgba(15,12,10,0.75)] ring-1 ring-gold-400/50 backdrop-blur-md sm:bottom-8 xl:hidden"
        >
          <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-gold-400/15 text-gold-300">
            <ArrowUp className="size-4" />
          </span>
          Back to the rack
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function FabricStepper({ index, count, prev, next, onStep }: { index: number; count: number; prev: string; next: string; onStep: (delta: 1 | -1) => void }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const button =
    "group grid size-11 place-items-center rounded-full text-ink-800 ring-1 ring-ink-900/15 transition-[background-color,color,box-shadow] duration-300 hover:bg-ink-900 hover:text-gold-200 hover:ring-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600";
  return (
    <div role="group" aria-label="Browse fabrics" className="flex shrink-0 items-center gap-1">
      <button type="button" aria-label={`Previous fabric: ${prev}`} title={prev} onClick={() => onStep(-1)} className={button}>
        <ChevronLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </button>
      <span aria-live="polite" className="min-w-[3.6rem] text-center font-caps text-[11px] tracking-[0.14em] text-ink-500 tabular-nums">
        {pad(index + 1)}
        <span className="text-ink-300"> / </span>
        {pad(count)}
      </span>
      <button type="button" aria-label={`Next fabric: ${next}`} title={next} onClick={() => onStep(1)} className={button}>
        <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Surface({ color, sizes, weave, zoom = 1 }: { color: string; sizes: string; weave: Weave; zoom?: number }) {
  return (
    <div className="absolute inset-0 isolate">
      <div className="absolute inset-0 transition-[background-color] duration-700 ease-[var(--ease-silk)]" style={{ backgroundColor: color }} />
      <Image src="/images/textures/suiting-neutral.jpg" alt="" fill sizes={sizes} quality={90} className="object-cover mix-blend-soft-light" draggable={false} />
      <Image src="/images/textures/suiting-neutral.jpg" alt="" fill sizes={sizes} quality={90} className="object-cover opacity-30 mix-blend-multiply" draggable={false} />
      <div className="absolute inset-0" style={weaveLayer(weave, zoom)} />
      {weave.sheen && <div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: SHEEN }} />}
    </div>
  );
}

function Inspector({ collection, shade, weave, className }: { collection: FabricCollection; shade: Shade; weave: Weave; className?: string }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const dark = luminance(shade.hex) < 0.35;

  const track = (e: React.PointerEvent) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect) return;
    setLens({ x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width, h: rect.height });
  };

  const selvedge = `NAWAB TEXTILE INTERNATIONAL  ★ ★ ★  ${collection.name.toUpperCase()} ${collection.line.toUpperCase()}  ★ ★ ★  `;
  /* The loupe never outgrows a short canvas. */
  const size = lens ? Math.round(Math.min(LENS, lens.h * 0.74)) : LENS;

  return (
    <div
      ref={box}
      onPointerMove={track}
      onPointerDown={track}
      onPointerLeave={() => setLens(null)}
      onPointerCancel={() => setLens(null)}
      onPointerUp={(e) => e.pointerType !== "mouse" && setLens(null)}
      className={cn(
        "relative cursor-zoom-in touch-pan-y overflow-hidden rounded-[22px] shadow-[0_30px_60px_-36px_rgba(27,24,21,0.55)] ring-1 ring-ink-900/10 select-none",
        className,
      )}
      role="img"
      aria-label={`${collection.name} fabric in ${shade.name}. Hover or press to magnify the weave.`}
    >
      {/* A new cloth unrolls over the last one when the collection changes */}
      <AnimatePresence initial={false}>
        <motion.div
          key={collection.id}
          className="absolute inset-0 overflow-hidden"
          initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ filter: "brightness(0.8)" }}
          transition={{ duration: 1.05, ease: UNROLL }}
        >
          <Surface color={shade.hex} weave={weave} sizes="(min-width: 1280px) 42vw, 100vw" />
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,transparent_80%,rgba(255,255,255,0.26)_94%,rgba(0,0,0,0.32)_100%)]"
              initial={{ y: "-100%", opacity: 1 }}
              animate={{ y: "0%", opacity: [1, 1, 0] }}
              transition={{ y: { duration: 1.05, ease: UNROLL }, opacity: { duration: 1.35, times: [0, 0.7, 1] } }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Selvedge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-9 overflow-hidden border-t border-black/10"
        style={{ backgroundColor: `color-mix(in oklab, ${shade.hex} 82%, ${dark ? "white" : "black"})` }}
      >
        <p className={cn("w-max animate-marquee font-caps text-[10px] leading-9 tracking-[0.42em] whitespace-nowrap motion-reduce:animate-none", dark ? "text-gold-200/80" : "text-ink-900/70")}>
          {selvedge.repeat(6)}
        </p>
      </div>

      <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[10.5px] font-medium tracking-[0.18em] text-white uppercase backdrop-blur-md">
        <span className="size-3 rounded-full ring-1 ring-white/70" style={{ backgroundColor: shade.hex }} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={shade.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
            {shade.name}
          </motion.span>
        </AnimatePresence>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute top-3 right-3 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[10.5px] tracking-[0.18em] text-white uppercase backdrop-blur-md transition-opacity duration-300",
          lens ? "opacity-0" : "opacity-100",
        )}
      >
        <ZoomIn className="size-3.5" /> <span className="hidden sm:inline">Hover to inspect · {weave.name}</span>
        <span className="sm:hidden">Press to inspect</span>
      </div>

      {/* Packaging tag */}
      <div className="pointer-events-none absolute right-3 bottom-12 flex items-center gap-2.5 rounded-xl bg-ivory-50/92 p-1.5 pr-3 shadow-[0_14px_30px_-16px_rgba(27,24,21,0.55)] ring-1 ring-ink-900/5 backdrop-blur">
        <span className="relative size-10 overflow-hidden rounded-lg bg-ivory-200">
          <AnimatePresence initial={false}>
            <motion.span key={collection.box} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <Image src={collection.box} alt="" fill sizes="40px" className="object-cover" />
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="leading-tight">
          <span className="block text-[9px] tracking-[0.22em] text-ink-500 uppercase">Selvedge-signed</span>
          <span className="block font-display text-[15px] text-ink-900">{collection.name}</span>
        </span>
      </div>

      {lens && (
        <motion.div
          aria-hidden="true"
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="pointer-events-none absolute z-10 overflow-hidden rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.35)] ring-2 ring-gold-300"
          style={{ width: size, height: size, left: lens.x - size / 2, top: lens.y - size / 2 }}
        >
          <div className="absolute" style={{ width: lens.w * ZOOM, height: lens.h * ZOOM, left: -(lens.x * ZOOM - size / 2), top: -(lens.y * ZOOM - size / 2) }}>
            <Surface color={shade.hex} weave={weave} zoom={ZOOM} sizes="2400px" />
          </div>
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_45%)]" />
        </motion.div>
      )}
    </div>
  );
}

function ShadeCard({ shades, weave, value, onChange }: { shades: Shade[]; weave: Weave; value: number; onChange: (i: number) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = shades.length;
  const spread = Math.min(56, n * 9);

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: value + 1, ArrowDown: value + 1, ArrowLeft: value - 1, ArrowUp: value - 1, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key]! + n) % n;
    onChange(next);
    refs.current[next]?.focus();
  };

  return (
    <fieldset>
      <legend className="flex w-full flex-wrap items-baseline justify-between gap-x-3 text-[10px] font-semibold tracking-[0.26em] text-ink-500 uppercase">
        <span>Shade card · {n} shades</span>
        <span className="font-display text-base tracking-normal text-ink-900 normal-case">{shades[value]?.name}</span>
      </legend>
      <div role="radiogroup" aria-label="Shades" onKeyDown={onKey} className="relative mx-auto mt-3 h-[134px] w-full max-w-[260px] split-short:mt-2 split-short:h-[116px]">
        {shades.map((s, i) => {
          const angle = n === 1 ? 0 : -spread / 2 + (spread * i) / (n - 1);
          const selected = i === value;
          return (
            <motion.button
              key={s.name}
              ref={(node) => {
                refs.current[i] = node;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={s.name}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(i)}
              initial={{ rotate: 0, y: 30, opacity: 0 }}
              animate={{ rotate: angle, y: selected ? -14 : 0, opacity: 1 }}
              whileHover={{ y: selected ? -14 : -8 }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.03 }}
              className="absolute bottom-0 left-1/2 -ml-[22px] h-[112px] w-[44px] origin-[50%_160%] split-short:-ml-[19px] split-short:h-[96px] split-short:w-[38px] overflow-hidden rounded-[9px] shadow-[0_8px_20px_-8px_rgba(27,24,21,0.55)] ring-1 ring-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              style={{ zIndex: selected ? 20 : i }}
            >
              <Surface color={s.hex} weave={weave} sizes="80px" />
              <span className="absolute inset-x-0 top-0 h-3 bg-black/15" />
              {selected && <span className="absolute inset-x-2 bottom-2 h-0.5 rounded-full bg-gold-300" />}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

function luminance(hex: string) {
  const v = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
