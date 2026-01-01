"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Upload, 
  Image as ImageIcon, 
  FileVideo, 
  FileText, 
  Trash2, 
  Copy, 
  Check, 
  Loader2,
  X,
  Filter,
  Grid,
  List,
  Download,
  Eye,
  RefreshCw,
  FolderSync,
  Search,
  CheckSquare,
  Square,
  Edit3,
  Info,
  Calendar,
  HardDrive,
  Link2,
  MoreVertical,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  FileType,
  Folder
} from "lucide-react";
import { MediaAsset } from "@/lib/supabase/types";

interface MediaLibraryProps {
  media: MediaAsset[];
}

type MediaFilter = "all" | "image" | "video" | "pdf" | "other";
type ViewMode = "grid" | "list";
type SortBy = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "size-desc" | "size-asc";

export default function MediaLibrary({ media }: MediaLibraryProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  
  // Details panel state
  const [detailsAsset, setDetailsAsset] = useState<MediaAsset | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);

  // Sync existing storage files to media_assets table
  const syncFromStorage = async () => {
    setSyncing(true);
    setSyncProgress("Scanning storage buckets...");
    
    const supabase = createClient();
    const buckets = ["images", "videos", "brochures"];
    let syncedCount = 0;
    let skippedCount = 0;

    // Get existing URLs to avoid duplicates
    const existingUrls = new Set(media.map(m => m.url));

    for (const bucket of buckets) {
      setSyncProgress(`Scanning ${bucket}...`);
      
      // List all files in bucket root and subfolders
      const folders = ["", "posts", "uploads", "covers"];
      
      for (const folder of folders) {
        const { data: files, error } = await supabase.storage
          .from(bucket)
          .list(folder || undefined, { limit: 1000 });

        if (error || !files) continue;

        for (const file of files) {
          // Skip folders
          if (!file.name || file.id === null) continue;
          
          const filePath = folder ? `${folder}/${file.name}` : file.name;
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          // Skip if already in media_assets
          if (existingUrls.has(publicUrl)) {
            skippedCount++;
            continue;
          }

          // Determine media type from extension
          const ext = file.name.split('.').pop()?.toLowerCase() || '';
          let mediaType: "image" | "video" | "pdf" | "other" = "other";
          let mimeType = "application/octet-stream";
          
          if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
            mediaType = "image";
            mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
          } else if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) {
            mediaType = "video";
            mimeType = `video/${ext}`;
          } else if (ext === 'pdf') {
            mediaType = "pdf";
            mimeType = "application/pdf";
          }

          // Insert into media_assets
          const { error: insertError } = await supabase.from("media_assets").insert({
            title: file.name,
            url: publicUrl,
            storage_path: filePath,
            mime_type: mimeType,
            size_bytes: file.metadata?.size || null,
            bucket,
            media_type: mediaType,
          });

          if (!insertError) {
            syncedCount++;
            existingUrls.add(publicUrl);
          }
        }
      }
    }

    setSyncProgress(`Synced ${syncedCount} new files, ${skippedCount} already existed`);
    setTimeout(() => {
      setSyncing(false);
      setSyncProgress("");
      router.refresh();
    }, 2000);
  };

  // Filtered and sorted media
  const filteredMedia = useMemo(() => {
    let results = media.filter((m) => {
      if (filter !== "all" && m.media_type !== filter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (m.title?.toLowerCase().includes(q) || m.url.toLowerCase().includes(q));
      }
      return true;
    });

    // Sort
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "name-desc":
          return (b.title || "").localeCompare(a.title || "");
        case "size-desc":
          return (b.size_bytes || 0) - (a.size_bytes || 0);
        case "size-asc":
          return (a.size_bytes || 0) - (b.size_bytes || 0);
        default:
          return 0;
      }
    });

    return results;
  }, [media, filter, searchQuery, sortBy]);

  // Multi-select handlers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredMedia.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMedia.map(m => m.id)));
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected files? This cannot be undone.`)) return;
    
    setBulkDeleting(true);
    const supabase = createClient();

    for (const id of selectedIds) {
      const asset = media.find(m => m.id === id);
      if (!asset) continue;
      
      if (asset.storage_path) {
        await supabase.storage.from(asset.bucket).remove([asset.storage_path]);
      }
      await supabase.from("media_assets").delete().eq("id", id);
    }
    
    setBulkDeleting(false);
    setSelectedIds(new Set());
    router.refresh();
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image": return ImageIcon;
      case "video": return FileVideo;
      case "pdf": return FileText;
      default: return FileText;
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getBucketForFile = (file: File): string => {
    if (file.type.startsWith("image/")) return "images";
    if (file.type.startsWith("video/")) return "videos";
    if (file.type === "application/pdf") return "brochures";
    return "images";
  };

  const getMediaType = (file: File): "image" | "video" | "pdf" | "other" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type === "application/pdf") return "pdf";
    return "other";
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress([]);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      setUploadProgress((prev) => [...prev, `Uploading ${file.name}...`]);

      const bucket = getBucketForFile(file);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        setUploadProgress((prev) => [...prev, `❌ Failed: ${file.name}`]);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      await supabase.from("media_assets").insert({
        title: file.name,
        url: publicUrl,
        storage_path: filePath,
        mime_type: file.type,
        size_bytes: file.size,
        bucket,
        media_type: getMediaType(file),
      });

      setUploadProgress((prev) => [...prev, `✓ Uploaded: ${file.name}`]);
    }

    setUploading(false);
    setTimeout(() => setUploadProgress([]), 3000);
    router.refresh();
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    
    setDeleting(asset.id);
    const supabase = createClient();

    if (asset.storage_path) {
      await supabase.storage.from(asset.bucket).remove([asset.storage_path]);
    }
    await supabase.from("media_assets").delete().eq("id", asset.id);
    
    setDeleting(null);
    router.refresh();
  };

  const copyUrl = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateTitle = async () => {
    if (!detailsAsset || !newTitle.trim()) return;
    
    setSavingTitle(true);
    const supabase = createClient();
    
    await supabase.from("media_assets").update({ title: newTitle.trim() }).eq("id", detailsAsset.id);
    
    setSavingTitle(false);
    setEditingTitle(false);
    router.refresh();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Upload Area & Sync Button */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative flex-1 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragOver
              ? "border-gold bg-gold/10"
              : "border-gold/30 bg-white/5 hover:border-gold/50"
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            onChange={(e) => handleUpload(e.target.files)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="h-10 w-10 text-gold mx-auto animate-spin" />
              <p className="text-gray-400">Uploading files...</p>
              {uploadProgress.map((msg, i) => (
                <p key={i} className="text-sm text-gray-500">{msg}</p>
              ))}
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-500 mx-auto mb-3" />
              <p className="text-white font-medium">Drop files here or click to upload</p>
              <p className="text-sm text-gray-500 mt-1">
                Images, Videos, PDFs up to 50MB
              </p>
            </>
          )}
        </div>

        {/* Sync from Storage */}
        <div className="sm:w-64 rounded-xl border border-gold/20 bg-white/5 p-6 text-center">
          <FolderSync className="h-10 w-10 text-gold/60 mx-auto mb-3" />
          <p className="text-white font-medium text-sm mb-2">Sync from Storage</p>
          <p className="text-xs text-gray-500 mb-4">
            Import existing files from Supabase storage buckets
          </p>
          <button
            onClick={syncFromStorage}
            disabled={syncing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gold/20 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/30 transition-colors disabled:opacity-50"
          >
            {syncing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Sync Now
              </>
            )}
          </button>
          {syncProgress && (
            <p className="text-xs text-gray-400 mt-2">{syncProgress}</p>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search files by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gold/20 bg-white/5 py-3 pl-12 pr-10 text-white placeholder-gray-500 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
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

      {/* Filters, Multi-select & View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Multi-select Toggle */}
          <button
            onClick={() => {
              if (selectedIds.size > 0) {
                setSelectedIds(new Set());
              } else {
                selectAll();
              }
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedIds.size > 0
                ? "bg-gold/20 text-gold"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {selectedIds.size > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select"}
          </button>

          {/* Bulk Delete */}
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="rounded-lg px-3 py-1.5 text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {bulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </button>
          )}

          <div className="h-6 w-px bg-gold/20" />

          {/* Filter Pills */}
          <Filter className="h-4 w-4 text-gray-500" />
          {(["all", "image", "video", "pdf"] as MediaFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-gold/20 text-gold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-lg border border-gold/20 bg-white/5 px-3 py-1.5 text-sm text-gray-300 focus:border-gold focus:outline-none"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="size-desc">Largest First</option>
            <option value="size-asc">Smallest First</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border border-gold/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded p-1.5 transition-colors ${
                viewMode === "grid" ? "bg-gold/20 text-gold" : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded p-1.5 transition-colors ${
                viewMode === "list" ? "bg-gold/20 text-gold" : "text-gray-400 hover:text-white"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing <span className="text-gold font-medium">{filteredMedia.length}</span> of {media.length} files
      </div>

      {/* Media Grid/List */}
      {filteredMedia.length === 0 ? (
        <div className="rounded-xl border border-gold/20 bg-white/5 p-12 text-center">
          <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">
            {filter === "all" ? "No media files yet" : `No ${filter} files`}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((asset) => {
            const Icon = getMediaIcon(asset.media_type);
            return (
              <div
                key={asset.id}
                className="group relative rounded-xl border border-gold/20 bg-white/5 overflow-hidden hover:border-gold/40 transition-colors"
              >
                {/* Preview */}
                <div className="aspect-square relative bg-neutral-900">
                  {asset.media_type === "image" ? (
                    <img
                      src={asset.url}
                      alt={asset.title || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {asset.media_type === "image" && (
                      <button
                        onClick={() => setPreviewAsset(asset)}
                        className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => copyUrl(asset.url, asset.id)}
                      className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                    >
                      {copiedId === asset.id ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <a
                      href={asset.url}
                      download
                      className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(asset)}
                      disabled={deleting === asset.id}
                      className="rounded-full bg-red-500/50 p-2 text-white hover:bg-red-500/70 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm text-white truncate">{asset.title || "Untitled"}</p>
                  <p className="text-xs text-gray-500">{formatSize(asset.size_bytes)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-gold/20 bg-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">File</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Size</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredMedia.map((asset) => {
                const Icon = getMediaIcon(asset.media_type);
                return (
                  <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center overflow-hidden">
                          {asset.media_type === "image" ? (
                            <img src={asset.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Icon className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <span className="text-white truncate max-w-[200px]">{asset.title || "Untitled"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400">
                        {asset.media_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatSize(asset.size_bytes)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(asset.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyUrl(asset.url, asset.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          {copiedId === asset.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(asset)}
                          disabled={deleting === asset.id}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewAsset(null)}
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
            onClick={() => setPreviewAsset(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={previewAsset.url}
            alt={previewAsset.title || "Preview"}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Details Panel */}
      {detailsAsset && (
        <div className="fixed inset-y-0 right-0 w-80 bg-neutral-900 border-l border-gold/20 shadow-2xl z-40 overflow-y-auto">
          <div className="p-4 border-b border-gold/20 flex items-center justify-between">
            <h3 className="font-semibold text-white">File Details</h3>
            <button
              onClick={() => setDetailsAsset(null)}
              className="p-1 rounded hover:bg-white/10"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          
          {/* Preview */}
          <div className="p-4">
            <div className="aspect-video rounded-lg bg-neutral-800 overflow-hidden mb-4">
              {detailsAsset.media_type === "image" ? (
                <img src={detailsAsset.url} alt="" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {detailsAsset.media_type === "video" ? (
                    <FileVideo className="h-12 w-12 text-gray-500" />
                  ) : (
                    <FileText className="h-12 w-12 text-gray-500" />
                  )}
                </div>
              )}
            </div>

            {/* Editable Title */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Title</label>
              {editingTitle ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="flex-1 rounded-lg border border-gold/30 bg-white/5 px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleUpdateTitle}
                    disabled={savingTitle}
                    className="rounded-lg bg-gold/20 px-3 py-2 text-gold hover:bg-gold/30 disabled:opacity-50"
                  >
                    {savingTitle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingTitle(false);
                      setNewTitle(detailsAsset.title || "");
                    }}
                    className="rounded-lg bg-white/10 px-3 py-2 text-gray-400 hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setEditingTitle(true)}
                  className="flex items-center justify-between rounded-lg border border-transparent hover:border-gold/20 px-3 py-2 cursor-pointer group"
                >
                  <span className="text-white truncate">{detailsAsset.title || "Untitled"}</span>
                  <Edit3 className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-400">
                <FileType className="h-4 w-4" />
                <span>{detailsAsset.mime_type || detailsAsset.media_type}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <HardDrive className="h-4 w-4" />
                <span>{formatSize(detailsAsset.size_bytes)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{new Date(detailsAsset.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Folder className="h-4 w-4" />
                <span>{detailsAsset.bucket}</span>
              </div>
            </div>

            {/* URL */}
            <div className="mt-4">
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={detailsAsset.url}
                  readOnly
                  className="flex-1 rounded-lg border border-gold/20 bg-white/5 px-3 py-2 text-xs text-gray-400 truncate"
                />
                <button
                  onClick={() => copyUrl(detailsAsset.url, detailsAsset.id)}
                  className="rounded-lg bg-gold/20 px-3 py-2 text-gold hover:bg-gold/30"
                >
                  {copiedId === detailsAsset.id ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <a
                href={detailsAsset.url}
                download
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm font-medium text-gold hover:bg-gold/20 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
              <button
                onClick={() => handleDelete(detailsAsset)}
                disabled={deleting === detailsAsset.id}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
