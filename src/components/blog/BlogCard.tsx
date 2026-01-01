"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// Flexible post type that works with both static and Supabase data
interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  coverImage?: string | null;
  author: {
    name: string;
    avatar: string;
  };
  category?: {
    name: string;
    slug: string;
    color?: string | null;
  } | null;
  readingTime?: number;
  publishedAt?: string | Date | null;
  isFeatured?: boolean;
}

interface BlogCardProps {
  post: BlogPostData;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export function BlogCard({ post, variant = "default", className }: BlogCardProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  // Get image URL (supports both featuredImage and coverImage)
  const imageUrl = post.featuredImage || post.coverImage;
  const categoryColor = post.category?.color || "#d4af37";
  const categoryName = post.category?.name || "Article";

  if (variant === "featured") {
    return (
      <Link
        href={`/insights/${post.slug}`}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-gold/20 shadow-xl transition-all duration-500 hover:border-gold/50 hover:shadow-gold/20 hover:-translate-y-2",
          className
        )}
      >
        {/* Background Image */}
        {imageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover opacity-40 transition-all duration-500 group-hover:opacity-50 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          </div>
        )}

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/20 to-transparent z-[1]" />

        <div className="relative z-10 flex h-full min-h-[320px] flex-col p-6">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
                color: "#000",
              }}
            >
              {categoryName}
            </span>
            <span className="text-xs text-gold/60 font-medium">{formattedDate}</span>
          </div>

          {/* Title */}
          <h3 className="mb-3 text-2xl font-serif font-bold leading-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gold-light group-hover:to-gold transition-all duration-300">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 text-sm text-gray-300 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-gold/40 shadow-lg">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{post.author.name}</p>
                <p className="text-xs text-gray-500">Property Consultant</p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between border-t border-gold/20 pt-4 text-xs">
              <span className="flex items-center gap-1.5 text-gray-400">
                <BookOpen className="h-3.5 w-3.5" />
                {post.readingTime || 5} min read
              </span>
              <span className="flex items-center gap-1.5 text-gold font-semibold group-hover:gap-2.5 transition-all">
                Read Article <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/insights/${post.slug}`}
        className={cn(
          "group flex gap-4 rounded-xl p-3 transition-colors hover:bg-white/5",
          className
        )}
      >
        {imageUrl && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-gold transition-colors">
            {post.title}
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            {post.readingTime || 5} min · {formattedDate}
          </p>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={`/insights/${post.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900/80 to-neutral-950 border border-gold/10 shadow-lg transition-all duration-500 hover:border-gold/40 hover:shadow-gold/10 hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      {imageUrl && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Category badge on image */}
          <div className="absolute top-4 left-4">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${categoryColor}ee, ${categoryColor}aa)`,
                color: "#000",
              }}
            >
              {categoryName}
            </span>
          </div>
          
          {/* Reading time on image */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
            <BookOpen className="h-3 w-3" />
            {post.readingTime || 5} min
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Date */}
        <p className="mb-2 text-xs font-medium text-gold/70">{formattedDate}</p>

        {/* Title */}
        <h3 className="mb-3 text-xl font-serif font-bold text-white leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gold-light group-hover:to-gold transition-all line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-4 text-sm text-gray-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>

        {/* Author & CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-gold/10 pt-4">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-gold/30 shadow-md">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{post.author.name}</p>
              <p className="text-[10px] text-gray-500">Property Expert</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-gold group-hover:gap-2 transition-all">
            Read <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
