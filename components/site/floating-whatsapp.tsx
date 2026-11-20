"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/site";

/** Appears once the hero is scrolled past. */
export function FloatingWhatsApp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={whatsappLink("Assalam-o-Alaikum Nawab Textile, I have a question about your collections.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Nawab on WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-gradient-to-b from-gold-200 via-gold-400 to-gold-600 text-onyx-950 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.5)] sm:right-8 sm:bottom-8"
        >
          <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-gold-300/30 [animation-duration:2.6s] motion-reduce:animate-none" />
          <WhatsAppIcon className="relative size-7" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
