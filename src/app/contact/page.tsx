import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConcierge from "@/components/FloatingConcierge";

export default function ContactPage() {
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
                  Speak with Bhukya Krishna
                </h1>
                <p className="mt-2 text-sm font-medium text-gray-300">
                  Senior Property Consultant · East Hyderabad & Hyderabad–Warangal corridor
                </p>
                <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">
                  Call for the fastest response, or send an enquiry with your area and timeline.
                  Local guidance for East Hyderabad and the Hyderabad–Warangal corridor.
                </p>

                <div className="mt-8 space-y-2">
                  <a
                    href="tel:+919848151456"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-8 text-sm font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-transform hover:scale-[1.02] focus-ring"
                    aria-label="Call Bhukya Krishna at +91 9848 151 456"
                  >
                    Call +91 9848 151 456
                  </a>
                  <p className="text-sm text-gray-400">
                    Prefer chat?{" "}
                    <a
                      href="https://wa.me/919848151456"
                      className="text-gold hover:text-gold-light underline-offset-2 hover:underline focus-ring rounded-sm"
                      aria-label="Chat on WhatsApp with Bhukya Krishna"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>{" "}
                    or{" "}
                    <a
                      href="mailto:krishnaproperties9848@gmail.com"
                      className="text-gold hover:text-gold-light underline-offset-2 hover:underline focus-ring rounded-sm"
                      aria-label="Email Krishna Properties at krishnaproperties9848@gmail.com"
                    >
                      Email
                    </a>
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-start">
                <div className="space-y-6">
                  <section className="rounded-2xl border border-gold/20 bg-white/5 p-6 sm:p-8">
                    <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr] sm:items-center">
                      <div className="space-y-3">
                        <h2 className="text-2xl font-serif text-gold-light">How to reach me</h2>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          Quickest: call directly. Prefer chat or email? Tap below to open WhatsApp or your mail app with my details.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                          <span className="rounded-full border border-gold/30 bg-black/40 px-3 py-1">Response: under 1 hour</span>
                          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">Languages: English / Telugu</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a
                          href="tel:+919848151456"
                          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-6 text-sm font-bold text-black shadow-[0_0_14px_rgba(212,175,55,0.25)] transition-transform hover:scale-[1.01] focus-ring"
                          aria-label="Call Bhukya Krishna at +91 9848 151 456"
                        >
                          Call now
                        </a>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href="https://wa.me/919848151456"
                            className="inline-flex h-11 items-center justify-center rounded-full border border-gold/30 bg-black/40 px-4 text-xs font-semibold text-white hover:border-gold hover:text-gold focus-ring"
                            aria-label="Chat on WhatsApp with Bhukya Krishna"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                          <a
                            href="mailto:krishnaproperties9848@gmail.com"
                            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-black/40 px-4 text-xs font-semibold text-white hover:border-gold/40 hover:text-gold focus-ring"
                            aria-label="Email Krishna Properties at krishnaproperties9848@gmail.com"
                          >
                            Email
                          </a>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-gold/20 bg-white/5 p-6">
                    <h2 className="text-lg font-serif text-gold-light">Direct</h2>
                    <div className="mt-3 space-y-3 text-sm text-gray-300">
                      <a
                        href="tel:+919848151456"
                        className="block hover:text-gold transition-colors focus-ring rounded-sm"
                        aria-label="Call Bhukya Krishna at +91 9848 151 456"
                      >
                        +91 9848 151 456
                      </a>
                      <a
                        href="mailto:krishnaproperties9848@gmail.com"
                        className="block hover:text-gold transition-colors focus-ring rounded-sm"
                        aria-label="Email Krishna Properties at krishnaproperties9848@gmail.com"
                      >
                        krishnaproperties9848@gmail.com
                      </a>
                    </div>
                  </section>
                </div>

                <aside className="space-y-6 lg:self-center lg:translate-y-4">
                  <section className="rounded-2xl border border-gold/20 bg-white/5 p-6">
                    <h2 className="text-lg font-serif text-gold-light">Corporate Office</h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-300">
                      H.No: 8-3-940/A, Flat No. 205, Tirumala Shah Apartments, Ameerpet X
                      Roads, Hyderabad – 500 073
                    </p>
                  </section>

                  <section className="rounded-2xl border border-gold/20 bg-white/5 p-6">
                    <h2 className="text-lg font-serif text-gold-light">Branch Office</h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-300">
                      D.No: 2-1-46/1, 3rd Floor, Sri Venkateswara Housing Colony, Above KS
                      Bakers, Opp. Metro Pillar No. 865, Uppal, Medchal-Malkajgiri District,
                      Telangana – 500 039
                    </p>
                  </section>
                </aside>
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
