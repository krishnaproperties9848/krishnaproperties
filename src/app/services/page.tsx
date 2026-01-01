import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConcierge from "@/components/FloatingConcierge";
import { MapPinned, FileText, Handshake, CheckCircle2, Phone } from "lucide-react";
import { SERVICES, CONTACT, BRAND } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  MapPinned,
  FileText,
  Handshake,
};

export const metadata = {
  title: "Services | Krishna Properties",
  description: "Plot shortlisting, document verification support, and registration assistance across East Hyderabad and Warangal.",
};

export default function ServicesPage() {
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
            {/* Hero Section */}
            <div className="mx-auto max-w-4xl text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">
                What We Offer
              </p>
              <h1 className="mt-3 text-3xl font-serif text-gold-light md:text-5xl">
                Services
              </h1>
              <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg max-w-2xl mx-auto">
                From initial plot shortlisting to final registration, {BRAND.consultant.name} provides 
                step-by-step guidance across {BRAND.regions.join(" and ")}.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid gap-8 lg:gap-10">
              {SERVICES.map((service, index) => {
                const IconComponent = iconMap[service.icon];
                return (
                  <section
                    key={service.id}
                    id={service.id}
                    className="scroll-mt-28 rounded-2xl border border-gold/20 bg-white/5 p-6 sm:p-8 lg:p-10"
                  >
                    <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12 items-start">
                      {/* Left: Icon and Title */}
                      <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
                            {IconComponent && <IconComponent className="h-8 w-8 text-gold" />}
                          </div>
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gold/70">
                              Service {index + 1}
                            </span>
                            <h2 className="text-xl font-serif text-gold-light sm:text-2xl">
                              {service.title}
                            </h2>
                          </div>
                        </div>
                        <p className="text-base leading-relaxed text-gray-300">
                          {service.fullDescription}
                        </p>
                      </div>

                      {/* Right: Benefits */}
                      <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gold/70 mb-4">
                          What You Get
                        </h3>
                        <ul className="grid gap-3 sm:grid-cols-2">
                          {service.benefits.map((benefit, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 rounded-xl border border-gold/10 bg-black/40 p-4"
                            >
                              <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-200">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/5 to-transparent p-8 sm:p-12">
                <h2 className="text-2xl font-serif text-gold-light sm:text-3xl">
                  Ready to find your plot?
                </h2>
                <p className="mt-3 text-gray-300 max-w-lg mx-auto">
                  Call or WhatsApp to discuss your requirements. {BRAND.consultant.name} typically 
                  responds within {CONTACT.responseTime}.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-8 text-sm font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-transform hover:scale-[1.02] focus-ring"
                    aria-label={`Call ${BRAND.consultant.name} at ${CONTACT.phoneDisplay}`}
                  >
                    <Phone className="h-4 w-4" />
                    Call {CONTACT.phoneDisplay}
                  </a>
                  <a
                    href={CONTACT.whatsappLink}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-gold/30 bg-black/40 px-8 text-sm font-semibold text-white hover:border-gold hover:text-gold focus-ring"
                    aria-label={`Chat on WhatsApp with ${BRAND.consultant.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
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
