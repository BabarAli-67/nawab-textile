import Image from "next/image";
import { WhatsAppIcon } from "@/components/ui/icons";
import { nav, site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-onyx-950 pt-20 pb-10">
      <div aria-hidden="true" className="hairline-gold absolute inset-x-0 top-0 h-px" />
      <div
        aria-hidden="true"
        lang="ur"
        dir="rtl"
        className="pointer-events-none absolute -bottom-24 left-1/2 -z-10 -translate-x-1/2 font-urdu text-[22rem] leading-none text-gold-400/[0.04] select-none"
      >
        {site.urdu}
      </div>

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <Image src="/images/brand/logo-emblem.png" alt="Nawab Textile emblem" width={88} height={88} className="size-20 rounded-full shadow-[0_0_0_1px_rgba(202,168,101,0.4),0_16px_40px_rgba(0,0,0,0.6)]" />
              <div>
                <p className="text-metal font-caps text-2xl font-semibold tracking-[0.28em]">NAWAB</p>
                <p className="font-caps text-[10px] tracking-[0.56em] text-gold-400">TEXTILE</p>
              </div>
            </div>
            <p className="mt-6 max-w-xs font-display text-xl text-champagne-200 italic">{site.tagline}.</p>
            <a
              href={whatsappLink("Assalam-o-Alaikum Nawab Textile, I'd like to know more about your collections.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 items-center gap-3 rounded-full border border-gold-400/50 px-6 text-[12px] font-semibold tracking-[0.2em] text-gold-100 uppercase transition-colors hover:bg-gold-400/10"
            >
              <WhatsAppIcon className="size-[18px]" /> Chat on WhatsApp
            </a>
          </div>

          <FooterColumn
            title="The Houses"
            links={[
              { href: "#perfumes", label: "Perfumes — Hassan, Lehar, Janoon" },
              { href: "#shawls", label: "Heritage Shawls" },
              { href: "#fabrics", label: "Unstitched Fabrics" },
            ]}
          />
          <FooterColumn
            title="The Atelier"
            links={[
              { href: "#story", label: "Our Story" },
              { href: whatsappLink("Assalam-o-Alaikum Nawab Textile, I'd like to discuss a custom or bulk order."), label: "Custom & Bulk Inquiry" },
              { href: whatsappLink("Assalam-o-Alaikum Nawab Textile, I'd like to ask about corporate gifting."), label: "Corporate Gifting" },
            ]}
          />
          <FooterColumn
            title="Collections"
            links={[
              { href: "#fabrics", label: "Royal Executive Suiting" },
              { href: "#fabrics", label: "American Latha" },
              { href: "#fabrics", label: "Premium Cotton" },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-champagne-100/10 pt-8 text-[12px] text-champagne-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.name}. All rights reserved.</p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="transition-colors hover:text-champagne-200">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="font-caps text-xs tracking-[0.3em] text-gold-300">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-[14px] text-champagne-300 transition-colors hover:text-champagne-50"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
