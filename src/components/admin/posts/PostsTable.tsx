"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Edit, Trash2, Eye, EyeOff, MoreHorizontal, Search } from "lucide-react";
import { Post, Category } from "@/lib/supabase/types";

interface PostWithCategory extends Omit<Post, 'category'> {
  category: Category | null;
}

interface PostsTableProps {
  posts: PostWithCategory[];
}

export default function PostsTable({ posts }: PostsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", id);
    router.refresh();
    setDeleting(null);
  };

  const toggleStatus = async (post: PostWithCategory) => {
    const supabase = createClient();
    const newStatus = post.status === "published" ? "draft" : "published";
    await supabase
      .from("posts")
      .update({ 
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null
      })
      .eq("id", post.id);
    router.refresh();
  };

  return (
    <div className="rounded-xl border border-gold/20 bg-white/5 overflow-hidden">
      {/* Search */}
      <div className="border-b border-gold/10 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gold/20 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10 text-left">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Title</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="text-gray-500">
                    {search ? "No posts match your search" : "No posts yet. Create your first post!"}
                  </div>
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">
                    <Link href={`/admin/posts/${post.id}`} className="group">
                      <p className="font-medium text-white group-hover:text-gold transition-colors line-clamp-1">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{post.excerpt}</p>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    {post.category ? (
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${post.category.color}20`,
                          color: post.category.color || "#d4af37",
                        }}
                      >
                        {post.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleStatus(post)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        post.status === "published"
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                      }`}
                    >
                      {post.status === "published" ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      {post.status}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
