"use client";

import { useState, useMemo } from "react";
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
  X,
  Search,
  SortAsc,
  TrendingUp,
  Shield,
  ChevronDown,
  Star,
  Eye,
  Sparkles,
  Check,
  Banknote,
  Ruler,
  Grid3X3,
  LayoutList,
  Clock,
  ArrowRight,
  Zap,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon
} from "lucide-react";

interface BrochuresClientProps {
  brochures: Brochure[];
}

const SORT_OPTIONS = [
  { label: "Featured", value: "featured", icon: Star },
  { label: "Price: Low → High", value: "price-asc", icon: TrendingUp },
  { label: "Price: High → Low", value: "price-desc", icon: TrendingUp },
  { label: "Newest", value: "newest", icon: Clock },
];

const BUDGET_RANGES = [
  { label: "All Budgets", min: 0, max: Infinity },
  { label: "Under ₹25L", min: 0, max: 2500000 },
  { label: "₹25L - ₹50L", min: 2500000, max: 5000000 },
  { label: "₹50L+", min: 5000000, max: Infinity },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  available: { label: "Available", color: "bg-green-500" },
  few_left: { label: "Few Left", color: "bg-amber-500" },
  sold_out: { label: "Sold Out", color: "bg-red-500" },
  coming_soon: { label: "Coming Soon", color: "bg-blue-500" },
};

export default function BrochuresClient({ brochures }: BrochuresClientProps) {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [budgetRange, setBudgetRange] = useState(BUDGET_RANGES[0]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewBrochure, setPreviewBrochure] = useState<Brochure | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Get unique regions
  const availableRegions = useMemo(() => {
    const regions = new Set(brochures.map(b => b.region));
    return ["All", ...Array.from(regions)];
  }, [brochures]);

  // Filter and sort
  const filteredBrochures = useMemo(() => {
    let results = brochures.filter((b) => {
      if (selectedRegion !== "All" && b.region !== selectedRegion) return false;
      if (budgetRange.max !== Infinity || budgetRange.min !== 0) {
        const minBudget = b.budget_min || 0;
        if (minBudget > budgetRange.max || (b.budget_max || Infinity) < budgetRange.min) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const fields = [b.title, b.location, b.region, b.description, ...(b.highlights || [])].filter(Boolean);
        if (!fields.some(f => f?.toLowerCase().includes(q))) return false;
      }
      return true;
    });

    switch (sortBy) {
      case "price-asc":
        results = [...results].sort((a, b) => (a.budget_min || 0) - (b.budget_min || 0));
        break;
      case "price-desc":
        results = [...results].sort((a, b) => (b.budget_min || 0) - (a.budget_min || 0));
        break;
      case "newest":
        results = [...results].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        results = [...results].sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (b.priority || 0) - (a.priority || 0);
        });
    }
    return results;
  }, [brochures, selectedRegion, searchQuery, sortBy, budgetRange]);

  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return "Contact";
    const fmt = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(0)}L` : `₹${n.toLocaleString("en-IN")}`;
    if (min && max && min !== max) return `${fmt(min)} - ${fmt(max)}`;
    return min ? `From ${fmt(min)}` : `Up to ${fmt(max!)}`;
  };

  const formatPlotSize = (min: number | null, max: number | null) => {
    if (!min && !max) return "Various";
    if (min && max && min !== max) return `${min}-${max} sq.yd`;
    return min ? `${min}+ sq.yd` : `Up to ${max} sq.yd`;
  };

  const hasActiveFilters = searchQuery || selectedRegion !== "All" || budgetRange.min !== 0;

  return (
    <main className="min-h-screen bg-neutral-950 font-sans text-white">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="px-4 py-8 sm:px-6 lg:px-8">
          {/* Compact Hero */}
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-widest text-gold/80 flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-3 w-3" /> Premium Properties <Sparkles className="h-3 w-3" />
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif bg-gradient-to-r from-amber-200 via-gold to-yellow-300 bg-clip-text text-transparent">
              Exclusive Land Portfolios
            </h1>
            
            {/* Trust Badges - Compact */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                { icon: Shield, text: "HMDA/DTCP" },
                { icon: Check, text: "Clear Title" },
                { icon: TrendingUp, text: "High ROI" },
                { icon: Award, text: "Trusted" },
              ].map((b, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-gold/20 text-[10px] text-gray-400">
                  <b.icon className="h-3 w-3 text-green-400" />
                  {b.text}
                </span>
              ))}
            </div>
          </div>

          {/* Search & Filters - Compact */}
          <div className="space-y-3 mb-6">
            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search location, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gold/30 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* Region Pills */}
                <div className="flex flex-wrap gap-1">
                  {availableRegions.slice(0, 4).map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedRegion === region
                          ? "bg-gold text-black"
                          : "border border-gold/30 text-gray-300 hover:border-gold hover:text-gold"
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>

                {/* Budget */}
                <select
                  value={BUDGET_RANGES.findIndex(b => b.min === budgetRange.min)}
                  onChange={(e) => setBudgetRange(BUDGET_RANGES[parseInt(e.target.value)])}
                  className="rounded-lg border border-gold/30 bg-black px-3 py-1.5 text-xs text-white focus:border-gold focus:outline-none"
                >
                  {BUDGET_RANGES.map((r, i) => (
                    <option key={i} value={i}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort & View */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gold/30 bg-black px-3 py-1.5 text-xs text-white hover:border-gold"
                  >
                    <SortAsc className="h-3 w-3" />
                    <span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showSortDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                      <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-gold/20 bg-neutral-900 shadow-xl z-20 overflow-hidden">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                            className={`w-full px-3 py-2 text-left text-xs ${sortBy === opt.value ? "bg-gold/20 text-gold" : "text-gray-300 hover:bg-white/5"}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex border border-gold/20 rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-gold/20 text-gold" : "text-gray-400"}`}>
                    <Grid3X3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-gold/20 text-gold" : "text-gray-400"}`}>
                    <LayoutList className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Showing <span className="text-gold font-medium">{filteredBrochures.length}</span> properties</span>
              {hasActiveFilters && (
                <button onClick={() => { setSearchQuery(""); setSelectedRegion("All"); setBudgetRange(BUDGET_RANGES[0]); }} className="text-gold hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Brochures Grid - Compact Cards */}
          {filteredBrochures.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-gold/20 bg-white/5">
              <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No properties found</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}>
              {filteredBrochures.map((brochure) => {
                const status = STATUS_CONFIG[brochure.status] || STATUS_CONFIG.available;

                return viewMode === "grid" ? (
                  // Compact Grid Card
                  <article
                    key={brochure.id}
                    className="group rounded-xl border border-gold/20 bg-gradient-to-b from-white/[0.06] to-transparent overflow-hidden hover:border-gold/40 transition-all cursor-pointer"
                    onClick={() => setPreviewBrochure(brochure)}
                  >
                    {/* Image - Smaller aspect ratio */}
                    <div className="relative aspect-[16/10] bg-neutral-800">
                      {brochure.cover_image_url ? (
                        <img src={brochure.cover_image_url} alt={brochure.title} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-neutral-900">
                          <MapPin className="h-8 w-8 text-gold/50" />
                        </div>
                      )}
                      
                      {/* Badges */}
                      <span className={`absolute top-2 right-2 ${status.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                        {status.label}
                      </span>
                      {brochure.is_featured && (
                        <span className="absolute top-2 left-2 bg-black/60 text-gold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="h-2.5 w-2.5 fill-gold" /> Featured
                        </span>
                      )}

                      {/* Media indicators */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {brochure.gallery_urls && brochure.gallery_urls.length > 0 && (
                          <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <ImageIcon className="h-2.5 w-2.5" /> {brochure.gallery_urls.length + 1}
                          </span>
                        )}
                        {brochure.videos && brochure.videos.length > 0 && (
                          <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Play className="h-2.5 w-2.5 fill-white" /> {brochure.videos.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content - Compact */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white truncate">{brochure.title}</h3>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" /> {brochure.location}
                      </p>

                      {/* Price & Size Row */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1 text-gold text-xs font-semibold">
                          <Banknote className="h-3 w-3" />
                          {formatPrice(brochure.budget_min, brochure.budget_max)}
                        </div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          {formatPlotSize(brochure.plot_size_min, brochure.plot_size_max)}
                        </div>
                      </div>

                      {/* Highlights - Max 2 */}
                      {brochure.highlights && brochure.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {brochure.highlights.slice(0, 2).map((h, i) => (
                            <span key={i} className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{h}</span>
                          ))}
                          {brochure.highlights.length > 2 && (
                            <span className="text-[10px] text-gray-500">+{brochure.highlights.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ) : (
                  // Compact List Card
                  <article
                    key={brochure.id}
                    className="flex gap-3 p-3 rounded-xl border border-gold/20 bg-white/5 hover:border-gold/40 cursor-pointer transition-all"
                    onClick={() => setPreviewBrochure(brochure)}
                  >
                    <div className="w-24 h-20 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                      {brochure.cover_image_url ? (
                        <img src={brochure.cover_image_url} alt={brochure.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-gold/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white truncate">{brochure.title}</h3>
                        <span className={`${status.color} text-white text-[10px] px-2 py-0.5 rounded-full flex-shrink-0`}>{status.label}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {brochure.location} · {brochure.region}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-gold text-xs font-semibold">{formatPrice(brochure.budget_min, brochure.budget_max)}</span>
                        <span className="text-[10px] text-gray-500">{formatPlotSize(brochure.plot_size_min, brochure.plot_size_max)}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center p-6 rounded-xl border border-gold/30 bg-gradient-to-b from-gold/5 to-transparent">
            <h2 className="text-lg font-serif text-gold">Looking for something specific?</h2>
            <p className="text-sm text-gray-400 mt-1">Contact us for personalized recommendations</p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-full text-sm font-semibold">
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-gold/30 text-white px-4 py-2 rounded-full text-sm hover:border-gold">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <Footer />
        <FloatingConcierge />
      </div>

      {/* Quick View Modal - Improved */}
      {previewBrochure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setPreviewBrochure(null)}>
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-gold/30 bg-neutral-900 flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setPreviewBrochure(null)} className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80">
              <X className="h-5 w-5" />
            </button>

            {/* Gallery */}
            <div className="relative aspect-video bg-neutral-800 flex-shrink-0">
              {(() => {
                const images = [previewBrochure.cover_image_url, ...(previewBrochure.gallery_urls || [])].filter(Boolean) as string[];
                return images.length > 0 ? (
                  <>
                    <img src={images[galleryIndex] || images[0]} alt={previewBrochure.title} className="w-full h-full object-cover" />
                    {images.length > 1 && (
                      <>
                        <button onClick={() => setGalleryIndex(p => p === 0 ? images.length - 1 : p - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white hover:bg-black/80">
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={() => setGalleryIndex(p => p === images.length - 1 ? 0 : p + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white hover:bg-black/80">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {images.map((_, i) => (
                            <button key={i} onClick={() => setGalleryIndex(i)} className={`w-2 h-2 rounded-full ${i === galleryIndex ? "bg-gold" : "bg-white/40"}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-gray-600" />
                  </div>
                );
              })()}
              
              {/* Status */}
              <span className={`absolute top-3 left-3 ${STATUS_CONFIG[previewBrochure.status]?.color || "bg-green-500"} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                {STATUS_CONFIG[previewBrochure.status]?.label || "Available"}
              </span>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-serif text-white">{previewBrochure.title}</h2>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" /> {previewBrochure.location} · {previewBrochure.region}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-gold">{formatPrice(previewBrochure.budget_min, previewBrochure.budget_max)}</p>
                  <p className="text-xs text-gray-500">{formatPlotSize(previewBrochure.plot_size_min, previewBrochure.plot_size_max)}</p>
                </div>
              </div>

              {previewBrochure.description && (
                <p className="text-sm text-gray-300 mb-4">{previewBrochure.description}</p>
              )}

              {/* Highlights */}
              {previewBrochure.highlights && previewBrochure.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {previewBrochure.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-300 bg-white/5 border border-gold/20 px-2 py-1 rounded-full">
                      <Check className="h-3 w-3 text-green-400" /> {h}
                    </span>
                  ))}
                </div>
              )}

              {/* Why Invest */}
              {previewBrochure.why_invest && previewBrochure.why_invest.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 mb-4">
                  <h3 className="text-sm font-semibold text-gold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Why Invest Here?
                  </h3>
                  <ul className="space-y-1.5">
                    {previewBrochure.why_invest.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions - Fixed bottom */}
            <div className="flex gap-3 p-4 border-t border-gold/20 bg-neutral-900">
              <a href={`tel:${previewBrochure.phone_override || CONTACT.phone}`} className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-black py-2.5 rounded-xl text-sm font-bold">
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={`${previewBrochure.whatsapp_override || CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi, I'm interested in ${previewBrochure.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 border border-gold/40 text-white py-2.5 rounded-xl text-sm font-semibold hover:border-gold"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <Link
                href={`/brochures/${previewBrochure.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-white/20 text-white py-2.5 rounded-xl text-sm font-semibold hover:border-gold"
              >
                Full Details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
