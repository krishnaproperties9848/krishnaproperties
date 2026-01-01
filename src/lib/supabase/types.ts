export type PostStatus = "draft" | "published";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: PostStatus;
  reading_time_minutes: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_name: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  is_featured: boolean;
  category?: Category;
  tags?: Tag[];
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

export interface MediaAsset {
  id: string;
  title: string | null;
  description: string | null;
  url: string;
  storage_path: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  bucket: string;
  media_type: "image" | "video" | "pdf" | "other";
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  is_active: boolean;
  created_at: string;
}

// Brochure types
export type BrochureStatus = "available" | "few_left" | "sold_out" | "coming_soon";
export type InvestmentIntent = "flip" | "hold" | "nri" | "retirement";

export interface BrochureFile {
  id: string;
  url: string;
  name: string;
  type: "pdf" | "docx" | "image" | "video";
  size_bytes: number | null;
  is_primary: boolean;
  source?: "upload" | "gdrive";
  bucket?: string | null;
  storage_path?: string | null;
}

export interface BrochureVideo {
  id: string;
  type: "youtube" | "cloudflare" | "upload";
  url: string;
  thumbnail_url: string | null;
  title: string | null;
}

export interface Brochure {
  id: string;
  title: string;
  slug: string;
  location: string;
  region: string;
  description: string | null;
  status: BrochureStatus;
  is_featured: boolean;
  priority: number;
  budget_min: number | null;
  budget_max: number | null;
  price_per_sqyard_min: number | null;
  price_per_sqyard_max: number | null;
  plot_size_min: number | null;
  plot_size_max: number | null;
  investment_intents: InvestmentIntent[];
  amenities: string[];
  highlights: string[];
  why_invest: string[];
  cover_image_url: string | null;
  gallery_urls: string[];
  files: BrochureFile[];
  videos: BrochureVideo[];
  views_count: number;
  downloads_count: number;
  phone_override: string | null;
  whatsapp_override: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminEmail {
  email: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      admin_emails: {
        Row: AdminEmail;
        Insert: Omit<AdminEmail, "created_at">;
        Update: Partial<Omit<AdminEmail, "created_at">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at">;
        Update: Partial<Omit<Category, "id" | "created_at">>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, "id" | "created_at">;
        Update: Partial<Omit<Tag, "id" | "created_at">>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Post, "id" | "created_at">>;
      };
      post_tags: {
        Row: PostTag;
        Insert: PostTag;
        Update: Partial<PostTag>;
      };
      media_assets: {
        Row: MediaAsset;
        Insert: Omit<MediaAsset, "id" | "created_at">;
        Update: Partial<Omit<MediaAsset, "id" | "created_at">>;
      };
      social_links: {
        Row: SocialLink;
        Insert: Omit<SocialLink, "id" | "created_at">;
        Update: Partial<Omit<SocialLink, "id" | "created_at">>;
      };
      brochures: {
        Row: Brochure;
        Insert: Omit<Brochure, "id" | "created_at" | "updated_at" | "views_count" | "downloads_count">;
        Update: Partial<Omit<Brochure, "id" | "created_at">>;
      };
    };
  };
}
