import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { lookup } from "dns/promises";
import net from "net";
import { createServerSupabaseAdmin, createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeExternalUrl(rawUrl: string) {
  const u = new URL(rawUrl);
  u.hash = "";

  const trackingKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
  ];

  trackingKeys.forEach((k) => u.searchParams.delete(k));
  return u.toString();
}

function getCandidateSlug(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "";
  return parts[parts.length - 1];
}

function ipv4ToInt(ip: string) {
  return ip
    .split(".")
    .reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

function isPrivateIp(ip: string) {
  const ipType = net.isIP(ip);
  if (ipType === 4) {
    const n = ipv4ToInt(ip);
    const inRange = (start: string, end: string) => {
      const a = ipv4ToInt(start);
      const b = ipv4ToInt(end);
      return n >= a && n <= b;
    };

    return (
      inRange("0.0.0.0", "0.255.255.255") ||
      inRange("10.0.0.0", "10.255.255.255") ||
      inRange("127.0.0.0", "127.255.255.255") ||
      inRange("169.254.0.0", "169.254.255.255") ||
      inRange("172.16.0.0", "172.31.255.255") ||
      inRange("192.168.0.0", "192.168.255.255") ||
      inRange("224.0.0.0", "239.255.255.255")
    );
  }

  if (ipType === 6) {
    const normalized = ip.toLowerCase();
    return (
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80")
    );
  }

  return true;
}

async function ensureHostIsPublic(hostname: string) {
  const forbiddenHosts = ["localhost"]; 
  if (forbiddenHosts.includes(hostname.toLowerCase())) {
    throw new Error("forbidden_host");
  }

  if (hostname.toLowerCase().endsWith(".local")) {
    throw new Error("forbidden_host");
  }

  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new Error("forbidden_host");
    return;
  }

  const results = await lookup(hostname, { all: true });
  if (results.length === 0) throw new Error("forbidden_host");

  for (const r of results) {
    if (isPrivateIp(r.address)) {
      throw new Error("forbidden_host");
    }
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "krishnaproperties-metadata-fetcher",
        Accept: "application/json, text/html;q=0.9,*/*;q=0.8",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function stripHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMetaTag(html: string, key: { attr: "property" | "name"; value: string }) {
  const patterns = [
    new RegExp(
      `<meta[^>]*${key.attr}=["']${key.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["]?[^>]*content=["']([^"']+)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']+)["'][^>]*${key.attr}=["']${key.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["]?[^>]*>`,
      "i"
    ),
  ];

  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return m[1];
  }

  return null;
}

function parseCanonical(html: string) {
  const m = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  return m?.[1] || null;
}

function parseTitleTag(html: string) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1] || null;
}

function extractFirstImageFromHtml(html: string) {
  const match = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
  return match?.[1] || null;
}

type ImportedExternalMetadata = {
  title: string;
  wpSlug: string;
  coverImageUrl: string | null;
  excerpt: string | null;
  canonicalUrl: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  authorName: string | null;
  category: { name: string; slug: string } | null;
  tags: Array<{ name: string; slug: string }>;
  externalUrl: string;
  siteOrigin: string;
  wpPostId: string | null;
  readingTimeMinutes: number;
};

function pickFeaturedImageFromEmbedded(post: any) {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes;
  const fallback = media?.source_url;
  if (!sizes || typeof sizes !== "object") return typeof fallback === "string" ? fallback : null;

  const preferred = ["large", "medium_large", "medium", "full"];
  for (const key of preferred) {
    const url = sizes?.[key]?.source_url;
    if (typeof url === "string") return url;
  }

  return typeof fallback === "string" ? fallback : null;
}

function extractTerms(post: any) {
  const termGroups: any[][] = post?._embedded?.["wp:term"] || [];
  const categories: Array<{ name: string; slug: string }> = [];
  const tags: Array<{ name: string; slug: string }> = [];

  for (const group of termGroups) {
    if (!Array.isArray(group)) continue;
    for (const term of group) {
      if (!term || typeof term !== "object") continue;
      if (term.taxonomy === "category") {
        if (typeof term.name === "string" && typeof term.slug === "string") {
          categories.push({ name: term.name, slug: term.slug });
        }
      }
      if (term.taxonomy === "post_tag") {
        if (typeof term.name === "string" && typeof term.slug === "string") {
          tags.push({ name: term.name, slug: term.slug });
        }
      }
    }
  }

  return { categories, tags };
}

function estimateReadingTimeMinutesFromHtml(html: string) {
  const text = stripHtml(html);
  if (!text) return 5;
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function fetchWordPressMetadataByUrl(rawUrl: string): Promise<ImportedExternalMetadata> {
  const normalizedExternalUrl = normalizeExternalUrl(rawUrl);
  const url = new URL(normalizedExternalUrl);
  const hostName = url.hostname;

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("invalid_url");
  }

  await ensureHostIsPublic(url.hostname);

  const siteOrigin = url.origin;
  const wpSlug = getCandidateSlug(url.pathname);

  const baseMeta: Omit<ImportedExternalMetadata, "title" | "wpSlug" | "externalUrl" | "siteOrigin" | "wpPostId"> = {
    coverImageUrl: null,
    excerpt: null,
    canonicalUrl: null,
    publishedAt: null,
    updatedAt: null,
    authorName: null,
    category: null,
    tags: [],
    readingTimeMinutes: 5,
  };

  if (wpSlug) {
    const apiUrl = `${siteOrigin}/wp-json/wp/v2/posts?slug=${encodeURIComponent(wpSlug)}&_embed=true&per_page=1`;
    const res = await fetchWithTimeout(apiUrl, 8000);

    if (res.ok) {
      const data = (await res.json().catch(() => null)) as any;
      if (Array.isArray(data) && data[0]) {
        const post = data[0];
        const title = typeof post?.title?.rendered === "string" ? stripHtml(post.title.rendered) : "";
        const excerptHtml = typeof post?.excerpt?.rendered === "string" ? post.excerpt.rendered : "";
        const contentHtml = typeof post?.content?.rendered === "string" ? post.content.rendered : "";
        const excerpt = excerptHtml ? stripHtml(excerptHtml) : (contentHtml ? stripHtml(contentHtml).slice(0, 160) : null);

        const coverImageUrl = pickFeaturedImageFromEmbedded(post);
        const canonicalUrl = typeof post?.link === "string" ? post.link : normalizedExternalUrl;

        const authorName =
          typeof post?._embedded?.author?.[0]?.name === "string"
            ? post._embedded.author[0].name
            : null;

        const { categories, tags } = extractTerms(post);
        const category = categories[0] || null;

        const readingTimeMinutes = estimateReadingTimeMinutesFromHtml(contentHtml);

        return {
          title: title || wpSlug,
          wpSlug: typeof post?.slug === "string" ? post.slug : wpSlug,
          externalUrl: normalizedExternalUrl,
          siteOrigin,
          wpPostId: post?.id ? String(post.id) : null,
          ...baseMeta,
          excerpt: excerpt || `External article from ${hostName}`,
          coverImageUrl: coverImageUrl || extractFirstImageFromHtml(contentHtml),
          canonicalUrl,
          publishedAt: typeof post?.date_gmt === "string" ? post.date_gmt : null,
          updatedAt: typeof post?.modified_gmt === "string" ? post.modified_gmt : null,
          authorName,
          category: category ? { name: category.name, slug: category.slug } : null,
          tags,
          readingTimeMinutes,
        };
      }
    }
  }

  const htmlRes = await fetchWithTimeout(normalizedExternalUrl, 8000);
  if (!htmlRes.ok) {
    throw new Error("not_found");
  }

  const html = await htmlRes.text();

  const ogTitle = parseMetaTag(html, { attr: "property", value: "og:title" }) || parseMetaTag(html, { attr: "name", value: "twitter:title" });
  const ogImage = parseMetaTag(html, { attr: "property", value: "og:image" });
  const ogDescription = parseMetaTag(html, { attr: "property", value: "og:description" }) || parseMetaTag(html, { attr: "name", value: "twitter:description" });
  const canonicalUrl = parseCanonical(html);
  const titleTag = parseTitleTag(html);

  const published = parseMetaTag(html, { attr: "property", value: "article:published_time" });
  const modified = parseMetaTag(html, { attr: "property", value: "article:modified_time" });
  const section = parseMetaTag(html, { attr: "property", value: "article:section" });
  const author =
    parseMetaTag(html, { attr: "name", value: "author" }) ||
    parseMetaTag(html, { attr: "property", value: "article:author" });

  const readingTimeMinutes = estimateReadingTimeMinutesFromHtml(html);

  const title =
    ogTitle ||
    titleTag ||
    (wpSlug ? wpSlug.replace(/[-_]/g, " ") : null) ||
    normalizedExternalUrl;
  const excerpt = ogDescription ? stripHtml(ogDescription) : null;

  const category = section
    ? { name: stripHtml(section), slug: slugify(stripHtml(section)) }
    : null;

  return {
    title: stripHtml(title),
    wpSlug,
    externalUrl: normalizedExternalUrl,
    siteOrigin,
    wpPostId: null,
    ...baseMeta,
    excerpt: excerpt || `External article from ${hostName}`,
    coverImageUrl: ogImage ? stripHtml(ogImage) : null,
    canonicalUrl: canonicalUrl ? stripHtml(canonicalUrl) : null,
    publishedAt: published ? stripHtml(published) : null,
    updatedAt: modified ? stripHtml(modified) : null,
    authorName: author ? stripHtml(author) : null,
    category,
    tags: [],
    readingTimeMinutes,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const inputUrl = body?.url as string | undefined;

    if (!inputUrl || typeof inputUrl !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { data: adminCheck } = await supabase
      .from("admin_emails")
      .select("email")
      .eq("email", user.email.toLowerCase())
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const meta = await fetchWordPressMetadataByUrl(inputUrl).catch((e: any) => {
      const code = typeof e?.message === "string" ? e.message : "fetch_failed";
      throw new Error(code);
    });

    const hash = createHash("sha1").update(meta.externalUrl).digest("hex").slice(0, 8);
    const internalSlugBase = `${slugify(new URL(meta.siteOrigin).hostname)}-${slugify(meta.wpSlug || meta.title)}-${hash}`;
    const internalSlug = internalSlugBase.slice(0, 120);

    const supabaseAdmin = await createServerSupabaseAdmin();

    let categoryId: string | null = null;
    if (meta.category?.name) {
      const { data: cat } = await supabaseAdmin
        .from("categories")
        .upsert(
          {
            name: meta.category.name,
            slug: meta.category.slug || slugify(meta.category.name),
            description: null,
            color: null,
          },
          { onConflict: "slug" }
        )
        .select("id")
        .single();

      categoryId = cat?.id || null;
    } else {
      const { data: fallbackCat } = await supabaseAdmin
        .from("categories")
        .upsert(
          { name: "External", slug: "external", description: "Imported posts", color: "#d4af37" },
          { onConflict: "slug" }
        )
        .select("id")
        .single();
      categoryId = fallbackCat?.id || null;
    }

    const postPayload: any = {
      title: meta.title,
      slug: internalSlug,
      excerpt: meta.excerpt,
      content: null,
      status: "published",
      reading_time_minutes: meta.readingTimeMinutes,
      published_at: meta.publishedAt,
      author_name: meta.authorName,
      cover_image_url: meta.coverImageUrl,
      category_id: categoryId,
      is_featured: false,
      is_external: true,
      external_url: meta.externalUrl,
      external_meta: {
        wp: {
          wpSlug: meta.wpSlug,
          wpPostId: meta.wpPostId,
          siteOrigin: meta.siteOrigin,
        },
        canonicalUrl: meta.canonicalUrl,
        tags: meta.tags,
        importedBy: user.email.toLowerCase(),
      },
    };

    const { data: savedPost, error: postError } = await supabaseAdmin
      .from("posts")
      .upsert(postPayload, { onConflict: "external_url" })
      .select("id")
      .single();

    if (postError || !savedPost) {
      const message = postError?.message || "Failed to save post";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    await supabaseAdmin.from("post_tags").delete().eq("post_id", savedPost.id);

    if (meta.tags.length > 0) {
      const tagIds: string[] = [];
      for (const t of meta.tags) {
        const { data: tag } = await supabaseAdmin
          .from("tags")
          .upsert(
            {
              name: t.name,
              slug: t.slug || slugify(t.name),
            },
            { onConflict: "slug" }
          )
          .select("id")
          .single();

        if (tag?.id) tagIds.push(tag.id);
      }

      if (tagIds.length > 0) {
        await supabaseAdmin
          .from("post_tags")
          .insert(tagIds.map((tagId) => ({ post_id: savedPost.id, tag_id: tagId })));
      }
    }

    return NextResponse.json({ id: savedPost.id }, { status: 200 });
  } catch (e: any) {
    const code = typeof e?.message === "string" ? e.message : "Unexpected error";

    if (code === "invalid_url") {
      return NextResponse.json({ error: "invalid_url" }, { status: 400 });
    }

    if (code === "forbidden_host") {
      return NextResponse.json({ error: "forbidden_host" }, { status: 400 });
    }

    if (code === "not_found") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (code === "AbortError") {
      return NextResponse.json({ error: "timeout" }, { status: 504 });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
