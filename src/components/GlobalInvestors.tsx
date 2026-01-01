"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import { TestimonialCard, Testimonial } from "@/components/ui/testimonial-card";

// --- Premium Copy Data ---
const testimonials: Testimonial[] = [
    {
        name: "Ravi Kumar",
        role: "Software Engineer",
        image: "https://randomuser.me/api/portraits/men/11.jpg",
        location: "Uppal, Hyderabad",
        rating: 5,
        quote: "Krishna garu guided me patiently through location options and basic document checks. The process felt clear and well explained.",
        investment: "Srisailam Highway",
        verified: false,
    },
    {
        name: "Anjali Reddy",
        role: "IT Professional",
        image: "https://randomuser.me/api/portraits/women/12.jpg",
        location: "East Hyderabad",
        rating: 5,
        quote: "Even while I was outside India, he shared photos and updates regularly and helped me shortlist options near the corridor.",
        investment: "Mumbai Highway",
        verified: false,
    },
    {
        name: "Sandeep Chowdary",
        role: "Business Owner",
        image: "https://randomuser.me/api/portraits/men/13.jpg",
        location: "Warangal",
        rating: 5,
        quote: "He explained the key documents to verify and coordinated smoothly between us and the seller. It was straightforward and stress-free.",
        investment: "Warangal Highway",
        verified: false,
    },
    {
        name: "Lakshmi Devi",
        role: "Doctor",
        image: "https://randomuser.me/api/portraits/women/14.jpg",
        location: "Hyderabad",
        rating: 5,
        quote: "He shared clear location details and helped me compare options based on my needs. The guidance was honest and practical.",
        investment: "Nagpur Highway",
        verified: false,
    },
    {
        name: "Suresh Babu",
        role: "Civil Engineer",
        image: "https://randomuser.me/api/portraits/men/15.jpg",
        location: "Hyderabad",
        rating: 5,
        quote: "He coordinated smoothly and kept me updated at each step, which made it much easier to decide remotely.",
        investment: "Srisailam Highway",
        verified: false,
    },
    {
        name: "Padmavati Devi",
        role: "Retired Principal",
        image: "https://randomuser.me/api/portraits/women/16.jpg",
        location: "Warangal",
        rating: 5,
        quote: "He treated us with respect and guided us honestly based on our budget and needs. We felt confident with his suggestions.",
        investment: "Warangal Highway",
        verified: false,
    },
];

// Duplicate for marquee effect
const marqueeTestimonials = [...testimonials, ...testimonials];

export default function GlobalInvestors() {
    const [isPaused, setIsPaused] = React.useState(false);

    return (
        <section className="relative w-full overflow-hidden bg-black pt-14 md:pt-18 pb-8 md:pb-10 text-zinc-100">

            {/* --- Dynamic Background --- */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15),transparent_50%)]" />

            {/* Dotted Map Pattern */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: 'radial-gradient(#555 1.5px, transparent 1.5px)',
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Side Fade Masks (Desktop Only) */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-black to-transparent hidden md:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-black to-transparent hidden md:block" />


            <div className="container relative z-20 mx-auto px-6 mb-10 md:mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-500 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                        <Globe2 className="mr-2 h-3.5 w-3.5" />
                        Client Stories
                    </span>
                    <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
                        What Clients <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Say.</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg font-light leading-relaxed text-zinc-400">
                        Local clients trust Krishna Properties for guidance on open plots across East Hyderabad and the Hyderabad–Warangal corridor.
                    </p>
                </motion.div>
            </div>

            {/* --- Mobile Layout: Snap Scroll Carousel (Visible on Mobile) --- */}
            <div className="block md:hidden relative w-full">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 sm:px-6 pb-8 scrollbar-hide" role="region" aria-label="Testimonials carousel">
                    {testimonials.map((item, i) => (
                        <div key={`mobile-${i}`} className="snap-center shrink-0 w-[85vw] max-w-[340px]">
                            <TestimonialCard testimonial={item} className="w-full h-full min-w-0 max-w-none" />
                        </div>
                    ))}
                    <div className="w-4 shrink-0" aria-hidden="true" />
                </div>
                {/* Swipe Indicator */}
                <div className="flex justify-center gap-1.5 pt-2 pb-4" aria-hidden="true">
                    <span className="text-xs text-zinc-500">Swipe to see more</span>
                </div>
            </div>

            {/* --- Desktop Layout: Infinite Marquee (Visible on Desktop) --- */}
            <div className="hidden md:flex flex-col gap-6">
                <div
                    className="flex w-full overflow-hidden select-none"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocusCapture={() => setIsPaused(true)}
                    onBlurCapture={() => setIsPaused(false)}
                >
                    <div
                        className="flex shrink-0 animate-scroll gap-6 py-4 px-3 min-w-full"
                        style={{ animationPlayState: isPaused ? "paused" : "running" }}
                    >
                        {marqueeTestimonials.map((item, i) => (
                            <TestimonialCard key={`row1-${i}`} testimonial={item} className="w-[350px] shrink-0 md:w-[400px]" />
                        ))}
                    </div>
                    <div
                        className="flex shrink-0 animate-scroll gap-6 py-4 px-3 min-w-full"
                        style={{ animationPlayState: isPaused ? "paused" : "running" }}
                        aria-hidden="true"
                    >
                        {marqueeTestimonials.map((item, i) => (
                            <TestimonialCard key={`row1-dup-${i}`} testimonial={item} className="w-[350px] shrink-0 md:w-[400px]" />
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
}
