import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FileText, Image, Link2, FolderOpen, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const supabase = await createServerSupabaseClient();
  
  const [
    { count: postsCount },
    { count: publishedCount },
    { count: mediaCount },
    { count: categoriesCount },
    { count: socialCount },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("media_assets").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("social_links").select("*", { count: "exact", head: true }),
  ]);

  return {
    posts: postsCount || 0,
    published: publishedCount || 0,
    media: mediaCount || 0,
    categories: categoriesCount || 0,
    social: socialCount || 0,
  };
}

async function getRecentPosts() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("id, title, status, created_at, slug")
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const recentPosts = await getRecentPosts();

  const statCards = [
    { label: "Total Posts", value: stats.posts, icon: FileText, href: "/admin/posts", color: "from-blue-500 to-blue-600" },
    { label: "Published", value: stats.published, icon: Eye, href: "/admin/posts?status=published", color: "from-green-500 to-green-600" },
    { label: "Media Files", value: stats.media, icon: Image, href: "/admin/media", color: "from-purple-500 to-purple-600" },
    { label: "Categories", value: stats.categories, icon: FolderOpen, href: "/admin/categories", color: "from-gold to-gold-dark" },
    { label: "Social Links", value: stats.social, icon: Link2, href: "/admin/social", color: "from-pink-500 to-pink-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-serif text-gold-light">Welcome back!</h1>
        <p className="mt-1 text-gray-500">Here&apos;s an overview of your website content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-gold/20 bg-white/5 p-5 hover:border-gold/40 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2.5`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/10 p-4 text-gold hover:bg-gold/20 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">New Post</span>
            </Link>
            <Link
              href="/admin/media"
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-gray-300 hover:bg-white/10 transition-colors"
            >
              <Image className="h-5 w-5" />
              <span className="font-medium">Upload Media</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-gray-300 hover:bg-white/10 transition-colors"
            >
              <FolderOpen className="h-5 w-5" />
              <span className="font-medium">Categories</span>
            </Link>
            <Link
              href="/admin/social"
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-gray-300 hover:bg-white/10 transition-colors"
            >
              <Link2 className="h-5 w-5" />
              <span className="font-medium">Social Links</span>
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Posts</h2>
            <Link href="/admin/posts" className="text-sm text-gold hover:text-gold-light transition-colors">
              View all →
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">No posts yet</p>
              <Link
                href="/admin/posts/new"
                className="inline-block mt-3 text-sm text-gold hover:text-gold-light"
              >
                Create your first post →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{post.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {post.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
