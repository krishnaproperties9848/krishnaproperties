import { createServerSupabaseClient } from "@/lib/supabase/server";
import BrochuresClient from "@/components/brochures/BrochuresClient";
import { Brochure } from "@/lib/supabase/types";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BrochuresPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: brochures } = await supabase
    .from("brochures")
    .select("*")
    .eq("is_published", true)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  return <BrochuresClient brochures={(brochures as Brochure[]) || []} />;
}
