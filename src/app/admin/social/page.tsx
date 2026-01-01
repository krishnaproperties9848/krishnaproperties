import { createServerSupabaseClient } from "@/lib/supabase/server";
import SocialLinksManager from "@/components/admin/social/SocialLinksManager";

export default async function SocialPage() {
  const supabase = await createServerSupabaseClient();
  const { data: links } = await supabase
    .from("social_links")
    .select("*")
    .order("platform");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-gold-light">Social Links</h1>
        <p className="mt-1 text-gray-500">Manage your social media presence</p>
      </div>

      <SocialLinksManager links={links || []} />
    </div>
  );
}
