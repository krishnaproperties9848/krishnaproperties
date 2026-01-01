"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Brochure, BrochureStatus, InvestmentIntent } from "@/lib/supabase/types";
import { extractYouTubeVideoId, googleDriveToDownloadUrl, googleDriveToViewUrl, youTubeToThumbnailUrl } from "@/lib/utils";
import SmartImage from "@/components/SmartImage";
import {
  Save,
  Loader2,
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  FileText,
  Video,
  Trash2,
  MapPin,
  Banknote,
  Ruler,
  Star,
  Eye,
  EyeOff,
  ChevronDown,
  Link2,
  Youtube,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface BrochureFormProps {
  brochure?: Brochure;
}

const REGIONS = ["East Hyderabad", "Warangal", "West Hyderabad", "North Hyderabad", "South Hyderabad"];
const STATUSES: { value: BrochureStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "few_left", label: "Few Left" },
  { value: "sold_out", label: "Sold Out" },
  { value: "coming_soon", label: "Coming Soon" },
];
const INVESTMENT_INTENTS: { value: InvestmentIntent; label: string }[] = [
  { value: "flip", label: "Quick Flip" },
  { value: "hold", label: "Long-term Hold" },
  { value: "nri", label: "NRI Investment" },
  { value: "retirement", label: "Retirement Planning" },
];
const COMMON_AMENITIES = [
  "HMDA Approved", "DTCP Approved", "Gated Community", "24/7 Security",
  "Wide Roads", "Avenue Plantation", "Underground Drainage", "Street Lights",
  "Near ORR", "Near IT Corridor", "Lake View", "Park View",
  "Clear Title", "Bank Loan Available", "Easy EMI Options"
];

export default function BrochureForm({ brochure }: BrochureFormProps) {
  const router = useRouter();
  const isEditing = !!brochure;

  // Form state
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Basic Info
  const [title, setTitle] = useState(brochure?.title || "");
  const [slug, setSlug] = useState(brochure?.slug || "");
  const [location, setLocation] = useState(brochure?.location || "");
  const [region, setRegion] = useState(brochure?.region || REGIONS[0]);
  const [description, setDescription] = useState(brochure?.description || "");
  const [status, setStatus] = useState<BrochureStatus>(brochure?.status || "available");
  
  // Pricing
  const [budgetMin, setBudgetMin] = useState<string>(brochure?.budget_min?.toString() || "");
  const [budgetMax, setBudgetMax] = useState<string>(brochure?.budget_max?.toString() || "");
  const [pricePerSqYardMin, setPricePerSqYardMin] = useState<string>(brochure?.price_per_sqyard_min?.toString() || "");
  const [pricePerSqYardMax, setPricePerSqYardMax] = useState<string>(brochure?.price_per_sqyard_max?.toString() || "");
  const [plotSizeMin, setPlotSizeMin] = useState<string>(brochure?.plot_size_min?.toString() || "");
  const [plotSizeMax, setPlotSizeMax] = useState<string>(brochure?.plot_size_max?.toString() || "");
  
  // Features
  const [investmentIntents, setInvestmentIntents] = useState<InvestmentIntent[]>(brochure?.investment_intents || []);
  const [amenities, setAmenities] = useState<string[]>(brochure?.amenities || []);
  const [highlights, setHighlights] = useState<string[]>(brochure?.highlights || []);
  const [whyInvest, setWhyInvest] = useState<string[]>(brochure?.why_invest || []);
  const [newHighlight, setNewHighlight] = useState("");
  const [newWhyInvest, setNewWhyInvest] = useState("");
  
  // Media
  const [coverImageUrl, setCoverImageUrl] = useState(brochure?.cover_image_url || "");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(brochure?.gallery_urls || []);
  const [coverGdriveLink, setCoverGdriveLink] = useState("");
  const [galleryGdriveLink, setGalleryGdriveLink] = useState("");
  
  // PDF Files
  const [files, setFiles] = useState(brochure?.files || []);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [pdfUploadSuccess, setPdfUploadSuccess] = useState<string | null>(null);
  const [deletingPdfId, setDeletingPdfId] = useState<string | null>(null);
  
  // Videos
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState(brochure?.videos || []);
  
  // Settings
  const [isFeatured, setIsFeatured] = useState(brochure?.is_featured || false);
  const [isPublished, setIsPublished] = useState(brochure?.is_published ?? true);
  const [priority, setPriority] = useState<string>(brochure?.priority?.toString() || "0");
  
  // SEO
  const [metaTitle, setMetaTitle] = useState(brochure?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(brochure?.meta_description || "");

  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing && !slug) {
      setSlug(generateSlug(value));
    }
  };

  // Toggle investment intent
  const toggleIntent = (intent: InvestmentIntent) => {
    setInvestmentIntents((prev) =>
      prev.includes(intent)
        ? prev.filter((i) => i !== intent)
        : [...prev, intent]
    );
  };

  // Toggle amenity
  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Add highlight
  const addHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights((prev) => [...prev, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  // Add why invest point
  const addWhyInvest = () => {
    if (newWhyInvest.trim()) {
      setWhyInvest((prev) => [...prev, newWhyInvest.trim()]);
      setNewWhyInvest("");
    }
  };

  // Handle cover image upload
  const handleCoverUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const supabase = createClient();
    const file = files[0];
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error } = await supabase.storage.from("images").upload(filePath, file);
    
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(filePath);
      setCoverImageUrl(publicUrl);
    }
    
    setUploading(false);
  };

  // Handle gallery upload
  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const supabase = createClient();
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error } = await supabase.storage.from("images").upload(filePath, file);
      
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(filePath);
        newUrls.push(publicUrl);
      }
    }
    
    setGalleryUrls((prev) => [...prev, ...newUrls]);
    setUploading(false);
  };

  // Google Drive PDF link state
  const [gdriveLink, setGdriveLink] = useState("");
  const [gdriveFileName, setGdriveFileName] = useState("");

  // Handle PDF brochure upload from local device
  const handlePdfUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    
    setUploadingPdf(true);
    setPdfUploadError(null);
    setPdfUploadSuccess(null);
    const supabase = createClient();
    const uploadErrors: string[] = [];
    let uploadedCount = 0;
    
    for (const file of Array.from(fileList)) {
      if (file.type !== "application/pdf") continue;
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storagePath = `pdfs/${fileName}`;

      const { error } = await supabase.storage.from("brochures").upload(storagePath, file);
      
      if (error) {
        uploadErrors.push(`${file.name}: ${error.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from("brochures").getPublicUrl(storagePath);
      uploadedCount += 1;
      setFiles((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          url: publicUrl,
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: "pdf" as const,
          size_bytes: file.size,
          is_primary: prev.length === 0,
          source: "upload" as const,
          bucket: "brochures",
          storage_path: storagePath,
        },
      ]);
    }
    
    setUploadingPdf(false);

    if (uploadedCount > 0) {
      setPdfUploadSuccess(`Uploaded ${uploadedCount} PDF${uploadedCount > 1 ? "s" : ""}. Click Update to save.`);
    }
    if (uploadErrors.length > 0) {
      setPdfUploadError(uploadErrors.join("\n"));
    }
  };

  const deletePdfFile = async (index: number) => {
    const file = files[index];
    if (!file) return;

    setPdfUploadError(null);
    setPdfUploadSuccess(null);

    // If it was uploaded to Supabase storage and we have the path, delete the object.
    if ((file.source ?? "upload") === "upload" && file.bucket && file.storage_path) {
      setDeletingPdfId(file.id);
      try {
        const supabase = createClient();
        const { error } = await supabase.storage.from(file.bucket).remove([file.storage_path]);
        if (error) {
          setPdfUploadError(error.message);
          return;
        }
      } finally {
        setDeletingPdfId(null);
      }
    }

    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setPdfUploadSuccess("File removed. Click Update to save.");
  };

  const setCoverFromGdrive = () => {
    if (!coverGdriveLink.trim()) return;
    const directLink = googleDriveToViewUrl(coverGdriveLink);
    if (!directLink) {
      alert("Invalid Google Drive link. Please use a valid share link.");
      return;
    }

    setCoverImageUrl(directLink);
    setCoverGdriveLink("");
  };

  const addGalleryFromGdrive = () => {
    if (!galleryGdriveLink.trim()) return;
    const directLink = googleDriveToViewUrl(galleryGdriveLink);
    if (!directLink) {
      alert("Invalid Google Drive link. Please use a valid share link.");
      return;
    }

    setGalleryUrls((prev) => [...prev, directLink]);
    setGalleryGdriveLink("");
  };

  // Add Google Drive PDF link
  const addGdriveFile = () => {
    if (!gdriveLink.trim()) return;
    
    const directLink = googleDriveToDownloadUrl(gdriveLink);
    if (!directLink) {
      alert("Invalid Google Drive link. Please use a valid share link.");
      return;
    }
    
    const fileName = gdriveFileName.trim() || "Brochure PDF";
    
    setFiles((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        url: directLink,
        name: fileName,
        type: "pdf" as const,
        size_bytes: null,
        is_primary: prev.length === 0,
        source: "gdrive" as const,
        bucket: null,
        storage_path: null,
      },
    ]);
    
    setGdriveLink("");
    setGdriveFileName("");
  };

  // Add YouTube video
  const addVideo = () => {
    if (!videoUrl.trim()) return;

    const videoId = extractYouTubeVideoId(videoUrl);
    if (videoId) {
      setVideos((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "youtube" as const,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail_url: youTubeToThumbnailUrl(videoId) || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          title: null,
        },
      ]);
      setVideoUrl("");
    }
  };

  // Format number with commas for display
  const formatNumberWithCommas = (value: string) => {
    const num = value.replace(/,/g, "");
    if (!num || isNaN(Number(num))) return value;
    return Number(num).toLocaleString("en-IN");
  };

  // Parse comma-separated number back to plain number string
  const parseFormattedNumber = (value: string) => {
    return value.replace(/,/g, "");
  };

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!slug.trim() && !title.trim()) newErrors.slug = "Slug is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save brochure - accepts explicit publishState to avoid React state timing issues
  const handleSave = async (publishState?: boolean) => {
    setSaveError(null);
    setSaveSuccess(false);
    
    if (!validateForm()) {
      setSaveError("Please fill in all required fields");
      return;
    }

    // Use passed publishState if provided, otherwise use current state
    const finalPublishState = publishState !== undefined ? publishState : isPublished;
    
    // Update local state to reflect the action
    if (publishState !== undefined) {
      setIsPublished(publishState);
    }

    setSaving(true);
    const supabase = createClient();

    const brochureData = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      location: location.trim(),
      region,
      description: description.trim() || null,
      status,
      is_featured: isFeatured,
      priority: parseInt(priority) || 0,
      budget_min: budgetMin ? parseInt(budgetMin) : null,
      budget_max: budgetMax ? parseInt(budgetMax) : null,
      price_per_sqyard_min: pricePerSqYardMin ? parseInt(pricePerSqYardMin) : null,
      price_per_sqyard_max: pricePerSqYardMax ? parseInt(pricePerSqYardMax) : null,
      plot_size_min: plotSizeMin ? parseInt(plotSizeMin) : null,
      plot_size_max: plotSizeMax ? parseInt(plotSizeMax) : null,
      investment_intents: investmentIntents,
      amenities,
      highlights,
      why_invest: whyInvest,
      cover_image_url: coverImageUrl || null,
      gallery_urls: galleryUrls,
      files,
      videos,
      phone_override: null,
      whatsapp_override: null,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      is_published: finalPublishState,
    };

    console.log("Saving brochure with is_published:", finalPublishState);

    try {
      let result;
      if (isEditing) {
        result = await supabase.from("brochures").update(brochureData).eq("id", brochure.id);
      } else {
        result = await supabase.from("brochures").insert(brochureData);
      }

      if (result.error) {
        throw result.error;
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/admin/brochures");
        router.refresh();
      }, 500);
    } catch (error: any) {
      console.error("Save error:", error);
      setSaveError(error.message || "Failed to save brochure. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Save as draft - explicitly pass false
  const handleSaveAsDraft = () => {
    handleSave(false);
  };

  // Publish now - explicitly pass true
  const handlePublish = () => {
    handleSave(true);
  };

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 flex items-center gap-3">
          <div className="rounded-full bg-green-500/20 p-2">
            <Save className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="font-medium text-green-400">Brochure saved successfully!</p>
            <p className="text-sm text-green-400/70">Redirecting...</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3">
          <div className="rounded-full bg-red-500/20 p-2">
            <X className="h-5 w-5 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-400">Error saving brochure</p>
            <p className="text-sm text-red-400/70">{saveError}</p>
          </div>
          <button onClick={() => setSaveError(null)} className="text-red-400 hover:text-red-300">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/brochures"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Brochures
        </Link>
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            isPublished
              ? "bg-green-500/20 text-green-400"
              : "bg-amber-500/20 text-amber-400"
          }`}>
            {isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {isPublished ? "Will be Published" : "Will be Draft"}
          </div>

          {/* Main Save Button - uses current isPublished state */}
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-dark px-6 py-2.5 text-sm font-semibold text-black hover:from-gold-light hover:to-gold transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : isEditing ? (isPublished ? "Update & Publish" : "Update as Draft") : (isPublished ? "Create & Publish" : "Create as Draft")}
          </button>

          {/* Publish Now - only show when draft */}
          {!isPublished && (
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-500 transition-all disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              Publish Now
            </button>
          )}

          {/* Unpublish - only show when published */}
          {isPublished && (
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-500 transition-all disabled:opacity-50"
            >
              <EyeOff className="h-4 w-4" />
              Unpublish
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-white/5 to-transparent p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Krishna Gardens Phase 2"
                  className="w-full rounded-lg border border-gold/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">/brochures/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="krishna-gardens-phase-2"
                    className="flex-1 rounded-lg border border-gold/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Nagpur Highway"
                      className="w-full rounded-lg border border-gold/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-neutral-900 px-4 py-3 text-white focus:border-gold focus:outline-none [&>option]:bg-neutral-900 [&>option]:text-white"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r} className="bg-neutral-900 text-white">{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the property layout, location advantages, and key features..."
                  className="w-full rounded-lg border border-gold/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Size */}
          <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-white/5 to-transparent p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Pricing & Size</h2>
            
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Budget Range (Min) ₹</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={formatNumberWithCommas(budgetMin)}
                      onChange={(e) => setBudgetMin(parseFormattedNumber(e.target.value))}
                      placeholder="e.g., 20,00,000"
                      className="w-full rounded-lg border border-gold/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                  </div>
                  {budgetMin && <p className="text-xs text-gray-500 mt-1">= ₹{formatNumberWithCommas(budgetMin)}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Budget Range (Max) ₹</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={formatNumberWithCommas(budgetMax)}
                      onChange={(e) => setBudgetMax(parseFormattedNumber(e.target.value))}
                      placeholder="e.g., 1,00,00,000"
                      className="w-full rounded-lg border border-gold/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                  </div>
                  {budgetMax && <p className="text-xs text-gray-500 mt-1">= ₹{formatNumberWithCommas(budgetMax)}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Price per Sq. Yard (Min) ₹</label>
                  <input
                    type="text"
                    value={formatNumberWithCommas(pricePerSqYardMin)}
                    onChange={(e) => setPricePerSqYardMin(parseFormattedNumber(e.target.value))}
                    placeholder="e.g., 15,000"
                    className="w-full rounded-lg border border-gold/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Price per Sq. Yard (Max) ₹</label>
                  <input
                    type="text"
                    value={formatNumberWithCommas(pricePerSqYardMax)}
                    onChange={(e) => setPricePerSqYardMax(parseFormattedNumber(e.target.value))}
                    placeholder="e.g., 25,000"
                    className="w-full rounded-lg border border-gold/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Plot Size (Min sq. yards)</label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={formatNumberWithCommas(plotSizeMin)}
                      onChange={(e) => setPlotSizeMin(parseFormattedNumber(e.target.value))}
                      placeholder="e.g., 150"
                      className="w-full rounded-lg border border-gold/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Plot Size (Max sq. yards)</label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={formatNumberWithCommas(plotSizeMax)}
                      onChange={(e) => setPlotSizeMax(parseFormattedNumber(e.target.value))}
                      placeholder="e.g., 500"
                      className="w-full rounded-lg border border-gold/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-white/5 to-transparent p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Features & Amenities</h2>
            
            <div className="space-y-6">
              {/* Investment Intents */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Investment Intent</label>
                <div className="flex flex-wrap gap-2">
                  {INVESTMENT_INTENTS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleIntent(value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        investmentIntents.includes(value)
                          ? "bg-gold text-black"
                          : "border border-gold/30 text-gray-400 hover:border-gold hover:text-gold"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_AMENITIES.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        amenities.includes(amenity)
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "border border-gold/20 text-gray-400 hover:border-gold/40"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Key Highlights</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addHighlight()}
                    placeholder="Add a highlight..."
                    className="flex-1 rounded-lg border border-gold/20 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="rounded-lg bg-gold/20 px-4 py-2 text-gold hover:bg-gold/30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white"
                    >
                      {h}
                      <button
                        type="button"
                        onClick={() => setHighlights((prev) => prev.filter((_, idx) => idx !== i))}
                        className="ml-1 text-gray-400 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Why Invest */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Why Invest Here?</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newWhyInvest}
                    onChange={(e) => setNewWhyInvest(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addWhyInvest()}
                    placeholder="Add a reason to invest..."
                    className="flex-1 rounded-lg border border-gold/20 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addWhyInvest}
                    className="rounded-lg bg-gold/20 px-4 py-2 text-gold hover:bg-gold/30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {whyInvest.map((w, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2"
                    >
                      <span className="text-sm text-gray-300">{w}</span>
                      <button
                        type="button"
                        onClick={() => setWhyInvest((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Videos */}
          <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-white/5 to-transparent p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Videos</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube URL..."
                    className="w-full rounded-lg border border-gold/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={addVideo}
                  className="rounded-lg bg-gold/20 px-4 py-3 text-gold hover:bg-gold/30"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {videos.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {videos.map((video, i) => (
                    <div key={video.id} className="relative rounded-lg overflow-hidden bg-neutral-800">
                      {video.thumbnail_url && (
                        <img src={video.thumbnail_url} alt="" className="w-full aspect-video object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => setVideos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Settings */}
          <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-white/5 to-transparent p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Status & Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BrochureStatus)}
                  className="w-full rounded-lg border border-gold/20 bg-neutral-900 px-4 py-3 text-white focus:border-gold focus:outline-none [&>option]:bg-neutral-900 [&>option]:text-white"
                >
                  {STATUSES.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-neutral-900 text-white">{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Priority (higher = shown first)</label>
                <input
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-lg border border-gold/20 bg-white/5 px-4 py-3 text-white focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400">Featured</span>
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isFeatured ? "bg-gold" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isFeatured ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-white/5 to-transparent p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Cover Image</h2>
            
            {coverImageUrl ? (
              <div className="relative">
                <SmartImage src={coverImageUrl} alt="Cover" width={1200} className="w-full rounded-lg" loading="eager" />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl("")}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="relative rounded-lg border-2 border-dashed border-gold/30 p-8 text-center hover:border-gold/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCoverUpload(e.target.files)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-gold mx-auto animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Click to upload cover image</p>
                  </>
                )}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={coverGdriveLink}
                  onChange={(e) => setCoverGdriveLink(e.target.value)}
                  placeholder="Paste Google Drive image link..."
                  className="w-full rounded-lg border border-gold/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={setCoverFromGdrive}
                className="rounded-lg bg-gold/20 px-4 py-3 text-gold hover:bg-gold/30"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500">Google Drive image must be shared as "Anyone with the link".</p>
          </div>

          {/* Gallery */}
          <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-white/5 to-transparent p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Gallery</h2>
            
            <div className="space-y-4">
              <div className="relative rounded-lg border-2 border-dashed border-gold/30 p-6 text-center hover:border-gold/50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleGalleryUpload(e.target.files)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-gold mx-auto animate-spin" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gray-500 mx-auto mb-1" />
                    <p className="text-sm text-gray-400">Add images</p>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={galleryGdriveLink}
                    onChange={(e) => setGalleryGdriveLink(e.target.value)}
                    placeholder="Paste Google Drive image link..."
                    className="w-full rounded-lg border border-gold/20 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={addGalleryFromGdrive}
                  className="rounded-lg bg-gold/20 px-4 py-3 text-gold hover:bg-gold/30"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {galleryUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {galleryUrls.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                      <SmartImage src={url} alt="" width={360} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGalleryUrls((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PDF Brochures */}
          <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-white/5 to-transparent p-6">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold" />
              PDF Brochures
            </h2>
            <p className="text-xs text-gray-500 mb-4">Upload PDF files that customers can download</p>

            {pdfUploadError && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200 whitespace-pre-line">
                {pdfUploadError}
              </div>
            )}

            {pdfUploadSuccess && (
              <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-200">
                {pdfUploadSuccess}
              </div>
            )}
            
            <div className="space-y-4">
              {/* Option 1: Upload from device */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Option 1: Upload from device</label>
                <div className="relative rounded-lg border-2 border-dashed border-gold/30 p-4 text-center hover:border-gold/50">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    multiple
                    onChange={(e) => handlePdfUpload(e.target.files)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploadingPdf}
                  />
                  {uploadingPdf ? (
                    <Loader2 className="h-5 w-5 text-gold mx-auto animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Click to upload PDF</p>
                    </>
                  )}
                </div>
              </div>

              {/* Option 2: Add from Google Drive */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Option 2: Add from Google Drive</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={gdriveFileName}
                    onChange={(e) => setGdriveFileName(e.target.value)}
                    placeholder="File name (e.g., Project Brochure)"
                    className="w-full rounded-lg border border-gold/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={gdriveLink}
                      onChange={(e) => setGdriveLink(e.target.value)}
                      placeholder="Paste Google Drive share link..."
                      className="flex-1 rounded-lg border border-gold/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addGdriveFile}
                      disabled={!gdriveLink.trim()}
                      className="rounded-lg bg-gold/20 px-3 py-2 text-xs font-medium text-gold hover:bg-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500">Make sure the file is set to "Anyone with the link can view"</p>
                </div>
              </div>

              {/* Uploaded Files List */}
              {files.length > 0 && (
                <div className="pt-3 border-t border-gold/10">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Uploaded Files ({files.length})</label>
                  <div className="space-y-2">
                    {files.map((file, i) => (
                      <div key={file.id || i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-gold/10">
                        <FileText className="h-5 w-5 text-red-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{file.name}</p>
                          <p className="text-[10px] text-gray-500">
                            {(file.source ?? "upload") === "gdrive" ? "Google Drive" : "Uploaded"}
                            {file.size_bytes ? ` · ${(file.size_bytes / 1024 / 1024).toFixed(2)} MB` : ""}
                          </p>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gold hover:underline"
                        >
                          View
                        </a>
                        <button
                          type="button"
                          onClick={() => deletePdfFile(i)}
                          disabled={deletingPdfId === file.id}
                          className="rounded-full p-1 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                        >
                          {deletingPdfId === file.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {files.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-2">No PDF files added yet</p>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-white/5 to-transparent p-6">
            <h2 className="text-lg font-semibold text-white mb-4">SEO</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO title..."
                  className="w-full rounded-lg border border-gold/20 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  placeholder="SEO description..."
                  className="w-full rounded-lg border border-gold/20 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
