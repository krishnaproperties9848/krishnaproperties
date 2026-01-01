import { getBlogRepository } from "@/lib/blog/supabase-repository";
import { InsightsClient } from "@/components/blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConcierge from "@/components/FloatingConcierge";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: "Real Estate Insights | Krishna Properties Blog",
  description:
    "Expert guidance on buying open plots in East Hyderabad and the Hyderabad-Warangal corridor. Learn from real experiences.",
};

export default async function InsightsPage() {
  const repo = getBlogRepository();

  // Fetch all data from Supabase
  const [postsResult, featuredPosts, categories, stats] = await Promise.all([
    repo.getPosts({ perPage: 50 }),
    repo.getFeaturedPosts(3),
    repo.getCategories(),
    repo.getStats(),
  ]);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-neutral-950 p-2 sm:p-4 lg:p-8 flex items-center justify-center font-sans antialiased text-white selection:bg-gold selection:text-black"
    >
      <div
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(212,175,55,0.1) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1400px] overflow-visible rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-gold/40 bg-black shadow-2xl shadow-gold/10 ring-1 ring-white/10">
        <Header />

        <InsightsClient
          initialPosts={postsResult.items}
          featuredPosts={featuredPosts}
          categories={categories}
          stats={stats}
        />

        <Footer />
        <FloatingConcierge />
      </div>
    </main>
  );
}
