import { StarMark } from "@/components/ui/icons";

const WORDS = [
  "Hassan",
  "Pure Pashmina",
  "American Latha",
  "Lehar",
  "Kani Weave",
  "Italian Suiting",
  "Janoon",
  "Jamawar",
  "Super Fine Cotton",
];

export function MarqueeRibbon() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="group relative overflow-hidden border-y border-gold-400/20 bg-onyx-900 py-5" aria-hidden="true">
      <div className="mask-fade-x">
        <div className="flex w-max animate-marquee items-center gap-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row.map((word, i) => (
            <span key={`${word}-${i}`} className="flex items-center gap-10">
              <span className="font-caps text-sm tracking-[0.36em] text-champagne-300 uppercase">{word}</span>
              <StarMark className="size-3.5 text-gold-400/70" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
