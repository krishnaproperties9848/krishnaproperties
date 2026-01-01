"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConcierge from "@/components/FloatingConcierge";
import { Download, Phone, MessageCircle, MapPin, Filter, X } from "lucide-react";
import { BROCHURES, CONTACT, BRAND } from "@/lib/constants";

const REGIONS = ["All", "East Hyderabad", "Warangal"] as const;

export default function BrochuresPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredBrochures = BROCHURES.filter(
    (b) => selectedRegion === "All" || b.region === selectedRegion
  );

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
            <div className="mx-auto max-w-4xl text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">
                Available Layouts
              </p>
              <h1 className="mt-3 text-3xl font-serif text-gold-light md:text-5xl">
                Brochures & Layouts
              </h1>
              <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg max-w-2xl mx-auto">
                Browse open plot layouts across {BRAND.regions.join(" and ")}. 
                Download brochures or contact us directly for site visits.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-4 py-2 text-sm font-medium text-white hover:border-gold focus-ring md:hidden"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap gap-2`}>
                  {REGIONS.map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus-ring ${
                        selectedRegion === region
                          ? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-black"
                          : "border border-gold/30 bg-black/40 text-white hover:border-gold hover:text-gold"
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Showing {filteredBrochures.length} layout{filteredBrochures.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Brochures Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBrochures.map((brochure) => (
                <article
                  key={brochure.id}
                  className="group rounded-2xl border border-gold/20 bg-white/5 overflow-hidden transition-all duration-300 hover:border-gold/40 hover:bg-white/[0.07]"
                >
                  {/* Thumbnail Placeholder */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                    <div className="text-center p-4">
                      <MapPin className="h-12 w-12 text-gold/40 mx-auto mb-2" />
                      <span className="text-xs text-gold/60 uppercase tracking-wider">
                        {brochure.location}
                      </span>
                    </div>
                    {/* Status Badge */}
                    <span className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      brochure.status === "Available" 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}>
                      {brochure.status}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h2 className="text-lg font-serif text-gold-light group-hover:text-gold transition-colors">
                          {brochure.title}
                        </h2>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {brochure.location} · {brochure.region}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Plot Sizes</span>
                        <span className="text-gray-300">{brochure.plotSizes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Price Range</span>
                        <span className="text-gray-300">{brochure.priceRange}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {brochure.highlights.slice(0, 3).map((highlight, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-gold/20 bg-black/40 px-2.5 py-1 text-xs text-gray-400"
                        >
                          {highlight}
                        </span>
                      ))}
                      {brochure.highlights.length > 3 && (
                        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-gray-500">
                          +{brochure.highlights.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={`tel:${CONTACT.phone}`}
                        className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-xs font-bold text-black transition-transform hover:scale-[1.02] focus-ring"
                        aria-label={`Call about ${brochure.title}`}
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Call
                      </a>
                      <a
                        href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi, I'm interested in ${brochure.title} at ${brochure.location}. Please share more details.`)}`}
                        className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-gold/30 bg-black/40 text-xs font-semibold text-white hover:border-gold hover:text-gold focus-ring"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp about ${brochure.title}`}
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp
                      </a>
                      <button
                        onClick={() => {
                          // In production, this would trigger actual download
                          alert(`Brochure download coming soon. Please call or WhatsApp for the ${brochure.title} brochure.`);
                        }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white hover:border-gold/40 hover:text-gold focus-ring"
                        aria-label={`Download ${brochure.title} brochure`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {filteredBrochures.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400">No layouts found for this region.</p>
                <button
                  onClick={() => setSelectedRegion("All")}
                  className="mt-4 text-gold hover:text-gold-light underline-offset-2 hover:underline"
                >
                  View all layouts
                </button>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/5 to-transparent p-8 sm:p-12">
                <h2 className="text-2xl font-serif text-gold-light sm:text-3xl">
                  Looking for something specific?
                </h2>
                <p className="mt-3 text-gray-300 max-w-lg mx-auto">
                  Don&apos;t see what you&apos;re looking for? Contact {BRAND.consultant.name} with 
                  your requirements and budget for personalized recommendations.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-8 text-sm font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-transform hover:scale-[1.02] focus-ring"
                  >
                    <Phone className="h-4 w-4" />
                    Call {CONTACT.phoneDisplay}
                  </a>
                  <a
                    href={CONTACT.whatsappLink}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-gold/30 bg-black/40 px-8 text-sm font-semibold text-white hover:border-gold hover:text-gold focus-ring"
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
