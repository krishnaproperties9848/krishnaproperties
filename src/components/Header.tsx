"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileMenuOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    return (
        <>
            <header className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-12 lg:py-6 bg-black/70 backdrop-blur border-b border-gold/10">
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Placeholder Logo */}
                    <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-gold/50 bg-black/40 text-xl sm:text-2xl font-serif text-gold backdrop-blur-md overflow-hidden">
                        <Image
                            src="/headshot-krishna.webp"
                            alt="Bhukya Krishna"
                            width={64}
                            height={64}
                            sizes="64px"
                            className="h-full w-full object-cover"
                            priority
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-lg sm:text-2xl font-serif text-gold-light tracking-wide">
                            Krishna Properties
                        </span>
                        <span className="text-[10px] sm:text-xs font-medium tracking-wide text-gray-300">
                            Bhukya Krishna · Senior Property Consultant
                        </span>
                    </div>
                </div>

                <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-200 transition-colors hover:text-gold focus-ring rounded-sm"
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-gray-200 transition-colors hover:text-gold focus-ring rounded-sm"
                    >
                        About
                    </Link>
                    <Link
                        href="/#services"
                        className="text-sm font-medium text-gray-200 transition-colors hover:text-gold focus-ring rounded-sm"
                    >
                        Services
                    </Link>
                    <Link
                        href="/insights"
                        className="text-sm font-medium text-gray-200 transition-colors hover:text-gold focus-ring rounded-sm"
                    >
                        Blog
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium text-gray-200 transition-colors hover:text-gold focus-ring rounded-sm"
                    >
                        Contact
                    </Link>
                    <a
                        href="tel:+919848151456"
                        className="rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-6 py-2.5 lg:px-8 lg:py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-transform hover:scale-105 focus-ring"
                        aria-label="Call Bhukya Krishna at +91 9848 151 456"
                    >
                        Call +91 9848 151 456
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-gold md:hidden focus-ring"
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Open navigation menu"
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </header>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Drawer Panel */}
                    <nav
                        id="mobile-menu"
                        className="absolute right-0 top-0 h-full w-[280px] max-w-[85vw] bg-neutral-950 border-l border-gold/20 shadow-2xl"
                        aria-label="Mobile navigation"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Close Button */}
                        <div className="flex items-center justify-between px-4 py-4 border-b border-gold/20">
                            <span className="text-lg font-serif text-gold-light">Menu</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex h-11 w-11 items-center justify-center rounded-lg text-gold hover:bg-gold/10 focus-ring"
                                aria-label="Close navigation menu"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-col px-4 py-6 space-y-2">
                            <Link
                                href="/"
                                className="flex h-12 items-center rounded-lg px-4 text-base font-medium text-gray-200 transition-colors hover:bg-gold/10 hover:text-gold focus-ring"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="flex h-12 items-center rounded-lg px-4 text-base font-medium text-gray-200 transition-colors hover:bg-gold/10 hover:text-gold focus-ring"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/#services"
                                className="flex h-12 items-center rounded-lg px-4 text-base font-medium text-gray-200 transition-colors hover:bg-gold/10 hover:text-gold focus-ring"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <Link
                                href="/insights"
                                className="flex h-12 items-center rounded-lg px-4 text-base font-medium text-gray-200 transition-colors hover:bg-gold/10 hover:text-gold focus-ring"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Blog
                            </Link>
                            <Link
                                href="/contact"
                                className="flex h-12 items-center rounded-lg px-4 text-base font-medium text-gray-200 transition-colors hover:bg-gold/10 hover:text-gold focus-ring"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </div>

                        {/* CTA Button */}
                        <div className="px-4 pt-4 border-t border-gold/20 mx-4">
                            <a
                                href="tel:+919848151456"
                                className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-6 py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] focus-ring"
                                aria-label="Call Bhukya Krishna at +91 9848 151 456"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Call +91 9848 151 456
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}
