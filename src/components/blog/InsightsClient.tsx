"use client";

import { useState, useMemo, useCallback } from "react";
import { Filter, X, BookOpen, TrendingUp } from "lucide-react";
import { BlogCard, BlogSearch, CategoryFilter, BlogSidebar } from "@/components/blog";
import type {
  IBlogPost,
  IBlogCategory,
  IBlogStats,
} from "@/lib/blog/supabase-repository";

interface InsightsClientProps {
  initialPosts: IBlogPost[];
  featuredPosts: IBlogPost[];
  categories: IBlogCategory[];
  stats: IBlogStats;
  popularPosts: IBlogPost[];
}

export default function InsightsClient({
  initialPosts,
  featuredPosts,
  categories,
  stats,
  popularPosts,
}: InsightsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter posts client-side based on category and search
  const filteredPosts = useMemo(() => {
    let filtered = initialPosts;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category?.slug === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [initialPosts, selectedCategory, searchQuery]);

  const handleCategorySelect = useCallback((slug: string | null) => {
    setSelectedCategory(slug);
    setMobileFilterOpen(false);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Adapt categories to old component format
  const adaptedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    color: c.color || "#d4af37",
    postCount: c.postCount,
  }));

  return (
    <div className="relative z-10 bg-black">
      {/* Hero Section */}
      <section className="relative overflow-visible border-b border-gold/10 bg-gradient-to-b from-gold/5 to-transparent py-12 sm:py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
              <BookOpen className="h-3.5 w-3.5" />
              Krishna Properties Blog
            </div>
            <h1 className="text-3xl font-serif text-gold-light md:text-5xl">
              Real Estate Insights
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-400 md:text-lg max-w-2xl mx-auto">
              Expert guidance on buying open plots in East Hyderabad and the
              Hyderabad–Warangal corridor. Learn from real experiences.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <BlogSearch
                onSearch={handleSearch}
                placeholder="Search for buying guides, market trends, tips..."
                className="w-full"
              />
            </div>

            {/* Quick Stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gold" />
                {stats.totalPosts} Articles
              </span>
              <span>{stats.totalCategories} Categories</span>
              <span>{stats.totalViews.toLocaleString()} Total Reads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && !searchQuery && !selectedCategory && (
        <section className="border-b border-gold/10 py-10 sm:py-12">
          <div className="container mx-auto px-6">
            <h2 className="mb-6 text-xl font-serif text-gold-light">
              Featured Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post as any} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Filter Toggle */}
      <div className="sticky top-16 z-30 border-b border-gold/10 bg-black/95 backdrop-blur-sm lg:hidden">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-4 py-2 text-sm font-medium text-white"
            >
              <Filter className="h-4 w-4" />
              Filters
              {selectedCategory && (
                <span className="rounded-full bg-gold px-2 py-0.5 text-xs text-black">
                  1
                </span>
              )}
            </button>
            <span className="text-sm text-gray-500">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[300px] max-w-[85vw] overflow-y-auto bg-neutral-900 border-r border-gold/20 shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gold/20 bg-neutral-900 px-5 py-4">
              <span className="text-lg font-serif text-gold-light">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gold hover:bg-gold/10"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              <BlogSidebar
                categories={adaptedCategories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            {/* Articles Grid */}
            <div>
              {/* Category Pills (Desktop) */}
              <div className="mb-6 hidden lg:block">
                <CategoryFilter
                  categories={adaptedCategories}
                  selectedCategory={selectedCategory}
                  onSelect={handleCategorySelect}
                  variant="pills"
                />
              </div>

              {/* Results Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-serif text-gold-light">
                  {selectedCategory
                    ? categories.find((c) => c.slug === selectedCategory)?.name
                    : searchQuery
                    ? `Results for "${searchQuery}"`
                    : "All Articles"}
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Articles Grid */}
              {filteredPosts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post as any} variant="default" />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-gold/20 bg-white/5 py-16 text-center">
                  <p className="text-gray-400">No articles found.</p>
                  {(selectedCategory || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSearchQuery("");
                      }}
                      className="mt-4 text-gold hover:text-gold-light underline-offset-2 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar (Desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <BlogSidebar
                  categories={adaptedCategories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                  popularPosts={popularPosts}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
