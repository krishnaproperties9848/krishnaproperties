"use client";

import { blogService, ICategory, IBlogPostCard } from "@/lib/blog";
import { BlogCard } from "./BlogCard";
import { CategoryFilter } from "./CategoryFilter";
import { Phone, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/constants";

interface BlogSidebarProps {
  categories: Array<ICategory & { postCount: number }>;
  selectedCategory: string | null;
  onCategorySelect: (slug: string | null) => void;
  popularPosts?: IBlogPostCard[];
}

export function BlogSidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  popularPosts,
}: BlogSidebarProps) {
  const popular = popularPosts || blogService.getPopularPosts(4);

  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div className="rounded-2xl border border-gold/20 bg-white/5 p-5">
        <h3 className="mb-4 text-lg font-serif text-gold-light">Categories</h3>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={onCategorySelect}
          variant="list"
        />
      </div>

      {/* Popular Posts */}
      <div className="rounded-2xl border border-gold/20 bg-white/5 p-5">
        <h3 className="mb-4 text-lg font-serif text-gold-light">Popular Articles</h3>
        <div className="space-y-1">
          {popular.map((post) => (
            <BlogCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      </div>

      {/* CTA Card */}
      <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6 text-center">
        <h3 className="text-lg font-serif text-gold-light">Need Guidance?</h3>
        <p className="mt-2 text-sm text-gray-400">
          Speak with Bhukya Krishna for personalized plot recommendations.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <a
            href={`tel:${CONTACT.phone}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-sm font-bold text-black transition-transform hover:scale-[1.02]"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
          <a
            href={CONTACT.whatsappLink}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-gold/30 bg-black/40 text-sm font-semibold text-white hover:border-gold hover:text-gold"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </aside>
  );
}

export default BlogSidebar;
