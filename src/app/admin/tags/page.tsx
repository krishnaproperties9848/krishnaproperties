import { createServerSupabaseClient } from "@/lib/supabase/server";
import TagsManager from "@/components/admin/tags/TagsManager";

export default async function TagsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-gold-light">Tags</h1>
        <p className="mt-1 text-gray-500">Manage tags for your blog posts</p>
      </div>

      <TagsManager tags={tags || []} />
    </div>
  );
}
