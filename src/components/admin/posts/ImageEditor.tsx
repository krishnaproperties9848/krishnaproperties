"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { 
  X, 
  Check, 
  RotateCcw, 
  Crop as CropIcon, 
  Maximize, 
  Image as ImageIcon,
  Loader2,
  Sun,
  Contrast,
  Sparkles,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Palette,
  Sliders,
  Wand2,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Expand,
  Shrink,
  Square,
  RectangleHorizontal,
  Grid3X3,
  Plus,
  Trash2,
  Move,
  CornerUpLeft
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageEditorProps {
  imageUrl: string;
  onSave: (croppedImageUrl: string, altText: string) => void;
  onCancel: () => void;
  initialAltText?: string;
}

interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
}

interface ImageSettings {
  scale: number;
  borderRadius: number;
  objectFit: "contain" | "cover" | "fill";
  shadow: string;
  border: number;
}

type DevicePreview = "desktop" | "tablet" | "mobile";
type LayoutMode = "single" | "side-by-side" | "grid-2x2";

const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
};

const DEFAULT_SETTINGS: ImageSettings = {
  scale: 100,
  borderRadius: 0,
  objectFit: "contain",
  shadow: "none",
  border: 0,
};

const PRESET_FILTERS: { name: string; filters: Partial<ImageFilters> }[] = [
  { name: "Original", filters: {} },
  { name: "Vivid", filters: { saturation: 130, contrast: 110 } },
  { name: "Warm", filters: { sepia: 20, saturation: 110 } },
  { name: "Cool", filters: { saturation: 90, brightness: 105 } },
  { name: "B&W", filters: { grayscale: 100 } },
  { name: "Vintage", filters: { sepia: 40, contrast: 90, saturation: 80 } },
  { name: "Dramatic", filters: { contrast: 130, saturation: 80, brightness: 95 } },
  { name: "Soft", filters: { contrast: 90, brightness: 105, blur: 0.5 } },
];

const SHADOW_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Soft", value: "0 4px 6px -1px rgba(0,0,0,0.3)" },
  { name: "Medium", value: "0 10px 15px -3px rgba(0,0,0,0.4)" },
  { name: "Large", value: "0 20px 25px -5px rgba(0,0,0,0.5)" },
  { name: "Gold Glow", value: "0 0 20px rgba(212,175,55,0.4)" },
];

const DEVICE_WIDTHS = {
  desktop: 800,
  tablet: 600,
  mobile: 350,
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageEditor({ imageUrl, onSave, onCancel, initialAltText = "" }: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [altText, setAltText] = useState(initialAltText);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"fit" | "crop" | "adjust" | "filters" | "style">("fit");
  const [filters, setFilters] = useState<ImageFilters>(DEFAULT_FILTERS);
  const [settings, setSettings] = useState<ImageSettings>(DEFAULT_SETTINGS);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("single");
  const [collageImages, setCollageImages] = useState<string[]>([imageUrl]);
  const [uploadingCollage, setUploadingCollage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    const { width, height } = e.currentTarget;
    if (aspect) {
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }, [aspect]);

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current && newAspect) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newAspect));
    } else {
      setCrop(undefined);
    }
  };

  const getFilterStyle = () => {
    return {
      filter: `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        blur(${filters.blur}px) 
        grayscale(${filters.grayscale}%) 
        sepia(${filters.sepia}%)
      `,
      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
    };
  };

  const getImageContainerStyle = () => {
    return {
      borderRadius: `${settings.borderRadius}px`,
      boxShadow: settings.shadow,
      border: settings.border > 0 ? `${settings.border}px solid rgba(212,175,55,0.5)` : "none",
      overflow: "hidden" as const,
    };
  };

  const applyPreset = (preset: Partial<ImageFilters>) => {
    setFilters({ ...DEFAULT_FILTERS, ...preset });
  };

  const resetAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSettings(DEFAULT_SETTINGS);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setLayoutMode("single");
    setCollageImages([imageUrl]);
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCollage(true);
    
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `collage-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const filePath = `posts/${fileName}`;

      const { error } = await supabase.storage.from("images").upload(filePath, file, {
        contentType: file.type,
        cacheControl: '3600',
      });
      
      if (error) {
        alert("Error uploading: " + error.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(filePath);
      
      // Use functional update to ensure we have latest state
      setCollageImages(prev => [...prev, publicUrl]);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploadingCollage(false);
      // Reset file input
      if (e.target) e.target.value = "";
    }
  };

  const removeCollageImage = (index: number) => {
    if (collageImages.length > 1) {
      setCollageImages(collageImages.filter((_, i) => i !== index));
    }
  };

  const getProcessedImage = async (): Promise<Blob | null> => {
    if (!imgRef.current || !canvasRef.current) return null;

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Calculate dimensions based on crop or full image
    let sourceX = 0, sourceY = 0, sourceW = image.naturalWidth, sourceH = image.naturalHeight;
    
    if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      sourceX = completedCrop.x * scaleX;
      sourceY = completedCrop.y * scaleY;
      sourceW = completedCrop.width * scaleX;
      sourceH = completedCrop.height * scaleY;
    }

    // Handle rotation dimensions
    const isRotated90 = rotation === 90 || rotation === 270;
    canvas.width = isRotated90 ? sourceH : sourceW;
    canvas.height = isRotated90 ? sourceW : sourceH;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // Apply filters
    ctx.filter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      blur(${filters.blur}px) 
      grayscale(${filters.grayscale}%) 
      sepia(${filters.sepia}%)
    `;

    // Draw the image
    const drawW = isRotated90 ? sourceH : sourceW;
    const drawH = isRotated90 ? sourceW : sourceH;
    ctx.drawImage(
      image,
      sourceX, sourceY, sourceW, sourceH,
      -drawW / 2, -drawH / 2, sourceW, sourceH
    );

    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/webp", 0.92);
    });
  };

  const hasEdits = () => {
    return (
      (completedCrop?.width ?? 0) > 0 ||
      rotation !== 0 ||
      flipH ||
      flipV ||
      filters.brightness !== 100 ||
      filters.contrast !== 100 ||
      filters.saturation !== 100 ||
      filters.blur !== 0 ||
      filters.grayscale !== 0 ||
      filters.sepia !== 0 ||
      settings.scale !== 100 ||
      settings.borderRadius !== 0 ||
      settings.objectFit !== "contain" ||
      settings.shadow !== "none" ||
      settings.border !== 0 ||
      layoutMode !== "single" ||
      collageImages.length > 1
    );
  };

  const renderImagePreview = () => {
    const containerWidth = DEVICE_WIDTHS[devicePreview];
    const containerHeight = devicePreview === "mobile" ? 280 : devicePreview === "tablet" ? 350 : 400;
    
    if (layoutMode === "single") {
      return (
        <div 
          className="relative mx-auto transition-all duration-300 bg-neutral-800/50 flex items-center justify-center"
          style={{ 
            width: `${containerWidth}px`, 
            height: `${containerHeight}px`,
            maxWidth: "100%",
            ...getImageContainerStyle()
          }}
        >
          <img
            ref={imgRef}
            src={collageImages[0]}
            alt="Preview"
            onLoad={onImageLoad}
            className="transition-all duration-300"
            style={{
              width: settings.objectFit === "contain" ? "auto" : "100%",
              height: settings.objectFit === "contain" ? "100%" : "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: settings.objectFit,
              ...getFilterStyle(),
              transform: `${getFilterStyle().transform} scale(${settings.scale / 100})`,
            }}
            crossOrigin="anonymous"
          />
        </div>
      );
    }

    if (layoutMode === "side-by-side") {
      const itemHeight = devicePreview === "mobile" ? 140 : 180;
      return (
        <div 
          className="flex gap-3 mx-auto transition-all duration-300"
          style={{ width: `${containerWidth}px`, maxWidth: "100%" }}
        >
          {collageImages.slice(0, 2).map((img, idx) => (
            <div 
              key={idx} 
              className="flex-1 relative group bg-neutral-800/50"
              style={{ ...getImageContainerStyle(), height: `${itemHeight}px` }}
            >
              <img
                src={img}
                alt={`Image ${idx + 1}`}
                className="w-full h-full transition-all"
                style={{ ...getFilterStyle(), objectFit: settings.objectFit }}
                crossOrigin="anonymous"
              />
              {collageImages.length > 1 && (
                <button
                  onClick={() => removeCollageImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Trash2 className="h-3 w-3 text-white" />
                </button>
              )}
            </div>
          ))}
          {collageImages.length < 2 && (
            <label 
              className="flex-1 border-2 border-dashed border-gold/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all"
              style={{ height: `${itemHeight}px` }}
            >
              {uploadingCollage ? (
                <Loader2 className="h-8 w-8 text-gold animate-spin" />
              ) : (
                <>
                  <Plus className="h-8 w-8 text-gold/50" />
                  <span className="text-xs text-gray-500 mt-2">Add Image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAddImage}
                className="hidden"
                disabled={uploadingCollage}
              />
            </label>
          )}
        </div>
      );
    }

    if (layoutMode === "grid-2x2") {
      const itemHeight = devicePreview === "mobile" ? 100 : 140;
      return (
        <div 
          className="grid grid-cols-2 gap-3 mx-auto transition-all duration-300"
          style={{ width: `${containerWidth}px`, maxWidth: "100%" }}
        >
          {[0, 1, 2, 3].map((idx) => (
            <div 
              key={idx} 
              className="relative group bg-neutral-800/50"
              style={{ ...getImageContainerStyle(), height: `${itemHeight}px` }}
            >
              {collageImages[idx] ? (
                <>
                  <img
                    src={collageImages[idx]}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-full transition-all"
                    style={{ ...getFilterStyle(), objectFit: settings.objectFit }}
                    crossOrigin="anonymous"
                  />
                  <button
                    onClick={() => removeCollageImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                </>
              ) : (
                <label 
                  className="w-full h-full border-2 border-dashed border-gold/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all"
                >
                  {uploadingCollage ? (
                    <Loader2 className="h-6 w-6 text-gold animate-spin" />
                  ) : (
                    <Plus className="h-6 w-6 text-gold/50" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddImage}
                    className="hidden"
                    disabled={uploadingCollage}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      let finalUrl = imageUrl;

      // If any edits were applied, process and upload
      if (hasEdits()) {
        const processedBlob = await getProcessedImage();
        if (processedBlob) {
          const supabase = createClient();
          const fileName = `edited-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
          const filePath = `posts/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(filePath, processedBlob, { contentType: "image/webp" });

          if (uploadError) {
            alert("Error uploading image: " + uploadError.message);
            setSaving(false);
            return;
          }

          const { data: { publicUrl } } = supabase.storage
            .from("images")
            .getPublicUrl(filePath);

          finalUrl = publicUrl;

          // Save to media assets
          await supabase.from("media_assets").insert({
            file_name: fileName,
            file_type: "image/webp",
            file_size: processedBlob.size,
            url: publicUrl,
            alt_text: altText || "Edited image",
          });
        }
      }

      onSave(finalUrl, altText);
    } catch (error: any) {
      alert("Error saving image: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl border border-gold/30 bg-neutral-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/20 px-6 py-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-gold" />
            Image Editor
          </h3>
          <div className="flex items-center gap-3">
            {/* Device Preview Selector */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setDevicePreview("desktop")}
                className={`p-1.5 rounded-md transition-colors ${
                  devicePreview === "desktop" ? "bg-gold text-black" : "text-gray-400 hover:text-white"
                }`}
                title="Desktop Preview"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDevicePreview("tablet")}
                className={`p-1.5 rounded-md transition-colors ${
                  devicePreview === "tablet" ? "bg-gold text-black" : "text-gray-400 hover:text-white"
                }`}
                title="Tablet Preview"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDevicePreview("mobile")}
                className={`p-1.5 rounded-md transition-colors ${
                  devicePreview === "mobile" ? "bg-gold text-black" : "text-gray-400 hover:text-white"
                }`}
                title="Mobile Preview"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={resetAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gold/20 bg-white/5 overflow-x-auto">
          <button
            onClick={() => setActiveTab("fit")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "fit" 
                ? "border-gold text-gold" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Expand className="h-3.5 w-3.5" />
            Fit & Layout
          </button>
          <button
            onClick={() => setActiveTab("crop")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "crop" 
                ? "border-gold text-gold" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <CropIcon className="h-3.5 w-3.5" />
            Crop & Transform
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "style" 
                ? "border-gold text-gold" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Square className="h-3.5 w-3.5" />
            Style & Corners
          </button>
          <button
            onClick={() => setActiveTab("adjust")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "adjust" 
                ? "border-gold text-gold" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Adjustments
          </button>
          <button
            onClick={() => setActiveTab("filters")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "filters" 
                ? "border-gold text-gold" 
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Controls */}
          <div className="w-72 border-r border-gold/20 bg-black/30 overflow-y-auto p-4 space-y-4">
            {/* Fit & Layout Tab */}
            {activeTab === "fit" && (
              <>
                {/* Object Fit */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Image Fit Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Contain", value: "contain" as const, icon: Shrink, desc: "Fit whole image" },
                      { label: "Cover", value: "cover" as const, icon: Expand, desc: "Fill & crop" },
                      { label: "Fill", value: "fill" as const, icon: Maximize, desc: "Stretch to fit" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => setSettings({ ...settings, objectFit: item.value })}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                          settings.objectFit === item.value 
                            ? "bg-gold text-black" 
                            : "bg-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {settings.objectFit === "contain" && "Shows the whole image without cropping"}
                    {settings.objectFit === "cover" && "Fills the area, may crop edges"}
                    {settings.objectFit === "fill" && "Stretches to fill (may distort)"}
                  </p>
                </div>

                {/* Scale */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                      <ZoomIn className="h-3 w-3" />
                      Scale
                    </label>
                    <span className="text-xs text-gold">{settings.scale}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.scale}
                    onChange={(e) => setSettings({ ...settings, scale: Number(e.target.value) })}
                    className="w-full accent-gold"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>Shrink</span>
                    <button 
                      onClick={() => setSettings({ ...settings, scale: 100 })}
                      className="text-gold hover:underline"
                    >
                      Reset
                    </button>
                    <span>Expand</span>
                  </div>
                </div>

                {/* Layout Mode */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Layout (Collage)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setLayoutMode("single")}
                      className={`py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                        layoutMode === "single" ? "bg-gold text-black" : "bg-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <ImageIcon className="h-4 w-4" />
                      Single
                    </button>
                    <button
                      onClick={() => setLayoutMode("side-by-side")}
                      className={`py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                        layoutMode === "side-by-side" ? "bg-gold text-black" : "bg-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <RectangleHorizontal className="h-4 w-4" />
                      Side by Side
                    </button>
                    <button
                      onClick={() => setLayoutMode("grid-2x2")}
                      className={`py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                        layoutMode === "grid-2x2" ? "bg-gold text-black" : "bg-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                      Grid 2×2
                    </button>
                  </div>
                </div>

                {/* Add More Images */}
                {layoutMode !== "single" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Add Images</label>
                    <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-dashed border-gold/30 text-gray-400 hover:border-gold/50 hover:text-white cursor-pointer transition-colors ${uploadingCollage ? 'opacity-50 cursor-wait' : ''}`}>
                      {uploadingCollage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-xs">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span className="text-xs">Upload another image</span>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAddImage}
                        className="hidden"
                        disabled={uploadingCollage}
                      />
                    </label>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {collageImages.length} of {layoutMode === "side-by-side" ? 2 : 4} images added
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Crop Tab */}
            {activeTab === "crop" && (
              <>
                {/* Aspect Ratio */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "16:9", value: 16 / 9 },
                      { label: "4:3", value: 4 / 3 },
                      { label: "1:1", value: 1 },
                      { label: "Free", value: undefined },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleAspectChange(item.value)}
                        className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                          aspect === item.value ? "bg-gold text-black" : "bg-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rotation */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Rotation</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      -90°
                    </button>
                    <button
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <RotateCw className="h-4 w-4" />
                      +90°
                    </button>
                  </div>
                  <div className="mt-2 text-center text-xs text-gray-500">
                    Current: {rotation}°
                  </div>
                </div>

                {/* Flip */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Flip</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFlipH(!flipH)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors ${
                        flipH ? "bg-gold text-black" : "bg-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <FlipHorizontal className="h-4 w-4" />
                      Horizontal
                    </button>
                    <button
                      onClick={() => setFlipV(!flipV)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors ${
                        flipV ? "bg-gold text-black" : "bg-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <FlipVertical className="h-4 w-4" />
                      Vertical
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Style & Corners Tab */}
            {activeTab === "style" && (
              <>
                {/* Border Radius */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                      <Square className="h-3 w-3" />
                      Corner Radius
                    </label>
                    <span className="text-xs text-gold">{settings.borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={settings.borderRadius}
                    onChange={(e) => setSettings({ ...settings, borderRadius: Number(e.target.value) })}
                    className="w-full accent-gold"
                  />
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {[0, 8, 16, 24].map((r) => (
                      <button
                        key={r}
                        onClick={() => setSettings({ ...settings, borderRadius: r })}
                        className={`py-1 rounded text-[10px] transition-colors ${
                          settings.borderRadius === r ? "bg-gold text-black" : "bg-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        {r === 0 ? "Sharp" : `${r}px`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shadow */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Shadow</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SHADOW_OPTIONS.map((shadow) => (
                      <button
                        key={shadow.name}
                        onClick={() => setSettings({ ...settings, shadow: shadow.value })}
                        className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                          settings.shadow === shadow.value 
                            ? "bg-gold text-black" 
                            : "bg-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        {shadow.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-400">Gold Border</label>
                    <span className="text-xs text-gold">{settings.border}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={settings.border}
                    onChange={(e) => setSettings({ ...settings, border: Number(e.target.value) })}
                    className="w-full accent-gold"
                  />
                </div>

                {/* Preview Styles */}
                <div className="pt-2 border-t border-gold/10">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Quick Styles</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSettings({ ...DEFAULT_SETTINGS })}
                      className="py-2 rounded-lg text-xs bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      Default
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, borderRadius: 16, shadow: "0 10px 15px -3px rgba(0,0,0,0.4)" })}
                      className="py-2 rounded-lg text-xs bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      Card Style
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, borderRadius: 999, shadow: "0 0 20px rgba(212,175,55,0.4)" })}
                      className="py-2 rounded-lg text-xs bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      Circular Glow
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, borderRadius: 8, border: 2, shadow: "none" })}
                      className="py-2 rounded-lg text-xs bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      Gold Frame
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "adjust" && (
              <>
                {/* Brightness */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                      <Sun className="h-3 w-3" />
                      Brightness
                    </label>
                    <span className="text-xs text-gold">{filters.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={filters.brightness}
                    onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                    className="w-full accent-gold"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                      <Contrast className="h-3 w-3" />
                      Contrast
                    </label>
                    <span className="text-xs text-gold">{filters.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={filters.contrast}
                    onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                    className="w-full accent-gold"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Saturation
                    </label>
                    <span className="text-xs text-gold">{filters.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.saturation}
                    onChange={(e) => setFilters({ ...filters, saturation: Number(e.target.value) })}
                    className="w-full accent-gold"
                  />
                </div>

                {/* Blur */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-400">Blur</label>
                    <span className="text-xs text-gold">{filters.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={filters.blur}
                    onChange={(e) => setFilters({ ...filters, blur: Number(e.target.value) })}
                    className="w-full accent-gold"
                  />
                </div>
              </>
            )}

            {activeTab === "filters" && (
              <div className="grid grid-cols-2 gap-2">
                {PRESET_FILTERS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.filters)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-gold/30 transition-colors text-center"
                  >
                    <div className="w-full aspect-video rounded bg-gradient-to-br from-gold/20 to-gold/5 mb-2 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        style={{
                          filter: `
                            brightness(${preset.filters.brightness || 100}%) 
                            contrast(${preset.filters.contrast || 100}%) 
                            saturate(${preset.filters.saturation || 100}%) 
                            grayscale(${preset.filters.grayscale || 0}%) 
                            sepia(${preset.filters.sepia || 0}%)
                          `,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{preset.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Image Preview */}
          <div className="flex-1 flex flex-col">
            {/* Device indicator */}
            <div className="px-4 py-2 bg-black/30 border-b border-gold/10 flex items-center justify-center gap-2">
              <span className="text-[10px] text-gray-500">
                {devicePreview === "desktop" && "Desktop Preview (800px)"}
                {devicePreview === "tablet" && "Tablet Preview (600px)"}
                {devicePreview === "mobile" && "Mobile Preview (350px)"}
              </span>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#1a1a1a]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '20px 20px' }}>
              <canvas ref={canvasRef} className="hidden" />
              
              {activeTab === "crop" ? (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  className="max-h-[50vh]"
                >
                  <img
                    ref={imgRef}
                    src={collageImages[0]}
                    alt="Edit preview"
                    onLoad={onImageLoad}
                    className="max-h-[50vh] max-w-full object-contain"
                    style={getFilterStyle()}
                    crossOrigin="anonymous"
                  />
                </ReactCrop>
              ) : (
                renderImagePreview()
              )}
            </div>

            {/* Alt Text */}
            <div className="px-4 py-3 border-t border-gold/20 bg-white/5">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Alt Text (Caption & Accessibility)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image..."
                className="w-full rounded-lg border border-gold/20 bg-white/5 py-2 px-3 text-sm text-white placeholder-gray-600 focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gold/20 px-6 py-4 bg-white/5">
          <div className="text-xs text-gray-500">
            {hasEdits() ? (
              <span className="text-gold">Edits will be applied</span>
            ) : (
              "No edits - original image will be used"
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gold/30 text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-gold-light via-gold to-gold-dark text-black font-bold hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {hasEdits() ? "Apply & Insert" : "Insert Image"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
