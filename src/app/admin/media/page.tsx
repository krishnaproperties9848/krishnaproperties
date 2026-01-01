import { createServerSupabaseClient } from "@/lib/supabase/server";
import MediaLibrary from "@/components/admin/media/MediaLibrary";

export default async function MediaPage() {
  const supabase = await createServerSupabaseClient();
  const { data: media } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-gold-light">Media Library</h1>
        <p className="mt-1 text-gray-500">Upload and manage images, videos, and brochures</p>
      </div>

      <MediaLibrary media={media || []} />
    </div>
  );
}
