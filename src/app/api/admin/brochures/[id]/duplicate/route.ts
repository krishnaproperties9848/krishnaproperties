import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createServerSupabaseAdmin, createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const awaitedParams = await context.params;
  const sourceId =
    awaitedParams?.id ||
    req.nextUrl.pathname.split("/").filter(Boolean).slice(-2)[0]; // fallback if params missing
  if (!sourceId) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Auth check (admin)
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: adminCheck } = await supabase
    .from("admin_emails")
    .select("email")
    .eq("email", user.email.toLowerCase())
    .single();

  if (!adminCheck) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const admin = await createServerSupabaseAdmin();

  const { data: source, error: srcErr } = await admin
    .from("brochures")
    .select("*")
    .eq("id", sourceId)
    .single();

  if (srcErr || !source) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const hash = randomBytes(3).toString("hex");
  const newTitle = `${source.title} (Copy)`;
  const baseSlug = slugify(`${source.slug || source.title}-copy`);
  let newSlug = `${baseSlug}-${hash}`.slice(0, 140);

  // Ensure slug uniqueness (one retry with new hash)
  const { data: existing } = await admin
    .from("brochures")
    .select("id")
    .eq("slug", newSlug)
    .maybeSingle();

  if (existing) {
    const retryHash = randomBytes(3).toString("hex");
    newSlug = `${baseSlug}-${retryHash}`.slice(0, 140);
  }

  const insertPayload = {
    title: newTitle,
    slug: newSlug,
    location: source.location,
    region: source.region,
    description: source.description,
    status: source.status,
    is_featured: source.is_featured,
    priority: source.priority,
    budget_min: source.budget_min,
    budget_max: source.budget_max,
    price_per_sqyard_min: source.price_per_sqyard_min,
    price_per_sqyard_max: source.price_per_sqyard_max,
    plot_size_min: source.plot_size_min,
    plot_size_max: source.plot_size_max,
    investment_intents: source.investment_intents,
    amenities: source.amenities,
    highlights: source.highlights,
    why_invest: source.why_invest,
    cover_image_url: source.cover_image_url,
    gallery_urls: source.gallery_urls,
    files: source.files,
    videos: source.videos,
    phone_override: source.phone_override,
    whatsapp_override: source.whatsapp_override,
    meta_title: source.meta_title,
    meta_description: source.meta_description,
    views_count: 0,
    downloads_count: 0,
    is_published: false,
  };

  const { data: created, error: insertErr } = await admin
    .from("brochures")
    .insert(insertPayload)
    .select("id, slug")
    .single();

  if (insertErr || !created) {
    return NextResponse.json({ error: insertErr?.message || "failed_to_duplicate" }, { status: 500 });
  }

  return NextResponse.json({ id: created.id, slug: created.slug }, { status: 200 });
}
