"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, MessageSquare, Share2, Bookmark, Eye, Menu, X, Filter, ArrowLeft } from "lucide-react";

// --- Mock Data ---
const FEATURED_ARTICLES = [
    {
        id: 1,
        type: "market_insight",
        title: "NRI Investment Guide 2025: Regional Tone ROI Global Markets",
        subtitle: "Advisors on seizing awkward stations perspectives",
        views: "2,305",
        reads: "6 mins",
        image: "/corridor-east.png" // Reusing asset
    },
    {
        id: 2,
        type: "market_insight",
        title: "Hyderabad-Term ROI Established Plots",
        subtitle: "Averages 8x better returns on land depositions",
        views: "3,803",
        reads: "4 mins",
        image: "/corridor-south.png" // Reusing asset
    },
    {
        id: 3,
        type: "market_insight",
        title: "Beyond Investment Guide 2025: Global Markets",
        subtitle: "A dream to balance culture, future, and ingredients",
        views: "2,983",
        reads: "5 mins",
        image: "/corridor-west.png" // Reusing asset
    }
];

const STANDARD_ARTICLES = [
    {
        id: 4,
        category: "Market Trends",
        title: "Why Invest Long-Term Global Markets",
        excerpt: "A comprehensive look at why patience pays off in the global real estate sector.",
        author: "Mimi Keough",
        authorImg: "https://randomuser.me/api/portraits/women/63.jpg",
        views: "4,213",
        likes: "876",
        image: null // Text centric
    },
    {
        id: 5,
        category: "Market Sentiment",
        title: "Market Analysis",
        excerpt: "",
        author: "Herbert Acker",
        authorImg: "https://randomuser.me/api/portraits/men/32.jpg",
        views: "3,103",
        likes: "542",
        image: "/aerial-2.png" // Image centric
    },
    {
        id: 6,
        category: "Sector Consultant",
        title: "Khpert Ranti'ext",
        excerpt: "",
        author: "Rajesh Kumar",
        authorImg: "https://randomuser.me/api/portraits/men/86.jpg",
        views: "9,008",
        likes: "1,203",
        image: "/aerial-1.png"
    },
    {
        id: 7,
        category: "Tech Trends",
        title: "Teya Engages Phenomenology",
        excerpt: "A deep dive into how technology is reshaping the property landscape.",
        author: "Sarah Smith",
        authorImg: "https://randomuser.me/api/portraits/women/44.jpg",
        views: "1,200",
        likes: "300",
        image: null
    }
];

export default function InsightsPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans selection:bg-black selection:text-white">

            {/* Top Navigation (Custom for Insights) */}
            <header className="sticky top-0 z-50 flex items-center justify-between bg-[#0a0a0a] px-4 sm:px-6 py-3 sm:py-4 text-white shadow-md">
                <div className="flex items-center gap-4 sm:gap-12">
                    <Link href="/" className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors focus-ring rounded-sm" aria-label="Back to home">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only sm:not-sr-only">Back</span>
                    </Link>
                    <h1 className="text-lg sm:text-2xl font-serif font-bold tracking-tight">Krishna Properties Insights</h1>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400" aria-label="Insights navigation">
                        <a href="#" className="text-white hover:text-gold border-b-2 border-gold pb-1 focus-ring rounded-sm">Topics</a>
                        <a href="#" className="hover:text-gold transition-colors focus-ring rounded-sm">Segments</a>
                        <a href="#" className="hover:text-gold transition-colors focus-ring rounded-sm">Listings</a>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    {/* Mobile Filter Button */}
                    <button 
                        onClick={() => setFilterOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-gold md:hidden focus-ring"
                        aria-label="Open filters"
                    >
                        <Filter className="h-5 w-5" />
                    </button>
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-gold md:hidden focus-ring"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    {/* Desktop Search */}
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search Insights"
                            className="w-48 lg:w-64 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <nav className="absolute right-0 top-0 h-full w-[280px] max-w-[85vw] bg-[#0a0a0a] border-l border-gold/20 shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-lg font-serif text-gold-light">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-lg text-gold hover:bg-gold/10 focus-ring" aria-label="Close menu">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <a href="#" className="block py-3 text-white border-b border-gold/20 font-medium">Topics</a>
                            <a href="#" className="block py-3 text-gray-400 hover:text-gold transition-colors">Segments</a>
                            <a href="#" className="block py-3 text-gray-400 hover:text-gold transition-colors">Listings</a>
                        </div>
                        <div className="mt-8">
                            <input type="text" placeholder="Search Insights" className="w-full rounded-lg bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold" />
                        </div>
                    </nav>
                </div>
            )}

            {/* Mobile Filter Sheet */}
            {filterOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
                    <div className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] bg-[#0f1115] border-r border-gold/20 shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-lg font-serif text-gold-light">Filters</span>
                            <button onClick={() => setFilterOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-lg text-gold hover:bg-gold/10 focus-ring" aria-label="Close filters">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4 text-sm text-gray-400">
                            <div className="py-2 cursor-pointer hover:text-gold transition-colors">Topics</div>
                            <div className="py-2 cursor-pointer hover:text-gold transition-colors">Market Trends</div>
                            <div className="py-2 cursor-pointer hover:text-gold transition-colors">Year</div>
                            <div className="h-px bg-white/10 my-4"></div>
                            <div className="py-2 cursor-pointer hover:text-gold transition-colors">Authors</div>
                            <div className="py-2 cursor-pointer hover:text-gold transition-colors">Comments</div>
                        </div>
                        <div className="mt-8">
                            <input type="text" placeholder="Search" className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gold" />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex">

                {/* Sidebar (Desktop) */}
                <aside className="hidden h-[calc(100vh-64px)] w-64 flex-col bg-[#0f1115] p-6 text-white md:flex sticky top-16 overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="mb-6 text-xl font-serif font-bold">Featured Article</h3>
                        <div className="space-y-4 text-sm text-gray-400">
                            <div className="cursor-pointer hover:text-gold transition-colors">Topics</div>
                            <div className="cursor-pointer hover:text-gold transition-colors">Market Trends</div>
                            <div className="cursor-pointer hover:text-gold transition-colors">Year</div>
                            <div className="h-px bg-white/10 my-4"></div>
                            <div className="cursor-pointer hover:text-gold transition-colors">Authors</div>
                            <div className="cursor-pointer hover:text-gold transition-colors">Comments</div>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full rounded bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-3 text-sm text-gray-400">
                            <div>Enterprise</div>
                            <div>Filters</div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main id="main-content" className="flex-1 p-4 sm:p-6 md:p-10">

                    {/* Row 1: Market Insights (Dark Cards) */}
                    <div className="mb-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURED_ARTICLES.map((article) => (
                            <div key={article.id} className="group relative overflow-hidden rounded-2xl bg-[#1a1d21] text-white shadow-xl transition-transform hover:-translate-y-1">
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0 z-0">
                                    <Image src={article.image} alt={article.title} fill className="object-cover opacity-30 transition-opacity group-hover:opacity-40" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                                </div>

                                <div className="relative z-10 flex h-full flex-col p-6">
                                    <span className="mb-3 w-fit rounded bg-[#d4af37] px-2 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">
                                        Market Insights
                                    </span>
                                    <h3 className="mb-2 text-lg font-serif font-bold leading-snug text-white">
                                        {article.title}
                                    </h3>
                                    <p className="mb-6 text-xs text-gray-400 line-clamp-2">
                                        {article.subtitle}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 text-[10px] uppercase text-gray-500 tracking-wide">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" /> {article.views}
                                        </div>
                                        <div>{article.reads}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Row 2: Standard Articles (Light Grid) */}
                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {STANDARD_ARTICLES.map((article) => (
                            <div key={article.id} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
                                {/* Image Slot (if exists) */}
                                {article.image && (
                                    <div className="relative h-32 w-full overflow-hidden">
                                        <Image src={article.image} alt={article.title} fill className="object-cover" />
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col p-5">
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                                            <Image src={article.authorImg} alt={article.author} fill className="object-cover" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-800">{article.category}</span>
                                            <span className="text-[10px] text-gray-500">{article.author}</span>
                                        </div>
                                    </div>

                                    <h3 className="mb-2 text-base font-serif font-bold text-slate-900 leading-tight">
                                        {article.title || "Untitled Article"}
                                    </h3>
                                    {article.excerpt && (
                                        <p className="mb-4 text-xs text-slate-500 line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                    )}

                                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" /> {article.views}
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex items-center gap-1 hover:text-slate-600 cursor-pointer"><Share2 className="h-3 w-3" /></div>
                                            <div className="flex items-center gap-1 hover:text-slate-600 cursor-pointer"><Bookmark className="h-3 w-3" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </main>
            </div>
        </div>
    );
}
