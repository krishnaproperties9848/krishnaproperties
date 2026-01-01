/**
 * Blog Domain Types
 * Following Interface Segregation Principle (ISP) - interfaces are specific to client needs
 */

// Base entity interface - Single Responsibility
export interface IEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Author entity
export interface IAuthor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

// Category for blog posts
export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
}

// Tag for blog posts
export interface ITag {
  id: string;
  name: string;
  slug: string;
}

// Blog post status enum
export enum BlogPostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

// Reading time metadata
export interface IReadingTime {
  minutes: number;
  words: number;
}

// Blog post metadata
export interface IBlogPostMeta {
  views: number;
  likes: number;
  shares: number;
  readingTime: IReadingTime;
}

// Main blog post interface
export interface IBlogPost extends IEntity {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: IAuthor;
  category: ICategory;
  tags: ITag[];
  status: BlogPostStatus;
  meta: IBlogPostMeta;
  isFeatured: boolean;
  publishedAt?: Date;
}

// Blog post card DTO (Data Transfer Object) - for list views
export interface IBlogPostCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  author: Pick<IAuthor, "name" | "avatar">;
  category: Pick<ICategory, "name" | "slug" | "color">;
  readingTime: number;
  publishedAt: Date;
  isFeatured: boolean;
}

// Search/Filter parameters
export interface IBlogSearchParams {
  query?: string;
  categorySlug?: string;
  tagSlug?: string;
  authorId?: string;
  status?: BlogPostStatus;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "publishedAt" | "views" | "likes";
  sortOrder?: "asc" | "desc";
}

// Paginated response
export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Blog stats for dashboard/sidebar
export interface IBlogStats {
  totalPosts: number;
  totalViews: number;
  totalCategories: number;
  popularCategories: Array<{ category: ICategory; count: number }>;
  recentPosts: IBlogPostCard[];
}
