"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { blogService, IBlogPostCard } from "@/lib/blog";
import { BlogCard } from "./BlogCard";
import { cn } from "@/lib/utils";

interface BlogSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showResults?: boolean;
}

export function BlogSearch({
  onSearch,
  placeholder = "Search articles...",
  className,
  showResults = true,
}: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IBlogPostCard[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const searchResults = blogService.searchPosts(query, 5);
      setResults(searchResults);
      setIsSearching(false);
      if (showResults) {
        setShowDropdown(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, showResults]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    onSearch?.("");
    inputRef.current?.focus();
  }, [onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    },
    []
  );

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && results.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full rounded-full bg-white/10 py-3 pl-11 pr-10 text-sm text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-gold/50"
          aria-label="Search articles"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gold" />
        )}
        {!isSearching && query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && showResults && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[400px] overflow-y-auto rounded-xl border border-gold/20 bg-neutral-900/95 backdrop-blur-md shadow-2xl"
        >
          {results.length > 0 ? (
            <div className="p-2">
              <p className="mb-2 px-3 text-xs text-gray-500">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              {results.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  variant="compact"
                  className="rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-500">
              No articles found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogSearch;
