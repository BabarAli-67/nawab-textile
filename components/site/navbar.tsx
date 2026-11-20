"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { nav, site, whatsappLink } from "@/lib/site";

const GENERAL_MESSAGE = `Assalam-o-Alaikum Nawab Textile, I'd like to know more about your perfumes, shawls and unstitched fabrics.`;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    const top = () => window.scrollY < window.innerHeight * 0.5 && setActive(null);
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || open
          ? "border-b border-champagne-100/10 bg-onyx-900/72 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 transition-[height] duration-500 sm:px-6 lg:px-10",
          scrolled ? "h-16" : "h-[4.5rem] md:h-20",
        )}
      >
        <a href="#top" className="group flex items-center gap-3 rounded-full" aria-label={`${site.name} — home`}>
          <Image
            src="/images/brand/logo-emblem.png"
            alt=""
            width={44}
            height={44}
            preload
            className="size-10 rounded-full shadow-[0_0_0_1px_rgba(202,168,101,0.35),0_6px_20px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:rotate-[8deg] md:size-11"
          />
          <span className="flex flex-col leading-none">
            <span className="text-metal font-caps text-lg font-semibold tracking-[0.28em] md:text-xl">NAWAB</span>
            <span className="mt-1 font-caps text-[9px] tracking-[0.56em] text-gold-400">TEXTILE</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(
                    "relative block rounded-full px-4 py-2 text-[13px] font-medium tracking-[0.14em] uppercase transition-colors duration-300",
                    active === item.id ? "text-champagne-50" : "text-champagne-300 hover:text-champagne-50",
                  )}
                >
                  {item.label}
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink(GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex h-11 items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-b from-gold-200 via-gold-400 to-gold-600 px-4 text-[12px] font-semibold tracking-[0.16em] text-onyx-950 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_24px_-8px_rgba(202,168,101,0.6)] transition-transform duration-300 hover:-translate-y-px sm:px-5"
          >
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-md animate-shine" />
            <WhatsAppIcon className="relative size-[18px]" />
            <span className="relative hidden sm:inline">Inquire on WhatsApp</span>
            <span className="relative sm:hidden">Inquire</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center rounded-full border border-champagne-100/15 text-champagne-100 transition-colors hover:border-gold-400/60 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-onyx-900/97 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Mobile" className="flex min-h-full flex-col justify-between px-6 pb-10 pt-8">
              <ul className="divide-y divide-champagne-100/10 border-y border-champagne-100/10">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.06 }}
                  >
                    <a
                      ref={i === 0 ? firstLink : undefined}
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-caps text-xs text-gold-400">0{i + 1}</span>
                        <span className="font-display text-4xl font-light text-champagne-50">{item.label}</span>
                      </span>
                      <span lang="ur" dir="rtl" className="font-urdu text-xl text-gold-300/80">
                        {item.urdu}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 space-y-3 text-center">
                <p className="font-display text-xl italic text-champagne-300">{site.tagline}</p>
                <a
                  href={whatsappLink("Assalam-o-Alaikum Nawab Textile, I'd like to discuss a custom or bulk order.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-gold-400/50 text-[12px] font-semibold tracking-[0.2em] text-gold-200 uppercase"
                >
                  Custom & Bulk Inquiry
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
