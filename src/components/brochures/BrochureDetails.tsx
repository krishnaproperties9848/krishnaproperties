"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConcierge from "@/components/FloatingConcierge";
import { Brochure } from "@/lib/supabase/types";
import { CONTACT, BRAND } from "@/lib/constants";
import {
  Phone,
  MessageCircle,
  MapPin,
  ArrowLeft,
  Share2,
  Heart,
  Download,
  Play,
  Check,
  Shield,
  TrendingUp,
  Banknote,
  Ruler,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock,
  Eye,
  Building2,
  TreePine,
  Car,
  Droplets,
  Home,
  FileText,
  Zap
} from "lucide-react";

interface BrochureDetailsProps {
  brochure: Brochure;
  related: Brochure[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  available: { label: "Available", color: "bg-green-500" },
  few_left: { label: "Few Left", color: "bg-amber-500" },
  sold_out: { label: "Sold Out", color: "bg-red-500" },
  coming_soon: { label: "Coming Soon", color: "bg-blue-500" },
};

const AMENITY_ICONS: Record<string, React.ElementType> = {
  "HMDA Approved": Shield,
  "DTCP Approved": Shield,
  "Gated Community": Building2,
  "Avenue Plantation": TreePine,
  "ORR Proximity": Car,
  "Near IT Corridor": Building2,
  "Clear Title": Check,
  "Bank Loan Available": Banknote,
  "24/7 Security": Shield,
  "Wide Roads": Car,
  "Underground Drainage": Droplets,
  "Park View": TreePine,
};

export default function BrochureDetails({ brochure, related }: BrochureDetailsProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState<string | null>(null);

  const status = STATUS_CONFIG[brochure.status] || STATUS_CONFIG.available;
  const images = [brochure.cover_image_url, ...(brochure.gallery_urls || [])].filter(Boolean) as string[];

  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return "Contact for Price";
    const fmt = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)} Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(0)} Lakhs` : `₹${n.toLocaleString("en-IN")}`;
    if (min && max && min !== max) return `${fmt(min)} - ${fmt(max)}`;
    return min ? `Starting from ${fmt(min)}` : `Up to ${fmt(max!)}`;
  };

  const formatPlotSize = (min: number | null, max: number | null) => {
    if (!min && !max) return "Various Sizes Available";
    if (min && max && min !== max) return `${min} - ${max} sq. yards`;
    return min ? `From ${min} sq. yards` : `Up to ${max} sq. yards`;
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: brochure.title, text: `Check out ${brochure.title}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 font-sans text-white">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link href="/brochures" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Link>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Gallery - 3 cols */}
            <div className="lg:col-span-3 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-800">
                {images.length > 0 ? (
                  <img src={images[galleryIndex]} alt={brochure.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-neutral-900">
                    <MapPin className="h-20 w-20 text-gold/30" />
                  </div>
                )}

                {/* Gallery Nav */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setGalleryIndex(p => p === 0 ? images.length - 1 : p - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white hover:bg-black/80">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={() => setGalleryIndex(p => p === images.length - 1 ? 0 : p + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white hover:bg-black/80">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-xs text-white">
                      {galleryIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {/* Status Badge */}
                <span className={`absolute top-3 left-3 ${status.color} text-white text-sm font-bold px-4 py-1.5 rounded-full`}>
                  {status.label}
                </span>

                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={() => setIsSaved(!isSaved)} className={`p-2 rounded-full backdrop-blur ${isSaved ? "bg-red-500 text-white" : "bg-black/60 text-white hover:bg-black/80"}`}>
                    <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                  </button>
                  <button onClick={share} className="p-2 rounded-full bg-black/60 backdrop-blur text-white hover:bg-black/80">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === galleryIndex ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Videos */}
              {brochure.videos && brochure.videos.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Videos</h3>
                  <div className="flex gap-2 overflow-x-auto">
                    {brochure.videos.map((video, i) => (
                      <button
                        key={i}
                        onClick={() => setShowVideoModal(video.url)}
                        className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-neutral-800 group"
                      >
                        {video.thumbnail_url ? (
                          <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-red-900/30 to-neutral-900" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
                          <Play className="h-8 w-8 text-white fill-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {brochure.description && (
                <div className="p-5 rounded-xl border border-gold/20 bg-white/5">
                  <h3 className="text-lg font-semibold text-white mb-3">About This Property</h3>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{brochure.description}</p>
                </div>
              )}

              {/* Amenities */}
              {brochure.amenities && brochure.amenities.length > 0 && (
                <div className="p-5 rounded-xl border border-gold/20 bg-white/5">
                  <h3 className="text-lg font-semibold text-white mb-3">Amenities & Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {brochure.amenities.map((amenity, i) => {
                      const Icon = AMENITY_ICONS[amenity] || Check;
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <Icon className="h-4 w-4 text-gold flex-shrink-0" />
                          {amenity}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Why Invest */}
              {brochure.why_invest && brochure.why_invest.length > 0 && (
                <div className="p-5 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent">
                  <h3 className="text-lg font-semibold text-gold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Why Invest Here?
                  </h3>
                  <ul className="space-y-2">
                    {brochure.why_invest.map((reason, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Details - 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              {/* Title & Location */}
              <div className="p-5 rounded-xl border border-gold/20 bg-white/5">
                <div className="flex items-start gap-2 mb-2">
                  {brochure.is_featured && (
                    <span className="inline-flex items-center gap-1 bg-gold/20 text-gold text-xs px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-gold" /> Featured
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-serif text-white mb-2">{brochure.title}</h1>
                <p className="text-gray-400 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold" />
                  {brochure.location} · {brochure.region}
                </p>

                {/* Price */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-gold/20 to-transparent border border-gold/30">
                  <p className="text-sm text-gray-400">Price Range</p>
                  <p className="text-2xl font-bold text-gold">{formatPrice(brochure.budget_min, brochure.budget_max)}</p>
                  {brochure.price_per_sqyard_min && (
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{brochure.price_per_sqyard_min.toLocaleString("en-IN")}
                      {brochure.price_per_sqyard_max && brochure.price_per_sqyard_max !== brochure.price_per_sqyard_min && ` - ₹${brochure.price_per_sqyard_max.toLocaleString("en-IN")}`} per sq. yard
                    </p>
                  )}
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-gold/10 text-center">
                    <Ruler className="h-5 w-5 text-gold mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500 uppercase">Plot Sizes</p>
                    <p className="text-sm font-semibold text-white">{formatPlotSize(brochure.plot_size_min, brochure.plot_size_max)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-gold/10 text-center">
                    <Eye className="h-5 w-5 text-gold mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500 uppercase">Views</p>
                    <p className="text-sm font-semibold text-white">{brochure.views_count || 0}</p>
                  </div>
                </div>

                {/* Highlights */}
                {brochure.highlights && brochure.highlights.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Highlights</p>
                    <div className="flex flex-wrap gap-2">
                      {brochure.highlights.map((h, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-300 bg-white/5 border border-gold/20 px-2.5 py-1 rounded-full">
                          <Check className="h-3 w-3 text-green-400" /> {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Card - Sticky on desktop */}
              <div className="p-5 rounded-xl border border-gold/30 bg-gradient-to-b from-gold/10 to-transparent sticky top-4">
                <h3 className="text-lg font-semibold text-white mb-4">Interested in this property?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Contact {BRAND.consultant.name} for site visit, pricing details, and investment guidance.
                </p>
                <div className="space-y-3">
                  <a
                    href={`tel:${brochure.phone_override || CONTACT.phone}`}
                    className="flex items-center justify-center gap-2 w-full bg-gold text-black py-3 rounded-xl text-sm font-bold hover:bg-gold-light transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>
                  <a
                    href={`${brochure.whatsapp_override || CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi, I'm interested in ${brochure.title} at ${brochure.location}. Please share more details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border border-gold/40 text-white py-3 rounded-xl text-sm font-semibold hover:border-gold hover:text-gold transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>

                {/* Download Brochure */}
                {brochure.files && brochure.files.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gold/20">
                    <p className="text-xs text-gray-400 mb-2">Download Brochure</p>
                    <div className="space-y-2">
                      {brochure.files.map((file, i) => (
                        <a
                          key={i}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gold hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          {file.name || `Brochure ${i + 1}`}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Properties */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-serif text-white mb-4">Similar Properties in {brochure.region}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/brochures/${item.slug}`}
                    className="group rounded-xl border border-gold/20 bg-white/5 overflow-hidden hover:border-gold/40 transition-all"
                  >
                    <div className="aspect-[16/10] bg-neutral-800">
                      {item.cover_image_url ? (
                        <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-gold/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-gold transition-colors">{item.title}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {item.location}
                      </p>
                      <p className="text-sm font-semibold text-gold mt-2">
                        {formatPrice(item.budget_min, item.budget_max)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
        <FloatingConcierge />
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={() => setShowVideoModal(null)}>
          <div className="relative w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowVideoModal(null)} className="absolute -top-10 right-0 text-white hover:text-gold">
              Close
            </button>
            <iframe
              src={showVideoModal.replace("watch?v=", "embed/")}
              className="w-full h-full rounded-xl"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}
    </main>
  );
}
