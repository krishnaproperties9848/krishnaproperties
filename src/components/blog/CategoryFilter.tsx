"use client";

import { ICategory } from "@/lib/blog";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  TrendingUp,
  MapPin,
  FileText,
  Wallet,
  Globe,
  LayoutGrid,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  TrendingUp,
  MapPin,
  FileText,
  Wallet,
  Globe,
};

interface CategoryFilterProps {
  categories: Array<ICategory & { postCount: number }>;
  selectedCategory: string | null;
  onSelect: (categorySlug: string | null) => void;
  variant?: "pills" | "list";
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
  variant = "pills",
  className,
}: CategoryFilterProps) {
  if (variant === "list") {
    return (
      <div className={cn("space-y-1", className)}>
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
            selectedCategory === null
              ? "bg-gold/20 text-gold"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="flex-1">All Articles</span>
          <span className="text-xs text-gray-500">
            {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
          </span>
        </button>
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon || ""] || BookOpen;
          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.slug)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                selectedCategory === category.slug
                  ? "bg-gold/20 text-gold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <IconComponent
                className="h-4 w-4"
                style={{ color: category.color }}
              />
              <span className="flex-1">{category.name}</span>
              <span className="text-xs text-gray-500">{category.postCount}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Pills variant (horizontal)
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-all",
          selectedCategory === null
            ? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-black"
            : "border border-gold/30 bg-black/40 text-white hover:border-gold hover:text-gold"
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.slug)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            selectedCategory === category.slug
              ? "text-black"
              : "border border-white/20 bg-black/40 text-white hover:border-gold/50 hover:text-gold"
          )}
          style={
            selectedCategory === category.slug
              ? { backgroundColor: category.color }
              : undefined
          }
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
