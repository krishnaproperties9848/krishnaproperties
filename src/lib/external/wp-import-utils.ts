export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeExternalUrl(rawUrl: string) {
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

export function getCandidateSlug(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "";
  return parts[parts.length - 1];
}

export function stripHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseMetaTag(html: string, key: { attr: "property" | "name"; value: string }) {
  const safeValue = key.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]*${key.attr}=["']${safeValue}["']?[^>]*content=["']([^"']+)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']+)["'][^>]*${key.attr}=["']${safeValue}["']?[^>]*>`,
      "i"
    ),
  ];

  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return m[1];
  }

  return null;
}

export function parseCanonical(html: string) {
  const m = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  return m?.[1] || null;
}

export function estimateReadingTimeMinutesFromHtml(html: string) {
  const text = stripHtml(html);
  if (!text) return 5;
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
