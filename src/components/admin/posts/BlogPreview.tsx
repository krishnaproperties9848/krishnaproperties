"use client";

import { useState } from "react";
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Clock, 
  Calendar, 
  Eye,
  ChevronRight,
  ArrowLeft,
  Phone,
  MessageCircle
} from "lucide-react";
import { MarkdownRenderer } from "@/components/blog";
import { BRAND } from "@/lib/constants";

interface BlogPreviewProps {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryName?: string;
  categoryColor?: string;
  authorName: string;
  authorAvatar?: string;
  readingTime: number;
  tags: string[];
  onClose: () => void;
}

type DeviceType = "desktop" | "tablet" | "mobile";

export default function BlogPreview({
  title,
  excerpt,
  content,
  coverImage,
  categoryName,
  categoryColor = "#d4af37",
  authorName,
  authorAvatar = "/headshot-krishna.webp",
  readingTime,
  tags,
  onClose,
}: BlogPreviewProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");

  const deviceConfig = {
    desktop: { width: "1024px", padding: "px-8", maxContent: "max-w-3xl" },
    tablet: { width: "768px", padding: "px-6", maxContent: "max-w-2xl" },
    mobile: { width: "375px", padding: "px-4", maxContent: "max-w-full" },
  };

  const config = deviceConfig[device];

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col" style={{ isolation: 'isolate' }}>
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-gold/20 bg-neutral-900">
        <div className="flex items-center gap-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-gold" />
            Preview Mode
          </h2>
          <span className="text-sm text-gray-500 hidden md:inline">See how your post will look when published</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Device Selector */}
          <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setDevice("desktop")}
              className={`p-2 rounded-md transition-colors ${
                device === "desktop" ? "bg-gold text-black" : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
              title="Desktop (1024px)"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`p-2 rounded-md transition-colors ${
                device === "tablet" ? "bg-gold text-black" : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`p-2 rounded-md transition-colors ${
                device === "mobile" ? "bg-gold text-black" : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
              title="Mobile (375px)"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
            Close Preview
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-neutral-950 p-4 md:p-6 flex justify-center">
        <div
          className="bg-black rounded-xl border border-gold/20 overflow-hidden transition-all duration-300 shadow-2xl h-fit"
          style={{ width: config.width, maxWidth: "100%" }}
        >
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800/80 border-b border-gold/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 mx-2">
              <div className="bg-neutral-700/60 rounded px-3 py-1 text-[10px] text-gray-400 font-mono truncate">
                krishnaproperties.com/insights/{title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}
              </div>
            </div>
          </div>

          {/* Blog Content - Isolated */}
          <article className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            {/* Cover Image */}
            {coverImage && (
              <div className="relative w-full bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt={title || "Cover image"}
                  className="w-full h-auto max-w-full block"
                  loading="eager"
                  style={{ aspectRatio: 'auto' }}
                />
              </div>
            )}

            {/* Hero Content */}
            <header className={`${config.padding} py-6 border-b border-gold/10`}>
              <div className={`mx-auto ${config.maxContent}`}>
                {/* Breadcrumb */}
                <nav className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-gold hover:text-gold-light cursor-pointer">
                    <ArrowLeft className="h-3 w-3" />
                    Blog
                  </span>
                  {categoryName && (
                    <>
                      <ChevronRight className="h-3 w-3" />
                      <span style={{ color: categoryColor }}>{categoryName}</span>
                    </>
                  )}
                </nav>

                {/* Category Badge */}
                {categoryName && (
                  <span
                    className="mb-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: categoryColor, color: "#000" }}
                  >
                    {categoryName}
                  </span>
                )}

                {/* Title */}
                <h1 className={`font-serif text-white leading-tight mb-3 ${
                  device === "mobile" ? "text-xl" : device === "tablet" ? "text-2xl" : "text-3xl"
                }`}>
                  {title || "Untitled Post"}
                </h1>

                {/* Excerpt */}
                {excerpt && (
                  <p className={`text-gray-400 leading-relaxed ${
                    device === "mobile" ? "text-sm" : "text-base"
                  }`}>
                    {excerpt}
                  </p>
                )}

                {/* Meta */}
                <div className={`mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 ${
                  device === "mobile" ? "flex-col items-start gap-2" : ""
                }`}>
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-gold/30 bg-neutral-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={authorAvatar}
                        alt={authorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white text-xs">{authorName}</p>
                      <p className="text-[10px] text-gray-500">Property Consultant</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readingTime} min
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <section className={`${config.padding} py-6`}>
              <div className={`mx-auto ${config.maxContent}`}>
                <MarkdownRenderer content={content || "*Start writing your blog post...*"} />

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-1.5 border-t border-gold/10 pt-4">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-[10px] text-gold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className={`mt-5 flex gap-3 rounded-lg border border-gold/20 bg-white/5 p-3 ${
                  device === "mobile" ? "flex-col" : "flex-row items-center justify-between"
                }`}>
                  <div>
                    <p className="font-medium text-white text-xs">Found this helpful?</p>
                    <p className="text-[10px] text-gray-400">
                      Speak with {BRAND.consultant.name} for guidance.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-3 text-[10px] font-bold text-black">
                      <Phone className="h-3 w-3" />
                      Call
                    </span>
                    <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-gold/30 bg-black/40 px-3 text-[10px] font-medium text-white">
                      <MessageCircle className="h-3 w-3" />
                      WhatsApp
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-6 py-2 border-t border-gold/20 bg-neutral-900 text-center">
        <p className="text-[10px] text-gray-500">
          Preview mode • Images and content will appear exactly like this when published
        </p>
      </div>
    </div>
  );
}
