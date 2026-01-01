import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BrochureDetails from "@/components/brochures/BrochureDetails";
import { Brochure } from "@/lib/supabase/types";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  
  const { data: brochure } = await supabase
    .from("brochures")
    .select("title, description, meta_title, meta_description, location")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!brochure) {
    return { title: "Property Not Found" };
  }

  return {
    title: brochure.meta_title || `${brochure.title} - Krishna Properties`,
    description: brochure.meta_description || brochure.description || `${brochure.title} at ${brochure.location}`,
  };
}

export default async function BrochureDetailsPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: brochure } = await supabase
    .from("brochures")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!brochure) {
    notFound();
  }

  // Increment view count
  await supabase
    .from("brochures")
    .update({ views_count: (brochure.views_count || 0) + 1 })
    .eq("id", brochure.id);

  // Get related brochures
  const { data: relatedBrochures } = await supabase
    .from("brochures")
    .select("id, title, slug, location, region, budget_min, budget_max, cover_image_url, status")
    .eq("is_published", true)
    .eq("region", brochure.region)
    .neq("id", brochure.id)
    .limit(3);

  return <BrochureDetails brochure={brochure as Brochure} related={(relatedBrochures as Brochure[]) || []} />;
}
