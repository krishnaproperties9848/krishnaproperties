import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import GrowthCorridors from "@/components/GrowthCorridors";
import GlobalInvestors from "@/components/GlobalInvestors";
import Footer from "@/components/Footer";
import FloatingConcierge from "@/components/FloatingConcierge";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-neutral-950 p-2 sm:p-4 lg:p-8 flex items-center justify-center font-sans antialiased text-white selection:bg-gold selection:text-black">
      {/* Background Decor (Optional - approximated) */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true"></div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-[1400px] overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-gold/40 bg-black shadow-2xl shadow-gold/10 ring-1 ring-white/10">

        <Header />

        <div className="flex flex-col">
          <Hero />
          <section id="about" aria-label="About Krishna Properties" className="relative z-10 bg-black py-16 scroll-mt-28">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif text-gold-light md:text-5xl">Local guidance for open plots</h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
                Krishna Properties is led by Bhukya Krishna (Senior Property Consultant). I help buyers and investors shortlist open plots with clear,
                practical guidance across East Hyderabad and the Hyderabad–Warangal corridor.
              </p>
            </div>
          </section>

          <div id="services" aria-label="Services" className="scroll-mt-28">
            <Features />
            <GrowthCorridors />
          </div>

          <div id="trust" aria-label="Trust and Proof" className="scroll-mt-28">
            <GlobalInvestors />
          </div>
        </div>

        {/* Footer */}
        <div id="contact" className="scroll-mt-28">
          <Footer />
        </div>

        <FloatingConcierge />
      </div>
    </main>
  );
}
