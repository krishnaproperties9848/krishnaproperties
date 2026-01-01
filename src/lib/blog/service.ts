/**
 * Blog Service Layer
 * Following Single Responsibility Principle (SRP) and Dependency Inversion Principle (DIP)
 * This service abstracts data access and provides business logic
 */

import {
  IBlogPost,
  IBlogPostCard,
  IBlogSearchParams,
  IPaginatedResponse,
  IBlogStats,
  ICategory,
  BlogPostStatus,
} from "./types";
import { BLOG_POSTS, CATEGORIES, getPostBySlug, getCategoryBySlug } from "./data";

/**
 * Repository Interface - Dependency Inversion
 * Allows swapping data source (e.g., from static to API/DB)
 */
interface IBlogRepository {
  findAll(): IBlogPost[];
  findBySlug(slug: string): IBlogPost | undefined;
  findByCategory(categorySlug: string): IBlogPost[];
  search(params: IBlogSearchParams): IBlogPost[];
}

/**
 * Static Data Repository Implementation
 * Can be swapped with API repository later
 */
class StaticBlogRepository implements IBlogRepository {
  findAll(): IBlogPost[] {
    return BLOG_POSTS.filter((post) => post.status === BlogPostStatus.PUBLISHED);
  }

  findBySlug(slug: string): IBlogPost | undefined {
    return getPostBySlug(slug);
  }

  findByCategory(categorySlug: string): IBlogPost[] {
    return BLOG_POSTS.filter(
      (post) =>
        post.status === BlogPostStatus.PUBLISHED &&
        post.category.slug === categorySlug
    );
  }

  search(params: IBlogSearchParams): IBlogPost[] {
    let results = this.findAll();

    // Filter by category
    if (params.categorySlug) {
      results = results.filter((post) => post.category.slug === params.categorySlug);
    }

    // Filter by tag
    if (params.tagSlug) {
      results = results.filter((post) =>
        post.tags.some((tag) => tag.slug === params.tagSlug)
      );
    }

    // Filter by featured
    if (params.isFeatured !== undefined) {
      results = results.filter((post) => post.isFeatured === params.isFeatured);
    }

    // Search query
    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.name.toLowerCase().includes(query))
      );
    }

    // Sort
    const sortBy = params.sortBy || "publishedAt";
    const sortOrder = params.sortOrder || "desc";
    results.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "publishedAt") {
        comparison =
          (a.publishedAt?.getTime() || 0) - (b.publishedAt?.getTime() || 0);
      } else if (sortBy === "views") {
        comparison = a.meta.views - b.meta.views;
      } else if (sortBy === "likes") {
        comparison = a.meta.likes - b.meta.likes;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    return results;
  }
}

/**
 * Blog Service - Business Logic Layer
 * Follows Single Responsibility: Only handles blog-related operations
 */
class BlogService {
  private repository: IBlogRepository;

  constructor(repository: IBlogRepository) {
    this.repository = repository;
  }

  /**
   * Transform full post to card DTO
   */
  private toCard(post: IBlogPost): IBlogPostCard {
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      author: {
        name: post.author.name,
        avatar: post.author.avatar,
      },
      category: {
        name: post.category.name,
        slug: post.category.slug,
        color: post.category.color,
      },
      readingTime: post.meta.readingTime.minutes,
      publishedAt: post.publishedAt || post.createdAt,
      isFeatured: post.isFeatured,
    };
  }

  /**
   * Get paginated blog posts
   */
  getPosts(params: IBlogSearchParams = {}): IPaginatedResponse<IBlogPostCard> {
    const page = params.page || 1;
    const limit = params.limit || 10;

    const allPosts = this.repository.search(params);
    const total = allPosts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    return {
      items: paginatedPosts.map((post) => this.toCard(post)),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Get featured posts
   */
  getFeaturedPosts(limit: number = 3): IBlogPostCard[] {
    const posts = this.repository.search({ isFeatured: true, limit });
    return posts.slice(0, limit).map((post) => this.toCard(post));
  }

  /**
   * Get recent posts
   */
  getRecentPosts(limit: number = 5): IBlogPostCard[] {
    const posts = this.repository.search({ sortBy: "publishedAt", sortOrder: "desc" });
    return posts.slice(0, limit).map((post) => this.toCard(post));
  }

  /**
   * Get popular posts by views
   */
  getPopularPosts(limit: number = 5): IBlogPostCard[] {
    const posts = this.repository.search({ sortBy: "views", sortOrder: "desc" });
    return posts.slice(0, limit).map((post) => this.toCard(post));
  }

  /**
   * Get single post by slug
   */
  getPostBySlug(slug: string): IBlogPost | undefined {
    return this.repository.findBySlug(slug);
  }

  /**
   * Get posts by category
   */
  getPostsByCategory(
    categorySlug: string,
    params: IBlogSearchParams = {}
  ): IPaginatedResponse<IBlogPostCard> {
    return this.getPosts({ ...params, categorySlug });
  }

  /**
   * Get all categories with post counts
   */
  getCategories(): Array<ICategory & { postCount: number }> {
    return CATEGORIES.map((category) => ({
      ...category,
      postCount: this.repository.findByCategory(category.slug).length,
    }));
  }

  /**
   * Get category by slug
   */
  getCategoryBySlug(slug: string): ICategory | undefined {
    return getCategoryBySlug(slug);
  }

  /**
   * Get related posts (same category, excluding current)
   */
  getRelatedPosts(currentSlug: string, limit: number = 3): IBlogPostCard[] {
    const currentPost = this.repository.findBySlug(currentSlug);
    if (!currentPost) return [];

    const sameCategoryPosts = this.repository
      .findByCategory(currentPost.category.slug)
      .filter((post) => post.slug !== currentSlug);

    return sameCategoryPosts.slice(0, limit).map((post) => this.toCard(post));
  }

  /**
   * Search posts
   */
  searchPosts(query: string, limit: number = 10): IBlogPostCard[] {
    const posts = this.repository.search({ query, limit });
    return posts.slice(0, limit).map((post) => this.toCard(post));
  }

  /**
   * Get blog stats
   */
  getStats(): IBlogStats {
    const allPosts = this.repository.findAll();
    const totalViews = allPosts.reduce((sum, post) => sum + post.meta.views, 0);

    const categoryCounts = CATEGORIES.map((cat) => ({
      category: cat,
      count: this.repository.findByCategory(cat.slug).length,
    }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);

    return {
      totalPosts: allPosts.length,
      totalViews,
      totalCategories: categoryCounts.length,
      popularCategories: categoryCounts.slice(0, 5),
      recentPosts: this.getRecentPosts(5),
    };
  }
}

// Singleton instance with static repository
const blogRepository = new StaticBlogRepository();
export const blogService = new BlogService(blogRepository);

// Export types for consumers
export type { IBlogRepository };
