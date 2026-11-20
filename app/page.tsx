import { FabricAtelier } from "@/components/sections/fabric-atelier";
import { Heritage } from "@/components/sections/heritage";
import { HeroPillars } from "@/components/sections/hero-pillars";
import { MarqueeRibbon } from "@/components/sections/marquee-ribbon";
import { PerfumeShowcase } from "@/components/sections/perfume-showcase";
import { ShawlGallery } from "@/components/sections/shawl-gallery";
import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

export default function Home() {
  return (
    <>
      <a
        href="#perfumes"
        className="sr-only z-[70] rounded-full bg-gold-300 px-4 py-2 text-onyx-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to collections
      </a>
      <Navbar />
      <main>
        <HeroPillars />
        <MarqueeRibbon />
        <PerfumeShowcase />
        <ShawlGallery />
        <FabricAtelier />
        <Heritage />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
