import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Search, FileText, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import PostsTable from "@/components/admin/posts/PostsTable";

export default async function PostsPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      category:categories(id, name, color)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-gold-light">Blog Posts</h1>
          <p className="mt-1 text-gray-500">Manage your blog content</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-light via-gold to-gold-dark px-4 py-2.5 font-semibold text-black hover:shadow-lg hover:shadow-gold/20 transition-all"
        >
          <Plus className="h-5 w-5" />
          New Post
        </Link>
      </div>

      {/* Posts Table */}
      <PostsTable posts={posts || []} />
    </div>
  );
}
