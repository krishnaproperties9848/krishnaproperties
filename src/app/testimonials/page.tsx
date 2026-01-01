import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConcierge from "@/components/FloatingConcierge";
import { Star, Quote, Phone, MapPin } from "lucide-react";
import { TESTIMONIALS, CONTACT, BRAND } from "@/lib/constants";
import Image from "next/image";

export const metadata = {
  title: "Testimonials | Krishna Properties",
  description: "Read what clients say about their experience working with Krishna Properties for plot purchases in East Hyderabad and Warangal.",
};

export default function TestimonialsPage() {
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
                Client Stories
              </p>
              <h1 className="mt-3 text-3xl font-serif text-gold-light md:text-5xl">
                What Clients Say
              </h1>
              <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg max-w-2xl mx-auto">
                Real feedback from buyers who trusted {BRAND.consultant.name} for their plot 
                purchase across {BRAND.regions.join(" and ")}.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mb-16 max-w-2xl mx-auto">
              <div className="text-center p-4 rounded-xl border border-gold/20 bg-white/5">
                <div className="text-2xl sm:text-3xl font-serif text-gold-light">
                  {BRAND.consultant.experience}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Experience</div>
              </div>
              <div className="text-center p-4 rounded-xl border border-gold/20 bg-white/5">
                <div className="text-2xl sm:text-3xl font-serif text-gold-light">
                  500+
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Happy Clients</div>
              </div>
              <div className="text-center p-4 rounded-xl border border-gold/20 bg-white/5">
                <div className="text-2xl sm:text-3xl font-serif text-gold-light">
                  5.0
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Avg Rating</div>
              </div>
            </div>

            {/* Testimonials Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="group rounded-2xl border border-gold/20 bg-white/5 p-6 transition-all duration-300 hover:border-gold/40 hover:bg-white/[0.07]"
                >
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-gold/30 mb-4" />

                  {/* Quote Text */}
                  <blockquote className="text-sm leading-relaxed text-gray-300 mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? "fill-gold text-gold"
                            : "fill-gray-700 text-gray-700"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gold/10">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border border-gold/30">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>

                  {/* Location & Investment */}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full border border-gold/20 bg-black/40 px-2.5 py-1 text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {testimonial.location}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-gray-500">
                      {testimonial.investment}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/5 to-transparent p-8 sm:p-12">
                <h2 className="text-2xl font-serif text-gold-light sm:text-3xl">
                  Join our happy clients
                </h2>
                <p className="mt-3 text-gray-300 max-w-lg mx-auto">
                  Start your plot search with {BRAND.consultant.name}. Get honest guidance 
                  and clear communication throughout the process.
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
