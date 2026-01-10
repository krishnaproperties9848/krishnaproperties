import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Eye, Phone, MessageCircle, ChevronRight } from "lucide-react";
import { getBlogRepository } from "@/lib/blog/supabase-repository";
import { BlogCard, MarkdownRenderer } from "@/components/blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConcierge from "@/components/FloatingConcierge";
import { CONTACT, BRAND } from "@/lib/constants";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const repo = getBlogRepository();
  const post = await repo.getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Article Not Found | Krishna Properties",
    };
  }

  return {
    title: `${post.title} | Krishna Properties Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      publishedTime: post.publishedAt || undefined,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const repo = getBlogRepository();
  const post = await repo.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  if (post.isExternal && post.externalUrl) {
    redirect(post.externalUrl);
  }

  const relatedPosts = await repo.getRelatedPosts(post.id, post.category?.id || null, 3);
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

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

      <div className="relative z-10 w-full max-w-[1400px] overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-gold/40 bg-black shadow-2xl shadow-gold/10 ring-1 ring-white/10">
        <Header />

        <article className="relative z-10 bg-black">
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-gold/10">
            {/* Background Image */}
            {post.coverImage && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover opacity-20"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
              </div>
            )}

            <div className="relative z-10 container mx-auto px-6 py-12 sm:py-16 lg:py-20">
              {/* Breadcrumb */}
              <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link
                  href="/insights"
                  className="flex items-center gap-1 text-gold hover:text-gold-light transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Blog
                </Link>
                {post.category && (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <Link
                      href={`/insights?category=${post.category.slug}`}
                      className="hover:text-gold transition-colors"
                      style={{ color: post.category.color || "#d4af37" }}
                    >
                      {post.category.name}
                    </Link>
                  </>
                )}
              </nav>

              <div className="mx-auto max-w-3xl">
                {/* Category Badge */}
                {post.category && (
                  <span
                    className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: post.category.color || "#d4af37",
                      color: "#000",
                    }}
                  >
                    {post.category.name}
                  </span>
                )}

                {/* Title */}
                <h1 className="text-3xl font-serif text-white leading-tight md:text-4xl lg:text-5xl">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="mt-4 text-lg text-gray-400 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-gold/30">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{post.author.name}</p>
                      <p className="text-sm text-gray-500">Senior Property Consultant</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readingTime} min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-6">
              <div className="mx-auto max-w-3xl">
                {/* Article Content */}
                <MarkdownRenderer content={post.content || ""} />

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-12 flex flex-wrap gap-2 border-t border-gold/10 pt-8">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs text-gold"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share & CTA */}
                <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-gold/20 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">Found this helpful?</p>
                    <p className="text-sm text-gray-400">
                      Speak with {BRAND.consultant.name} for personalized guidance.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={`tel:${CONTACT.phone}`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-5 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>
                    <a
                      href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi, I just read "${post.title}" on your blog and have a question.`)}`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-gold/30 bg-black/40 px-5 text-sm font-semibold text-white hover:border-gold hover:text-gold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-gold/10 py-12 sm:py-16">
              <div className="container mx-auto px-6">
                <h2 className="mb-8 text-2xl font-serif text-gold-light text-center">
                  Related Articles
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.id} post={relatedPost} variant="default" />
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href="/insights"
                    className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to all articles
                  </Link>
                </div>
              </div>
            </section>
          )}
        </article>

        <Footer />
        <FloatingConcierge />
      </div>
    </main>
  );
}
