/**
 * Supabase Blog Repository
 * Implements the Repository Pattern with SOLID principles:
 * - Single Responsibility: Only handles Supabase data access
 * - Open/Closed: Can be extended without modification
 * - Interface Segregation: Specific interfaces for different concerns
 * - Dependency Inversion: Depends on abstractions (interfaces)
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Post, Category, Tag } from "@/lib/supabase/types";

// ============================================================================
// INTERFACES (Dependency Inversion Principle)
// ============================================================================

export interface IBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  readingTime: number;
  isFeatured: boolean;
  isExternal: boolean;
  externalUrl: string | null;
  externalMeta: Record<string, any>;
  siteOrigin?: string | null;
  author: {
    name: string;
    avatar: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  } | null;
  tags: { id: string; name: string; slug: string }[];
}

export interface IBlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  postCount: number;
}

export interface IBlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface IPostsResult {
  items: IBlogPost[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface IPostsQuery {
  categorySlug?: string;
  tagSlug?: string;
  query?: string;
  featured?: boolean;
  page?: number;
  perPage?: number;
}

export interface IBlogStats {
  totalPosts: number;
  totalCategories: number;
  totalTags: number;
  totalViews: number;
}

// ============================================================================
// REPOSITORY INTERFACE (Interface Segregation Principle)
// ============================================================================

export interface IBlogRepository {
  getPosts(params?: IPostsQuery): Promise<IPostsResult>;
  getPostBySlug(slug: string): Promise<IBlogPost | null>;
  getFeaturedPosts(limit?: number): Promise<IBlogPost[]>;
  getRelatedPosts(postId: string, categoryId: string | null, limit?: number): Promise<IBlogPost[]>;
  getCategories(): Promise<IBlogCategory[]>;
  getTags(): Promise<IBlogTag[]>;
  getPopularPosts(limit?: number): Promise<IBlogPost[]>;
  getStats(): Promise<IBlogStats>;
}

// ============================================================================
// MAPPER (Single Responsibility Principle)
// ============================================================================

class BlogPostMapper {
  static toDTO(
    post: Post & { category?: Category | null; tags?: Tag[] }
  ): IBlogPost {
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.cover_image_url,
      publishedAt: post.published_at,
      readingTime: post.reading_time_minutes || 5,
      isFeatured: post.is_featured,
      isExternal: post.is_external,
      externalUrl: post.external_url,
      externalMeta: post.external_meta || {},
      siteOrigin:
        (post.external_meta as any)?.wp?.siteOrigin ||
        (post.external_url ? new URL(post.external_url).hostname : null),
      author: {
        name: post.author_name || "Bhukya Krishna",
        avatar: "/headshot-krishna.webp",
      },
      category: post.category
        ? {
            id: post.category.id,
            name: post.category.name,
            slug: post.category.slug,
            color: post.category.color,
          }
        : null,
      tags: post.tags || [],
    };
  }
}

// ============================================================================
// SUPABASE REPOSITORY IMPLEMENTATION
// ============================================================================

export class SupabaseBlogRepository implements IBlogRepository {
  async getPosts(params: IPostsQuery = {}): Promise<IPostsResult> {
    const { categorySlug, tagSlug, query, featured, page = 1, perPage = 12 } = params;
    const supabase = await createServerSupabaseClient();

    let queryBuilder = supabase
      .from("posts")
      .select(
        `
        *,
        category:categories(*),
        post_tags(tag_id, tags(*))
      `,
        { count: "exact" }
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      if (cat) {
        queryBuilder = queryBuilder.eq("category_id", cat.id);
      }
    }

    if (featured !== undefined) {
      queryBuilder = queryBuilder.eq("is_featured", featured);
    }

    if (tagSlug) {
      const { data: tag } = await supabase.from("tags").select("id").eq("slug", tagSlug).single();
      if (tag?.id) {
        const { data: postTags } = await supabase
          .from("post_tags")
          .select("post_id")
          .eq("tag_id", tag.id);

        const postIds = (postTags || []).map((pt: any) => pt.post_id).filter(Boolean);
        if (postIds.length === 0) {
          return { items: [], total: 0, page, perPage, totalPages: 0 };
        }

        queryBuilder = queryBuilder.in("id", postIds);
      }
    }

    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
      );
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data: posts, count, error } = await queryBuilder;

    if (error) {
      console.error("Error fetching posts:", error);
      return { items: [], total: 0, page, perPage, totalPages: 0 };
    }

    const items = (posts || []).map((post: any) => {
      const tags = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || [];
      return BlogPostMapper.toDTO({ ...post, tags });
    });

    const total = count || 0;
    const totalPages = Math.ceil(total / perPage);

    return { items, total, page, perPage, totalPages };
  }

  async getPostBySlug(slug: string): Promise<IBlogPost | null> {
    const supabase = await createServerSupabaseClient();

    const { data: post, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        category:categories(*),
        post_tags(tag_id, tags(*))
      `
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !post) {
      return null;
    }

    const tags = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || [];
    return BlogPostMapper.toDTO({ ...post, tags });
  }

  async getFeaturedPosts(limit: number = 3): Promise<IBlogPost[]> {
    const supabase = await createServerSupabaseClient();

    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        category:categories(*),
        post_tags(tag_id, tags(*))
      `
      )
      .eq("status", "published")
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching featured posts:", error);
      return [];
    }

    return (posts || []).map((post: any) => {
      const tags = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || [];
      return BlogPostMapper.toDTO({ ...post, tags });
    });
  }

  async getRelatedPosts(
    postId: string,
    categoryId: string | null,
    limit: number = 3
  ): Promise<IBlogPost[]> {
    const supabase = await createServerSupabaseClient();

    let queryBuilder = supabase
      .from("posts")
      .select(
        `
        *,
        category:categories(*),
        post_tags(tag_id, tags(*))
      `
      )
      .eq("status", "published")
      .neq("id", postId)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (categoryId) {
      queryBuilder = queryBuilder.eq("category_id", categoryId);
    }

    const { data: posts, error } = await queryBuilder;

    if (error) {
      console.error("Error fetching related posts:", error);
      return [];
    }

    return (posts || []).map((post: any) => {
      const tags = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || [];
      return BlogPostMapper.toDTO({ ...post, tags });
    });
  }

  async getPopularPosts(limit: number = 5): Promise<IBlogPost[]> {
    // For now, return recent posts (could add view count tracking later)
    const supabase = await createServerSupabaseClient();

    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        category:categories(*),
        post_tags(tag_id, tags(*))
      `
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching popular posts:", error);
      return [];
    }

    return (posts || []).map((post: any) => {
      const tags = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || [];
      return BlogPostMapper.toDTO({ ...post, tags });
    });
  }

  async getCategories(): Promise<IBlogCategory[]> {
    const supabase = await createServerSupabaseClient();

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    // Get post counts
    const { data: posts } = await supabase
      .from("posts")
      .select("category_id")
      .eq("status", "published");

    const postCounts = (posts || []).reduce((acc: Record<string, number>, post) => {
      if (post.category_id) {
        acc[post.category_id] = (acc[post.category_id] || 0) + 1;
      }
      return acc;
    }, {});

    return (categories || []).map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      color: cat.color,
      postCount: postCounts[cat.id] || 0,
    }));
  }

  async getTags(): Promise<IBlogTag[]> {
    const supabase = await createServerSupabaseClient();

    const { data: tags, error } = await supabase
      .from("tags")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching tags:", error);
      return [];
    }

    return (tags || []).map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    }));
  }

  async getStats(): Promise<IBlogStats> {
    const supabase = await createServerSupabaseClient();

    const [
      { count: postsCount },
      { count: categoriesCount },
      { count: tagsCount },
    ] = await Promise.all([
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("tags").select("*", { count: "exact", head: true }),
    ]);

    return {
      totalPosts: postsCount || 0,
      totalCategories: categoriesCount || 0,
      totalTags: tagsCount || 0,
      totalViews: (postsCount || 0) * 150, // Placeholder
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE (Factory Pattern)
// ============================================================================

let repositoryInstance: IBlogRepository | null = null;

export function getBlogRepository(): IBlogRepository {
  if (!repositoryInstance) {
    repositoryInstance = new SupabaseBlogRepository();
  }
  return repositoryInstance;
}
