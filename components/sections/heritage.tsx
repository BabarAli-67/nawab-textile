import Image from "next/image";
import { Award, Droplets, Gem, Gift } from "lucide-react";
import { ArchFrame } from "@/components/ui/arch-frame";
import { Reveal, SectionEyebrow } from "@/components/ui/reveal";
import { site } from "@/lib/site";

const PROMISES = [
  {
    Icon: Award,
    title: "Signed on the selvedge",
    body: "The name Nawab Textile International is woven into the edge of every suit length — a signature you can feel.",
  },
  {
    Icon: Droplets,
    title: "Composed to linger",
    body: "Eau de parfum concentrations built on deep bases of oud, amber and musk, so a scent stays with the day.",
  },
  {
    Icon: Gem,
    title: "Heritage crafts",
    body: "Pashmina, kani, jamawar and sozni — shawls chosen for the patience of their weave and the hand of their wool.",
  },
  {
    Icon: Gift,
    title: "Presented to gift",
    body: "Hard-cover signature boxes and gift-ready flacons for Eid, weddings and the people who matter.",
  },
];

export function Heritage() {
  return (
    <section id="story" aria-labelledby="story-title" className="relative isolate overflow-hidden bg-onyx-900 py-24 md:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.05]"
        style={{ backgroundImage: "url(/images/brand/monogram-pattern.png)", backgroundSize: "1100px auto", backgroundPosition: "center" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,transparent,rgba(8,8,10,0.85))]" />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <Reveal className="relative mx-auto w-full max-w-lg">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <ArchFrame className="row-span-2 aspect-[100/170] w-full" inset>
                <Image
                  src="/images/editorial/badshahi-night.jpg"
                  alt="A Mughal minaret lit against a starry night"
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover"
                />
              </ArchFrame>
              <ArchFrame className="aspect-[100/120] w-full">
                <Image src="/images/editorial/mughal-arch.jpg" alt="A carved sandstone Mughal arch" fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
              </ArchFrame>
              <div className="relative aspect-[100/110] w-full overflow-hidden rounded-[18px]">
                <Image src="/images/editorial/loom.jpg" alt="Cloth taking shape on a traditional loom" fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <SectionEyebrow numeral="IV" label="Our Story" urdu="داستان" />
              <p lang="ur" dir="rtl" aria-hidden="true" className="text-gilt mt-8 font-urdu text-7xl leading-[1.9] sm:text-8xl">
                {site.urdu}
              </p>
              <h2 id="story-title" className="mt-2 font-display text-5xl leading-[0.98] font-light text-champagne-50 sm:text-6xl">
                Dressed in heritage, <em className="text-gilt font-normal">composed for today.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-champagne-300">
                A man&rsquo;s presence is composed — the scent he wears, the cloth he chooses, the shawl he inherits. Nawab brings the three
                together under one standard: <span className="text-champagne-100">tradition meets quality</span>. From the courtyards of the
                Mughal city to the tailor&rsquo;s table, we keep what was noble and make it wearable.
              </p>
            </Reveal>
          </div>
        </div>

        <ul className="mt-20 grid gap-px overflow-hidden rounded-[28px] border border-champagne-100/10 bg-champagne-100/10 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {PROMISES.map(({ Icon, title, body }, i) => (
            <li key={title} className="bg-onyx-900">
              <Reveal delay={i * 0.08} className="flex h-full flex-col p-8 lg:p-10">
                <span className="flex size-12 items-center justify-center rounded-full border border-gold-400/35 text-gold-300">
                  <Icon className="size-5" strokeWidth={1.4} />
                </span>
                <h3 className="mt-6 font-display text-2xl text-champagne-50">{title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-champagne-400">{body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
