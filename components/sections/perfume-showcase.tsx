"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, Feather, Flame, Gift, Hourglass } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { ArchFrame } from "@/components/ui/arch-frame";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal, SectionEyebrow } from "@/components/ui/reveal";
import { perfumes, type Perfume } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { whatsappLink } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const TIERS = [
  { key: "top", label: "Top Notes", hint: "The first impression", Icon: Feather },
  { key: "heart", label: "Heart Notes", hint: "The character", Icon: Flame },
  { key: "base", label: "Base Notes", hint: "What lingers", Icon: Hourglass },
] as const;

export function PerfumeShowcase() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sizes, setSizes] = useState<Record<string, string>>(() =>
    Object.fromEntries(perfumes.map((p) => [p.id, p.sizes.at(-1) ?? "100 ml"])),
  );
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const perfume = perfumes[index]!;
  const size = sizes[perfume.id]!;

  const go = useCallback(
    (next: number) => {
      const n = (next + perfumes.length) % perfumes.length;
      if (n === index) return;
      const wrappedForward = index === perfumes.length - 1 && n === 0;
      const wrappedBack = index === 0 && n === perfumes.length - 1;
      setDirection(wrappedForward || (n > index && !wrappedBack) ? 1 : -1);
      setIndex(n);
    },
    [index],
  );

  const onTabKey = (event: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: perfumes.length - 1 };
    if (!(event.key in map)) return;
    event.preventDefault();
    const n = (map[event.key]! + perfumes.length) % perfumes.length;
    go(n);
    tabs.current[n]?.focus();
  };

  const message = `Assalam-o-Alaikum Nawab, I'm interested in ${perfume.name.toUpperCase()} Eau de Parfum (${size}). Could you please share availability and price?`;

  return (
    <section id="perfumes" aria-labelledby="perfumes-title" className="relative isolate overflow-hidden bg-onyx-950 py-24 md:py-32">
      {/* Scent-tinted ambient light */}
      {perfumes.map((p, i) => (
        <div
          key={p.id}
          aria-hidden="true"
          className="absolute inset-0 -z-20 transition-opacity duration-[1400ms] ease-[var(--ease-silk)]"
          style={{
            opacity: i === index ? 1 : 0,
            background: `radial-gradient(55% 45% at 50% 52%, ${p.glow}, transparent 70%), radial-gradient(40% 30% at 85% 10%, ${p.glow.replace(/[\d.]+\)$/, "0.12)")}, transparent 70%)`,
          }}
        />
      ))}
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />

      {/* Giant scent name */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[34%] -z-10 flex justify-center overflow-hidden md:top-[30%]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={perfume.id}
            initial={{ opacity: 0, y: 60 * direction, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -60 * direction, filter: "blur(8px)" }}
            transition={{ duration: 1, ease: EASE }}
            className="font-caps text-[24vw] leading-none font-semibold tracking-[0.06em] text-transparent select-none md:text-[19vw]"
            style={{ WebkitTextStroke: `1px color-mix(in oklab, ${perfume.accent} 38%, transparent)` }}
          >
            {perfume.name.toUpperCase()}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end">
          <Reveal>
            <SectionEyebrow numeral="I" label="Les Parfums" urdu="عطر" />
            <h2 id="perfumes-title" className="mt-6 font-display text-5xl leading-[0.95] font-light text-champagne-50 sm:text-6xl lg:text-7xl">
              Three signatures, <em className="text-gilt font-normal">one bloodline.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-[15px] leading-relaxed text-champagne-300 md:ml-auto">
              Each Nawab eau de parfum carries the house mark — the quiet <span className="font-display text-lg italic text-champagne-100">h.</span> —
              and a name drawn from Urdu poetry. Choose a scent to explore its story, its notes and its presence.
            </p>
          </Reveal>
        </div>

        <div
          role="tabpanel"
          id="perfume-panel"
          aria-labelledby={`perfume-tab-${perfume.id}`}
          className="mt-14 grid items-center gap-x-10 gap-y-12 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,430px)_minmax(0,1fr)]"
        >
          {/* Stage */}
          <div className="order-1 lg:order-2">
            <Stage perfume={perfume} direction={direction} reduce={!!reduce} onPrev={() => go(index - 1)} onNext={() => go(index + 1)} />
          </div>

          {/* Details */}
          <div className="order-2 lg:order-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={perfume.id}
                initial={{ opacity: 0, x: 24 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 * direction }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <p className="font-caps text-xs tracking-[0.3em] text-champagne-400">
                  <span className="text-gold-300">{String(index + 1).padStart(2, "0")}</span> / {String(perfumes.length).padStart(2, "0")} · Eau de Parfum
                </p>
                <div className="mt-3 flex items-end gap-5">
                  <h3 className="text-metal font-display text-6xl leading-none font-light sm:text-7xl">{perfume.name}</h3>
                  <span lang="ur" dir="rtl" className="pb-1 font-urdu text-4xl leading-[1.6]" style={{ color: perfume.accent }}>
                    {perfume.urdu}
                  </span>
                </div>
                <p className="mt-3 text-[12px] font-medium tracking-[0.28em] text-gold-300 uppercase">
                  “{perfume.meaning}” · {perfume.family}
                </p>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-champagne-200">{perfume.description}</p>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Mood">
                  {perfume.mood.map((m) => (
                    <li key={m} className="rounded-full border border-champagne-100/15 px-3.5 py-1.5 text-[11px] tracking-[0.18em] text-champagne-200 uppercase">
                      {m}
                    </li>
                  ))}
                </ul>

                <fieldset className="mt-8">
                  <legend className="text-[11px] font-medium tracking-[0.3em] text-champagne-400 uppercase">Flacon</legend>
                  <div className="mt-3 inline-flex rounded-full border border-champagne-100/15 bg-onyx-900/60 p-1 backdrop-blur">
                    {perfume.sizes.map((s) => {
                      const selected = s === size;
                      return (
                        <label
                          key={s}
                          className={cn(
                            "relative cursor-pointer rounded-full px-5 py-2.5 text-[13px] font-medium tracking-[0.08em] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-400",
                            selected ? "text-onyx-950" : "text-champagne-200 hover:text-champagne-50",
                          )}
                        >
                          <input
                            type="radio"
                            name={`size-${perfume.id}`}
                            value={s}
                            checked={selected}
                            onChange={() => setSizes((prev) => ({ ...prev, [perfume.id]: s }))}
                            className="sr-only"
                          />
                          {selected && (
                            <motion.span
                              layoutId="size-pill"
                              className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-gold-200 to-gold-500"
                              transition={{ type: "spring", stiffness: 420, damping: 36 }}
                            />
                          )}
                          {s}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <dl className="mt-8 grid max-w-sm gap-3">
                  {perfume.profile.map((row) => (
                    <div key={row.label} className="grid grid-cols-[6.5rem_1fr] items-center gap-4">
                      <dt className="text-[11px] tracking-[0.24em] text-champagne-400 uppercase">{row.label}</dt>
                      <dd className="flex gap-1.5" aria-label={`${row.value} of 5`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <motion.span
                            key={i}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
                            className="h-[3px] flex-1 origin-left rounded-full"
                            style={{ background: i < row.value ? perfume.accent : "rgba(237,231,218,0.14)" }}
                          />
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href={whatsappLink(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex h-13 items-center gap-3 overflow-hidden rounded-full bg-gradient-to-b from-gold-200 via-gold-400 to-gold-600 px-7 text-[12px] font-semibold tracking-[0.2em] text-onyx-950 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_14px_34px_-12px_rgba(202,168,101,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-white/40 blur-md" />
                    <WhatsAppIcon className="relative size-5" />
                    <span className="relative">Inquire about this scent</span>
                  </a>
                  <a
                    href={whatsappLink("Assalam-o-Alaikum Nawab, I'd like to ask about bulk perfume orders and gifting.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] font-medium tracking-[0.2em] text-champagne-300 uppercase underline decoration-gold-400/50 underline-offset-8 transition-colors hover:text-champagne-50"
                  >
                    Bulk & gifting
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Olfactive pyramid */}
          <div className="order-3 lg:order-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.ol
                key={perfume.id}
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
                className="relative mx-auto max-w-sm space-y-7 lg:ml-0"
                aria-label={`${perfume.name} fragrance notes`}
              >
                <span aria-hidden="true" className="absolute top-3 bottom-3 left-[19px] w-px bg-gradient-to-b from-gold-300/60 via-gold-400/30 to-transparent" />
                {TIERS.map(({ key, label, hint, Icon }) => (
                  <motion.li
                    key={key}
                    variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}
                    className="relative grid grid-cols-[40px_1fr] gap-4"
                  >
                    <span className="relative z-10 flex size-10 items-center justify-center rounded-full border border-gold-400/40 bg-onyx-950" style={{ color: perfume.accent }}>
                      <Icon className="size-4" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.3em] text-gold-300 uppercase">{label}</p>
                      <p className="mt-0.5 text-[12px] text-champagne-400 italic">{hint}</p>
                      <p className="mt-2 font-display text-[1.6rem] leading-snug text-champagne-50">{perfume.notes[key].join(" · ")}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </div>

        {/* Scent selector */}
        <div role="tablist" aria-label="Choose a fragrance" onKeyDown={onTabKey} className="mt-16 grid grid-cols-3 gap-2 sm:gap-4 lg:mt-20">
          {perfumes.map((p, i) => {
            const selected = i === index;
            return (
              <button
                key={p.id}
                ref={(node) => {
                  tabs.current[i] = node;
                }}
                type="button"
                role="tab"
                id={`perfume-tab-${p.id}`}
                aria-selected={selected}
                aria-controls="perfume-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => go(i)}
                className={cn(
                  "group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border px-2 py-4 text-center transition-[border-color,background-color] duration-500 sm:flex-row sm:gap-4 sm:px-4 sm:text-left",
                  selected ? "border-gold-400/60 bg-onyx-900/80" : "border-champagne-100/10 bg-onyx-900/30 hover:border-champagne-100/25",
                )}
              >
                <span className="relative block h-16 w-12 shrink-0 sm:h-20 sm:w-14">
                  <ArchFrame className="absolute inset-0" outline={selected}>
                    <Image src={p.image} alt="" fill sizes="64px" className={cn("object-cover transition duration-500", selected ? "" : "grayscale-[0.6] brightness-75 group-hover:grayscale-0")} />
                  </ArchFrame>
                </span>
                <span className="min-w-0">
                  <span className={cn("block font-display text-xl sm:text-2xl", selected ? "text-champagne-50" : "text-champagne-300")}>{p.name}</span>
                  <span className="hidden text-[10px] tracking-[0.24em] text-champagne-400 uppercase sm:block">{p.family}</span>
                </span>
                <span lang="ur" dir="rtl" aria-hidden="true" className="ml-auto hidden font-urdu text-2xl text-gold-300/70 lg:block">
                  {p.urdu}
                </span>
                {selected && (
                  <motion.span layoutId="scent-underline" className="absolute inset-x-6 bottom-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Gifting band */}
        <Reveal className="mt-20 lg:mt-28">
          <div className="grid overflow-hidden rounded-[28px] border border-gold-400/20 bg-onyx-900 md:grid-cols-[1fr_1.05fr]">
            <div className="relative aspect-square md:order-2 md:aspect-auto md:min-h-[440px]">
              <Image src="/images/perfumes/trio.jpg" alt="Lehar, Janoon and Hassan flacons on a marble plinth" fill sizes="(min-width: 768px) 52vw, 100vw" className="object-cover object-[50%_55%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx-900 via-transparent to-transparent md:bg-gradient-to-r md:from-onyx-900 md:via-onyx-900/10" />
            </div>
            <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.36em] text-gold-300 uppercase">
                <Gift className="size-4" strokeWidth={1.5} /> Gifting
              </p>
              <h3 className="mt-5 font-display text-4xl leading-tight font-light text-champagne-50 sm:text-5xl">
                The trio, <em className="text-gilt">presented as one.</em>
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-champagne-300">
                Hassan, Lehar and Janoon side by side — ask us about pairing all three for weddings, Eid and corporate gifting.
              </p>
              <a
                href={whatsappLink("Assalam-o-Alaikum Nawab, I'd like to ask about gifting all three perfumes (Hassan, Lehar & Janoon).")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 items-center gap-3 rounded-full border border-gold-300/60 px-6 text-[12px] font-semibold tracking-[0.2em] text-gold-100 uppercase backdrop-blur transition-colors duration-300 hover:bg-gold-300/10"
              >
                <WhatsAppIcon className="size-[18px]" /> Ask about the trio
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stage({
  perfume,
  direction,
  reduce,
  onPrev,
  onNext,
}: {
  perfume: Perfume;
  direction: number;
  reduce: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 18 });
  const sheen = useTransform(px, [-0.5, 0.5], ["-30%", "130%"]);

  return (
    <div className="relative mx-auto w-[min(64vw,400px)]">
      <motion.div
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const box = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - box.left) / box.width - 0.5);
          py.set((e.clientY - box.top) / box.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        drag={reduce ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) onNext();
          else if (info.offset.x > 60) onPrev();
        }}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
        className="relative aspect-[100/140] cursor-grab touch-pan-y active:cursor-grabbing"
      >
        <ArchFrame className="absolute inset-0" inset>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={perfume.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.12, x: `${8 * direction}%` }}
              animate={{ opacity: 1, scale: 1, x: "0%" }}
              exit={{ opacity: 0, scale: 0.98, x: `${-6 * direction}%` }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Image
                src={perfume.image}
                alt={`${perfume.name} eau de parfum by Nawab`}
                fill
                quality={90}
                sizes="(min-width: 1024px) 430px, 64vw"
                className="pointer-events-none object-cover object-[50%_50%] select-none"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
          <motion.span
            aria-hidden="true"
            style={{ left: sheen }}
            className="pointer-events-none absolute -inset-y-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/14 to-transparent mix-blend-overlay"
          />
        </ArchFrame>
      </motion.div>

      {/* Reflection on the floor */}
      <div aria-hidden="true" className="relative mt-2 h-24 overflow-hidden opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]">
        <div className="absolute inset-x-0 top-0 aspect-[100/140] -scale-y-100 blur-[2px]">
          <ArchFrame className="absolute inset-0" outline={false}>
            <AnimatePresence initial={false}>
              <motion.div key={perfume.id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
                <Image src={perfume.image} alt="" fill sizes="400px" className="object-cover object-bottom" />
              </motion.div>
            </AnimatePresence>
          </ArchFrame>
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-6 top-[calc(100%-6.5rem)] h-10 rounded-[100%] blur-2xl" style={{ background: perfume.glow }} />

      <div className="absolute top-[38%] -left-14 sm:-left-16">
        <StageArrow label="Previous fragrance" onClick={onPrev}>
          <ArrowLeft className="size-4" />
        </StageArrow>
      </div>
      <div className="absolute top-[38%] -right-14 sm:-right-16">
        <StageArrow label="Next fragrance" onClick={onNext}>
          <ArrowRight className="size-4" />
        </StageArrow>
      </div>
    </div>
  );
}

function StageArrow({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full border border-champagne-100/20 bg-onyx-950/60 text-champagne-100 backdrop-blur transition-[border-color,transform] duration-300 hover:scale-105 hover:border-gold-400/70"
    >
      {children}
    </button>
  );
}
