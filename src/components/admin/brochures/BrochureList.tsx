"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Brochure } from "@/lib/supabase/types";
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  MapPin,
  Banknote,
  Loader2,
  X,
  CheckSquare,
  Square,
  Copy,
  ExternalLink,
  Download,
  Image as ImageIcon,
  Globe,
  FileEdit
} from "lucide-react";

interface BrochureListProps {
  brochures: Brochure[];
}

type StatusFilter = "all" | "available" | "few_left" | "sold_out" | "coming_soon";
type PublishFilter = "all" | "published" | "draft";

const STATUS_COLORS = {
  available: "bg-green-500/20 text-green-400 border-green-500/30",
  few_left: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  sold_out: "bg-red-500/20 text-red-400 border-red-500/30",
  coming_soon: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const STATUS_LABELS = {
  available: "Available",
  few_left: "Few Left",
  sold_out: "Sold Out",
  coming_soon: "Coming Soon",
};

export default function BrochureList({ brochures }: BrochureListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [publishFilter, setPublishFilter] = useState<PublishFilter>("all");
  const [togglingPublish, setTogglingPublish] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  const filteredBrochures = useMemo(() => {
    return brochures.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (publishFilter === "published" && !b.is_published) return false;
      if (publishFilter === "draft" && b.is_published) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.region.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [brochures, searchQuery, statusFilter, publishFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredBrochures.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredBrochures.map((b) => b.id)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brochure? This cannot be undone.")) return;

    setDeleting(id);
    const supabase = createClient();
    await supabase.from("brochures").delete().eq("id", id);
    setDeleting(null);
    router.refresh();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} brochures? This cannot be undone.`)) return;

    setBulkDeleting(true);
    const supabase = createClient();
    
    for (const id of selectedIds) {
      await supabase.from("brochures").delete().eq("id", id);
    }

    setBulkDeleting(false);
    setSelectedIds(new Set());
    router.refresh();
  };

  const toggleFeatured = async (brochure: Brochure) => {
    const supabase = createClient();
    await supabase
      .from("brochures")
      .update({ is_featured: !brochure.is_featured })
      .eq("id", brochure.id);
    router.refresh();
  };

  const togglePublished = async (brochure: Brochure) => {
    setTogglingPublish(brochure.id);
    try {
      const supabase = createClient();
      const newStatus = !brochure.is_published;
      const { error } = await supabase
        .from("brochures")
        .update({ is_published: newStatus })
        .eq("id", brochure.id);
      
      if (error) {
        console.error("Failed to toggle publish status:", error);
        alert(`Failed to ${newStatus ? "publish" : "unpublish"} brochure: ${error.message}`);
      }
      router.refresh();
    } catch (err) {
      console.error("Error toggling publish:", err);
    } finally {
      setTogglingPublish(null);
    }
  };

  const handleDuplicate = async (brochure: Brochure) => {
    setDuplicating(brochure.id);
    try {
      const res = await fetch(`/api/admin/brochures/${brochure.id}/duplicate`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to duplicate brochure");
      }
      const data = await res.json();
      router.push(`/admin/brochures/${data.id}`);
    } catch (err: any) {
      console.error("Duplicate brochure failed:", err);
      alert(err?.message || "Failed to duplicate brochure");
    } finally {
      setDuplicating(null);
    }
  };

  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return "—";
    const format = (n: number) => {
      if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
      if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
      return `₹${n.toLocaleString("en-IN")}`;
    };
    if (min && max) return `${format(min)} - ${format(max)}`;
    if (min) return `From ${format(min)}`;
    return `Up to ${format(max!)}`;
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search brochures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gold/20 bg-white/5 py-3 pl-12 pr-10 text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Publish Filter */}
        <div className="flex items-center gap-1 border border-gold/20 rounded-lg p-1">
          {(["all", "published", "draft"] as PublishFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setPublishFilter(filter)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                publishFilter === filter
                  ? filter === "published" 
                    ? "bg-green-500/20 text-green-400"
                    : filter === "draft"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-gold/20 text-gold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {filter === "published" && <Globe className="h-3.5 w-3.5" />}
              {filter === "draft" && <FileEdit className="h-3.5 w-3.5" />}
              {filter === "all" ? "All" : filter === "published" ? "Published" : "Drafts"}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          {(["all", "available", "few_left", "sold_out", "coming_soon"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-gold/20 text-gold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {status === "all" ? "All" : STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-gold/20 bg-gold/5 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={selectAll}
              className="flex items-center gap-2 text-sm text-gold"
            >
              <CheckSquare className="h-4 w-4" />
              {selectedIds.size === filteredBrochures.length ? "Deselect All" : "Select All"}
            </button>
            <span className="text-sm text-gray-400">
              {selectedIds.size} selected
            </span>
          </div>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30 disabled:opacity-50"
          >
            {bulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete Selected
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing <span className="text-gold font-medium">{filteredBrochures.length}</span> of {brochures.length} brochures
      </div>

      {/* Brochure Cards */}
      {filteredBrochures.length === 0 ? (
        <div className="rounded-xl border border-gold/20 bg-white/5 p-16 text-center">
          <ImageIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No brochures found</p>
          <p className="text-gray-500 text-sm mb-6">
            {brochures.length === 0
              ? "Get started by adding your first property brochure"
              : "Try adjusting your search or filters"}
          </p>
          {brochures.length === 0 && (
            <Link
              href="/admin/brochures/new"
              className="inline-flex items-center gap-2 rounded-lg bg-gold/20 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/30"
            >
              <Plus className="h-4 w-4" />
              Add Brochure
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBrochures.map((brochure) => {
            const isSelected = selectedIds.has(brochure.id);
            return (
              <div
                key={brochure.id}
                className={`group rounded-xl border overflow-hidden transition-all ${
                  isSelected
                    ? "border-gold bg-gold/5"
                    : "border-gold/20 bg-gradient-to-r from-white/5 to-transparent hover:border-gold/40"
                }`}
              >
                <div className="flex items-stretch">
                  {/* Selection Checkbox */}
                  <button
                    onClick={() => toggleSelect(brochure.id)}
                    className="flex items-center justify-center w-12 border-r border-gold/10 hover:bg-white/5"
                  >
                    {isSelected ? (
                      <CheckSquare className="h-5 w-5 text-gold" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-500" />
                    )}
                  </button>

                  {/* Cover Image */}
                  <div className="w-32 h-32 bg-neutral-800 flex-shrink-0">
                    {brochure.cover_image_url ? (
                      <img
                        src={brochure.cover_image_url}
                        alt={brochure.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">
                            {brochure.title}
                          </h3>
                          {brochure.is_featured && (
                            <Star className="h-4 w-4 text-gold fill-gold" />
                          )}
                          {!brochure.is_published && (
                            <span className="rounded-full bg-gray-500/20 px-2 py-0.5 text-xs text-gray-400">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {brochure.location} · {brochure.region}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          STATUS_COLORS[brochure.status]
                        }`}
                      >
                        {STATUS_LABELS[brochure.status]}
                      </span>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Banknote className="h-4 w-4 text-gold/60" />
                        {formatPrice(brochure.budget_min, brochure.budget_max)}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Eye className="h-4 w-4" />
                        {brochure.views_count} views
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Download className="h-4 w-4" />
                        {brochure.downloads_count} downloads
                      </div>
                    </div>

                    {/* Highlights */}
                    {brochure.highlights && brochure.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {brochure.highlights.slice(0, 4).map((h, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400"
                          >
                            {h}
                          </span>
                        ))}
                        {brochure.highlights.length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{brochure.highlights.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center gap-2 p-4 border-l border-gold/10">
                    <Link
                      href={`/admin/brochures/${brochure.id}`}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gold/20 hover:text-gold transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(brochure)}
                      disabled={duplicating === brochure.id}
                      className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                      title="Duplicate"
                    >
                      {duplicating === brochure.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    {/* Publish/Unpublish Toggle */}
                    <button
                      onClick={() => togglePublished(brochure)}
                      disabled={togglingPublish === brochure.id}
                      className={`rounded-lg p-2 transition-colors ${
                        brochure.is_published
                          ? "text-green-400 hover:bg-amber-500/20 hover:text-amber-400"
                          : "text-amber-400 hover:bg-green-500/20 hover:text-green-400"
                      } disabled:opacity-50`}
                      title={brochure.is_published ? "Unpublish (make draft)" : "Publish"}
                    >
                      {togglingPublish === brochure.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : brochure.is_published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleFeatured(brochure)}
                      className={`rounded-lg p-2 transition-colors ${
                        brochure.is_featured
                          ? "text-gold hover:bg-gold/20"
                          : "text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                      title={brochure.is_featured ? "Remove from featured" : "Add to featured"}
                    >
                      {brochure.is_featured ? (
                        <Star className="h-4 w-4 fill-current" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </button>
                    <Link
                      href={`/brochures/${brochure.slug}`}
                      target="_blank"
                      className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                      title="View on site"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(brochure.id)}
                      disabled={deleting === brochure.id}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === brochure.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
