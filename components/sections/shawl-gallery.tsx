"use client";

import Image from "next/image";
import { Hand, MousePointerClick, MoveHorizontal } from "lucide-react";
import { ArchFrame } from "@/components/ui/arch-frame";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal, SectionEyebrow } from "@/components/ui/reveal";
import { ShawlRail, type RailShawl } from "@/components/ui/shawl-rail";
import { shawls } from "@/lib/catalog";
import { whatsappLink } from "@/lib/site";

const RAIL_ITEMS: RailShawl[] = shawls.map((s) => ({
  id: s.id,
  name: s.name,
  tag: s.craft,
  description: s.description,
  details: s.details,
  color: s.color,
  texture: s.texture,
  textureOpacity: s.textureOpacity,
  border: s.border,
}));

const CRAFTS = ["Pashmina", "Kani", "Jamawar", "Sozni", "Damask", "Merino", "Cashmere"];

export function ShawlGallery() {
  return (
    <section id="shawls" aria-labelledby="shawls-title" className="theme-walnut relative isolate overflow-hidden bg-background py-24 md:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(202,168,101,0.14),transparent_70%),radial-gradient(60%_40%_at_50%_100%,rgba(0,0,0,0.5),transparent)]" />
      <div aria-hidden="true" className="grain absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20 lg:px-12">
        <div>
          <Reveal>
            <SectionEyebrow numeral="II" label="Heritage Shawls" urdu="شال" />
            <h2 id="shawls-title" className="mt-6 font-display text-5xl leading-[0.95] font-light text-champagne-50 sm:text-6xl lg:text-7xl">
              The winter court, <em className="text-gilt font-normal">on a single rail.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-champagne-300">
              Shawls are not accessories in our house — they are inheritance. Each piece is chosen for the hand of its wool, the patience of its
              weave and the way it falls from the shoulder. Walk the rail below as you would in our atelier.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Crafts in the collection">
              {CRAFTS.map((c) => (
                <li key={c} className="rounded-full border border-gold-400/25 bg-walnut-800/60 px-4 py-1.5 font-caps text-[11px] tracking-[0.2em] text-champagne-200">
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative mx-auto w-full max-w-xl">
          <div className="grid grid-cols-[1.25fr_1fr] items-end gap-4 sm:gap-6">
            <ArchFrame className="aspect-[100/140] w-full" inset>
              <Image
                src="/images/editorial/shawl-wool-man.jpg"
                alt="A man draped in a heavy brown wool shawl, warmly lit against a dark studio backdrop"
                fill
                sizes="(min-width: 1024px) 26vw, 55vw"
                className="object-cover object-top"
              />
            </ArchFrame>
            <figure className="mb-10">
              <ArchFrame className="aspect-[100/140] w-full">
                <Image
                  src="/images/editorial/shawl-heritage-portrait.jpg"
                  alt="A man in a white shalwar kameez with a navy shawl draped over his shoulders, in a carved-wood haveli"
                  fill
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className="object-cover object-top"
                />
              </ArchFrame>
              <figcaption className="mt-4 font-display text-lg leading-snug text-champagne-200 italic">
                Worn the old way — draped, never tied.
              </figcaption>
            </figure>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-20 max-w-[1400px] px-2 sm:px-6 md:mt-24">
        <ShawlRail
          items={RAIL_ITEMS}
          hanger="brass"
          autoplay
          interval={3000}
          dialogClassName="theme-walnut"
          eyebrow={
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] tracking-[0.24em] text-champagne-400 uppercase">
              <li className="flex items-center gap-2"><MoveHorizontal className="size-3.5 text-gold-400" /> Brush along the rail</li>
              <li className="flex items-center gap-2"><Hand className="size-3.5 text-gold-400" /> Drag a hanger</li>
              <li className="flex items-center gap-2"><MousePointerClick className="size-3.5 text-gold-400" /> Lift to inspect</li>
            </ul>
          }
          caption="Seven shawls, seven crafts — hover a hanger to turn it to you."
          labels={{ front: "Front", back: "Reverse", close: "Back to the rail", show: "Show" }}
          action={
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={whatsappLink("Assalam-o-Alaikum Nawab, I'd like to see your shawl collection. Please share the current designs.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-3 rounded-full bg-gradient-to-b from-gold-200 via-gold-400 to-gold-600 px-6 text-[12px] font-semibold tracking-[0.2em] text-onyx-950 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="size-[18px]" /> Request the shawl lookbook
              </a>
              <a
                href={whatsappLink("Assalam-o-Alaikum Nawab, I'd like to discuss wedding and bulk shawl orders.")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-medium tracking-[0.2em] text-champagne-300 uppercase underline decoration-gold-400/50 underline-offset-8 hover:text-champagne-50"
              >
                Wedding & bulk orders
              </a>
            </div>
          }
          renderDetailAction={(item, close) => (
            <>
              <a
                href={whatsappLink(`Assalam-o-Alaikum Nawab, I'm interested in the ${item.name} shawl (${item.tag}). Please share availability and price.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-3 rounded-full bg-gradient-to-b from-gold-200 via-gold-400 to-gold-600 px-6 text-[12px] font-semibold tracking-[0.2em] text-onyx-950 uppercase"
              >
                <WhatsAppIcon className="size-[18px]" /> Inquire about this shawl
              </a>
              <a
                href={whatsappLink("Assalam-o-Alaikum Nawab, I'd like to place a bulk shawl order.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => close()}
                className="text-[12px] font-medium tracking-[0.2em] text-muted-foreground uppercase underline decoration-gold-400/50 underline-offset-8 hover:text-foreground"
              >
                Bulk order
              </a>
            </>
          )}
        />
      </div>
    </section>
  );
}
