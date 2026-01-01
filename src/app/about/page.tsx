import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConcierge from "@/components/FloatingConcierge";

export default function AboutPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-neutral-950 p-2 sm:p-4 lg:p-8 flex items-center justify-center font-sans antialiased text-white selection:bg-gold selection:text-black"
    >
      <div
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(212,175,55,0.1) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1400px] overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-gold/40 bg-black shadow-2xl shadow-gold/10 ring-1 ring-white/10">
        <Header />

        <div className="relative z-10 bg-black py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-5xl">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">
                  Krishna Properties
                </p>
                <h1 className="text-3xl font-serif text-gold-light md:text-5xl">
                  Bhukya Krishna
                </h1>
                <p className="mt-2 text-sm font-medium text-gray-300">
                  Senior Property Consultant · East Hyderabad & Hyderabad–Warangal corridor
                </p>
                <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">
                  Senior Property Consultant at Krishna Properties, helping you shortlist open
                  plots across East Hyderabad and the Hyderabad–Warangal corridor—step-by-step
                  support from first visit to registration.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <a
                    href="tel:+919848151456"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-6 text-sm font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-transform hover:scale-[1.02] focus-ring"
                    aria-label="Call Bhukya Krishna at +91 9848 151 456"
                  >
                    Call +91 9848 151 456
                  </a>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <a
                      href="https://wa.me/919848151456"
                      className="inline-flex h-12 items-center justify-center rounded-full border border-gold/30 bg-black/40 px-5 font-semibold text-white hover:border-gold hover:text-gold focus-ring"
                      aria-label="Chat on WhatsApp with Bhukya Krishna"
                    >
                      WhatsApp
                    </a>
                    <a
                      href="mailto:krishnaproperties9848@gmail.com"
                      className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-black/40 px-5 font-semibold text-white hover:border-gold/40 hover:text-gold focus-ring"
                      aria-label="Email Krishna Properties at krishnaproperties9848@gmail.com"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                <section className="rounded-2xl border border-gold/20 bg-white/5 p-6">
                  <h2 className="text-lg font-serif text-gold-light">
                    Why I serve these corridors
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">
                    I’ve worked across East Hyderabad and the Hyderabad–Warangal belt for
                    years, meeting families, first-time buyers, and NRIs who want straightforward
                    guidance. My focus is simple: help you choose a plot you understand.
                  </p>
                </section>

                <section className="rounded-2xl border border-gold/20 bg-white/5 p-6">
                  <h2 className="text-lg font-serif text-gold-light">
                    What I help you with
                  </h2>
                  <ul className="mt-3 space-y-3 text-sm text-gray-300">
                    <li>
                      <span className="font-semibold text-white">Shortlisting:</span> Options
                      filtered by budget, access, neighborhood, and priorities.
                    </li>
                    <li>
                      <span className="font-semibold text-white">Checks (support):</span>
                      Guidance on basic document review and on-site clarity before you commit.
                    </li>
                    <li>
                      <span className="font-semibold text-white">Deal closure:</span> Help
                      with negotiation and coordination through the registration steps.
                    </li>
                  </ul>
                </section>

                <section className="rounded-2xl border border-gold/20 bg-white/5 p-6">
                  <h2 className="text-lg font-serif text-gold-light">
                    Trusted by local buyers
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">
                    Clients often tell me the process felt calmer and clearer with a local
                    point of contact. You’ll find more detailed testimonials in the Trust
                    section—kept short and genuine.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>

        <Footer />
        <FloatingConcierge />
      </div>
    </main>
  );
}
