import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PostEditor from "@/components/admin/posts/PostEditor";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  const [{ data: post }, { data: categories }, { data: tags }, { data: postTags }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
    supabase.from("post_tags").select("tag_id").eq("post_id", id),
  ]);

  if (!post) {
    notFound();
  }

  const selectedTagIds = postTags?.map((pt) => pt.tag_id) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-gold-light">Edit Post</h1>
        <p className="mt-1 text-gray-500">Update your blog article</p>
      </div>

      <PostEditor 
        post={post}
        categories={categories || []} 
        tags={tags || []}
        selectedTagIds={selectedTagIds}
      />
    </div>
  );
}
