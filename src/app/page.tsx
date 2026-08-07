import { FloatingCTA, StickyContactBar } from "@/components/layout/FloatingCTA";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageLoader } from "@/components/layout/PageLoader";
import { Benefits } from "@/components/sections/Benefits";
import { Comparison } from "@/components/sections/Comparison";
import { Contact } from "@/components/sections/Contact";
import { FAQ } from "@/components/sections/FAQ";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { Process } from "@/components/sections/Process";
import { ProductExplorer } from "@/components/sections/ProductExplorer";
import { Products } from "@/components/sections/Products";
import { Reviews } from "@/components/sections/Reviews";
import { Testimonials } from "@/components/sections/Testimonials";
import { Trust } from "@/components/sections/Trust";

export default function TyreRetreadingPage() {
  return (
    <>
      <PageLoader />
      <Navbar />

      <main id="main">
        <Hero />
        <Products />
        <ProductExplorer />
        <Process />
        <Benefits />
        <Comparison />
        <Industries />
        <Trust />
        <Testimonials />
        <Reviews />
        <Gallery />
        <FAQ />
        <Contact />
      </main>

      <Footer />
      <FloatingCTA />
      <StickyContactBar />
    </>
  );
}
