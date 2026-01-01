import { createServerSupabaseClient } from "@/lib/supabase/server";
import PostEditor from "@/components/admin/posts/PostEditor";

export default async function NewPostPage() {
  const supabase = await createServerSupabaseClient();
  
  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-gold-light">Create New Post</h1>
        <p className="mt-1 text-gray-500">Write and publish a new blog article</p>
      </div>

      <PostEditor 
        categories={categories || []} 
        tags={tags || []} 
      />
    </div>
  );
}
